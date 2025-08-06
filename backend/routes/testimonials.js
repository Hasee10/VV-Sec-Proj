const express = require('express');
const { body, query, validationResult } = require('express-validator');
const prisma = require('../config/database');
const logger = require('../utils/logger');
const { trackEvent } = require('../services/analyticsService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all approved testimonials
router.get('/', [
  query('featured').optional().isBoolean(),
  query('projectId').optional().trim(),
  query('limit').optional().isInt({ min: 1, max: 50 })
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

    const { featured, projectId, limit = 10 } = req.query;
    
    const where = {
      approved: true,
      ...(featured !== undefined && { featured: featured === 'true' }),
      ...(projectId && { projectId })
    };

    const testimonials = await prisma.testimonial.findMany({
      where,
      take: parseInt(limit),
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        project: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: testimonials
    });

  } catch (error) {
    logger.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Submit new testimonial
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('company').optional().trim().isLength({ max: 100 }).withMessage('Company name too long'),
  body('position').optional().trim().isLength({ max: 100 }).withMessage('Position too long'),
  body('content').trim().isLength({ min: 10, max: 1000 }).withMessage('Content must be between 10 and 1000 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('projectId').optional().trim()
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
      name,
      email,
      company,
      position,
      content,
      rating,
      projectId
    } = req.body;

    // Check if project exists (if provided)
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        email,
        company,
        position,
        content,
        rating,
        projectId,
        approved: false // Requires admin approval
      }
    });

    // Track analytics
    await trackEvent({
      event: 'testimonial_submitted',
      properties: {
        testimonialId: testimonial.id,
        rating,
        hasProject: !!projectId
      },
      sessionId: req.headers['x-session-id'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    logger.info(`Testimonial submitted: ${name} (${email}) - Rating: ${rating}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for your testimonial! It will be reviewed and published soon.',
      data: {
        id: testimonial.id
      }
    });

  } catch (error) {
    logger.error('Submit testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'There was an error submitting your testimonial. Please try again later.'
    });
  }
});

module.exports = router;