#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Generating Encryption Key and JWT Secret');
console.log('===========================================\n');

// Generate 32-byte (256-bit) encryption key
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('✅ ENCRYPTION_KEY:');
console.log(encryptionKey);
console.log('');

// Generate 64-byte JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('✅ JWT_SECRET:');
console.log(jwtSecret);
console.log('');

console.log('📝 Copy these lines to your .env file:');
console.log('=====================================');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');

console.log('🔑 Keys generated successfully! 🎯'); 