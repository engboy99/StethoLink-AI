#!/usr/bin/env node

/**
 * Icon Generator for StethoLink AI PWA
 * This script creates placeholder icons for PWA functionality
 * 
 * Note: In production, you should replace these with actual designed icons
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const ICON_SIZES = [
    16, 32, 57, 60, 72, 76, 96, 114, 120, 128, 144, 152, 180, 192, 384, 512
];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
    console.log('📁 Created icons directory');
}

// Create a simple SVG icon for each size
ICON_SIZES.forEach(size => {
    const iconPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    
    // Create a simple stethoscope icon SVG
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#grad1)" stroke="#4a5568" stroke-width="2"/>
  
  <!-- Stethoscope icon -->
  <g transform="translate(${size/2}, ${size/2}) scale(${size/100})">
    <!-- Stethoscope tube -->
    <path d="M-30,-20 Q-30,-40 -10,-40 Q10,-40 10,-20 Q10,-10 0,0 Q-10,10 -30,10 Q-40,10 -40,0 Q-40,-10 -30,-20 Z" 
          fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    
    <!-- Earpieces -->
    <circle cx="-35" cy="-15" r="8" fill="white"/>
    <circle cx="-35" cy="15" r="8" fill="white"/>
    
    <!-- Plus symbol for AI -->
    <g stroke="white" stroke-width="4" stroke-linecap="round">
      <line x1="20" y1="-10" x2="20" y2="10"/>
      <line x1="10" y1="0" x2="30" y2="0"/>
    </g>
  </g>
  
  <!-- App name -->
  <text x="${size/2}" y="${size - 8}" text-anchor="middle" 
        font-family="Arial, sans-serif" font-size="${Math.max(8, size/20)}" 
        fill="white" font-weight="bold">StethoLink</text>
</svg>`;

    fs.writeFileSync(iconPath, svgContent);
    console.log(`✅ Created icon-${size}x${size}.svg`);
});

// Create favicon.ico placeholder (SVG for now)
const faviconPath = path.join(iconsDir, 'favicon.ico');
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="16" cy="16" r="15" fill="url(#grad1)" stroke="#4a5568" stroke-width="2"/>
  
  <g transform="translate(16, 16) scale(0.32)">
    <path d="M-30,-20 Q-30,-40 -10,-40 Q10,-40 10,-20 Q10,-10 0,0 Q-10,10 -30,10 Q-40,10 -40,0 Q-40,-10 -30,-20 Z" 
          fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    
    <circle cx="-35" cy="-15" r="8" fill="white"/>
    <circle cx="-35" cy="15" r="8" fill="white"/>
    
    <g stroke="white" stroke-width="4" stroke-linecap="round">
      <line x1="20" y1="-10" x2="20" y2="10"/>
      <line x1="10" y1="0" x2="30" y2="0"/>
    </g>
  </g>
</svg>`;

fs.writeFileSync(faviconPath, faviconSvg);
console.log('✅ Created favicon.ico (SVG placeholder)');

// Create a simple HTML test page to verify icons
const testPagePath = path.join(__dirname, 'public', 'test-icons.html');
const testPageContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Icon Test - StethoLink AI</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .icon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 20px; margin: 20px 0; }
        .icon-item { text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
        .icon-item img { max-width: 100%; height: auto; }
        .icon-item .size { font-size: 12px; color: #666; margin-top: 5px; }
    </style>
</head>
<body>
    <h1>🧪 Icon Test Page</h1>
    <p>This page displays all generated icons to verify they're working correctly.</p>
    
    <div class="icon-grid">
        <div class="icon-item">
            <img src="/icons/favicon.ico" alt="Favicon">
            <div class="size">Favicon</div>
        </div>
        ${ICON_SIZES.map(size => `
        <div class="icon-item">
            <img src="/icons/icon-${size}x${size}.svg" alt="Icon ${size}x${size}">
            <div class="size">${size}x${size}</div>
        </div>
        `).join('')}
    </div>
    
    <h2>📱 PWA Installation Test</h2>
    <p>To test PWA installation:</p>
    <ol>
        <li>Open this page in Chrome on your phone</li>
        <li>Look for "Add to Home Screen" banner</li>
        <li>Or check browser menu for install option</li>
    </ol>
    
    <h2>🔗 Quick Links</h2>
    <p><a href="/">🏠 Main App</a> | <a href="/test-sw.html">🧪 Service Worker Test</a> | <a href="/offline-dashboard.html">📱 Offline Dashboard</a></p>
</body>
</html>`;

fs.writeFileSync(testPagePath, testPageContent);
console.log('✅ Created test-icons.html');

console.log('\n🎉 Icon generation complete!');
console.log('\n📱 Next steps:');
console.log('1. Open http://localhost:3000/test-icons.html to verify icons');
console.log('2. Test PWA installation on your phone');
console.log('3. Follow the PHONE_TESTING_GUIDE.md for detailed testing');
console.log('\n💡 Note: These are placeholder SVG icons. Replace with actual PNG icons for production.'); 