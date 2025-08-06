const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Generate access and refresh tokens
const generateTokens = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '15m',
      issuer: 'vespaverse-api',
      audience: 'vespaverse-client'
    }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
      issuer: 'vespaverse-api',
      audience: 'vespaverse-client'
    }
  );

  return { accessToken, refreshToken };
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate secure random token
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate password reset token with expiry
const generatePasswordResetToken = () => {
  const token = generateSecureToken();
  const expires = new Date(Date.now() + 3600000); // 1 hour from now
  return { token, expires };
};

// Generate email verification token
const generateEmailVerificationToken = () => {
  return generateSecureToken();
};

// Validate password strength
const validatePasswordStrength = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common, please choose a stronger password');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    score: calculatePasswordScore(password)
  };
};

// Calculate password strength score
const calculatePasswordScore = (password) => {
  let score = 0;
  
  // Length bonus
  score += Math.min(password.length * 4, 25);
  
  // Character variety bonus
  if (/[a-z]/.test(password)) score += 5;
  if (/[A-Z]/.test(password)) score += 5;
  if (/\d/.test(password)) score += 5;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;
  
  // Pattern penalties
  if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 10; // Sequential characters
  
  return Math.max(0, Math.min(100, score));
};

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

// Extract user ID from token (without verification)
const extractUserIdFromToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded?.userId || null;
  } catch (error) {
    return null;
  }
};

// Generate API key
const generateApiKey = () => {
  return `vv_${crypto.randomBytes(32).toString('hex')}`;
};

// Sanitize user data for JWT payload
const sanitizeUserForToken = (user) => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified
  };
};

// Check if user has permission
const hasPermission = (user, permission) => {
  const rolePermissions = {
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
      'read_analytics', 'manage_settings',
      'manage_api_keys'
    ]
  };

  const userPermissions = rolePermissions[user.role] || [];
  return userPermissions.includes(permission);
};

// Rate limiting helpers
const generateRateLimitKey = (req, suffix = '') => {
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.user?.id || 'anonymous';
  return `rate_limit:${ip}:${userId}${suffix ? ':' + suffix : ''}`;
};

module.exports = {
  generateTokens,
  verifyRefreshToken,
  generateSecureToken,
  hashPassword,
  comparePassword,
  generatePasswordResetToken,
  generateEmailVerificationToken,
  validatePasswordStrength,
  calculatePasswordScore,
  isTokenExpired,
  extractUserIdFromToken,
  generateApiKey,
  sanitizeUserForToken,
  hasPermission,
  generateRateLimitKey
};