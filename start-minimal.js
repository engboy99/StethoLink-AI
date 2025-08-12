#!/usr/bin/env node

console.log('🚀 Starting StethoLink AI Minimal Server...');

// Check environment
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
console.log(`🔌 Port: ${process.env.PORT || '3000'}`);

// Start the minimal server
try {
  console.log('📡 Starting minimal server...');
  require('./src/server-minimal.js');
  console.log('✅ Minimal server started successfully');
} catch (error) {
  console.error('❌ Failed to start minimal server:', error.message);
  process.exit(1);
}
