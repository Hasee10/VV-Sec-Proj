const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this.prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
      errorFormat: 'pretty',
    });

    // Logging
    this.prisma.$on('query', (e) => {
      if (process.env.LOG_QUERIES === 'true') {
        logger.debug(`Query: ${e.query}`);
        logger.debug(`Params: ${e.params}`);
        logger.debug(`Duration: ${e.duration}ms`);
      }
    });

    this.prisma.$on('error', (e) => {
      logger.error('Database error:', e);
    });

    this.prisma.$on('info', (e) => {
      logger.info(`Database info: ${e.message}`);
    });

    this.prisma.$on('warn', (e) => {
      logger.warn(`Database warning: ${e.message}`);
    });

    // Connection handling
    this.connect();
  }

  async connect() {
    try {
      await this.prisma.$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await this.prisma.$disconnect();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
    }
  }

  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
    }
  }

  // Transaction helper
  async transaction(operations) {
    return this.prisma.$transaction(operations);
  }

  // Raw query helper
  async raw(query, params = []) {
    return this.prisma.$queryRawUnsafe(query, ...params);
  }

  // Pagination helper
  getPaginationParams(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return {
      skip,
      take: parseInt(limit),
    };
  }

  // Search helper
  createSearchCondition(searchTerm, fields) {
    if (!searchTerm) return {};
    
    return {
      OR: fields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    };
  }

  // Date range helper
  createDateRangeCondition(startDate, endDate, field = 'createdAt') {
    const condition = {};
    
    if (startDate || endDate) {
      condition[field] = {};
      if (startDate) condition[field].gte = new Date(startDate);
      if (endDate) condition[field].lte = new Date(endDate);
    }
    
    return condition;
  }
}

const database = new Database();

module.exports = database.prisma;
module.exports.database = database;