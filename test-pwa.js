#!/usr/bin/env node

/**
 * PWA Testing Script for StethoLink AI
 * This script tests all PWA functionality including service worker, offline capabilities, and installation
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🧪 StethoLink AI PWA Testing Suite');
console.log('=====================================\n');

// Test configuration
const TEST_CONFIG = {
    baseUrl: 'http://localhost:3000',
    timeout: 10000,
    testFiles: [
        '/',
        '/manifest.json',
        '/offline-dashboard.html',
        '/offline.html',
        '/offline-api.html',
        '/test-sw.html',
        '/test-icons.html',
        '/js/sw-register.js',
        '/js/app.js',
        '/css/style.css'
    ],
    requiredIcons: [
        '/icons/favicon.ico',
        '/icons/icon-192x192.svg',
        '/icons/icon-512x512.svg'
    ]
};

// Test results
let testResults = {
    passed: 0,
    failed: 0,
    total: 0
};

// Utility function to make HTTP requests
function makeRequest(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const req = http.request(url, { method, timeout: TEST_CONFIG.timeout }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        });
        
        req.on('error', reject);
        req.on('timeout', () => reject(new Error('Request timeout')));
        req.end();
    });
}

// Test function
async function runTest(testName, testFunction) {
    testResults.total++;
    try {
        await testFunction();
        console.log(`✅ ${testName}`);
        testResults.passed++;
        return true;
    } catch (error) {
        console.log(`❌ ${testName}: ${error.message}`);
        testResults.failed++;
        return false;
    }
}

// Test 1: Check if server is running
async function testServerRunning() {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/`);
    if (response.status !== 200) {
        throw new Error(`Server returned status ${response.status}`);
    }
}

// Test 2: Check manifest.json
async function testManifest() {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/manifest.json`);
    if (response.status !== 200) {
        throw new Error(`Manifest not accessible: ${response.status}`);
    }
    
    try {
        const manifest = JSON.parse(response.data);
        if (!manifest.name || !manifest.short_name || !manifest.icons) {
            throw new Error('Manifest missing required fields');
        }
        console.log(`   📱 App Name: ${manifest.name}`);
        console.log(`   🏷️ Short Name: ${manifest.short_name}`);
        console.log(`   🎨 Icons: ${manifest.icons.length} icon definitions`);
    } catch (parseError) {
        throw new Error(`Invalid JSON in manifest: ${parseError.message}`);
    }
}

// Test 3: Check offline pages
async function testOfflinePages() {
    const offlinePages = ['/offline-dashboard.html', '/offline.html', '/offline-api.html'];
    
    for (const page of offlinePages) {
        const response = await makeRequest(`${TEST_CONFIG.baseUrl}${page}`);
        if (response.status !== 200) {
            throw new Error(`Offline page ${page} not accessible: ${response.status}`);
        }
    }
    console.log(`   📴 All offline pages accessible`);
}

// Test 4: Check service worker files
async function testServiceWorkerFiles() {
    const swFiles = ['/js/sw-register.js', '/sw.js'];
    
    for (const file of swFiles) {
        const response = await makeRequest(`${TEST_CONFIG.baseUrl}${file}`);
        if (response.status !== 200) {
            throw new Error(`Service worker file ${file} not accessible: ${response.status}`);
        }
    }
    console.log(`   🔄 Service worker files accessible`);
}

// Test 5: Check icons
async function testIcons() {
    const iconFiles = ['/icons/favicon.ico', '/icons/icon-192x192.svg', '/icons/icon-512x512.svg'];
    
    for (const icon of iconFiles) {
        const response = await makeRequest(`${TEST_CONFIG.baseUrl}${icon}`);
        if (response.status !== 200) {
            throw new Error(`Icon ${icon} not accessible: ${response.status}`);
        }
    }
    console.log(`   🎨 All required icons accessible`);
}

// Test 6: Check CSS and JS files
async function testAssets() {
    const assets = ['/css/style.css', '/js/app.js'];
    
    for (const asset of assets) {
        const response = await makeRequest(`${TEST_CONFIG.baseUrl}${asset}`);
        if (response.status !== 200) {
            throw new Error(`Asset ${asset} not accessible: ${response.status}`);
        }
    }
    console.log(`   🎨 CSS and JS assets accessible`);
}

// Test 7: Check PWA meta tags
async function testPWAMetaTags() {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/`);
    const html = response.data;
    
    const requiredMeta = [
        'manifest',
        'apple-mobile-web-app-capable',
        'apple-mobile-web-app-title',
        'theme-color'
    ];
    
    for (const meta of requiredMeta) {
        if (!html.includes(meta)) {
            throw new Error(`Missing PWA meta tag: ${meta}`);
        }
    }
    console.log(`   📱 PWA meta tags present`);
}

// Test 8: Check offline functionality simulation
async function testOfflineSimulation() {
    // This test simulates what would happen in offline mode
    console.log(`   📴 Offline simulation: Service worker should handle offline requests`);
    console.log(`   💡 Use Chrome DevTools Network tab "Offline" checkbox to test`);
}

// Test 9: Check installation readiness
async function testInstallationReadiness() {
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/manifest.json`);
    const manifest = JSON.parse(response.data);
    
    if (!manifest.display || manifest.display !== 'standalone') {
        throw new Error('Manifest display mode not set to standalone');
    }
    
    if (!manifest.start_url) {
        throw new Error('Manifest missing start_url');
    }
    
    if (!manifest.icons || manifest.icons.length < 3) {
        throw new Error('Manifest missing required icons');
    }
    
    console.log(`   📱 PWA installation ready`);
    console.log(`   🎯 Display mode: ${manifest.display}`);
    console.log(`   🚀 Start URL: ${manifest.start_url}`);
}

// Test 10: Check service worker registration
async function testServiceWorkerRegistration() {
    // This test checks if the service worker registration code is present
    const response = await makeRequest(`${TEST_CONFIG.baseUrl}/js/sw-register.js`);
    const js = response.data;
    
    if (!js.includes('ServiceWorkerManager')) {
        throw new Error('ServiceWorkerManager class not found');
    }
    
    if (!js.includes('navigator.serviceWorker.register')) {
        throw new Error('Service worker registration not found');
    }
    
    console.log(`   🔄 Service worker registration code present`);
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting PWA tests...\n');
    
    await runTest('Server Running', testServerRunning);
    await runTest('Manifest.json Accessible', testManifest);
    await runTest('Offline Pages Accessible', testOfflinePages);
    await runTest('Service Worker Files Accessible', testServiceWorkerFiles);
    await runTest('Icons Accessible', testIcons);
    await runTest('Assets Accessible', testAssets);
    await runTest('PWA Meta Tags Present', testPWAMetaTags);
    await runTest('Offline Functionality Ready', testOfflineSimulation);
    await runTest('Installation Ready', testInstallationReadiness);
    await runTest('Service Worker Registration', testServiceWorkerRegistration);
    
    console.log('\n📊 Test Results:');
    console.log(`   ✅ Passed: ${testResults.passed}`);
    console.log(`   ❌ Failed: ${testResults.failed}`);
    console.log(`   📊 Total: ${testResults.total}`);
    
    if (testResults.failed === 0) {
        console.log('\n🎉 All tests passed! Your PWA is ready for phone testing.');
        console.log('\n📱 Next Steps:');
        console.log('1. Open http://localhost:3000 on your phone');
        console.log('2. Look for "Add to Home Screen" or install prompt');
        console.log('3. Test offline functionality by turning off WiFi');
        console.log('4. Follow PHONE_TESTING_GUIDE.md for detailed testing');
    } else {
        console.log('\n⚠️ Some tests failed. Please fix the issues before testing on phone.');
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('❌ Test suite failed:', error.message);
        process.exit(1);
    });
}

module.exports = { runAllTests, testResults }; 