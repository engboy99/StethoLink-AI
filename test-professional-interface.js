const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/professional';

console.log('🏥 PROFESSIONAL MEDICAL INTERFACE TEST\n');
console.log('Testing: Professional dashboard, quick action buttons, medical tools\n');

let passedTests = 0;
let totalTests = 0;

async function runTest(testName, testFunction) {
  totalTests++;
  console.log(`Testing: ${testName}`);
  console.log('='.repeat(80));
  
  try {
    const result = await testFunction();
    console.log(`${testName}: ${JSON.stringify(result, null, 2)}`);
    console.log(`✅ ${testName} - PASSED\n`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${testName} - FAILED: ${error.message}\n`);
  }
}

// Test 1: Professional Dashboard
async function testProfessionalDashboard() {
  const response = await axios.get(`${BASE_URL}/dashboard`);
  const data = response.data;
  
  return {
    hasDashboard: data.success,
    totalButtons: data.totalButtons,
    sections: data.sections,
    hasEmergencySection: !!data.dashboard.emergency,
    hasSimulationSection: !!data.dashboard.simulation,
    hasHospitalsSection: !!data.dashboard.hospitals,
    hasDoctorsSection: !!data.dashboard.doctors,
    hasProceduresSection: !!data.dashboard.procedures,
    hasToolsSection: !!data.dashboard.tools,
    hasPlanningSection: !!data.dashboard.planning,
    emergencyButtons: data.dashboard.emergency.buttons.length,
    simulationButtons: data.dashboard.simulation.buttons.length,
    hospitalButtons: data.dashboard.hospitals.buttons.length
  };
}

// Test 2: Quick Action - Cardiac Arrest
async function testCardiacArrestAction() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'cardiac_arrest',
    studentId: 'student_001'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasProtocol: !!data.result.protocol,
    hasSteps: Array.isArray(data.result.steps),
    hasMedications: Array.isArray(data.result.medications),
    stepsCount: data.result.steps.length,
    medicationsCount: data.result.medications.length,
    timeCritical: data.result.timeCritical,
    protocolName: data.result.protocol
  };
}

// Test 3: Quick Action - Start Simulation
async function testStartSimulationAction() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'start_simulation',
    studentId: 'student_002'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasMessage: !!data.result.message,
    hasScenarios: Array.isArray(data.result.availableScenarios),
    hasNextStep: !!data.result.nextStep,
    scenariosCount: data.result.availableScenarios.length,
    message: data.result.message
  };
}

// Test 4: Quick Action - National Hospital
async function testNationalHospitalAction() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'national_hospital',
    studentId: 'student_003'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasHospital: !!data.result.hospital,
    hasLocation: !!data.result.location,
    hasContact: !!data.result.contact,
    hasAmbulance: !!data.result.ambulance,
    hasSpecialties: Array.isArray(data.result.specialties),
    hasOccupancy: !!data.result.currentOccupancy,
    hasEmergencyCases: !!data.result.emergencyCases,
    hospitalName: data.result.hospital,
    specialtiesCount: data.result.specialties.length
  };
}

// Test 5: Quick Action - Emergency Doctor
async function testEmergencyDoctorAction() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'emergency_doctor',
    studentId: 'student_004'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasDoctor: !!data.result.doctor,
    hasSpecialty: !!data.result.specialty,
    hasExperience: !!data.result.experience,
    hasHospital: !!data.result.hospital,
    hasSchedule: !!data.result.schedule,
    hasExpertise: Array.isArray(data.result.expertise),
    hasContact: !!data.result.contact,
    doctorName: data.result.doctor,
    specialty: data.result.specialty,
    experience: data.result.experience
  };
}

// Test 6: Quick Action - IV Cannulation
async function testIVCannulationAction() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'iv_cannulation',
    studentId: 'student_005'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasProcedure: !!data.result.procedure,
    hasSteps: Array.isArray(data.result.steps),
    hasEquipment: Array.isArray(data.result.equipment),
    hasComplications: Array.isArray(data.result.complications),
    stepsCount: data.result.steps.length,
    equipmentCount: data.result.equipment.length,
    complicationsCount: data.result.complications.length,
    procedureName: data.result.procedure
  };
}

// Test 7: Quick Action - Drug Database
async function testDrugDatabaseAction() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'drug_database',
    studentId: 'student_006'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasMessage: !!data.result.message,
    hasCategories: Array.isArray(data.result.categories),
    hasSearchOptions: Array.isArray(data.result.searchOptions),
    hasFeatures: Array.isArray(data.result.features),
    hasRecentSearches: Array.isArray(data.result.recentSearches),
    categoriesCount: data.result.categories.length,
    searchOptionsCount: data.result.searchOptions.length,
    featuresCount: data.result.features.length,
    recentSearchesCount: data.result.recentSearches.length
  };
}

// Test 8: Quick Action - Daily Schedule
async function testDailyScheduleAction() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'daily_schedule',
    studentId: 'student_007'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasMessage: !!data.result.message,
    hasCurrentTime: !!data.result.currentTime,
    hasUpcomingTasks: Array.isArray(data.result.upcomingTasks),
    hasAlerts: Array.isArray(data.result.alerts),
    tasksCount: data.result.upcomingTasks.length,
    alertsCount: data.result.alerts.length,
    message: data.result.message
  };
}

// Test 9: Professional Medical Search
async function testProfessionalSearch() {
  const response = await axios.post(`${BASE_URL}/search`, {
    query: 'chest pain management',
    category: 'emergency'
  });
  const data = response.data;
  
  return {
    hasSearch: data.success,
    hasQuery: !!data.searchResults.query,
    hasCategory: !!data.searchResults.category,
    hasResults: Array.isArray(data.searchResults.results),
    hasSuggestions: Array.isArray(data.searchResults.suggestions),
    hasFilters: !!data.searchResults.filters,
    resultsCount: data.searchResults.results.length,
    suggestionsCount: data.searchResults.suggestions.length,
    query: data.searchResults.query,
    category: data.searchResults.category
  };
}

// Test 10: Professional Medical Case Interface
async function testMedicalCaseInterface() {
  const response = await axios.get(`${BASE_URL}/case/ED001`);
  const data = response.data;
  
  return {
    hasCase: data.success,
    hasPatient: !!data.medicalCase.patient,
    hasPresentation: !!data.medicalCase.presentation,
    hasActions: Array.isArray(data.medicalCase.actions),
    hasTimeline: Array.isArray(data.medicalCase.timeline),
    hasNotes: !!data.medicalCase.notes,
    hasStatus: !!data.medicalCase.status,
    hasPriority: !!data.medicalCase.priority,
    patientName: data.medicalCase.patient.name,
    actionsCount: data.medicalCase.actions.length,
    timelineCount: data.medicalCase.timeline.length,
    status: data.medicalCase.status,
    priority: data.medicalCase.priority
  };
}

// Test 11: Professional Medical Calculators
async function testMedicalCalculators() {
  const response = await axios.get(`${BASE_URL}/calculators`);
  const data = response.data;
  
  return {
    hasCalculators: data.success,
    hasCardiovascular: !!data.calculators.cardiovascular,
    hasRespiratory: !!data.calculators.respiratory,
    hasEndocrine: !!data.calculators.endocrine,
    hasEmergency: !!data.calculators.emergency,
    totalCalculators: data.totalCalculators,
    cardiovascularCount: data.calculators.cardiovascular.length,
    respiratoryCount: data.calculators.respiratory.length,
    endocrineCount: data.calculators.endocrine.length,
    emergencyCount: data.calculators.emergency.length
  };
}

// Test 12: Professional Drug Database Interface
async function testDrugDatabaseInterface() {
  const response = await axios.get(`${BASE_URL}/drugs`);
  const data = response.data;
  
  return {
    hasDrugDatabase: data.success,
    hasCategories: Array.isArray(data.drugDatabase.categories),
    hasSearchOptions: Array.isArray(data.drugDatabase.searchOptions),
    hasFeatures: Array.isArray(data.drugDatabase.features),
    hasRecentSearches: Array.isArray(data.drugDatabase.recentSearches),
    categoriesCount: data.drugDatabase.categories.length,
    searchOptionsCount: data.drugDatabase.searchOptions.length,
    featuresCount: data.drugDatabase.features.length,
    recentSearchesCount: data.drugDatabase.recentSearches.length
  };
}

// Test 13: Professional Guidelines Interface
async function testGuidelinesInterface() {
  const response = await axios.get(`${BASE_URL}/guidelines`);
  const data = response.data;
  
  return {
    hasGuidelines: data.success,
    hasCategories: Array.isArray(data.guidelines.categories),
    hasLatestUpdates: Array.isArray(data.guidelines.latestUpdates),
    hasEvidenceLevels: Array.isArray(data.guidelines.evidenceLevels),
    categoriesCount: data.guidelines.categories.length,
    latestUpdatesCount: data.guidelines.latestUpdates.length,
    evidenceLevelsCount: data.guidelines.evidenceLevels.length
  };
}

// Run all tests
async function runAllTests() {
  await runTest('🏥 DASHBOARD: Professional Medical Dashboard', testProfessionalDashboard);
  await runTest('🚨 ACTION: Cardiac Arrest Protocol', testCardiacArrestAction);
  await runTest('🎯 ACTION: Start Simulation', testStartSimulationAction);
  await runTest('🏥 ACTION: National Hospital Information', testNationalHospitalAction);
  await runTest('👨‍⚕️ ACTION: Emergency Doctor Profile', testEmergencyDoctorAction);
  await runTest('💉 ACTION: IV Cannulation Procedure', testIVCannulationAction);
  await runTest('💊 ACTION: Drug Database Access', testDrugDatabaseAction);
  await runTest('📅 ACTION: Daily Schedule', testDailyScheduleAction);
  await runTest('🔍 SEARCH: Professional Medical Search', testProfessionalSearch);
  await runTest('📋 CASE: Medical Case Interface', testMedicalCaseInterface);
  await runTest('🧮 CALCULATORS: Medical Calculators', testMedicalCalculators);
  await runTest('💊 DATABASE: Drug Database Interface', testDrugDatabaseInterface);
  await runTest('📋 GUIDELINES: Clinical Guidelines Interface', testGuidelinesInterface);

  // Print results
  console.log('🏥 PROFESSIONAL MEDICAL INTERFACE TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}`);
  console.log(`🚨 Critical Failures: ${totalTests - passedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

  if (passedTests === totalTests) {
    console.log('🎉 100% PROFESSIONAL MEDICAL INTERFACE ACHIEVED!');
    console.log('✅ Professional dashboard with buttons working');
    console.log('✅ Quick action buttons functional');
    console.log('✅ Emergency protocols accessible');
    console.log('✅ Hospital information available');
    console.log('✅ Doctor profiles accessible');
    console.log('✅ Medical procedures available');
    console.log('✅ Drug database interface working');
    console.log('✅ Medical calculators available');
    console.log('✅ Clinical guidelines accessible');
    console.log('✅ Professional medical search functional');
    console.log('✅ Medical case interface working');
    console.log('✅ Easy-to-use interface for medical students');
    console.log('✅ Real-world medical training system complete\n');
    console.log('🚀 SRI LANKAN MEDICAL STUDENTS NOW HAVE PROFESSIONAL INTERFACE!');
  } else {
    console.log('⚠️ Some tests failed. Please check the implementation.');
  }
}

// Start the server and run tests
async function main() {
  try {
    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    await runAllTests();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

main(); 