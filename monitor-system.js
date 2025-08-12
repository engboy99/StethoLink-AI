const axios = require('axios');
const readline = require('readline');

const BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// System monitoring dashboard
class SystemMonitor {
  constructor() {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      lastCheck: new Date(),
      services: {
        diagnosis: { total: 0, success: 0, avgTime: 0 },
        patientEducation: { total: 0, success: 0, avgTime: 0 },
        evidence: { total: 0, success: 0, avgTime: 0 },
        drugs: { total: 0, success: 0, avgTime: 0 },
        guidelines: { total: 0, success: 0, avgTime: 0 },
        calculator: { total: 0, success: 0, avgTime: 0 },
        interactions: { total: 0, success: 0, avgTime: 0 }
      }
    };
  }

  // Test health endpoint
  async checkHealth() {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${BASE_URL}/health`);
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime,
        uptime: response.data.uptime,
        environment: response.data.environment
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Test diagnosis service
  async testDiagnosis(symptoms = 'fever') {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${BASE_URL}/api/diagnosis`, {
        symptoms,
        language: 'en'
      });
      const responseTime = Date.now() - startTime;
      
      this.stats.services.diagnosis.total++;
      this.stats.services.diagnosis.success++;
      this.stats.services.diagnosis.avgTime = 
        (this.stats.services.diagnosis.avgTime * (this.stats.services.diagnosis.success - 1) + responseTime) / this.stats.services.diagnosis.success;
      
      return {
        success: true,
        responseTime,
        hasRedFlags: response.data.data.diagnosis.includes('Red Flags'),
        hasDifferential: response.data.data.diagnosis.includes('differential diagnoses'),
        responseLength: response.data.data.diagnosis.length
      };
    } catch (error) {
      this.stats.services.diagnosis.total++;
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Test patient education
  async testPatientEducation() {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${BASE_URL}/api/advanced/patient-education`, {
        diagnosis: 'dengue fever',
        language: 'en'
      });
      const responseTime = Date.now() - startTime;
      
      this.stats.services.patientEducation.total++;
      this.stats.services.patientEducation.success++;
      this.stats.services.patientEducation.avgTime = 
        (this.stats.services.patientEducation.avgTime * (this.stats.services.patientEducation.success - 1) + responseTime) / this.stats.services.patientEducation.success;
      
      return {
        success: true,
        responseTime,
        hasTitle: response.data.education.title === 'Dengue Fever Management',
        hasContent: response.data.education.content.en.includes('paracetamol')
      };
    } catch (error) {
      this.stats.services.patientEducation.total++;
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Test evidence-based medicine
  async testEvidence() {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${BASE_URL}/api/advanced/evidence`, {
        query: 'dengue fever treatment'
      });
      const responseTime = Date.now() - startTime;
      
      this.stats.services.evidence.total++;
      this.stats.services.evidence.success++;
      this.stats.services.evidence.avgTime = 
        (this.stats.services.evidence.avgTime * (this.stats.services.evidence.success - 1) + responseTime) / this.stats.services.evidence.success;
      
      return {
        success: true,
        responseTime,
        hasSystematicReviews: response.data.evidence.systematicReviews.length > 0,
        hasGuidelines: response.data.evidence.guidelines.some(g => g.includes('WHO'))
      };
    } catch (error) {
      this.stats.services.evidence.total++;
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Test drug interactions
  async testDrugInteractions() {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${BASE_URL}/api/advanced/drug-interactions`, {
        drugs: ['Warfarin', 'NSAIDs']
      });
      const responseTime = Date.now() - startTime;
      
      this.stats.services.interactions.total++;
      this.stats.services.interactions.success++;
      this.stats.services.interactions.avgTime = 
        (this.stats.services.interactions.avgTime * (this.stats.services.interactions.success - 1) + responseTime) / this.stats.services.interactions.success;
      
      return {
        success: true,
        responseTime,
        hasInteractions: response.data.data.interactions.length > 0,
        hasBleedingRisk: response.data.data.interactions.some(i => i.effect.includes('bleeding'))
      };
    } catch (error) {
      this.stats.services.interactions.total++;
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Test calculator
  async testCalculator() {
    try {
      const startTime = Date.now();
      const response = await axios.post(`${BASE_URL}/api/advanced/calculator`, {
        type: 'BMI',
        parameters: [70, 175]
      });
      const responseTime = Date.now() - startTime;
      
      this.stats.services.calculator.total++;
      this.stats.services.calculator.success++;
      this.stats.services.calculator.avgTime = 
        (this.stats.services.calculator.avgTime * (this.stats.services.calculator.success - 1) + responseTime) / this.stats.services.calculator.success;
      
      return {
        success: true,
        responseTime,
        correctResult: response.data.data.result === '22.9',
        result: response.data.data.result
      };
    } catch (error) {
      this.stats.services.calculator.total++;
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Run comprehensive system check
  async runSystemCheck() {
    console.clear();
    console.log(`${colors.bold}${colors.cyan}🏥 StethoLink AI System Monitor${colors.reset}\n`);
    
    const health = await this.checkHealth();
    console.log(`${colors.bold}System Health:${colors.reset}`);
    console.log(`  Status: ${health.status === 'healthy' ? colors.green + '✅ Healthy' : colors.red + '❌ Unhealthy'}${colors.reset}`);
    if (health.status === 'healthy') {
      console.log(`  Uptime: ${Math.floor(health.uptime / 60)} minutes`);
      console.log(`  Environment: ${health.environment}`);
      console.log(`  Response Time: ${health.responseTime}ms`);
    }
    console.log('');

    // Test all services
    console.log(`${colors.bold}Service Tests:${colors.reset}`);
    
    const tests = [
      { name: 'Diagnosis Service', test: () => this.testDiagnosis() },
      { name: 'Patient Education', test: () => this.testPatientEducation() },
      { name: 'Evidence-Based Medicine', test: () => this.testEvidence() },
      { name: 'Drug Interactions', test: () => this.testDrugInteractions() },
      { name: 'Medical Calculator', test: () => this.testCalculator() }
    ];

    for (const test of tests) {
      const result = await test.test();
      const status = result.success ? colors.green + '✅ PASS' : colors.red + '❌ FAIL';
      const time = result.success ? `(${result.responseTime}ms)` : '';
      console.log(`  ${test.name}: ${status}${colors.reset} ${time}`);
      
      if (result.success) {
        // Show additional details for diagnosis
        if (test.name === 'Diagnosis Service') {
          console.log(`    • Red Flags: ${result.hasRedFlags ? colors.green + '✅' : colors.red + '❌'}${colors.reset}`);
          console.log(`    • Differential: ${result.hasDifferential ? colors.green + '✅' : colors.red + '❌'}${colors.reset}`);
          console.log(`    • Response Length: ${result.responseLength} chars`);
        }
        // Show additional details for calculator
        if (test.name === 'Medical Calculator') {
          console.log(`    • Result: ${result.correctResult ? colors.green + '✅' : colors.red + '❌'}${colors.reset} ${result.result}`);
        }
      } else {
        console.log(`    • Error: ${result.error}`);
      }
    }
    console.log('');

    // Display statistics
    console.log(`${colors.bold}Service Statistics:${colors.reset}`);
    for (const [service, stats] of Object.entries(this.stats.services)) {
      if (stats.total > 0) {
        const successRate = ((stats.success / stats.total) * 100).toFixed(1);
        const avgTime = stats.avgTime.toFixed(0);
        const status = successRate >= 90 ? colors.green : successRate >= 70 ? colors.yellow : colors.red;
        console.log(`  ${service}: ${status}${successRate}%${colors.reset} success (${stats.success}/${stats.total}) - ${avgTime}ms avg`);
      }
    }
    console.log('');

    // Show current time
    console.log(`${colors.bold}Last Check:${colors.reset} ${new Date().toLocaleTimeString()}`);
    console.log(`${colors.bold}Total Requests:${colors.reset} ${this.stats.totalRequests}`);
    console.log('');

    // Show menu
    console.log(`${colors.bold}Commands:${colors.reset}`);
    console.log(`  ${colors.cyan}r${colors.reset} - Refresh monitoring`);
    console.log(`  ${colors.cyan}t${colors.reset} - Test specific service`);
    console.log(`  ${colors.cyan}q${colors.reset} - Quit monitoring`);
    console.log('');
  }

  // Interactive monitoring
  async startInteractiveMonitoring() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    await this.runSystemCheck();

    rl.on('line', async (input) => {
      const command = input.trim().toLowerCase();
      
      switch (command) {
        case 'r':
          await this.runSystemCheck();
          break;
        case 't':
          console.log('\nTesting specific services...');
          await this.testSpecificServices();
          break;
        case 'q':
          console.log('\nStopping monitoring...');
          rl.close();
          process.exit(0);
          break;
        default:
          console.log('Unknown command. Use r (refresh), t (test), or q (quit)');
      }
    });
  }

  // Test specific services with detailed output
  async testSpecificServices() {
    console.log('\n' + '='.repeat(50));
    console.log('DETAILED SERVICE TESTS');
    console.log('='.repeat(50));

    // Test diagnosis with different symptoms
    const symptoms = ['loose motion', 'doxycycline', 'fever', 'headache'];
    console.log('\n🔍 Testing Diagnosis Service:');
    for (const symptom of symptoms) {
      const result = await this.testDiagnosis(symptom);
      const status = result.success ? colors.green + '✅' : colors.red + '❌';
      console.log(`  ${symptom}: ${status}${colors.reset} ${result.success ? `${result.responseTime}ms` : result.error}`);
    }

    // Test calculator with different values
    console.log('\n🧮 Testing Calculator Service:');
    const bmiTests = [
      { weight: 70, height: 175, expected: '22.9' },
      { weight: 60, height: 160, expected: '23.4' },
      { weight: 80, height: 180, expected: '24.7' }
    ];
    
    for (const test of bmiTests) {
      try {
        const response = await axios.post(`${BASE_URL}/api/advanced/calculator`, {
          type: 'BMI',
          parameters: [test.weight, test.height]
        });
        const correct = response.data.data.result === test.expected;
        const status = correct ? colors.green + '✅' : colors.red + '❌';
        console.log(`  BMI(${test.weight}kg, ${test.height}cm): ${status}${colors.reset} ${response.data.data.result} (expected: ${test.expected})`);
      } catch (error) {
        console.log(`  BMI(${test.weight}kg, ${test.height}cm): ${colors.red}❌${colors.reset} ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(50));
  }
}

// Start monitoring
async function main() {
  const monitor = new SystemMonitor();
  await monitor.startInteractiveMonitoring();
}

main().catch(error => {
  console.error('Monitoring failed:', error);
  process.exit(1);
}); 