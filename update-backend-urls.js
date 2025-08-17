#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 UPDATING ALL BACKEND URLS TO RAILWAY PRODUCTION');
console.log('==================================================');

const OLD_URL = 'http://localhost:3000';
const NEW_URL = 'https://awake-courage-production.up.railway.app';

const filesToUpdate = [
  // Test files
  'test-advanced-features.js',
  'test-comprehensive-dashboard.js',
  'test-100-precision.js',
  'test-all-functions.js',
  'test-enhanced-functionality.js',
  'test-global-medical-knowledge.js',
  'test-professional-interface.js',
  'test-production-readiness.js',
  'test-patient-simulation-chat.js',
  'test-mobile-app.js',
  'test-level1-medical-system.js',
  'test-medical-practice-system.js',
  'test-student-task-manager.js',
  'test-real-world-simulation.js',
  'test-chat-system.js',
  'test-complete-system.js',
  'test-setup.js',
  'test-pwa.js',
  'test-telegram-webhook.js',
  'test-telegram-bot-status.js',
  'test-telegram-simple.js',
  'real-medical-test.js',
  
  // Bot files
  'src/bots/whatsapp-ultimate.js',
  'src/bots/telegram.js',
  'src/bots/telegram-ultimate.js',
  'src/bots/telegram-simple.js',
  
  // Server files
  'src/server.js',
  'src/server-mobile-test.js',
  
  // Configuration files
  'env.example',
  'monitor-system.js',
  'quick-start.js',
  'generate-icons.js',
  
  // Documentation files
  'HEROKU_DEPLOYMENT_GUIDE.md',
  'RAILWAY_DEPLOYMENT_GUIDE.md',
  'setup-testing.md',
  'ADVANCED_FEATURES_GUIDE.md',
  'PRACTICAL_USAGE_GUIDE.md',
  'PHONE_TESTING_GUIDE.md',
  'BUTTONS_TESTING_GUIDE.md',
  'STUDENT_ACCESS_GUIDE.md',
  'PWA_TESTING_GUIDE.md',
  'PHONE_INSTALLATION_GUIDE.md',
  'WHATSAPP_TESTING_GUIDE.md',
  'PWA_IMPLEMENTATION_COMPLETE.md',
  'WHATSAPP_STARTUP_GUIDE.md',
  'ENHANCED_FEATURES_SUMMARY.md',
  'PRODUCTION_READINESS_CHECKLIST.md'
];

let updatedCount = 0;
let errorCount = 0;

console.log(`\n📋 Updating ${filesToUpdate.length} files...`);
console.log(`🔄 From: ${OLD_URL}`);
console.log(`✅ To: ${NEW_URL}\n`);

filesToUpdate.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // Replace all occurrences
      content = content.replace(new RegExp(OLD_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_URL);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
        updatedCount++;
      } else {
        console.log(`⏭️  No changes: ${filePath}`);
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log('\n🎉 URL UPDATE COMPLETED!');
console.log(`✅ Files updated: ${updatedCount}`);
console.log(`❌ Errors: ${errorCount}`);
console.log(`\n🚀 Your frontend applications now point to:`);
console.log(`   ${NEW_URL}`);
console.log(`\n📱 Test your updated endpoints:`);
console.log(`   • Health: ${NEW_URL}/health`);
console.log(`   • API: ${NEW_URL}/api`);
console.log(`   • Auth: ${NEW_URL}/auth`);
console.log(`   • Test: ${NEW_URL}/api/test`);
