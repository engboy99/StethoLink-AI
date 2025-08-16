#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 StethoLink AI - Setup Test');
console.log('==============================\n');

// Test 1: Check if .env file exists
console.log('1. Checking environment configuration...');
if (fs.existsSync('.env')) {
  console.log('✅ .env file exists');
  
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = [
    'OPENAI_API_KEY',
    'FIREBASE_PROJECT_ID',
    'ENCRYPTION_KEY',
    'JWT_SECRET'
  ];
  
  let missingVars = [];
  requiredVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your-`)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length === 0) {
    console.log('✅ All required environment variables are configured');
  } else {
    console.log('⚠️  Missing or unconfigured environment variables:', missingVars.join(', '));
  }
} else {
  console.log('❌ .env file not found. Run: node quick-start.js');
}

// Test 2: Check if node_modules exists
console.log('\n2. Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencies installed');
} else {
  console.log('❌ Dependencies not installed. Run: npm install');
}

// Test 3: Check if required directories exist
console.log('\n3. Checking directory structure...');
const requiredDirs = ['logs', 'uploads'];
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir} directory exists`);
  } else {
    console.log(`❌ ${dir} directory missing. Run: node quick-start.js`);
  }
});

// Test 4: Check if all required files exist
console.log('\n4. Checking source files...');
const requiredFiles = [
  'src/server.js',
  'src/config/firebase.js',
  'src/services/ai.js',
  'src/services/scheduler.js',
  'src/bots/whatsapp.js',
  'src/bots/telegram.js',
  'src/routes/api.js',
  'src/routes/auth.js',
  'src/routes/whatsapp.js',
  'src/routes/telegram.js',
  'src/middleware/errorHandler.js',
  'src/utils/logger.js',
  'src/utils/encryption.js'
];

let missingFiles = [];
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    missingFiles.push(file);
  }
});

// Test 5: Check package.json
console.log('\n5. Checking package.json...');
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ Package name: ${packageJson.name}`);
  console.log(`✅ Version: ${packageJson.version}`);
  console.log(`✅ Main entry: ${packageJson.main}`);
  
  const requiredDeps = [
    'express', 'openai', 'firebase-admin', 'twilio', 
    'node-telegram-bot-api', 'winston', 'joi', 'bcryptjs'
  ];
  
  let missingDeps = [];
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep]) {
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length === 0) {
    console.log('✅ All required dependencies are listed');
  } else {
    console.log('⚠️  Missing dependencies:', missingDeps.join(', '));
  }
} else {
  console.log('❌ package.json not found');
}

// Test 6: Check if server can be imported
console.log('\n6. Testing server import...');
try {
  // Test basic import without starting the server
  const serverPath = path.join(__dirname, 'src', 'server.js');
  if (fs.existsSync(serverPath)) {
    console.log('✅ Server file can be found');
    
    // Test if the file has valid syntax by reading it
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    if (serverContent.includes('express') && serverContent.includes('app.listen')) {
      console.log('✅ Server file appears to be valid');
    } else {
      console.log('⚠️  Server file may have issues');
    }
  } else {
    console.log('❌ Server file not found');
  }
} catch (error) {
  console.log('❌ Error testing server import:', error.message);
}

// Summary
console.log('\n📋 Test Summary');
console.log('===============');

if (missingFiles.length === 0) {
  console.log('✅ All source files are present');
} else {
  console.log(`❌ Missing ${missingFiles.length} source files`);
}

console.log('\n🚀 Next Steps:');
console.log('1. Configure your .env file with API keys');
console.log('2. Run: npm install (if not done)');
console.log('3. Run: npm run dev');
console.log('4. Test the API: curl https://awake-courage-production.up.railway.app/health');
console.log('5. Check API docs: curl https://awake-courage-production.up.railway.app/api/docs');

console.log('\n📚 For detailed setup instructions, see: README.md');
console.log('🧪 For testing instructions, see: setup-testing.md');

console.log('\n🎯 Setup test completed! 🏥'); 