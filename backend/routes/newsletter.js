const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const sendEmail = require('../services/emailService');
const logger = require('../utils/logger');
const { trackEvent } = require('../services/analyticsService');

const router = express.Router();

// Validation middleware
const validateSubscription = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('firstName').optional().trim().isLength({ max: 50 }).withMessage('First name too long'),
  body('lastName').optional().trim().isLength({ max: 50 }).withMessage('Last name too long')
];

// Subscribe to newsletter
router.post('/subscribe', validateSubscription, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, firstName, lastName, source, preferences } = req.body;

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.status === 'ACTIVE') {
        return res.status(400).json({
          success: false,
          message: 'You are already subscribed to our newsletter'
        });
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email },
          data: {
            status: 'ACTIVE',
            firstName: firstName || existing.firstName,
            lastName: lastName || existing.lastName,
            source: source || existing.source,
            preferences: preferences || existing.preferences,
            subscribedAt: new Date(),
            unsubscribedAt: null
          }
        });

        logger.info(`Newsletter subscription reactivated: ${email}`);

        return res.json({
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated.'
        });
      }
    }

    // Create new subscription
    const subscription = await prisma.newsletter.create({
      data: {
        email,
        firstName,
        lastName,
        source: source || 'website',
        preferences: preferences || {},
        status: 'ACTIVE'
      }
    });

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to VespaVerse Newsletter',
        template: 'newsletter-welcome',
        data: {
          firstName: firstName || 'Subscriber',
          unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}`
        }
      });
    } catch (emailError) {
      logger.error('Failed to send newsletter welcome email:', emailError);
      // Don't fail subscription if email fails
    }

    // Track analytics
    await trackEvent({
      event: 'newsletter_subscribed',
      properties: {
        subscriptionId: subscription.id,
        source: source || 'website'
      },
      sessionId: req.headers['x-session-id'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    logger.info(`Newsletter subscription created: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! Check your email for a welcome message.'
    });

  } catch (error) {
    logger.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'There was an error subscribing to the newsletter. Please try again later.'
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
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

    const { email, reason } = req.body;

    const subscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    if (subscription.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'You are already unsubscribed from our newsletter'
      });
    }

    // Update subscription status
    await prisma.newsletter.update({
      where: { email },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
        tags: subscription.tags ? [...subscription.tags, `unsubscribe_reason:${reason || 'not_specified'}`] : [`unsubscribe_reason:${reason || 'not_specified'}`]
      }
    });

    // Track analytics
    await trackEvent({
      event: 'newsletter_unsubscribed',
      properties: {
        email,
        reason: reason || 'not_specified'
      },
      sessionId: req.headers['x-session-id'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    logger.info(`Newsletter unsubscription: ${email}, reason: ${reason || 'not_specified'}`);

    res.json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.'
    });

  } catch (error) {
    logger.error('Newsletter unsubscription error:', error);
    res.status(500).json({
      success: false,
      message: 'There was an error unsubscribing. Please try again later.'
    });
  }
});

// Get newsletter preferences (for managing subscription)
router.get('/preferences/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }

    const subscription = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        preferences: true,
        subscribedAt: true,
        tags: true
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    res.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    logger.error('Get newsletter preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update newsletter preferences
router.put('/preferences', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('preferences').optional().isObject().withMessage('Preferences must be an object'),
  body('firstName').optional().trim().isLength({ max: 50 }).withMessage('First name too long'),
  body('lastName').optional().trim().isLength({ max: 50 }).withMessage('Last name too long')
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

    const { email, preferences, firstName, lastName } = req.body;

    const subscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    // Update preferences
    const updatedSubscription = await prisma.newsletter.update({
      where: { email },
      data: {
        ...(preferences && { preferences }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName })
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        preferences: true,
        status: true
      }
    });

    logger.info(`Newsletter preferences updated: ${email}`);

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: updatedSubscription
    });

  } catch (error) {
    logger.error('Update newsletter preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'There was an error updating your preferences. Please try again later.'
    });
  }
});

module.exports = router;