const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { initializeFirebase } = require('./config/firebase');
const { initializeLogger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Import mobile app routes
const mobileAppApiRoutes = require('./routes/mobile-app-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const logger = initializeLogger();
initializeFirebase();

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
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Character encoding middleware for HTML responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    message: 'Mobile Test Server Running'
  });
});

// Static files
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

// Mobile App API routes
app.use('/api/mobile', mobileAppApiRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Mobile Test Server API Working',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      mobile: '/api/mobile',
      test: '/api/test'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: ['/health', '/api/mobile', '/api/test']
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Mobile Test Server running on port ${PORT}`);
  logger.info(`📱 Mobile API: http://localhost:${PORT}/api/mobile`);
  logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
  logger.info(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

module.exports = app; 