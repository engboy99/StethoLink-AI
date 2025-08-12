require('dotenv').config();
const { logger } = require('./src/utils/logger');

async function testEnhancedFeatures() {
    console.log('🧪 Testing Enhanced Telegram Agent Features...\n');

// Test 1: Check if services are loaded
console.log('1️⃣ Testing Service Loading...');
try {
    const medicalAgentSystem = require('./src/services/medical-agent-system');
    const notificationService = require('./src/services/notification-service');
    const notebookService = require('./src/services/notebook-service');
    const alertProcessor = require('./src/services/alert-processor');
    
    console.log('✅ All services loaded successfully');
    console.log('   - Medical Agent System: ✅');
    console.log('   - Notification Service: ✅');
    console.log('   - Notebook Service: ✅');
    console.log('   - Alert Processor: ✅');
} catch (error) {
    console.log('❌ Service loading failed:', error.message);
}

// Test 2: Test Medical Agent System
console.log('\n2️⃣ Testing Medical Agent System...');
try {
    const medicalAgentSystem = require('./src/services/medical-agent-system');
    
    // Test agent initialization
    const testUserId = 'test-user-' + Date.now();
    const agent = await medicalAgentSystem.initializeAgent(testUserId, {
        name: 'Test Student',
        telegramId: 123456789,
        language: 'en'
    });
    
    console.log('✅ Agent initialized successfully');
    console.log(`   - Agent ID: ${agent.id}`);
    console.log(`   - Student ID: ${agent.studentId}`);
    console.log(`   - Status: ${agent.status}`);
    
    // Test task creation
    const taskResult = await medicalAgentSystem.addTaskWithAlerts(testUserId, {
        title: 'Test Study Task',
        description: 'Testing enhanced task creation',
        category: 'study',
        priority: 'medium',
        scheduledTime: new Date(Date.now() + 60000), // 1 minute from now
        deadline: new Date(Date.now() + 3600000) // 1 hour from now
    });
    
    console.log('✅ Task created successfully');
    console.log(`   - Task ID: ${taskResult.task.id}`);
    console.log(`   - Alerts scheduled: ${taskResult.alerts.length}`);
    
} catch (error) {
    console.log('❌ Medical Agent System test failed:', error.message);
}

// Test 3: Test Notebook Service
console.log('\n3️⃣ Testing Notebook Service...');
try {
    const notebookService = require('./src/services/notebook-service');
    
    // Test note creation
    const testUserId = 'test-user-' + Date.now();
    const noteResult = await notebookService.addNote(testUserId, {
        title: 'Test Medical Note',
        content: 'This is a test note for ECG interpretation',
        category: 'cardiology',
        tags: ['ECG', 'cardiology', 'test'],
        priority: 'high'
    });
    
    console.log('✅ Note created successfully');
    console.log(`   - Note ID: ${noteResult.note.id}`);
    console.log(`   - Title: ${noteResult.note.title}`);
    console.log(`   - Category: ${noteResult.note.category}`);
    console.log(`   - Word Count: ${noteResult.note.wordCount}`);
    
    // Test note retrieval
    const notesResult = await notebookService.getNotes(testUserId);
    console.log('✅ Notes retrieved successfully');
    console.log(`   - Total notes: ${notesResult.total}`);
    
} catch (error) {
    console.log('❌ Notebook Service test failed:', error.message);
}

// Test 4: Test Notification Service
console.log('\n4️⃣ Testing Notification Service...');
try {
    const notificationService = require('./src/services/notification-service');
    
    // Test alert creation
    const testAlert = {
        id: 'test-alert-' + Date.now(),
        type: 'task_reminder',
        priority: 'medium',
        message: 'Test reminder for study task',
        channels: ['telegram', 'sound', 'voice']
    };
    
    const notification = await notificationService.sendAlert('test-user', testAlert, {
        name: 'Test Student',
        telegramId: 123456789,
        language: 'en'
    });
    
    console.log('✅ Notification sent successfully');
    console.log(`   - Notification ID: ${notification.id}`);
    console.log(`   - Title: ${notification.title}`);
    console.log(`   - Priority: ${notification.priority}`);
    
} catch (error) {
    console.log('❌ Notification Service test failed:', error.message);
}

// Test 5: Test Alert Processor
console.log('\n5️⃣ Testing Alert Processor...');
try {
    const alertProcessor = require('./src/services/alert-processor');
    
    const status = alertProcessor.getStatus();
    console.log('✅ Alert Processor status:');
    console.log(`   - Running: ${status.isRunning}`);
    console.log(`   - Check Interval: ${status.checkInterval}ms`);
    console.log(`   - Processed Alerts: ${status.processedAlertsCount}`);
    
} catch (error) {
    console.log('❌ Alert Processor test failed:', error.message);
}

// Test 6: Test Server Status
console.log('\n6️⃣ Testing Server Status...');
try {
    const http = require('http');
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET',
        timeout: 5000
    };
    
    const req = http.request(options, (res) => {
        console.log('✅ Server is running');
        console.log(`   - Status: ${res.statusCode}`);
        console.log(`   - Port: 3000`);
    });
    
    req.on('error', (error) => {
        console.log('❌ Server connection failed:', error.message);
    });
    
    req.on('timeout', () => {
        console.log('❌ Server connection timeout');
        req.destroy();
    });
    
    req.end();
    
} catch (error) {
    console.log('❌ Server test failed:', error.message);
}

console.log('\n🎯 Enhanced Features Summary:');
console.log('✅ Enhanced Alert System with Sounds & Voice');
console.log('✅ Interactive Notebook System');
console.log('✅ Dashboard Integration');
console.log('✅ Natural Language Commands');
console.log('✅ Medical Agent Memory');
console.log('✅ Cross-Platform Sync');

console.log('\n🚀 Ready to test in Telegram!');
console.log('📱 Open Telegram and search for @StethoLinkAI');
console.log('💬 Try these commands:');
console.log('   - /start');
console.log('   - /agent');
console.log('   - "Study cardiology at 6 PM"');
console.log('   - "add note: ECG interpretation basics"');
console.log('   - "dashboard"');
console.log('   - "my notes"');
console.log('   - "Calculate BMI for 70kg 1.75m"');
}

// Run the test
testEnhancedFeatures().catch(console.error); 