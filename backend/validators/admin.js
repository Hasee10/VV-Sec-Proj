const { body, query } = require('express-validator');
const {
  VALID_USER_ROLES,
  VALID_CONTACT_STATUSES,
  VALID_CONTACT_PRIORITIES,
  VALID_NEWSLETTER_STATUSES,
  MAX_LIMIT
} = require('../constants/admin');

// Pagination validators
const paginationValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: MAX_LIMIT }).withMessage(`Limit must be between 1 and ${MAX_LIMIT}`)
];

// User management validators
const userListValidators = [
  ...paginationValidators,
  query('search').optional().trim(),
  query('role').optional().isIn(VALID_USER_ROLES).withMessage('Invalid role'),
  query('status').optional().isIn(['active', 'inactive', 'verified', 'unverified']).withMessage('Invalid status')
];

const updateUserRoleValidators = [
  body('role').isIn(VALID_USER_ROLES).withMessage('Invalid role')
];

// Contact management validators
const contactListValidators = [
  ...paginationValidators,
  query('status').optional().isIn(VALID_CONTACT_STATUSES).withMessage('Invalid status'),
  query('priority').optional().isIn(VALID_CONTACT_PRIORITIES).withMessage('Invalid priority'),
  query('service').optional().trim(),
  query('search').optional().trim()
];

const updateContactValidators = [
  body('status').optional().isIn(VALID_CONTACT_STATUSES).withMessage('Invalid status'),
  body('priority').optional().isIn(VALID_CONTACT_PRIORITIES).withMessage('Invalid priority'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes too long')
];

const sendEmailValidators = [
  body('subject').trim().isLength({ min: 1, max: 200 }).withMessage('Subject is required and must be under 200 characters'),
  body('message').trim().isLength({ min: 1, max: 5000 }).withMessage('Message is required and must be under 5000 characters'),
  body('template').optional().trim()
];

// Newsletter validators
const newsletterListValidators = [
  ...paginationValidators,
  query('status').optional().isIn(VALID_NEWSLETTER_STATUSES).withMessage('Invalid status')
];

module.exports = {
  paginationValidators,
  userListValidators,
  updateUserRoleValidators,
  contactListValidators,
  updateContactValidators,
  sendEmailValidators,
  newsletterListValidators
};