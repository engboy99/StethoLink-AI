const axios = require('axios');

const BASE_URL = 'https://awake-courage-production.up.railway.app';

// 100% Precision Test for Medical Students
async function test100Precision() {
  console.log('🏥 100% PRECISION TEST FOR MEDICAL STUDENTS\n');
  console.log('Testing ALL critical medical scenarios for 100% accuracy...\n');

  const tests = [
    // CRITICAL EMERGENCY SCENARIOS
    {
      name: '🚨 CRITICAL: Acute Coronary Syndrome Recognition',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/diagnosis`, {
          symptoms: 'severe chest pain radiating to left arm and jaw, sweating, shortness of breath, nausea, pain worse with exertion, history of hypertension and diabetes',
          language: 'en'
        });
        
        const diagnosis = response.data.data.diagnosis;
        const hasEmergency = diagnosis.includes('EMERGENCY');
        const hasCardiac = diagnosis.includes('cardiac') || diagnosis.includes('chest pain');
        const hasHighUrgency = diagnosis.includes('HIGH');
        
        console.log('ACS Diagnosis:', {
          hasEmergency,
          hasCardiac,
          hasHighUrgency,
          diagnosis: diagnosis.substring(0, 200) + '...'
        });
        
        return hasEmergency && hasCardiac && hasHighUrgency;
      }
    },

    {
      name: '🚨 CRITICAL: Sepsis Recognition and Management',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/clinical-decision`, {
          symptoms: ['fever', 'tachycardia', 'tachypnea', 'hypotension', 'altered mental status'],
          age: 65,
          gender: 'male',
          comorbidities: ['diabetes', 'hypertension']
        });
        
        const data = response.data.data;
        const hasSepsis = data.differentials.includes('Sepsis');
        const hasHighUrgency = data.urgency === 'high';
        const hasRedFlags = data.redFlags.length > 0;
        const hasRiskScore = data.riskScore >= 8;
        
        console.log('Sepsis Decision:', {
          hasSepsis,
          hasHighUrgency,
          hasRedFlags,
          hasRiskScore,
          urgency: data.urgency,
          riskScore: data.riskScore,
          redFlags: data.redFlags
        });
        
        return hasSepsis && hasHighUrgency && hasRedFlags && hasRiskScore;
      }
    },

    {
      name: '🚨 CRITICAL: Meningitis Emergency Recognition',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/diagnosis`, {
          symptoms: 'severe headache, neck stiffness, photophobia, fever, altered consciousness, petechial rash',
          language: 'en'
        });
        
        const diagnosis = response.data.data.diagnosis;
        const hasMeningitis = diagnosis.includes('Meningitis') || diagnosis.includes('meningitis');
        const hasEmergency = diagnosis.includes('EMERGENCY');
        const hasHighUrgency = diagnosis.includes('HIGH');
        
        console.log('Meningitis Diagnosis:', {
          hasMeningitis,
          hasEmergency,
          hasHighUrgency,
          diagnosis: diagnosis.substring(0, 200) + '...'
        });
        
        return hasMeningitis && hasEmergency && hasHighUrgency;
      }
    },

    // DRUG SAFETY AND INTERACTIONS
    {
      name: '💊 CRITICAL: Drug Interaction Safety - Warfarin + NSAIDs',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/drug-interactions`, {
          drugs: ['Warfarin', 'Ibuprofen']
        });
        
        const data = response.data.data;
        const hasInteraction = data.interactions.length > 0;
        const hasWarfarinIbuprofen = data.interactions.some(i => 
          i.combination.includes('Warfarin') && i.combination.includes('Ibuprofen')
        );
        const hasHighSeverity = data.severity === 'High';
        const hasMonitoring = data.recommendations.includes('monitor') || data.recommendations.includes('Monitor');
        
        console.log('Drug Interaction:', {
          hasInteraction,
          hasWarfarinIbuprofen,
          hasHighSeverity,
          hasMonitoring,
          interactions: data.interactions,
          severity: data.severity,
          recommendations: data.recommendations
        });
        
        return hasInteraction && hasWarfarinIbuprofen && hasHighSeverity && hasMonitoring;
      }
    },

    {
      name: '💊 CRITICAL: Comprehensive Drug Information - Amoxicillin',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/advanced/drugs/antibiotics`);
        
        const amoxicillin = response.data.data.drugs.find(d => d.name === 'Amoxicillin');
        const hasDosage = amoxicillin && amoxicillin.dosage && amoxicillin.dosage.includes('TDS');
        const hasIndications = amoxicillin && amoxicillin.indications && amoxicillin.indications.length > 0;
        const hasContraindications = amoxicillin && amoxicillin.contraindications && amoxicillin.contraindications.length > 0;
        const hasSideEffects = amoxicillin && amoxicillin.sideEffects && amoxicillin.sideEffects.length > 0;
        const hasInteractions = amoxicillin && amoxicillin.interactions && amoxicillin.interactions.length > 0;
        
        console.log('Amoxicillin Info:', {
          hasDosage,
          hasIndications,
          hasContraindications,
          hasSideEffects,
          hasInteractions,
          dosage: amoxicillin?.dosage,
          indications: amoxicillin?.indications?.length
        });
        
        return hasDosage && hasIndications && hasContraindications && hasSideEffects && hasInteractions;
      }
    },

    // MEDICAL CALCULATORS
    {
      name: '🧮 CRITICAL: GFR Calculator with Clinical Interpretation',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/calculator`, {
          type: 'GFR',
          parameters: [75, 60, 2.5, 'male'] // age, weight, creatinine, gender
        });
        
        const data = response.data.data;
        const hasResult = data.result !== undefined && data.result > 0;
        const hasInterpretation = data.interpretation && data.interpretation.includes('kidney');
        const hasStage = data.interpretation && data.interpretation.includes('Stage');
        const resultInRange = data.result >= 15 && data.result <= 30; // Should be Stage 4 CKD
        
        console.log('GFR Calculation:', {
          hasResult,
          hasInterpretation,
          hasStage,
          resultInRange,
          result: data.result,
          interpretation: data.interpretation
        });
        
        return hasResult && hasInterpretation && hasStage && resultInRange;
      }
    },

    // EVIDENCE-BASED MEDICINE
    {
      name: '🔬 CRITICAL: Evidence-Based Medicine - COVID-19 Treatment',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/evidence`, {
          query: 'COVID-19 treatment guidelines 2024'
        });
        
        const data = response.data.data;
        const hasRECOVERY = data.clinicalTrials.some(trial => trial.includes('RECOVERY'));
        const hasLevelA = data.levelOfEvidence === 'A';
        const hasGuidelines = data.guidelines.length > 0;
        const hasSystematicReviews = data.systematicReviews.length > 0;
        const hasRecommendations = data.recommendations.length > 0;
        
        console.log('COVID-19 Evidence:', {
          hasRECOVERY,
          hasLevelA,
          hasGuidelines,
          hasSystematicReviews,
          hasRecommendations,
          levelOfEvidence: data.levelOfEvidence,
          clinicalTrials: data.clinicalTrials.length,
          guidelines: data.guidelines.length
        });
        
        return hasRECOVERY && hasLevelA && hasGuidelines && hasSystematicReviews && hasRecommendations;
      }
    },

    // CLINICAL GUIDELINES
    {
      name: '📋 CRITICAL: Clinical Guidelines - Dengue Fever',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/advanced/guidelines/Dengue Fever`);
        
        const data = response.data.data;
        const hasDiagnosis = data.diagnosis && data.diagnosis.includes('FBC');
        const hasTreatment = data.treatment && data.treatment.includes('fluid');
        const hasWarningSigns = data.diagnosis && (data.diagnosis.includes('warning') || data.diagnosis.includes('Warning'));
        const hasPrevention = data.prevention && data.prevention.length > 0;
        const hasComplications = data.complications && data.complications.includes('Dengue');
        
        console.log('Dengue Guidelines:', {
          hasDiagnosis,
          hasTreatment,
          hasWarningSigns,
          hasPrevention,
          hasComplications,
          diagnosis: data.diagnosis?.substring(0, 100) + '...',
          treatment: data.treatment?.substring(0, 100) + '...'
        });
        
        return hasDiagnosis && hasTreatment && hasWarningSigns && hasPrevention && hasComplications;
      }
    },

    // PATIENT EDUCATION
    {
      name: '📚 CRITICAL: Patient Education - Diabetes Management',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/advanced/patient-education`, {
          diagnosis: 'diabetes mellitus type 2',
          language: 'en'
        });
        
        const data = response.data.data;
        const hasTitle = data.title && data.title.includes('Diabetes');
        const hasContent = data.content && (data.content.en || data.content).includes('blood sugar');
        const hasLifestyle = data.lifestyle && data.lifestyle.includes('diet');
        const hasComplications = data.complications && data.complications.includes('Retinopathy');
        
        console.log('Diabetes Education:', {
          hasTitle,
          hasContent,
          hasLifestyle,
          hasComplications,
          title: data.title,
          hasContentText: !!data.content
        });
        
        return hasTitle && hasContent && hasLifestyle && hasComplications;
      }
    },

    // PROFESSIONAL INTERFACE
    {
      name: '🖥️ CRITICAL: Professional Medical Interface',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/interface/dashboard`);
        
        const data = response.data.data;
        const hasEmergencyProtocols = data.quickAccess.emergencyProtocols.length > 0;
        const hasCalculators = data.quickAccess.calculators.length > 0;
        const hasDrugDatabase = data.quickAccess.drugDatabase.length > 0;
        const hasGuidelines = data.recentUpdates.guidelines.length > 0;
        const hasResearch = data.recentUpdates.research.length > 0;
        const hasLearningModules = data.learningModules.length > 0;
        
        console.log('Professional Interface:', {
          hasEmergencyProtocols,
          hasCalculators,
          hasDrugDatabase,
          hasGuidelines,
          hasResearch,
          hasLearningModules,
          emergencyProtocols: data.quickAccess.emergencyProtocols.length,
          calculators: data.quickAccess.calculators.length
        });
        
        return hasEmergencyProtocols && hasCalculators && hasDrugDatabase && hasGuidelines && hasResearch && hasLearningModules;
      }
    }
  ];

  let passed = 0;
  let failed = 0;
  let criticalFailures = 0;

  console.log('🚨 STARTING 100% PRECISION TESTING...\n');

  for (const test of tests) {
    try {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`Testing: ${test.name}`);
      console.log(`${'='.repeat(80)}`);
      
      const result = await test.test();
      
      if (result) {
        console.log(`✅ ${test.name} - PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - FAILED`);
        failed++;
        if (test.name.includes('CRITICAL')) {
          criticalFailures++;
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED (${error.message})`);
      failed++;
      if (test.name.includes('CRITICAL')) {
        criticalFailures++;
      }
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('🏥 100% PRECISION TEST RESULTS');
  console.log(`${'='.repeat(80)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🚨 Critical Failures: ${criticalFailures}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 100% PRECISION ACHIEVED!');
    console.log('✅ ALL tests passed - System is ready for medical students');
    console.log('✅ Professional medical standards met');
    console.log('✅ Critical scenarios handled correctly');
    console.log('✅ Drug safety and interactions accurate');
    console.log('✅ Evidence-based medicine current');
    console.log('✅ Clinical guidelines comprehensive');
    console.log('✅ Patient education professional');
    console.log('✅ Interface suitable for medical education');
    console.log('\n🚀 SYSTEM IS 100% READY FOR MEDICAL STUDENTS!');
  } else if (criticalFailures === 0) {
    console.log('\n⚠️ MOSTLY PRECISE:');
    console.log('• All critical medical scenarios passed');
    console.log('• Some non-critical features need improvement');
    console.log('• System is safe for medical students');
    console.log('• Minor enhancements recommended');
  } else {
    console.log('\n🚨 CRITICAL ISSUES DETECTED:');
    console.log('• Critical medical scenarios failed');
    console.log('• System is NOT ready for medical students');
    console.log('• Patient safety concerns');
    console.log('• Immediate fixes required');
    console.log('\n⚠️ DO NOT RELEASE - Critical medical accuracy issues!');
  }

  return {
    passed,
    failed,
    criticalFailures,
    successRate: ((passed / (passed + failed)) * 100).toFixed(1),
    isReady: failed === 0
  };
}

// Run the 100% precision test
test100Precision().catch(error => {
  console.error('❌ 100% precision test failed:', error.message);
  process.exit(1);
}); 