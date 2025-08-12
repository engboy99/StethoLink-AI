const express = require('express');
const path = require('path');
const cors = require('cors');

// Import advanced features routes
const advancedFeaturesApiRoutes = require('./routes/advanced-features-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Character encoding middleware for HTML responses
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }
  next();
});

// Static files (serve before API routes to avoid conflicts)
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/icons', express.static('public/icons'));

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

// Dashboard endpoint
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Simple API endpoint for testing
app.get('/api/test', (req, res) => {
  res.json({
    message: 'StethoLink AI API is working!',
    timestamp: new Date().toISOString(),
    features: [
      'Medical Chat Assistant',
      'Study Planning',
      'Task Management',
      'Medical Calculators',
      'Patient Simulations'
    ]
  });
});

// Advanced Features API routes
app.use('/api/advanced-features', advancedFeaturesApiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: ['/', '/chat', '/dashboard', '/health', '/api/test']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StethoLink AI Simple Server running on port ${PORT}`);
  console.log(`📱 Main page: http://localhost:${PORT}`);
  console.log(`💬 Chat interface: http://localhost:${PORT}/chat`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 