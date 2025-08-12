const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test mobile app API endpoints
async function testMobileAppAPI() {
    console.log('🚀 Testing Mobile App API Endpoints\n');

    try {
        // Test 1: Health Check
        console.log('📱 Test 1: Mobile App Health Check');
        const healthResponse = await axios.get(`${BASE_URL}/api/mobile/health`);
        console.log('✅ Health Check:', healthResponse.data.message);
        console.log('📊 Status:', healthResponse.data.data.status);
        console.log('🔧 Initialized:', healthResponse.data.data.initialized);
        console.log('📱 Device Info:', healthResponse.data.data.deviceInfo ? 'Available' : 'Not Available');
        console.log('');

        // Test 2: Send Medical Alert
        console.log('🚨 Test 2: Send Medical Alert');
        const alertResponse = await axios.post(`${BASE_URL}/api/mobile/notifications/medical-alert`, {
            title: 'Test Medical Alert',
            message: 'This is a test medical alert notification',
            priority: 'high',
            category: 'test'
        });
        console.log('✅ Medical Alert:', alertResponse.data.message);
        console.log('📋 Alert Data:', alertResponse.data.data);
        console.log('');

        // Test 3: Schedule Study Reminder
        console.log('📚 Test 3: Schedule Study Reminder');
        const reminderResponse = await axios.post(`${BASE_URL}/api/mobile/notifications/study-reminder`, {
            subject: 'Medical Physiology',
            topic: 'Cardiovascular System',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            priority: 'normal'
        });
        console.log('✅ Study Reminder:', reminderResponse.data.message);
        console.log('📋 Reminder Data:', reminderResponse.data.data);
        console.log('');

        // Test 4: Send Emergency Update
        console.log('🆘 Test 4: Send Emergency Update');
        const emergencyResponse = await axios.post(`${BASE_URL}/api/mobile/notifications/emergency-update`, {
            title: 'Test Emergency',
            message: 'This is a test emergency update',
            location: 'Test Hospital',
            urgency: 'high'
        });
        console.log('✅ Emergency Update:', emergencyResponse.data.message);
        console.log('📋 Emergency Data:', emergencyResponse.data.data);
        console.log('');

        // Test 5: Process Background Task
        console.log('⚙️ Test 5: Process Background Task');
        const backgroundResponse = await axios.post(`${BASE_URL}/api/mobile/background-task`, {
            taskType: 'medical_analysis',
            data: { test: true, patientId: 'test-123' },
            priority: 'normal'
        });
        console.log('✅ Background Task:', backgroundResponse.data.message);
        console.log('📋 Task Result:', backgroundResponse.data.data);
        console.log('');

        // Test 6: Get Notification Settings
        console.log('⚙️ Test 6: Get Notification Settings');
        const settingsResponse = await axios.get(`${BASE_URL}/api/mobile/settings/notifications`);
        console.log('✅ Notification Settings:', settingsResponse.data.message);
        console.log('📋 Settings:', settingsResponse.data.data);
        console.log('');

        // Test 7: Update Notification Settings
        console.log('⚙️ Test 7: Update Notification Settings');
        const updateSettingsResponse = await axios.put(`${BASE_URL}/api/mobile/settings/notifications`, {
            dailyDigest: true,
            medicalAlerts: true,
            studyReminders: true,
            emergencyUpdates: true
        });
        console.log('✅ Settings Updated:', updateSettingsResponse.data.message);
        console.log('📋 New Settings:', updateSettingsResponse.data.data);
        console.log('');

        // Test 8: Test Mobile Agent Features
        console.log('🤖 Test 8: Test Mobile Agent Features');
        const testResponse = await axios.post(`${BASE_URL}/api/mobile/test`, {
            testType: 'notification'
        });
        console.log('✅ Test Completed:', testResponse.data.message);
        console.log('📋 Test Result:', testResponse.data.data);
        console.log('');

        console.log('🎉 All Mobile App API Tests Completed Successfully!');
        console.log('📱 Your mobile app is ready for development!');

    } catch (error) {
        if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('❌ Network Error: No response received');
            console.error('💡 Make sure your server is running: npm run start-standalone');
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

// Test device-specific features (these will fail in Node.js but show the API structure)
async function testDeviceFeatures() {
    console.log('\n📱 Testing Device-Specific Features (Expected to fail in Node.js)\n');

    try {
        // Test device location (will fail in Node.js)
        console.log('📍 Test: Get Device Location');
        const locationResponse = await axios.get(`${BASE_URL}/api/mobile/device/location`);
        console.log('✅ Location:', locationResponse.data);
    } catch (error) {
        console.log('❌ Location Test Failed (Expected in Node.js):', error.response?.data?.message || error.message);
    }

    try {
        // Test camera (will fail in Node.js)
        console.log('📷 Test: Take Medical Photo');
        const photoResponse = await axios.post(`${BASE_URL}/api/mobile/device/photo`, {
            options: { quality: 90 }
        });
        console.log('✅ Photo:', photoResponse.data);
    } catch (error) {
        console.log('❌ Camera Test Failed (Expected in Node.js):', error.response?.data?.message || error.message);
    }

    console.log('\n💡 Device features will work in the actual mobile app, not in Node.js testing');
}

// Run tests
async function runAllTests() {
    await testMobileAppAPI();
    await testDeviceFeatures();
}

// Export for use in other test files
module.exports = { testMobileAppAPI, testDeviceFeatures, runAllTests };

// Run if called directly
if (require.main === module) {
    runAllTests();
} 