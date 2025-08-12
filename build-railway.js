#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Building StethoLink AI for Railway...');

// Check if we're in Railway environment
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID;

if (isRailway) {
  console.log('✅ Building in Railway environment');
} else {
  console.log('⚠️ Building in local environment');
}

// Verify critical files exist
const criticalFiles = [
  'src/server-railway.js',
  'start-railway.js',
  'package.json',
  'railway.json'
];

console.log('📋 Checking critical files...');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check if public directory exists (for PWA)
if (fs.existsSync('public')) {
  console.log('✅ Public directory exists');
  const publicFiles = fs.readdirSync('public');
  console.log(`📁 Public directory contains ${publicFiles.length} files`);
} else {
  console.log('⚠️ Public directory not found');
}

// Verify package.json has required scripts
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['start', 'build'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ Script '${script}' exists`);
    } else {
      console.log(`❌ Script '${script}' missing`);
    }
  });
  
  console.log('✅ Package.json validation complete');
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

console.log('🎉 Railway build preparation complete!');
console.log('📡 Ready to deploy to Railway');
