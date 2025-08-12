#!/usr/bin/env node

// Railway-specific startup script
console.log('🚀 Starting StethoLink AI for Railway...');

// Check if we're in Railway environment
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID;

if (isRailway) {
  console.log('✅ Running in Railway environment');
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔌 Port: ${process.env.PORT || '3000'}`);
} else {
  console.log('⚠️ Not in Railway environment, using local config');
}

// Check required environment variables
const requiredVars = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'ENCRYPTION_KEY'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:', missingVars);
  console.log('⚠️ Some features may not work correctly');
} else {
  console.log('✅ All required environment variables are set');
}

// Start the Railway-optimized server
try {
  console.log('📡 Starting server...');
  require('./src/server-railway.js');
  console.log('✅ Server started successfully');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
