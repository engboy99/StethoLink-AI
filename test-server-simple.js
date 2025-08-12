const express = require('express');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Simple middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Test server is running!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// WhatsApp test endpoint
app.get('/whatsapp', (req, res) => {
  res.json({
    message: 'WhatsApp webhook endpoint is active',
    timestamp: new Date().toISOString(),
    features: [
      'Year-specific curriculum (1st-5th year)',
      'Sri Lankan medical context',
      'Emergency training modules',
      'Clinical procedures training'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📱 Test WhatsApp endpoint: http://localhost:${PORT}/whatsapp`);
  console.log(`🔗 Test root endpoint: http://localhost:${PORT}/`);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 