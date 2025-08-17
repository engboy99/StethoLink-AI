const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = ` ${JSON.stringify(meta)}`;
    }
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  defaultMeta: { service: 'stetholink-ai' },
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Daily rotating file
    new winston.transports.File({
      filename: path.join(logsDir, `stetholink-${new Date().toISOString().split('T')[0]}.log`),
      maxsize: 10485760, // 10MB
      maxFiles: 7,
      tailable: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 3
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 3
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Custom logging functions for medical context
const medicalLogger = {
  // Log user interactions
  userInteraction: (userId, action, details = {}) => {
    logger.info('User Interaction', {
      userId,
      action,
      details,
      type: 'user_interaction'
    });
  },

  // Log diagnosis requests
  diagnosisRequest: (userId, symptoms, language, platform) => {
    logger.info('Diagnosis Request', {
      userId,
      symptoms: symptoms.substring(0, 200), // Truncate for privacy
      language,
      platform,
      type: 'diagnosis_request'
    });
  },

  // Log simulation sessions
  simulationSession: (userId, simulationType, duration, score) => {
    logger.info('Simulation Session', {
      userId,
      simulationType,
      duration,
      score,
      type: 'simulation_session'
    });
  },

  // Log voice processing
  voiceProcessing: (userId, language, duration, success) => {
    logger.info('Voice Processing', {
      userId,
      language,
      duration,
      success,
      type: 'voice_processing'
    });
  },

  // Log errors with medical context
  medicalError: (error, context = {}) => {
    logger.error('Medical System Error', {
      error: error.message,
      stack: error.stack,
      context,
      type: 'medical_error'
    });
  },

  // Log security events
  securityEvent: (event, userId, details = {}) => {
    logger.warn('Security Event', {
      event,
      userId,
      details,
      type: 'security_event'
    });
  },

  // Log performance metrics
  performance: (operation, duration, metadata = {}) => {
    logger.info('Performance Metric', {
      operation,
      duration,
      metadata,
      type: 'performance'
    });
  },

  // Log AI interactions
  aiInteraction: (model, operation, tokens, duration) => {
    logger.info('AI Interaction', {
      model,
      operation,
      tokens,
      duration,
      type: 'ai_interaction'
    });
  },

  // Log bot interactions
  botInteraction: (platform, userId, messageType, success) => {
    logger.info('Bot Interaction', {
      platform,
      userId,
      messageType,
      success,
      type: 'bot_interaction'
    });
  }
};

// Initialize logger function
function initializeLogger() {
  logger.info('🚀 StethoLink AI Logger initialized');
  logger.info(`📁 Log files directory: ${logsDir}`);
  logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📊 Log level: ${process.env.LOG_LEVEL || 'info'}`);
  
  return logger;
}

// Export both the standard logger and medical-specific logger
module.exports = {
  logger,
  medicalLogger,
  initializeLogger
}; 