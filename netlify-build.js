#!/usr/bin/env node

console.log('🚀 Netlify Build Script for StethoLink AI');
console.log('==========================================');

const fs = require('fs');
const path = require('path');

// Check if public directory exists
if (fs.existsSync('public')) {
  console.log('✅ Public directory exists');
  const publicFiles = fs.readdirSync('public');
  console.log(`📁 Public directory contains ${publicFiles.length} files`);
  
  // List key files
  const keyFiles = ['index.html', 'manifest.json', 'sw.js'];
  keyFiles.forEach(file => {
    if (fs.existsSync(`public/${file}`)) {
      console.log(`✅ ${file} found`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  });
} else {
  console.log('❌ Public directory not found');
  process.exit(1);
}

// Check if functions directory exists
if (fs.existsSync('netlify/functions')) {
  console.log('✅ Functions directory exists');
  const functionFiles = fs.readdirSync('netlify/functions');
  console.log(`📁 Functions directory contains: ${functionFiles.join(', ')}`);
} else {
  console.log('❌ Functions directory not found');
  process.exit(1);
}

console.log('🎉 Netlify build preparation complete!');
console.log('📡 Ready to deploy functions and frontend');
