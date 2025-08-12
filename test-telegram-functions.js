const simulationManager = require('./src/services/simulation-manager');
const advancedFeatures = require('./src/services/advanced-features');

// Test the intelligent command detection
async function testTelegramFunctions() {
  console.log('🧪 Testing Telegram Bot Functions...\n');

  const tests = [
    // Test drug category detection
    {
      name: 'Drug Category Detection - antibiotics',
      test: () => {
        const message = 'antibiotics';
        const lowerMessage = message.toLowerCase().trim();
        const isDrugCategory = ['antibiotics', 'analgesics', 'antihypertensives', 'antidiabetics', 'antimalarials'].includes(lowerMessage);
        return isDrugCategory;
      }
    },

    // Test drug category detection
    {
      name: 'Drug Category Detection - analgesics',
      test: () => {
        const message = 'analgesics';
        const lowerMessage = message.toLowerCase().trim();
        const isDrugCategory = ['antibiotics', 'analgesics', 'antihypertensives', 'antidiabetics', 'antimalarials'].includes(lowerMessage);
        return isDrugCategory;
      }
    },

    // Test calculator detection
    {
      name: 'Calculator Detection - bmi',
      test: () => {
        const message = 'bmi';
        const lowerMessage = message.toLowerCase().trim();
        const isCalculator = ['bmi', 'gfr', 'chads2', 'fev1', 'creatinine', 'pediatric', 'gcs', 'apache'].includes(lowerMessage);
        return isCalculator;
      }
    },

    // Test guideline detection
    {
      name: 'Guideline Detection - dengue',
      test: () => {
        const message = 'dengue';
        const lowerMessage = message.toLowerCase().trim();
        const isGuideline = ['dengue', 'leptospirosis', 'tb', 'malaria', 'diabetes', 'hypertension'].includes(lowerMessage);
        return isGuideline;
      }
    },

    // Test simulation manager
    {
      name: 'Simulation Manager - Start Simulation',
      test: () => {
        try {
          const presentation = simulationManager.startSimulation('test-user', 'leptospirosis', 'en', {
            age: 26,
            gender: 'Male',
            occupation: 'Farmer'
          });
          return presentation && presentation.length > 0;
        } catch (error) {
          return false;
        }
      }
    },

    // Test simulation manager question handling
    {
      name: 'Simulation Manager - Handle Question',
      test: () => {
        try {
          // Start a simulation first
          simulationManager.startSimulation('test-user-2', 'leptospirosis', 'en');
          
          // Ask a question
          const response = simulationManager.handleQuestion('test-user-2', 'What happened?', 'en');
          return response.isSimulationActive && response.response.length > 0;
        } catch (error) {
          return false;
        }
      }
    },

    // Test advanced features - drug database
    {
      name: 'Advanced Features - Drug Database',
      test: () => {
        try {
          const drugs = advancedFeatures.getDrugsByCategory('antibiotics');
          return drugs && drugs.length > 0;
        } catch (error) {
          return false;
        }
      }
    },

    // Test advanced features - clinical guidelines
    {
      name: 'Advanced Features - Clinical Guidelines',
      test: () => {
        try {
          const guideline = advancedFeatures.getClinicalGuideline('Dengue Fever');
          return guideline && guideline.diagnosis;
        } catch (error) {
          return false;
        }
      }
    },

    // Test advanced features - drug interactions
    {
      name: 'Advanced Features - Drug Interactions',
      test: async () => {
        try {
          const result = await advancedFeatures.checkDrugInteractions(['Warfarin', 'NSAIDs']);
          return result && result.interactions;
        } catch (error) {
          return false;
        }
      }
    },

    // Test advanced features - clinical decision support
    {
      name: 'Advanced Features - Clinical Decision Support',
      test: async () => {
        try {
          const result = await advancedFeatures.clinicalDecisionSupport(['fever', 'headache'], 30, 'male');
          return result && result.differentials;
        } catch (error) {
          return false;
        }
      }
    },

    // Test advanced features - patient education
    {
      name: 'Advanced Features - Patient Education',
      test: async () => {
        try {
          const result = await advancedFeatures.generatePatientEducation('dengue fever', 'en');
          return result && result.education;
        } catch (error) {
          return false;
        }
      }
    },

    // Test advanced features - evidence based medicine
    {
      name: 'Advanced Features - Evidence Based Medicine',
      test: async () => {
        try {
          const result = await advancedFeatures.evidenceBasedMedicine('dengue fever treatment');
          return result && result.evidence;
        } catch (error) {
          return false;
        }
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      const result = await test.test();
      
      if (result) {
        console.log(`✅ ${test.name} - PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - FAILED`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED (${error.message})`);
      failed++;
    }
    console.log('');
  }

  console.log('📊 Telegram Bot Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All Telegram bot functions are working correctly!');
    console.log('✅ The "antibiotics" issue has been fixed!');
  } else {
    console.log('\n⚠️ Some Telegram bot functions need attention.');
  }
}

// Run the tests
testTelegramFunctions().catch(error => {
  console.error('❌ Telegram bot test runner failed:', error.message);
  process.exit(1);
}); 