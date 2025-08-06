const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports array
const transports = [
  // Console transport for development
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    format: consoleFormat,
    handleExceptions: true,
    handleRejections: true
  })
];

// Add file transports for production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Access log file for HTTP requests
    new winston.transports.File({
      filename: path.join(logsDir, 'access.log'),
      level: 'http',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  defaultMeta: {
    service: 'vespaverse-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports,
  exitOnError: false
});

// Add custom log levels
logger.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  debug: 'white'
});

// Custom logging methods
logger.security = (message, meta = {}) => {
  logger.warn(`[SECURITY] ${message}`, {
    ...meta,
    category: 'security'
  });
};

logger.performance = (message, meta = {}) => {
  logger.info(`[PERFORMANCE] ${message}`, {
    ...meta,
    category: 'performance'
  });
};

logger.audit = (message, meta = {}) => {
  logger.info(`[AUDIT] ${message}`, {
    ...meta,
    category: 'audit'
  });
};

logger.database = (message, meta = {}) => {
  logger.debug(`[DATABASE] ${message}`, {
    ...meta,
    category: 'database'
  });
};

logger.api = (message, meta = {}) => {
  logger.http(`[API] ${message}`, {
    ...meta,
    category: 'api'
  });
};

// Request logging helper
logger.logRequest = (req, res, responseTime) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userId: req.user?.id,
    sessionId: req.headers['x-session-id']
  };

  // Determine log level based on status code
  let level = 'http';
  if (res.statusCode >= 400 && res.statusCode < 500) {
    level = 'warn';
  } else if (res.statusCode >= 500) {
    level = 'error';
  }

  logger.log(level, `${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTime}ms`, logData);
};

// Error logging helper
logger.logError = (error, req = null, additionalInfo = {}) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...additionalInfo
  };

  if (req) {
    errorData.request = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
      body: req.body,
      params: req.params,
      query: req.query
    };
  }

  logger.error('Application Error', errorData);
};

// Database operation logging
logger.logDatabaseOperation = (operation, table, duration, success = true) => {
  const logData = {
    operation,
    table,
    duration: `${duration}ms`,
    success
  };

  if (success) {
    logger.database(`${operation} on ${table} completed in ${duration}ms`, logData);
  } else {
    logger.error(`${operation} on ${table} failed after ${duration}ms`, logData);
  }
};

// Authentication logging
logger.logAuth = (event, userId, email, success = true, additionalInfo = {}) => {
  const logData = {
    event,
    userId,
    email,
    success,
    timestamp: new Date().toISOString(),
    ...additionalInfo
  };

  if (success) {
    logger.security(`Authentication ${event} successful for ${email}`, logData);
  } else {
    logger.security(`Authentication ${event} failed for ${email}`, logData);
  }
};

// Rate limiting logging
logger.logRateLimit = (ip, endpoint, limit, current) => {
  logger.security(`Rate limit triggered for ${ip} on ${endpoint}`, {
    ip,
    endpoint,
    limit,
    current,
    category: 'rate_limit'
  });
};

// Create a stream object for Morgan HTTP logger
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Graceful shutdown logging
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
});

// Unhandled promise rejection logging
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason?.toString(),
    stack: reason?.stack,
    promise: promise?.toString()
  });
});

// Uncaught exception logging
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
});

module.exports = logger;