#!/usr/bin/env node

/**
 * StethoLink AI Standalone App Startup Script
 * 
 * This script starts the standalone medical student app that can be installed
 * as a Progressive Web App (PWA) on phones and computers.
 * 
 * Usage:
 *   node start-standalone.js
 *   npm run start-standalone
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🏥 StethoLink AI Standalone App');
console.log('================================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Error: Node.js version 18 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  console.error('   Please update Node.js and try again');
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Check if required files exist
const requiredFiles = [
  'src/standalone-app.js',
  'public/index.html',
  'public/css/style.css',
  'public/js/app.js'
];

console.log('\n🔍 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} (missing)`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('\n❌ Some required files are missing. Please ensure all files are present.');
  process.exit(1);
}

// Check if dependencies are installed
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies || {});
  console.log(`   ✅ Found ${dependencies.length} dependencies`);
} catch (error) {
  console.error('   ❌ Error reading package.json');
  process.exit(1);
}

// Start the standalone app
console.log('\n🚀 Starting StethoLink AI Standalone App...\n');

const appPath = path.join(__dirname, 'src', 'standalone-app.js');

try {
  const child = spawn('node', [appPath], {
    stdio: 'inherit',
    cwd: __dirname
  });

  child.on('error', (error) => {
    console.error('❌ Failed to start app:', error.message);
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`\n❌ App exited with code ${code}`);
      process.exit(code);
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down StethoLink AI...');
    child.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n\n🛑 Shutting down StethoLink AI...');
    child.kill('SIGTERM');
    process.exit(0);
  });

} catch (error) {
  console.error('❌ Error starting app:', error.message);
  process.exit(1);
} 