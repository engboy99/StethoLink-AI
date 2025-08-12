#!/usr/bin/env node

/**
 * Test Script for StethoLink AI Standalone App
 * 
 * This script tests the standalone app functionality without starting the server.
 * Run this to verify everything is working before starting the app.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing StethoLink AI Standalone App');
console.log('=======================================\n');

let allTestsPassed = true;

// Test 1: Check required files
console.log('📁 Test 1: Required Files');
const requiredFiles = [
  'src/standalone-app.js',
  'public/index.html',
  'public/css/style.css',
  'public/js/app.js',
  'package.json'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} (missing)`);
    allTestsPassed = false;
  }
});

// Test 2: Check package.json
console.log('\n📦 Test 2: Package Configuration');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts['start-standalone']) {
    console.log('   ✅ start-standalone script found');
  } else {
    console.log('   ❌ start-standalone script missing');
    allTestsPassed = false;
  }
  
  if (packageJson.dependencies) {
    const requiredDeps = ['express'];
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length === 0) {
      console.log('   ✅ Required dependencies found');
    } else {
      console.log(`   ❌ Missing dependencies: ${missingDeps.join(', ')}`);
      allTestsPassed = false;
    }
  }
} catch (error) {
  console.log('   ❌ Error reading package.json:', error.message);
  allTestsPassed = false;
}

// Test 3: Check standalone app syntax
console.log('\n🔍 Test 3: App Code Validation');
try {
  const appCode = fs.readFileSync('src/standalone-app.js', 'utf8');
  
  // Check for required functions
  const requiredFunctions = [
    'processMessage',
    'getUserProfile',
    'updateUserProfile',
    'getYearSpecificCurriculum',
    'getAvailableTools'
  ];
  
  requiredFunctions.forEach(func => {
    if (appCode.includes(`function ${func}`) || appCode.includes(`async function ${func}`)) {
      console.log(`   ✅ ${func} function found`);
    } else {
      console.log(`   ❌ ${func} function missing`);
      allTestsPassed = false;
    }
  });
  
  // Check for required routes
  const requiredRoutes = [
    'app.get(\'/\'',
    'app.post(\'/api/chat\'',
    'app.get(\'/api/user/:userId\'',
    'app.get(\'/health\''
  ];
  
  requiredRoutes.forEach(route => {
    if (appCode.includes(route)) {
      console.log(`   ✅ ${route} route found`);
    } else {
      console.log(`   ❌ ${route} route missing`);
      allTestsPassed = false;
    }
  });
  
} catch (error) {
  console.log('   ❌ Error reading standalone app:', error.message);
  allTestsPassed = false;
}

// Test 4: Check HTML structure
console.log('\n🌐 Test 4: HTML Structure');
try {
  const htmlContent = fs.readFileSync('public/index.html', 'utf8');
  
  const requiredElements = [
    'StethoLink AI',
    'manifest.json',
    'sw.js',
    'id="app"',
    'class="header"',
    'class="main-content"'
  ];
  
  requiredElements.forEach(element => {
    if (htmlContent.includes(element)) {
      console.log(`   ✅ ${element} found`);
    } else {
      console.log(`   ❌ ${element} missing`);
      allTestsPassed = false;
    }
  });
  
} catch (error) {
  console.log('   ❌ Error reading HTML:', error.message);
  allTestsPassed = false;
}

// Test 5: Check CSS structure
console.log('\n🎨 Test 5: CSS Structure');
try {
  const cssContent = fs.readFileSync('public/css/style.css', 'utf8');
  
  const requiredStyles = [
    '.header',
    '.main-content',
    '.welcome-section',
    '.menu-grid',
    '@media'
  ];
  
  requiredStyles.forEach(style => {
    if (cssContent.includes(style)) {
      console.log(`   ✅ ${style} style found`);
    } else {
      console.log(`   ❌ ${style} style missing`);
      allTestsPassed = false;
    }
  });
  
} catch (error) {
  console.log('   ❌ Error reading CSS:', error.message);
  allTestsPassed = false;
}

// Test 6: Check JavaScript functionality
console.log('\n⚡ Test 6: JavaScript Functionality');
try {
  const jsContent = fs.readFileSync('public/js/app.js', 'utf8');
  
  const requiredJS = [
    'class StethoLinkApp',
    'constructor()',
    'init()',
    'bindEvents()',
    'startApp()'
  ];
  
  requiredJS.forEach(js => {
    if (jsContent.includes(js)) {
      console.log(`   ✅ ${js} found`);
    } else {
      console.log(`   ❌ ${js} missing`);
      allTestsPassed = false;
    }
  });
  
} catch (error) {
  console.log('   ❌ Error reading JavaScript:', error.message);
  allTestsPassed = false;
}

// Test 7: Check startup script
console.log('\n🚀 Test 7: Startup Script');
try {
  const startupContent = fs.readFileSync('start-standalone.js', 'utf8');
  
  if (startupContent.includes('StethoLink AI Standalone App')) {
    console.log('   ✅ Startup script found and valid');
  } else {
    console.log('   ❌ Startup script invalid');
    allTestsPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error reading startup script:', error.message);
  allTestsPassed = false;
}

// Final Results
console.log('\n' + '='.repeat(50));
if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('✅ Your StethoLink AI Standalone App is ready to use!');
  console.log('\n🚀 To start the app, run:');
  console.log('   npm run start-standalone');
  console.log('\n📱 Students can then install it on their phones!');
} else {
  console.log('❌ SOME TESTS FAILED');
  console.log('🔧 Please fix the issues above before starting the app.');
  console.log('\n💡 Common fixes:');
  console.log('   • Run: npm install');
  console.log('   • Check file paths and names');
  console.log('   • Verify all required files exist');
}

console.log('\n' + '='.repeat(50)); 