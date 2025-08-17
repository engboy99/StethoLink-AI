const { logger, medicalLogger } = require('../utils/logger');
const jwt = require('jsonwebtoken');

// Custom error classes
class AIProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AIProcessingError';
    this.statusCode = 500;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

// Async handler wrapper
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Request validation middleware
function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const validationError = new ValidationError(error.details[0].message);
      return next(validationError);
    }
    next();
  };
}

// Authentication middleware
function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No valid authorization header');
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role || 'student'
      };
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token expired');
      } else if (jwtError.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Invalid token');
      } else {
        throw new AuthenticationError('Token verification failed');
      }
    }
  } catch (error) {
    next(error);
  }
}

// Authorization middleware
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }
    
    if (req.user.role !== role) {
      return next(new AuthorizationError(`Access denied. Role '${role}' required.`));
    }
    
    next();
  };
}

// Main error handler
function errorHandler(err, req, res, next) {
  let error = err;

  // Track error in monitoring system if available
  try {
    const { productionMonitor } = require('../services/monitoring');
    if (productionMonitor && typeof productionMonitor.trackError === 'function') {
      productionMonitor.trackError(error, req);
    }
  } catch (monitorError) {
    // If monitoring is not available, just log it
    logger.warn('⚠️ Monitoring system not available for error tracking');
  }

  // Log the error
  logger.error('❌ Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Log medical errors separately
  if (error.name === 'AIProcessingError' || error.message.includes('medical')) {
    medicalLogger.medicalError(error, {
      url: req.url,
      method: req.method,
      userId: req.user?.id || 'anonymous'
    });
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }

  if (error.name === 'AuthenticationError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }

  if (error.name === 'AuthorizationError') {
    return res.status(403).json({
      success: false,
      error: 'Authorization Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }

  if (error.name === 'AIProcessingError') {
    return res.status(500).json({
      success: false,
      error: 'AI Processing Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }

  // Handle OpenAI API errors
  if (error.code === 'insufficient_quota') {
    return res.status(503).json({
      success: false,
      error: 'Service Temporarily Unavailable',
      message: 'AI service quota exceeded. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }

  if (error.code === 'rate_limit_exceeded') {
    return res.status(429).json({
      success: false,
      error: 'Rate Limit Exceeded',
      message: 'Too many requests. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : error.message;

  res.status(statusCode).json({
    success: false,
    error: 'Internal Server Error',
    message: message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
}

// 404 handler
function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

module.exports = {
  AIProcessingError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  asyncHandler,
  validateRequest,
  requireAuth,
  requireRole,
  errorHandler,
  notFoundHandler
}; 