const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { initializeFirebase } = require('./config/firebase');
const { initializeLogger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const advancedApiRoutes = require('./routes/advanced-api');
const interfaceApiRoutes = require('./routes/interface-api');
const globalMedicalApiRoutes = require('./routes/global-medical-api');
const medicalPracticeApiRoutes = require('./routes/medical-practice-api');
const advancedPlannerApiRoutes = require('./routes/advanced-planner-api');
const realWorldSimulationApiRoutes = require('./routes/real-world-simulation-api');
const professionalInterfaceApiRoutes = require('./routes/professional-interface-api');
const patientSimulationChatApiRoutes = require('./routes/patient-simulation-chat-api');
const comprehensiveDashboardApiRoutes = require('./routes/comprehensive-dashboard-api');
const studentTaskManagerApiRoutes = require('./routes/student-task-manager-api');
const advancedFeaturesApiRoutes = require('./routes/advanced-features-api');
const mobileAppApiRoutes = require('./routes/mobile-app-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const logger = initializeLogger();

// Initialize Firebase (non-blocking)
try {
  initializeFirebase();
  logger.info('✅ Firebase initialized successfully');
} catch (error) {
  logger.warn('⚠️ Firebase initialization failed, but server will continue:', error.message);
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration for Railway
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 / 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint (Railway requirement)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'StethoLink AI Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/auth',
      advanced: '/api/advanced',
      mobile: '/api/mobile'
    }
  });
});

// Mount API routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/api/advanced', advancedApiRoutes);
app.use('/api/interface', interfaceApiRoutes);
app.use('/api/global-medical', globalMedicalApiRoutes);
app.use('/api/medical-practice', medicalPracticeApiRoutes);
app.use('/api/advanced-planner', advancedPlannerApiRoutes);
app.use('/api/real-world-simulation', realWorldSimulationApiRoutes);
app.use('/api/professional-interface', professionalInterfaceApiRoutes);
app.use('/api/patient-simulation-chat', patientSimulationChatApiRoutes);
app.use('/api/comprehensive-dashboard', comprehensiveDashboardApiRoutes);
app.use('/api/student-task-manager', studentTaskManagerApiRoutes);
app.use('/api/advanced-features', advancedFeaturesApiRoutes);
app.use('/api/mobile', mobileAppApiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: ['/health', '/api', '/auth']
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server (Railway optimized)
function startServer() {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 StethoLink AI Railway server running on port ${PORT}`);
      logger.info(`🔗 API base: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown for Railway
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions (Railway will restart)
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Don't exit immediately, let Railway handle restart
  setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit immediately, let Railway handle restart
  setTimeout(() => process.exit(1), 1000);
});

// Start the server
startServer();

module.exports = app;
