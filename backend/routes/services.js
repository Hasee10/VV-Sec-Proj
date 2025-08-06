const express = require('express');
const { query, validationResult } = require('express-validator');
const prisma = require('../config/database');
const logger = require('../utils/logger');
const { trackEvent } = require('../services/analyticsService');

const router = express.Router();

// Get all services
router.get('/', [
  query('category').optional().trim(),
  query('active').optional().isBoolean()
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

    const { category, active } = req.query;
    
    const where = {
      ...(category && { category }),
      ...(active !== undefined && { active: active === 'true' })
    };

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { popular: 'desc' },
        { order: 'asc' },
        { name: 'asc' }
      ]
    });

    // Track analytics
    await trackEvent({
      event: 'services_viewed',
      properties: {
        filters: { category, active },
        totalResults: services.length
      },
      sessionId: req.headers['x-session-id'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: services
    });

  } catch (error) {
    logger.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get service by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const service = await prisma.service.findUnique({
      where: { slug }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    if (!service.active) {
      return res.status(403).json({
        success: false,
        message: 'Service not available'
      });
    }

    // Track service view
    await trackEvent({
      event: 'service_viewed',
      properties: {
        serviceId: service.id,
        serviceName: service.name,
        serviceCategory: service.category
      },
      sessionId: req.headers['x-session-id'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: service
    });

  } catch (error) {
    logger.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get service categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await prisma.service.groupBy({
      by: ['category'],
      where: { active: true },
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });

    const formattedCategories = categories.map(cat => ({
      name: cat.category,
      count: cat._count.category
    }));

    res.json({
      success: true,
      data: formattedCategories
    });

  } catch (error) {
    logger.error('Get service categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;