const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const sendEmail = require('../services/emailService');
const logger = require('../utils/logger');
const { trackEvent } = require('../services/analyticsService');

const router = express.Router();

// Validation middleware
const validateContact = [
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('company').optional().trim().isLength({ max: 100 }).withMessage('Company name too long'),
  body('service').optional().trim().isLength({ max: 50 }).withMessage('Service selection too long'),
  body('budget').optional().trim().isLength({ max: 50 }).withMessage('Budget selection too long'),
  body('timeline').optional().trim().isLength({ max: 50 }).withMessage('Timeline selection too long'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
];

// Submit contact form
router.post('/submit', validateContact, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      service,
      budget,
      timeline,
      message,
      source
    } = req.body;

    // Check for duplicate submissions (same email within 5 minutes)
    const recentSubmission = await prisma.contact.findFirst({
      where: {
        email,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        }
      }
    });

    if (recentSubmission) {
      return res.status(429).json({
        success: false,
        message: 'Please wait before submitting another contact form'
      });
    }

    // Create contact record
    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        company,
        service,
        budget,
        timeline,
        message,
        source: source || 'website',
        status: 'NEW',
        priority: determinePriority(service, budget)
      }
    });

    // Send confirmation email to user
    try {
      await sendEmail({
        to: email,
        subject: 'Thank you for contacting VespaVerse',
        template: 'contact-confirmation',
        data: {
          firstName,
          contactId: contact.id
        }
      });
    } catch (emailError) {
      logger.error('Failed to send contact confirmation email:', emailError);
    }

    // Send notification email to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@vespaverse.com',
        subject: `New Contact Form Submission - ${firstName} ${lastName}`,
        template: 'contact-notification',
        data: {
          contact: {
            ...contact,
            fullName: `${firstName} ${lastName}`
          }
        }
      });
    } catch (emailError) {
      logger.error('Failed to send contact notification email:', emailError);
    }

    // Track analytics event
    await trackEvent({
      event: 'contact_form_submitted',
      properties: {
        contactId: contact.id,
        service,
        budget,
        source
      },
      sessionId: req.headers['x-session-id'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    logger.info(`Contact form submitted: ${email} (ID: ${contact.id})`);

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you within 24 hours.',
      data: {
        contactId: contact.id
      }
    });

  } catch (error) {
    logger.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'There was an error submitting your message. Please try again later.'
    });
  }
});

// Get contact status (for follow-up)
router.get('/status/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    logger.error('Get contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Book demo endpoint
router.post('/book-demo', [
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('company').optional().trim(),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('preferredDate').optional().isISO8601().withMessage('Please provide a valid date'),
  body('preferredTime').optional().trim(),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      company,
      phone,
      preferredDate,
      preferredTime,
      notes
    } = req.body;

    // Create contact record for demo booking
    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        company,
        service: 'Demo Booking',
        message: `Demo booking request. Preferred date: ${preferredDate || 'Not specified'}. Preferred time: ${preferredTime || 'Not specified'}. Notes: ${notes || 'None'}`,
        source: 'demo-booking',
        status: 'NEW',
        priority: 'HIGH'
      }
    });

    // Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: 'Demo Booking Confirmation - VespaVerse',
        template: 'demo-confirmation',
        data: {
          firstName,
          preferredDate,
          preferredTime,
          contactId: contact.id
        }
      });
    } catch (emailError) {
      logger.error('Failed to send demo confirmation email:', emailError);
    }

    // Send notification to sales team
    try {
      await sendEmail({
        to: process.env.SALES_EMAIL || 'sales@vespaverse.com',
        subject: `New Demo Booking - ${firstName} ${lastName}`,
        template: 'demo-notification',
        data: {
          contact: {
            ...contact,
            fullName: `${firstName} ${lastName}`,
            preferredDate,
            preferredTime
          }
        }
      });
    } catch (emailError) {
      logger.error('Failed to send demo notification email:', emailError);
    }

    // Track analytics
    await trackEvent({
      event: 'demo_booked',
      properties: {
        contactId: contact.id,
        preferredDate,
        preferredTime
      },
      sessionId: req.headers['x-session-id'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    logger.info(`Demo booked: ${email} (ID: ${contact.id})`);

    res.status(201).json({
      success: true,
      message: 'Demo booking confirmed! We will contact you within 24 hours to schedule your personalized demo.',
      data: {
        contactId: contact.id
      }
    });

  } catch (error) {
    logger.error('Demo booking error:', error);
    res.status(500).json({
      success: false,
      message: 'There was an error booking your demo. Please try again later.'
    });
  }
});

// Helper function to determine priority
function determinePriority(service, budget) {
  if (budget && (budget.includes('$50,000') || budget.includes('$100,000') || budget.includes('Enterprise'))) {
    return 'HIGH';
  }
  
  if (service && (service.includes('AI') || service.includes('Enterprise') || service.includes('Consulting'))) {
    return 'HIGH';
  }
  
  return 'MEDIUM';
}

module.exports = router;