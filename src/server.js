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
const { productionMonitor } = require('./services/monitoring');

// Import routes
const whatsappRoutes = require('./routes/whatsapp');
const telegramRoutes = require('./routes/telegram');
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

// Import bot handlers
const { initializeWhatsAppBot } = require('./bots/whatsapp-ultimate');
const { initializeTelegramBot } = require('./bots/telegram-ultimate');

// Import alert processor
const alertProcessor = require('./services/alert-processor');

// Import services
const { initializeAIServices } = require('./services/ai');
const { initializeScheduler } = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const logger = initializeLogger();
initializeFirebase();

// Initialize AI services (non-blocking) - don't wait for completion
setTimeout(() => {
  initializeAIServices().catch(error => {
    logger.warn('⚠️ AI services initialization failed, but server will continue:', error.message);
  });
}, 1000); // Start AI services after 1 second, don't block server startup

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

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://awake-courage-production.up.railway.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Production monitoring middleware
app.use(productionMonitor.trackRequest.bind(productionMonitor));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
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

// Character encoding middleware for HTML responses
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }
  next();
});

// Root endpoint - serve the main HTML file with proper encoding
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Chat interface endpoint
app.get('/chat', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(__dirname, '../public/chat-interface.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Enhanced health check with monitoring data
app.get('/health/detailed', (req, res) => {
  try {
    const healthMetrics = productionMonitor.getHealthMetrics();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      monitoring: healthMetrics
    });
  } catch (error) {
    logger.error('❌ Error getting detailed health metrics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get health metrics',
      error: error.message
    });
  }
});

// Performance report endpoint
app.get('/health/performance', (req, res) => {
  try {
    const performanceReport = productionMonitor.getPerformanceReport();
    res.json({
      success: true,
      data: performanceReport
    });
  } catch (error) {
    logger.error('❌ Error getting performance report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get performance report',
      message: error.message
    });
  }
});

// Static files (serve before API routes to avoid conflicts)
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

// API routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/api/advanced', advancedApiRoutes);
app.use('/api/interface', interfaceApiRoutes);
app.use('/api/global', globalMedicalApiRoutes);
app.use('/api/practice', medicalPracticeApiRoutes);
app.use('/api/planner', advancedPlannerApiRoutes);
app.use('/api/simulation', realWorldSimulationApiRoutes);
app.use('/api/professional', professionalInterfaceApiRoutes);
app.use('/api/chat', patientSimulationChatApiRoutes);
app.use('/api/dashboard', comprehensiveDashboardApiRoutes);
app.use('/api/student', studentTaskManagerApiRoutes);
app.use('/api/advanced-features', advancedFeaturesApiRoutes);
app.use('/api/agent', require('./routes/medical-agent-api'));
app.use('/api/mobile', mobileAppApiRoutes);

// Bot webhook routes
app.use('/webhook/whatsapp', whatsappRoutes);
app.use('/webhook/telegram', telegramRoutes);

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    message: '听 StethoLink AI - Medical Diagnostic Chatbot',
    description: 'Cross-platform multilingual medical diagnostic chatbot for WhatsApp and Telegram',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      whatsapp: '/webhook/whatsapp',
      telegram: '/webhook/telegram'
    }
  });
});

// Demo endpoint for web interface
app.post('/api/simulation/demo', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use the simulation manager for demo responses
    const simulationManager = require('./services/simulation-manager');
    
    // Create a demo user ID
    const demoUserId = 'demo-user-' + Date.now();
    
    // Start a demo simulation if not already active
    if (!simulationManager.getSimulationStatus(demoUserId)) {
      simulationManager.startSimulation(demoUserId, 'leptospirosis', language, {
        age: 26,
        gender: 'Male',
        occupation: 'Farmer',
        location: 'Rural Sri Lanka'
      });
    }
    
    // Handle the question
    const result = simulationManager.handleQuestion(demoUserId, message, language);
    
    res.json({
      response: result.response,
      isSimulationActive: result.isSimulationActive,
      hints: result.hints || []
    });
    
  } catch (error) {
    logger.error('❌ Error in demo endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: ['/health', '/api', '/webhook/whatsapp', '/webhook/telegram']
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize bots
async function initializeBots() {
  try {
    await initializeWhatsAppBot();
    await initializeTelegramBot();
    logger.info('✅ All bots initialized successfully');
  } catch (error) {
    logger.error('❌ Error initializing bots:', error);
  }
}

// Initialize scheduler
async function initializeServices() {
  try {
    // Temporarily disable scheduler to test Claude integration
    logger.info('⏰ Scheduler temporarily disabled for testing');
    // await initializeScheduler();
    // logger.info('✅ Scheduler initialized successfully');
  } catch (error) {
    logger.error('❌ Error initializing scheduler:', error);
  }
}

// Start server
async function startServer() {
  try {
    await initializeBots();
    await initializeServices();
    
    app.listen(PORT, () => {
      logger.info(`🚀 StethoLink AI server running on port ${PORT}`);
      logger.info(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
      logger.info(`📲 Telegram webhook: http://localhost:${PORT}/webhook/telegram`);
      logger.info(`🔗 API base: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app; 