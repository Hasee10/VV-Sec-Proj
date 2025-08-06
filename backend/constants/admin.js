// Admin role permissions
const ADMIN_PERMISSIONS = {
  USER: ['read_own_profile', 'update_own_profile'],
  ADMIN: [
    'read_own_profile', 'update_own_profile',
    'read_all_users', 'update_all_users',
    'read_all_projects', 'create_projects', 'update_all_projects',
    'read_contacts', 'update_contacts',
    'read_analytics'
  ],
  SUPER_ADMIN: [
    'read_own_profile', 'update_own_profile',
    'read_all_users', 'update_all_users', 'delete_users',
    'read_all_projects', 'create_projects', 'update_all_projects', 'delete_projects',
    'read_contacts', 'update_contacts', 'delete_contacts',
    'read_analytics', 'manage_settings', 'manage_api_keys'
  ]
};

// Valid enum values
const VALID_USER_ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN'];
const VALID_CONTACT_STATUSES = ['NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED', 'SPAM'];
const VALID_CONTACT_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const VALID_NEWSLETTER_STATUSES = ['ACTIVE', 'UNSUBSCRIBED', 'BOUNCED', 'COMPLAINED'];
const VALID_PROJECT_STATUSES = ['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED', 'ON_HOLD'];

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// Email templates
const EMAIL_TEMPLATES = {
  ADMIN_REPLY: 'admin-reply',
  USER_NOTIFICATION: 'user-notification',
  PROJECT_UPDATE: 'project-update',
  NEWSLETTER_BROADCAST: 'newsletter-broadcast'
};

module.exports = {
  ADMIN_PERMISSIONS,
  VALID_USER_ROLES,
  VALID_CONTACT_STATUSES,
  VALID_CONTACT_PRIORITIES,
  VALID_NEWSLETTER_STATUSES,
  VALID_PROJECT_STATUSES,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  EMAIL_TEMPLATES
};