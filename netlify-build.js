#!/usr/bin/env node

console.log('🚀 Netlify Build Script for StethoLink AI');
console.log('==========================================');

const fs = require('fs');
const path = require('path');

console.log('📂 Current working directory:', process.cwd());
console.log('📂 Directory contents:', fs.readdirSync('.'));

// Check multiple possible locations for public directory
const publicPaths = ['public', './public', '../public', '../../public'];
let publicFound = false;
let publicPath = '';

for (const testPath of publicPaths) {
  if (fs.existsSync(testPath)) {
    console.log(`✅ Public directory found at: ${testPath}`);
    publicFound = true;
    publicPath = testPath;
    break;
  }
}

if (!publicFound) {
  console.log('❌ Public directory not found in any expected location');
  console.log('🔍 Searching for HTML files...');
  
  // Search recursively for HTML files
  function findHtmlFiles(dir, depth = 0) {
    if (depth > 3) return; // Limit recursion depth
    
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && depth < 3) {
          findHtmlFiles(fullPath, depth + 1);
        } else if (item.endsWith('.html')) {
          console.log(`📄 Found HTML file: ${fullPath}`);
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
  }
  
  findHtmlFiles('.');
  process.exit(1);
}

// Check key files in the found public directory
const publicFiles = fs.readdirSync(publicPath);
console.log(`📁 Public directory contains ${publicFiles.length} files`);

const keyFiles = ['index.html', 'manifest.json', 'sw.js'];
keyFiles.forEach(file => {
  if (fs.existsSync(path.join(publicPath, file))) {
    console.log(`✅ ${file} found`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check if functions directory exists
const functionPaths = ['netlify/functions', './netlify/functions', '../netlify/functions'];
let functionsFound = false;

for (const testPath of functionPaths) {
  if (fs.existsSync(testPath)) {
    console.log(`✅ Functions directory found at: ${testPath}`);
    functionsFound = true;
    
    const functionFiles = fs.readdirSync(testPath);
    console.log(`📁 Functions directory contains: ${functionFiles.join(', ')}`);
    break;
  }
}

if (!functionsFound) {
  console.log('❌ Functions directory not found');
  process.exit(1);
}

console.log('🎉 Netlify build preparation complete!');
console.log('📡 Ready to deploy functions and frontend');
