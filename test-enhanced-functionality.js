const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Enhanced functionality test for medical students
async function testEnhancedMedicalFunctionality() {
  console.log('🏥 ENHANCED MEDICAL FUNCTIONALITY TEST FOR MEDICAL STUDENTS\n');
  console.log('Testing professional medical content and accuracy...\n');

  const tests = [
    // Test 1: Comprehensive Drug Information
    {
      name: 'Comprehensive Drug Database - Antibiotics',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/advanced/drugs/antibiotics`);
        console.log('Available antibiotics:', response.data.data.drugs.length);
        
        // Check for comprehensive drug information
        const amoxicillin = response.data.data.drugs.find(d => d.name === 'Amoxicillin');
        if (!amoxicillin) return false;
        
        // Verify professional medical content
        const hasProfessionalInfo = amoxicillin.dosage && 
                                   amoxicillin.dosage.includes('TDS') &&
                                   amoxicillin.dosage.includes('PO');
        
        console.log('Amoxicillin info:', {
          dosage: amoxicillin.dosage,
          hasProfessionalInfo: hasProfessionalInfo
        });
        
        return hasProfessionalInfo;
      }
    },

    // Test 2: Clinical Decision Support - Sepsis
    {
      name: 'Clinical Decision Support - Sepsis Scenario',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/clinical-decision`, {
          symptoms: ['fever', 'tachycardia', 'tachypnea', 'hypotension', 'altered mental status'],
          age: 65,
          gender: 'male',
          comorbidities: ['diabetes', 'hypertension']
        });
        
        console.log('Clinical decision response:', {
          urgency: response.data.data.urgency,
          riskScore: response.data.data.riskScore,
          differentials: response.data.data.differentials.length,
          redFlags: response.data.data.redFlags.length
        });
        
        // Verify professional medical content
        const hasSepsis = response.data.data.differentials.includes('Sepsis');
        const hasHighUrgency = response.data.data.urgency === 'high';
        const hasRedFlags = response.data.data.redFlags.length > 0;
        
        return hasSepsis && hasHighUrgency && hasRedFlags;
      }
    },

    // Test 3: Evidence-Based Medicine - COVID-19
    {
      name: 'Evidence-Based Medicine - COVID-19 Treatment',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/evidence`, {
          query: 'COVID-19 treatment guidelines 2024'
        });
        
        console.log('Evidence response:', {
          systematicReviews: response.data.data.systematicReviews.length,
          clinicalTrials: response.data.data.clinicalTrials.length,
          guidelines: response.data.data.guidelines.length,
          levelOfEvidence: response.data.data.levelOfEvidence
        });
        
        // Verify professional medical content
        const hasRECOVERY = response.data.data.clinicalTrials.some(trial => trial.includes('RECOVERY'));
        const hasLevelA = response.data.data.levelOfEvidence === 'A';
        const hasGuidelines = response.data.data.guidelines.length > 0;
        
        return hasRECOVERY && hasLevelA && hasGuidelines;
      }
    },

    // Test 4: Drug Interaction Checker
    {
      name: 'Drug Interaction Checker - Complex Interactions',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/drug-interactions`, {
          drugs: ['Warfarin', 'Amiodarone', 'Ibuprofen', 'Metformin']
        });
        
        console.log('Drug interactions:', {
          interactions: response.data.data.interactions.length,
          severity: response.data.data.severity,
          recommendations: response.data.data.recommendations
        });
        
        // Verify professional medical content
        const hasInteractions = response.data.data.interactions.length > 0;
        const hasSeverity = response.data.data.severity !== 'None';
        const hasRecommendations = response.data.data.recommendations.includes('monitor');
        
        // Check for specific expected interactions
        const hasWarfarinIbuprofen = response.data.data.interactions.some(i => 
          i.combination.includes('Warfarin') && i.combination.includes('Ibuprofen')
        );
        
        return hasInteractions && hasSeverity && hasRecommendations && hasWarfarinIbuprofen;
      }
    },

    // Test 5: Medical Calculator - GFR
    {
      name: 'Medical Calculator - GFR for Elderly Patient',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/calculator`, {
          type: 'GFR',
          parameters: [75, 60, 2.5, 'male'] // age, weight, creatinine, gender
        });
        
        console.log('GFR calculation:', {
          result: response.data.data.result,
          interpretation: response.data.data.interpretation
        });
        
        // Verify professional medical content
        const hasResult = response.data.data.result !== undefined;
        const hasInterpretation = response.data.data.interpretation && 
                                 response.data.data.interpretation.includes('kidney');
        
        return hasResult && hasInterpretation;
      }
    },

    // Test 6: Patient Education - Diabetes
    {
      name: 'Patient Education - Diabetes Management',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/patient-education`, {
          diagnosis: 'diabetes mellitus type 2',
          language: 'en'
        });
        
        console.log('Patient education:', {
          title: response.data.data.title,
          hasContent: !!response.data.data.content,
          hasLifestyle: !!response.data.data.lifestyle,
          hasComplications: !!response.data.data.complications
        });
        
        // Verify professional medical content
        const hasTitle = response.data.data.title && response.data.data.title.includes('Diabetes');
        const hasContent = response.data.data.content && 
                          (response.data.data.content.en || response.data.data.content).includes('blood sugar');
        const hasLifestyle = response.data.data.lifestyle && 
                            response.data.data.lifestyle.includes('diet');
        
        return hasTitle && hasContent && hasLifestyle;
      }
    },

    // Test 7: Clinical Guidelines - Dengue
    {
      name: 'Clinical Guidelines - Dengue Fever',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/advanced/guidelines/Dengue Fever`);
        
        console.log('Dengue guidelines:', {
          hasDiagnosis: !!response.data.data.diagnosis,
          hasTreatment: !!response.data.data.treatment,
          hasMonitoring: !!response.data.data.monitoring,
          hasPrevention: !!response.data.data.prevention
        });
        
        // Verify professional medical content
        const hasDiagnosis = response.data.data.diagnosis && 
                            response.data.data.diagnosis.includes('FBC');
        const hasTreatment = response.data.data.treatment && 
                            response.data.data.treatment.includes('fluid');
        const hasWarningSigns = response.data.data.diagnosis && 
                               response.data.data.diagnosis.includes('warning');
        
        return hasDiagnosis && hasTreatment && hasWarningSigns;
      }
    },

    // Test 8: Medical Diagnosis - Complex Case
    {
      name: 'Medical Diagnosis - Complex Chest Pain',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/diagnosis`, {
          symptoms: 'severe chest pain radiating to left arm and jaw, sweating, shortness of breath, nausea, pain worse with exertion, history of hypertension and diabetes',
          language: 'en'
        });
        
        console.log('Complex diagnosis:', {
          diagnosis: response.data.data.diagnosis.substring(0, 200) + '...',
          hasEmergency: response.data.data.diagnosis.includes('EMERGENCY'),
          hasCardiac: response.data.data.diagnosis.includes('cardiac') || 
                     response.data.data.diagnosis.includes('chest pain')
        });
        
        // Verify professional medical content
        const hasEmergency = response.data.data.diagnosis.includes('EMERGENCY');
        const hasCardiac = response.data.data.diagnosis.includes('cardiac') || 
                          response.data.data.diagnosis.includes('chest pain');
        const hasHighUrgency = response.data.data.diagnosis.includes('HIGH');
        
        return hasEmergency && hasCardiac && hasHighUrgency;
      }
    },

    // Test 9: Patient Simulation - Meningitis
    {
      name: 'Patient Simulation - Meningitis Case',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/simulation`, {
          condition: 'bacterial meningitis',
          language: 'en',
          patientProfile: {
            age: 25,
            gender: 'Female',
            occupation: 'Student',
            location: 'Colombo, Sri Lanka'
          }
        });
        
        console.log('Meningitis simulation:', {
          simulation: response.data.data.simulation.substring(0, 200) + '...',
          hasPhysicalExam: response.data.data.simulation.includes('Physical Examination'),
          hasLabResults: response.data.data.simulation.includes('Laboratory'),
          hasManagement: response.data.data.simulation.includes('Management')
        });
        
        // Verify professional medical content
        const hasPhysicalExam = response.data.data.simulation.includes('Physical Examination');
        const hasLabResults = response.data.data.simulation.includes('Laboratory');
        const hasManagement = response.data.data.simulation.includes('Management');
        const hasQuestions = response.data.data.simulation.includes('Questions');
        
        return hasPhysicalExam && hasLabResults && hasManagement && hasQuestions;
      }
    },

    // Test 10: Medical Education - Hypertension
    {
      name: 'Medical Education - Hypertension Management',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/education`, {
          topic: 'hypertension management',
          language: 'en',
          complexity: 'student'
        });
        
        console.log('Hypertension education:', {
          content: response.data.data.content.substring(0, 200) + '...',
          hasPathophysiology: response.data.data.content.includes('PATHOPHYSIOLOGY'),
          hasManagement: response.data.data.content.includes('MANAGEMENT'),
          hasComplications: response.data.data.content.includes('COMPLICATIONS')
        });
        
        // Verify professional medical content
        const hasPathophysiology = response.data.data.content.includes('PATHOPHYSIOLOGY');
        const hasManagement = response.data.data.content.includes('MANAGEMENT');
        const hasComplications = response.data.data.content.includes('COMPLICATIONS');
        const hasTargetBP = response.data.data.content.includes('130/80');
        
        return hasPathophysiology && hasManagement && hasComplications && hasTargetBP;
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Testing: ${test.name}`);
      console.log(`${'='.repeat(60)}`);
      
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
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 ENHANCED MEDICAL FUNCTIONALITY RESULTS');
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 ALL ENHANCED MEDICAL TESTS PASSED!');
    console.log('✅ System provides professional medical content');
    console.log('✅ Suitable for medical students');
    console.log('✅ Comprehensive drug information');
    console.log('✅ Evidence-based medicine support');
    console.log('✅ Clinical decision support');
    console.log('✅ Professional patient education');
    console.log('\n🚀 System is ready for medical education!');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED:');
    console.log('• System needs improvements for medical students');
    console.log('• Some content may not be professional enough');
    console.log('• Additional medical knowledge needed');
  }
}

// Run the enhanced functionality test
testEnhancedMedicalFunctionality().catch(error => {
  console.error('❌ Enhanced functionality test failed:', error.message);
  process.exit(1);
}); 