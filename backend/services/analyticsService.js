const prisma = require('../config/database');
const logger = require('../utils/logger');

class AnalyticsService {
  constructor() {
    this.enabled = process.env.ENABLE_ANALYTICS === 'true';
  }

  async trackEvent({ event, properties = {}, userId = null, projectId = null, sessionId = null, ipAddress = null, userAgent = null }) {
    if (!this.enabled) return;

    try {
      await prisma.analytics.create({
        data: {
          event,
          properties,
          userId,
          projectId,
          sessionId,
          ipAddress,
          userAgent
        }
      });
    } catch (error) {
      logger.error('Analytics tracking error:', error);
    }
  }

  async getEventCounts(startDate, endDate, eventName = null) {
    try {
      const where = {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        ...(eventName && { event: eventName })
      };

      return await prisma.analytics.groupBy({
        by: ['event'],
        where,
        _count: {
          event: true
        },
        orderBy: {
          _count: {
            event: 'desc'
          }
        }
      });
    } catch (error) {
      logger.error('Get event counts error:', error);
      return [];
    }
  }

  async getUserStats(startDate, endDate) {
    try {
      const where = {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      };

      const [uniqueUsers, totalEvents, topEvents] = await Promise.all([
        prisma.analytics.groupBy({
          by: ['userId'],
          where: { ...where, userId: { not: null } },
          _count: { userId: true }
        }),
        
        prisma.analytics.count({ where }),
        
        prisma.analytics.groupBy({
          by: ['event'],
          where,
          _count: { event: true },
          orderBy: { _count: { event: 'desc' } },
          take: 10
        })
      ]);

      return {
        uniqueUsers: uniqueUsers.length,
        totalEvents,
        topEvents: topEvents.map(e => ({
          event: e.event,
          count: e._count.event
        }))
      };
    } catch (error) {
      logger.error('Get user stats error:', error);
      return { uniqueUsers: 0, totalEvents: 0, topEvents: [] };
    }
  }
}

const analyticsService = new AnalyticsService();

module.exports = {
  trackEvent: analyticsService.trackEvent.bind(analyticsService),
  getEventCounts: analyticsService.getEventCounts.bind(analyticsService),
  getUserStats: analyticsService.getUserStats.bind(analyticsService)
};