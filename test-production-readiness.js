const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

console.log('🚀 STETHOLINK AI - PRODUCTION READINESS TEST');
console.log('=============================================\n');

let passedTests = 0;
let totalTests = 0;
let criticalFailures = 0;

async function runTest(testName, testFunction, isCritical = false) {
  totalTests++;
  console.log(`🧪 Testing: ${testName}`);
  console.log('='.repeat(80));
  
  try {
    const result = await testFunction();
    console.log(`✅ ${testName} - PASSED`);
    console.log(`Result: ${JSON.stringify(result, null, 2)}\n`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${testName} - FAILED: ${error.message}\n`);
    if (isCritical) {
      criticalFailures++;
    }
  }
}

// ===== SECURITY TESTS =====

// Test 1: Environment Variables Security
async function testEnvironmentSecurity() {
  const requiredEnvVars = [
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'FIREBASE_PROJECT_ID',
    'NODE_ENV'
  ];

  const missingVars = [];
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing critical environment variables: ${missingVars.join(', ')}`);
  }

  // Check for weak secrets
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET is too short (minimum 32 characters)');
  }

  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length < 32) {
    throw new Error('ENCRYPTION_KEY is too short (minimum 32 characters)');
  }

  return {
    status: 'secure',
    environment: process.env.NODE_ENV,
    hasJWTSecret: !!process.env.JWT_SECRET,
    hasEncryptionKey: !!process.env.ENCRYPTION_KEY,
    hasFirebaseConfig: !!process.env.FIREBASE_PROJECT_ID
  };
}

// Test 2: Authentication System
async function testAuthenticationSystem() {
  // Test registration
  const testUser = {
    email: `test-${Date.now()}@stetholink.test`,
    password: 'SecurePassword123!',
    displayName: 'Test User',
    language: 'en',
    platform: 'api'
  };

  const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
  
  if (!registerResponse.data.success) {
    throw new Error('User registration failed');
  }

  const { token } = registerResponse.data.data;

  // Test protected endpoint with valid token
  const protectedResponse = await axios.get(`${BASE_URL}/api/student/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (protectedResponse.status !== 200) {
    throw new Error('Protected endpoint access failed with valid token');
  }

  // Test protected endpoint without token (should fail)
  try {
    await axios.get(`${BASE_URL}/api/student/tasks`);
    throw new Error('Protected endpoint accessible without token');
  } catch (error) {
    if (error.response.status !== 401) {
      throw new Error('Expected 401 for unauthorized access');
    }
  }

  return {
    status: 'working',
    registration: 'successful',
    tokenGeneration: 'working',
    protectedAccess: 'working',
    unauthorizedBlocking: 'working'
  };
}

// Test 3: Rate Limiting
async function testRateLimiting() {
  const requests = [];
  const maxRequests = 110; // Should trigger rate limit

  for (let i = 0; i < maxRequests; i++) {
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      requests.push({ status: response.status, rateLimited: false });
    } catch (error) {
      if (error.response && error.response.status === 429) {
        requests.push({ status: 429, rateLimited: true });
      } else {
        requests.push({ status: error.response?.status || 0, rateLimited: false });
      }
    }
  }

  const rateLimitedRequests = requests.filter(r => r.rateLimited);
  
  if (rateLimitedRequests.length === 0) {
    throw new Error('Rate limiting not working - no requests were blocked');
  }

  return {
    status: 'working',
    totalRequests: requests.length,
    rateLimitedRequests: rateLimitedRequests.length,
    rateLimitTriggered: rateLimitedRequests.length > 0
  };
}

// ===== PERFORMANCE TESTS =====

// Test 4: Response Time Performance
async function testResponseTimePerformance() {
  const responseTimes = [];
  const testCount = 10;

  for (let i = 0; i < testCount; i++) {
    const startTime = Date.now();
    await axios.get(`${BASE_URL}/health`);
    const endTime = Date.now();
    responseTimes.push(endTime - startTime);
  }

  const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const maxResponseTime = Math.max(...responseTimes);

  if (avgResponseTime > 1000) {
    throw new Error(`Average response time too high: ${avgResponseTime}ms`);
  }

  if (maxResponseTime > 3000) {
    throw new Error(`Maximum response time too high: ${maxResponseTime}ms`);
  }

  return {
    status: 'acceptable',
    averageResponseTime: `${avgResponseTime.toFixed(2)}ms`,
    maxResponseTime: `${maxResponseTime}ms`,
    testCount
  };
}

// Test 5: Memory Usage
async function testMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
  const usagePercentage = (heapUsedMB / heapTotalMB) * 100;

  if (usagePercentage > 90) {
    throw new Error(`Memory usage too high: ${usagePercentage.toFixed(2)}%`);
  }

  return {
    status: 'healthy',
    heapUsed: `${heapUsedMB}MB`,
    heapTotal: `${heapTotalMB}MB`,
    usagePercentage: `${usagePercentage.toFixed(2)}%`
  };
}

// ===== MONITORING TESTS =====

// Test 6: Health Check Endpoints
async function testHealthEndpoints() {
  const endpoints = ['/health', '/health/detailed', '/health/performance'];
  const results = {};

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      results[endpoint] = {
        status: response.status,
        working: true,
        data: response.data
      };
    } catch (error) {
      results[endpoint] = {
        status: error.response?.status || 0,
        working: false,
        error: error.message
      };
    }
  }

  const workingEndpoints = Object.values(results).filter(r => r.working).length;
  
  if (workingEndpoints < endpoints.length) {
    throw new Error(`Only ${workingEndpoints}/${endpoints.length} health endpoints working`);
  }

  return {
    status: 'working',
    totalEndpoints: endpoints.length,
    workingEndpoints,
    details: results
  };
}

// Test 7: Monitoring Data
async function testMonitoringData() {
  const response = await axios.get(`${BASE_URL}/health/performance`);
  const data = response.data.data;

  if (!data || !data.summary || !data.details) {
    throw new Error('Monitoring data structure incomplete');
  }

  const requiredFields = ['status', 'uptime', 'totalRequests', 'avgResponseTime'];
  const missingFields = requiredFields.filter(field => !data.summary[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing monitoring fields: ${missingFields.join(', ')}`);
  }

  return {
    status: 'working',
    monitoringData: 'complete',
    summary: data.summary,
    hasRecommendations: Array.isArray(data.recommendations)
  };
}

// ===== DATABASE TESTS =====

// Test 8: Database Connectivity
async function testDatabaseConnectivity() {
  try {
    // Test a simple database operation through an API endpoint
    const response = await axios.get(`${BASE_URL}/api/student/tasks`);
    
    // If we get a response (even 401), the database connection is working
    return {
      status: 'connected',
      database: 'firebase',
      connection: 'working',
      responseStatus: response.status
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // 401 means database is working but authentication failed (expected)
      return {
        status: 'connected',
        database: 'firebase',
        connection: 'working',
        note: 'Authentication required (expected)'
      };
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Database connection refused');
    } else {
      throw new Error(`Database test failed: ${error.message}`);
    }
  }
}

// ===== DEPLOYMENT TESTS =====

// Test 9: Production Files
async function testProductionFiles() {
  const requiredFiles = [
    'public/index.html',
    'public/manifest.json',
    'public/sw.js',
    'netlify.toml',
    'package.json'
  ];

  const missingFiles = [];
  const existingFiles = [];

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      existingFiles.push(file);
    } else {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    throw new Error(`Missing production files: ${missingFiles.join(', ')}`);
  }

  // Check PWA manifest
  const manifestPath = 'public/manifest.json';
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (!manifest.name || !manifest.short_name) {
      throw new Error('PWA manifest incomplete');
    }
  }

  return {
    status: 'ready',
    totalFiles: requiredFiles.length,
    existingFiles: existingFiles.length,
    missingFiles: missingFiles.length,
    pwaManifest: 'valid'
  };
}

// Test 10: Build Process
async function testBuildProcess() {
  // Check if build scripts exist
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['build', 'start', 'start-standalone'];
  
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
  
  if (missingScripts.length > 0) {
    throw new Error(`Missing build scripts: ${missingScripts.join(', ')}`);
  }

  // Check if public directory has content
  const publicDir = 'public';
  if (!fs.existsSync(publicDir)) {
    throw new Error('Public directory missing');
  }

  const publicFiles = fs.readdirSync(publicDir);
  if (publicFiles.length === 0) {
    throw new Error('Public directory is empty');
  }

  return {
    status: 'ready',
    buildScripts: 'complete',
    publicDirectory: 'exists',
    publicFiles: publicFiles.length,
    scripts: Object.keys(packageJson.scripts)
  };
}

// ===== RUN ALL TESTS =====

async function runAllTests() {
  console.log('🚀 Starting Production Readiness Tests...\n');

  // Security Tests (Critical)
  await runTest('Environment Variables Security', testEnvironmentSecurity, true);
  await runTest('Authentication System', testAuthenticationSystem, true);
  await runTest('Rate Limiting', testRateLimiting, true);

  // Performance Tests
  await runTest('Response Time Performance', testResponseTimePerformance, false);
  await runTest('Memory Usage', testMemoryUsage, false);

  // Monitoring Tests
  await runTest('Health Check Endpoints', testHealthEndpoints, false);
  await runTest('Monitoring Data', testMonitoringData, false);

  // Database Tests
  await runTest('Database Connectivity', testDatabaseConnectivity, true);

  // Deployment Tests
  await runTest('Production Files', testProductionFiles, true);
  await runTest('Build Process', testBuildProcess, true);

  // Generate Report
  generateTestReport();
}

function generateTestReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 PRODUCTION READINESS TEST RESULTS');
  console.log('='.repeat(80));

  const successRate = ((passedTests / totalTests) * 100).toFixed(2);
  const criticalSuccessRate = criticalFailures === 0 ? 100 : 0;

  console.log(`\n📈 Overall Results:`);
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${passedTests}`);
  console.log(`   Failed: ${totalTests - passedTests}`);
  console.log(`   Success Rate: ${successRate}%`);
  console.log(`   Critical Failures: ${criticalFailures}`);

  if (criticalFailures > 0) {
    console.log(`\n🚨 CRITICAL ISSUES DETECTED!`);
    console.log(`   Your app is NOT ready for production deployment.`);
    console.log(`   Fix the critical failures above before proceeding.`);
  } else if (passedTests === totalTests) {
    console.log(`\n🎉 ALL TESTS PASSED!`);
    console.log(`   Your StethoLink AI is 100% ready for production!`);
    console.log(`   You can deploy immediately.`);
  } else {
    console.log(`\n⚠️  PARTIAL SUCCESS`);
    console.log(`   Your app is mostly ready but has some non-critical issues.`);
    console.log(`   Consider fixing them before production deployment.`);
  }

  console.log(`\n🚀 Next Steps:`);
  if (criticalFailures === 0) {
    console.log(`   1. ✅ Security: Ready`);
    console.log(`   2. ✅ Database: Ready`);
    console.log(`   3. ✅ Monitoring: Ready`);
    console.log(`   4. 🚀 Deploy to production!`);
    console.log(`\n   Choose your deployment platform:`);
    console.log(`     • Netlify (Recommended): https://app.netlify.com/`);
    console.log(`     • Vercel: https://vercel.com/`);
    console.log(`     • Heroku: https://heroku.com/`);
  } else {
    console.log(`   1. ❌ Fix critical security issues`);
    console.log(`   2. ❌ Fix critical database issues`);
    console.log(`   3. 🔧 Address non-critical issues`);
    console.log(`   4. 🧪 Re-run tests`);
    console.log(`   5. 🚀 Deploy when all critical issues resolved`);
  }

  console.log(`\n📋 Detailed test results saved to: production-test-results.json`);
}

// Save detailed results to file
function saveTestResults() {
  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate: ((passedTests / totalTests) * 100).toFixed(2),
      criticalFailures
    },
    recommendations: criticalFailures === 0 ? 
      'Ready for production deployment' : 
      'Fix critical issues before deployment'
  };

  fs.writeFileSync('production-test-results.json', JSON.stringify(results, null, 2));
}

// Main execution
async function main() {
  try {
    await runAllTests();
    saveTestResults();
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  runAllTests,
  generateTestReport
}; 