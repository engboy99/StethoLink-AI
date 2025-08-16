const axios = require('axios');

const BASE_URL = 'https://awake-courage-production.up.railway.app';

// Test all functions systematically
async function testAllFunctions() {
  console.log('🧪 Testing All StethoLink AI Functions...\n');

  const tests = [
    // 1. Health Check
    {
      name: 'Health Check',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/health`);
        return response.status === 200;
      }
    },

    // 2. Root Endpoint
    {
      name: 'Root Endpoint',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/`);
        return response.status === 200 && response.data.message;
      }
    },

    // 3. Diagnosis API
    {
      name: 'Diagnosis API',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/diagnosis`, {
          symptoms: 'fever, headache, muscle pain',
          language: 'en'
        });
        return response.status === 200 && response.data.data.diagnosis;
      }
    },

    // 4. Simulation API
    {
      name: 'Simulation API',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/simulation`, {
          condition: 'leptospirosis',
          language: 'en',
          patientProfile: { age: 26, gender: 'Male' }
        });
        return response.status === 200 && response.data.data.simulation;
      }
    },

    // 5. Education API
    {
      name: 'Education API',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/education`, {
          topic: 'dengue fever',
          language: 'en',
          complexity: 'intermediate'
        });
        return response.status === 200 && response.data.data.content;
      }
    },

    // 6. Motivation API
    {
      name: 'Motivation API',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/motivation?language=en&context=daily`);
        return response.status === 200 && response.data.data.message;
      }
    },

    // 7. Advanced Calculator API
    {
      name: 'Advanced Calculator API',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/calculator`, {
          type: 'BMI',
          parameters: [70, 1.75]
        });
        return response.status === 200 && response.data.data.result;
      }
    },

    // 8. Drug Database API
    {
      name: 'Drug Database API',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/advanced/drugs/antibiotics`);
        return response.status === 200 && response.data.data.drugs;
      }
    },

    // 9. Clinical Guidelines API
    {
      name: 'Clinical Guidelines API',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/advanced/guidelines/Dengue Fever`);
        return response.status === 200 && response.data.data.guideline;
      }
    },

    // 10. Drug Interactions API
    {
      name: 'Drug Interactions API',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/drug-interactions`, {
          drugs: ['Amoxicillin', 'Paracetamol']
        });
        return response.status === 200 && response.data.data.interactions;
      }
    },

    // 11. Clinical Decision Support API
    {
      name: 'Clinical Decision Support API',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/clinical-decision`, {
          symptoms: ['fever', 'headache'],
          age: 30,
          gender: 'male'
        });
        return response.status === 200 && response.data.differential;
      }
    },

    // 12. Patient Education API
    {
      name: 'Patient Education API',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/patient-education`, {
          diagnosis: 'dengue fever',
          language: 'en'
        });
        return response.status === 200 && response.data.education;
      }
    },

    // 13. Evidence-Based Medicine API
    {
      name: 'Evidence-Based Medicine API',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/evidence`, {
          query: 'dengue fever treatment'
        });
        return response.status === 200 && response.data.evidence;
      }
    },

    // 14. Web Demo API
    {
      name: 'Web Demo API',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/simulation/demo`, {
          message: 'What happened?',
          language: 'en'
        });
        return response.status === 200 && response.data.response;
      }
    },

    // 15. Available Calculators API
    {
      name: 'Available Calculators API',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/advanced/calculators`);
        return response.status === 200 && response.data.data.available;
      }
    },

    // 16. Drug Categories API
    {
      name: 'Drug Categories API',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/advanced/drug-categories`);
        return response.status === 200 && response.data.data.categories;
      }
    },

    // 17. Available Guidelines API
    {
      name: 'Available Guidelines API',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/advanced/guidelines`);
        return response.status === 200 && response.data.data.guidelines;
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

  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your StethoLink AI is ready for release!');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the issues before release.');
  }
}

// Run the tests
testAllFunctions().catch(error => {
  console.error('❌ Test runner failed:', error.message);
  process.exit(1);
}); 