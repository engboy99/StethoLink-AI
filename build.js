#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Building StethoLink AI for production...');

// Ensure public directory exists
if (!fs.existsSync('public')) {
    console.error('❌ Public directory not found!');
    process.exit(1);
}

// List contents of public directory
console.log('📁 Public directory contents:');
const files = fs.readdirSync('public');
files.forEach(file => {
    const stats = fs.statSync(path.join('public', file));
    const size = stats.isDirectory() ? '<DIR>' : `${stats.size} bytes`;
    console.log(`   ${file} - ${size}`);
});

// Verify key files exist
console.log('🔍 Verifying key files...');

const requiredFiles = ['index.html', 'manifest.json', 'sw.js'];
let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(path.join('public', file))) {
        console.log(`✅ ${file} found`);
    } else {
        console.log(`❌ ${file} missing`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.error('❌ Build failed - missing required files');
    process.exit(1);
}

console.log('✅ Build completed successfully!');
console.log('📱 StethoLink AI is ready for deployment!'); 