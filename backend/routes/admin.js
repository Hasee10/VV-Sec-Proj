const express = require('express');
const { validationResult } = require('express-validator');
const prisma = require('../config/database');
const logger = require('../utils/logger');
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');
const sendEmail = require('../services/emailService');

// Import validators and helpers
const {
  userListValidators,
  updateUserRoleValidators,
  contactListValidators,
  updateContactValidators,
  sendEmailValidators,
  newsletterListValidators
} = require('../validators/admin');

const {
  buildUserWhereCondition,
  buildContactWhereCondition,
  getPaginationParams,
  buildPaginationResponse,
  getDashboardStats,
  logAdminAction
} = require('../helpers/admin');

const router = express.Router();

// All admin routes require admin access
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Admin dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get all users
router.get('/users', userListValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { search, role, status } = req.query;
    const { skip, take, page, limit } = getPaginationParams(req.query.page, req.query.limit);
    const where = buildUserWhereCondition(search, role, status);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isEmailVerified: true,
          avatar: true,
          lastLogin: true,
          createdAt: true,
          _count: {
            select: {
              projects: true,
              contacts: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: buildPaginationResponse(page, limit, total)
    });

  } catch (error) {
    logger.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Update user role (Super Admin only)
router.patch('/users/:id/role', requireSuperAdmin, updateUserRoleValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    logAdminAction('update_user_role', req.user.id, 'user', id, { newRole: role });

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });

  } catch (error) {
    logger.error('Admin update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
});

// Get all contacts
router.get('/contacts', contactListValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, priority, service, search } = req.query;
    const { skip, take, page, limit } = getPaginationParams(req.query.page, req.query.limit);
    const where = buildContactWhereCondition(status, priority, service, search);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.contact.count({ where })
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: buildPaginationResponse(page, limit, total)
    });

  } catch (error) {
    logger.error('Admin get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
});

// Update contact
router.patch('/contacts/:id', updateContactValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        ...updateData,
        assignedTo: req.user.id
      }
    });

    logAdminAction('update_contact', req.user.id, 'contact', id, updateData);

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });

  } catch (error) {
    logger.error('Admin update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
});

// Send email to contact
router.post('/contacts/:id/email', sendEmailValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { subject, message, template } = req.body;

    const contact = await prisma.contact.findUnique({
      where: { id }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const emailData = {
      to: contact.email,
      subject,
      template: template || null,
      data: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        message,
        adminName: `${req.user.firstName} ${req.user.lastName}`
      }
    };

    if (!template) {
      emailData.data.html = message;
    }

    await sendEmail(emailData);

    await prisma.contact.update({
      where: { id },
      data: {
        status: 'REPLIED',
        assignedTo: req.user.id
      }
    });

    logAdminAction('send_email', req.user.id, 'contact', id, { subject });

    res.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    logger.error('Admin send email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email'
    });
  }
});

// Get newsletter subscribers
router.get('/newsletter/subscribers', newsletterListValidators, async (req, res) => {
  try {
    const { status } = req.query;
    const { skip, take, page, limit } = getPaginationParams(req.query.page, req.query.limit);
    const where = status ? { status } : {};

    const [subscribers, total] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        skip,
        take,
        orderBy: { subscribedAt: 'desc' }
      }),
      prisma.newsletter.count({ where })
    ]);

    res.json({
      success: true,
      data: subscribers,
      pagination: buildPaginationResponse(page, limit, total)
    });

  } catch (error) {
    logger.error('Admin get newsletter subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch newsletter subscribers'
    });
  }
});

module.exports = router;