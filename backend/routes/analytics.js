const express = require('express');
const { query, validationResult } = require('express-validator');
const { requireAdmin } = require('../middleware/auth');
const { getEventCounts, getUserStats } = require('../services/analyticsService');

const router = express.Router();

// All analytics routes require admin access
router.use(requireAdmin);

// Get analytics overview
router.get('/overview', [
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period')
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

    let { startDate, endDate, period } = req.query;

    // Set default period if no dates provided
    if (!startDate || !endDate) {
      const now = new Date();
      endDate = now;
      
      switch (period || '30d') {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    } else {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
    }

    const [eventCounts, userStats] = await Promise.all([
      getEventCounts(startDate, endDate),
      getUserStats(startDate, endDate)
    ]);

    res.json({
      success: true,
      data: {
        period: {
          startDate,
          endDate
        },
        events: eventCounts,
        users: userStats
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

module.exports = router;