const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Real medical scenarios for Sri Lankan medical students
async function testRealMedicalScenarios() {
  console.log('🏥 REAL MEDICAL SCENARIOS FOR SRI LANKAN MEDICAL STUDENTS\n');
  console.log('Testing scenarios that medical students ACTUALLY need...\n');

  const scenarios = [
    // Scenario 1: Complex Drug Interaction
    {
      name: 'Complex Drug Interaction - Warfarin + Amiodarone + NSAIDs',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/drug-interactions`, {
          drugs: ['Warfarin', 'Amiodarone', 'Ibuprofen']
        });
        console.log('Response:', JSON.stringify(response.data, null, 2));
        return response.status === 200;
      }
    },

    // Scenario 2: Dengue Fever with Warning Signs
    {
      name: 'Dengue Fever with Warning Signs',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/diagnosis`, {
          symptoms: 'high fever 40°C for 4 days, severe abdominal pain, persistent vomiting, bleeding from gums, restlessness',
          language: 'en'
        });
        console.log('Response:', response.data.data.diagnosis);
        return response.data.data.diagnosis.includes('Dengue') && 
               response.data.data.diagnosis.includes('HIGH') &&
               response.data.data.diagnosis.includes('EMERGENCY');
      }
    },

    // Scenario 3: Acute Coronary Syndrome
    {
      name: 'Acute Coronary Syndrome',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/diagnosis`, {
          symptoms: 'severe chest pain radiating to left arm, sweating, shortness of breath, nausea, pain worse with exertion',
          language: 'en'
        });
        console.log('Response:', response.data.data.diagnosis);
        return response.data.data.diagnosis.includes('chest pain') && 
               response.data.data.diagnosis.includes('HIGH') &&
               response.data.data.diagnosis.includes('EMERGENCY');
      }
    },

    // Scenario 4: Latest Antibiotic Guidelines
    {
      name: 'Latest Antibiotic Guidelines - Community Acquired Pneumonia',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/advanced/drugs/antibiotics`);
        console.log('Available antibiotics:', response.data.data.drugs);
        return response.data.data.drugs.length > 0;
      }
    },

    // Scenario 5: Clinical Decision Support - Sepsis
    {
      name: 'Clinical Decision Support - Sepsis',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/clinical-decision`, {
          symptoms: ['fever', 'tachycardia', 'tachypnea', 'hypotension', 'altered mental status'],
          age: 65,
          gender: 'male',
          comorbidities: ['diabetes', 'hypertension']
        });
        console.log('Clinical decision response:', JSON.stringify(response.data, null, 2));
        return response.status === 200;
      }
    },

    // Scenario 6: Evidence-Based Medicine - COVID-19 Treatment
    {
      name: 'Evidence-Based Medicine - COVID-19 Treatment',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/evidence`, {
          query: 'COVID-19 treatment guidelines 2024'
        });
        console.log('Evidence response:', JSON.stringify(response.data, null, 2));
        return response.status === 200;
      }
    },

    // Scenario 7: Patient Education - Diabetes Management
    {
      name: 'Patient Education - Diabetes Management',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/patient-education`, {
          diagnosis: 'diabetes mellitus type 2',
          language: 'en'
        });
        console.log('Patient education response:', JSON.stringify(response.data, null, 2));
        return response.status === 200;
      }
    },

    // Scenario 8: Medical Calculator - GFR for Elderly
    {
      name: 'Medical Calculator - GFR for Elderly Patient',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/calculator`, {
          type: 'GFR',
          parameters: [75, 60, 2.5, 'male'] // age, weight, creatinine, gender
        });
        console.log('GFR calculation:', JSON.stringify(response.data, null, 2));
        return response.status === 200;
      }
    },

    // Scenario 9: Complex Symptoms - Meningitis
    {
      name: 'Complex Symptoms - Meningitis',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/diagnosis`, {
          symptoms: 'severe headache, neck stiffness, photophobia, fever, altered consciousness, petechial rash',
          language: 'en'
        });
        console.log('Meningitis diagnosis:', response.data.data.diagnosis);
        return response.data.data.diagnosis.includes('Meningitis') || 
               response.data.data.diagnosis.includes('meningitis');
      }
    },

    // Scenario 10: Drug Dosage Calculation
    {
      name: 'Drug Dosage Calculation - Pediatric',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/calculator`, {
          type: 'Pediatric_Dose',
          parameters: [25, 500] // weight in kg, adult dose
        });
        console.log('Pediatric dose calculation:', JSON.stringify(response.data, null, 2));
        return response.status === 200;
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const scenario of scenarios) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Testing: ${scenario.name}`);
      console.log(`${'='.repeat(60)}`);
      
      const result = await scenario.test();
      
      if (result) {
        console.log(`✅ ${scenario.name} - PASSED`);
        passed++;
      } else {
        console.log(`❌ ${scenario.name} - FAILED`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${scenario.name} - FAILED (${error.message})`);
      failed++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 REAL MEDICAL SCENARIOS RESULTS');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n🚨 CRITICAL ISSUES IDENTIFIED:');
    console.log('• The system is NOT ready for medical students');
    console.log('• Missing critical medical knowledge');
    console.log('• Inadequate drug database');
    console.log('• Poor clinical decision support');
    console.log('• Outdated medical information');
    console.log('\n⚠️ DO NOT RELEASE - Major improvements needed!');
  } else {
    console.log('\n🎉 All real medical scenarios passed!');
    console.log('✅ System is ready for medical students');
  }
}

// Run the real medical scenarios test
testRealMedicalScenarios().catch(error => {
  console.error('❌ Real medical scenarios test failed:', error.message);
  process.exit(1);
}); 