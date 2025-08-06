const prisma = require('../config/database');
const logger = require('../utils/logger');
const { DEFAULT_PAGE, DEFAULT_LIMIT } = require('../constants/admin');

// Build where conditions for user queries
const buildUserWhereCondition = (search, role, status) => {
  const where = {};
  
  if (role) where.role = role;
  
  if (status) {
    switch (status) {
      case 'verified':
        where.isEmailVerified = true;
        break;
      case 'unverified':
        where.isEmailVerified = false;
        break;
    }
  }
  
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  return where;
};

// Build where conditions for contact queries
const buildContactWhereCondition = (status, priority, service, search) => {
  const where = {};
  
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (service) where.service = service;
  
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  return where;
};

// Calculate pagination parameters
const getPaginationParams = (page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) => {
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;
  
  return {
    skip,
    take: parsedLimit,
    page: parsedPage,
    limit: parsedLimit
  };
};

// Build pagination response
const buildPaginationResponse = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// Get dashboard statistics
const getDashboardStats = async () => {
  const [
    totalUsers,
    totalProjects,
    totalContacts,
    newsletterSubscribers,
    recentContacts,
    recentProjects
  ] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.contact.count(),
    prisma.newsletter.count({ where: { status: 'ACTIVE' } }),
    
    prisma.contact.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        service: true,
        status: true,
        createdAt: true
      }
    }),
    
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        createdAt: true
      }
    })
  ]);

  return {
    overview: {
      totalUsers,
      totalProjects,
      totalContacts,
      newsletterSubscribers
    },
    recent: {
      contacts: recentContacts,
      projects: recentProjects
    }
  };
};

// Log admin action
const logAdminAction = (action, adminId, targetType, targetId, details = {}) => {
  logger.audit(`Admin action: ${action}`, {
    adminId,
    targetType,
    targetId,
    ...details,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  buildUserWhereCondition,
  buildContactWhereCondition,
  getPaginationParams,
  buildPaginationResponse,
  getDashboardStats,
  logAdminAction
};