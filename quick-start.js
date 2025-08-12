#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

console.log('🏥 StethoLink AI - Quick Start Setup');
console.log('=====================================\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  
  if (fs.existsSync('env.example')) {
    fs.copyFileSync('env.example', '.env');
    console.log('✅ .env file created from env.example');
  } else {
    console.log('❌ env.example not found. Please create .env file manually.');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Generate encryption keys if not present
const envContent = fs.readFileSync('.env', 'utf8');

if (!envContent.includes('ENCRYPTION_KEY=') || envContent.includes('your-32-character-encryption-key-here')) {
  console.log('🔐 Generating encryption keys...');
  
  const encryptionKey = crypto.randomBytes(32).toString('hex');
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  
  let newEnvContent = envContent
    .replace(/ENCRYPTION_KEY=.*/, `ENCRYPTION_KEY=${encryptionKey}`)
    .replace(/JWT_SECRET=.*/, `JWT_SECRET=${jwtSecret}`);
  
  fs.writeFileSync('.env', newEnvContent);
  console.log('✅ Encryption keys generated and added to .env');
} else {
  console.log('✅ Encryption keys already configured');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.log('❌ Failed to install dependencies. Please run "npm install" manually.');
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Create necessary directories
const dirs = ['logs', 'uploads'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created ${dir} directory`);
  }
});

console.log('\n🎯 Setup Complete!');
console.log('==================');

console.log('\n📋 Next Steps:');
console.log('1. Edit .env file with your API keys:');
console.log('   - OpenAI API Key (https://platform.openai.com/api-keys)');
console.log('   - Firebase credentials (https://console.firebase.google.com/)');
console.log('   - Telegram Bot Token (message @BotFather on Telegram)');
console.log('   - Twilio credentials (https://console.twilio.com/)');

console.log('\n2. Start the server:');
console.log('   npm run dev');

console.log('\n3. Test the application:');
console.log('   - Health check: curl http://localhost:3000/health');
console.log('   - API docs: curl http://localhost:3000/api/docs');

console.log('\n4. Test Telegram bot:');
console.log('   - Find your bot and send /start');

console.log('\n5. Test WhatsApp bot:');
console.log('   - Use ngrok for local testing: ngrok http 3000');
console.log('   - Set webhook URL in Twilio console');

console.log('\n📚 For detailed testing instructions, see: setup-testing.md');
console.log('📖 For full documentation, see: README.md');

console.log('\n🚀 Happy testing! 🏥'); 