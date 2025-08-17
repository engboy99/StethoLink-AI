#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');

console.log('🔐 Generating Encryption Keys and JWT Secret');
console.log('============================================\n');

// Generate 32-byte (256-bit) encryption key
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('✅ Encryption Key Generated:');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log('');

// Generate 64-byte JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('✅ JWT Secret Generated:');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');

// Check if .env file exists
if (fs.existsSync('.env')) {
  console.log('📝 Updating .env file...');
  
  let envContent = fs.readFileSync('.env', 'utf8');
  
  // Replace encryption key
  envContent = envContent.replace(
    /ENCRYPTION_KEY=.*/,
    `ENCRYPTION_KEY=${encryptionKey}`
  );
  
  // Replace JWT secret
  envContent = envContent.replace(
    /JWT_SECRET=.*/,
    `JWT_SECRET=${jwtSecret}`
  );
  
  // Write back to .env file
  fs.writeFileSync('.env', envContent);
  
  console.log('✅ .env file updated successfully!');
  console.log('');
  console.log('🔑 Keys have been automatically added to your .env file.');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Add your API keys to .env file:');
  console.log('   - OPENAI_API_KEY (from https://platform.openai.com/api-keys)');
  console.log('   - Firebase credentials (from https://console.firebase.google.com/)');
  console.log('   - Telegram bot token (from @BotFather)');
  console.log('   - Twilio credentials (from https://console.twilio.com/)');
  console.log('');
  console.log('2. Start the server: npm run dev');
  console.log('');
  console.log('3. Test the application: node test-setup.js');
  
} else {
  console.log('❌ .env file not found!');
  console.log('');
  console.log('Please create .env file first:');
  console.log('copy env.example .env');
  console.log('');
  console.log('Then run this script again.');
}

console.log('');
console.log('🔐 Key generation completed! 🎯'); 