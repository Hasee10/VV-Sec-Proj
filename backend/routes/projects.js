const express = require('express');
const { body, query, validationResult } = require('express-validator');
const prisma = require('../config/database');
const logger = require('../utils/logger');
const { trackEvent } = require('../services/analyticsService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateProject = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('description').trim().isLength({ min: 1, max: 5000 }).withMessage('Description must be between 1 and 5000 characters'),
  body('shortDescription').optional().trim().isLength({ max: 500 }).withMessage('Short description too long'),
  body('category').trim().isLength({ min: 1, max: 100 }).withMessage('Category is required'),
  body('technologies').isArray().withMessage('Technologies must be an array'),
  body('startDate').isISO8601().withMessage('Please provide a valid start date'),
  body('endDate').optional().isISO8601().withMessage('Please provide a valid end date'),
  body('status').optional().isIn(['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED', 'ON_HOLD']).withMessage('Invalid status')
];

// Get all public projects (with pagination and filtering)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().trim(),
  query('technology').optional().trim(),
  query('status').optional().isIn(['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED', 'ON_HOLD']),
  query('search').optional().trim(),
  query('featured').optional().isBoolean()
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
      page = 1,
      limit = 12,
      category,
      technology,
      status,
      search,
      featured
    } = req.query;

    // Build where conditions
    const where = {
      visibility: 'PUBLIC',
      ...(category && { category }),
      ...(status && { status }),
      ...(featured !== undefined && { featured: featured === 'true' }),
      ...(technology && { technologies: { has: technology } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { shortDescription: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get projects and total count
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          title: true,
          description: true,
          shortDescription: true,
          category: true,
          tags: true,
          images: true,
          liveUrl: true,
          githubUrl: true,
          startDate: true,
          endDate: true,
          status: true,
          technologies: true,
          featured: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.project.count({ where })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / take);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Track analytics
    await trackEvent({
      event: 'projects_viewed',
      properties: {
        page: parseInt(page),
        limit: take,
        filters: { category, technology, status, search, featured },
        totalResults: total
      },
      sessionId: req.headers['x-session-id'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: take,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    logger.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        testimonials: {
          where: { approved: true },
          select: {
            id: true,
            name: true,
            company: true,
            position: true,
            content: true,
            rating: true,
            avatar: true,
            createdAt: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check visibility
    if (project.visibility !== 'PUBLIC') {
      return res.status(403).json({
        success: false,
        message: 'Project not accessible'
      });
    }

    // Track project view
    await trackEvent({
      event: 'project_viewed',
      properties: {
        projectId: project.id,
        projectTitle: project.title,
        projectCategory: project.category
      },
      sessionId: req.headers['x-session-id'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    logger.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get featured projects
router.get('/featured/list', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        visibility: 'PUBLIC',
        featured: true,
        status: 'COMPLETED'
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        shortDescription: true,
        category: true,
        images: true,
        liveUrl: true,
        technologies: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: projects
    });

  } catch (error) {
    logger.error('Get featured projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get project categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await prisma.project.groupBy({
      by: ['category'],
      where: {
        visibility: 'PUBLIC'
      },
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
    logger.error('Get project categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get project technologies
router.get('/meta/technologies', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        visibility: 'PUBLIC'
      },
      select: {
        technologies: true
      }
    });

    // Flatten and count technologies
    const techCount = {};
    projects.forEach(project => {
      project.technologies.forEach(tech => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });
    });

    // Sort by popularity
    const technologies = Object.entries(techCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      data: technologies
    });

  } catch (error) {
    logger.error('Get project technologies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create project (protected route)
router.post('/', authMiddleware, validateProject, async (req, res) => {
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
      title,
      description,
      shortDescription,
      category,
      tags,
      images,
      liveUrl,
      githubUrl,
      startDate,
      endDate,
      budget,
      client,
      clientEmail,
      clientPhone,
      clientCompany,
      technologies,
      featured,
      visibility,
      status
    } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        shortDescription,
        category,
        tags: tags || [],
        images: images || [],
        liveUrl,
        githubUrl,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        budget,
        client,
        clientEmail,
        clientPhone,
        clientCompany,
        technologies,
        featured: featured || false,
        visibility: visibility || 'PUBLIC',
        status: status || 'PLANNING',
        userId: req.user.id
      }
    });

    logger.info(`Project created: ${title} (ID: ${project.id}) by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });

  } catch (error) {
    logger.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update project (protected route)
router.put('/:id', authMiddleware, validateProject, async (req, res) => {
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

    // Check if project exists and user has permission
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { id: true, userId: true, title: true }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permission (only owner or admin can update)
    if (existingProject.userId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Update project
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.startDate && { startDate: new Date(updateData.startDate) }),
        ...(updateData.endDate && { endDate: new Date(updateData.endDate) })
      }
    });

    logger.info(`Project updated: ${project.title} (ID: ${id}) by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });

  } catch (error) {
    logger.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete project (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists and user has permission
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { id: true, userId: true, title: true }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permission (only owner or admin can delete)
    if (existingProject.userId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // Delete project
    await prisma.project.delete({
      where: { id }
    });

    logger.info(`Project deleted: ${existingProject.title} (ID: ${id}) by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    logger.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;