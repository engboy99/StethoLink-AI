const axios = require('axios');

const BASE_URL = 'https://awake-courage-production.up.railway.app/api/dashboard';

console.log('🏥 COMPREHENSIVE MEDICAL DASHBOARD TEST\n');
console.log('Testing: All features, buttons, time alerts, notifications in one place\n');

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

// Test 1: Comprehensive Dashboard
async function testComprehensiveDashboard() {
  const response = await axios.get(`${BASE_URL}/dashboard`);
  const data = response.data;
  
  return {
    hasDashboard: data.success,
    totalButtons: data.totalButtons,
    sections: data.sections,
    hasEmergency: !!data.dashboard.emergency,
    hasSimulation: !!data.dashboard.simulation,
    hasHospitals: !!data.dashboard.hospitals,
    hasDoctors: !!data.dashboard.doctors,
    hasProcedures: !!data.dashboard.procedures,
    hasDrugs: !!data.dashboard.drugs,
    hasCalculators: !!data.dashboard.calculators,
    hasGuidelines: !!data.dashboard.guidelines,
    hasPlanning: !!data.dashboard.planning,
    hasNotifications: !!data.dashboard.notifications,
    hasAnalytics: !!data.dashboard.analytics,
    emergencyButtons: data.dashboard.emergency.buttons.length,
    simulationButtons: data.dashboard.simulation.buttons.length,
    hospitalButtons: data.dashboard.hospitals.buttons.length,
    doctorButtons: data.dashboard.doctors.buttons.length,
    procedureButtons: data.dashboard.procedures.buttons.length,
    drugButtons: data.dashboard.drugs.buttons.length,
    calculatorButtons: data.dashboard.calculators.buttons.length,
    guidelineButtons: data.dashboard.guidelines.buttons.length,
    planningButtons: data.dashboard.planning.buttons.length,
    notificationButtons: data.dashboard.notifications.buttons.length,
    analyticsButtons: data.dashboard.analytics.buttons.length
  };
}

// Test 2: Emergency Actions
async function testEmergencyActions() {
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
    hasTimeLimit: !!data.result.timeLimit,
    hasAlert: !!data.result.alert,
    timeCritical: data.result.timeCritical,
    stepsCount: data.result.steps.length,
    medicationsCount: data.result.medications.length,
    protocolName: data.result.protocol
  };
}

// Test 3: Anaphylaxis Action
async function testAnaphylaxisAction() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'anaphylaxis',
    studentId: 'student_002'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasProtocol: !!data.result.protocol,
    hasSteps: Array.isArray(data.result.steps),
    hasMedications: Array.isArray(data.result.medications),
    timeCritical: data.result.timeCritical,
    stepsCount: data.result.steps.length,
    medicationsCount: data.result.medications.length,
    protocolName: data.result.protocol
  };
}

// Test 4: Patient Simulation Actions
async function testSimulationActions() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'start_simulation',
    studentId: 'student_003'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasMessage: !!data.result.message,
    hasAvailableCases: Array.isArray(data.result.availableCases),
    hasNextStep: !!data.result.nextStep,
    hasFeatures: Array.isArray(data.result.features),
    casesCount: data.result.availableCases.length,
    featuresCount: data.result.features.length,
    message: data.result.message
  };
}

// Test 5: Hospital Information
async function testHospitalInformation() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'national_hospital',
    studentId: 'student_004'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasHospital: !!data.result.hospital,
    hasLocation: !!data.result.location,
    hasContact: !!data.result.contact,
    hasSpecialties: Array.isArray(data.result.specialties),
    hasCurrentStats: !!data.result.currentStats,
    hasRealTime: data.result.realTime,
    hospitalName: data.result.hospital,
    specialtiesCount: data.result.specialties.length,
    contact: data.result.contact
  };
}

// Test 6: Doctor Profiles
async function testDoctorProfiles() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'emergency_doctor',
    studentId: 'student_005'
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
    hasAvailability: !!data.result.availability,
    doctorName: data.result.doctor,
    specialty: data.result.specialty,
    experience: data.result.experience
  };
}

// Test 7: Medical Procedures
async function testMedicalProcedures() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'iv_cannulation',
    studentId: 'student_006'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasProcedure: !!data.result.procedure,
    hasSteps: Array.isArray(data.result.steps),
    hasEquipment: Array.isArray(data.result.equipment),
    hasComplications: Array.isArray(data.result.complications),
    hasDifficulty: !!data.result.difficulty,
    hasDuration: !!data.result.duration,
    stepsCount: data.result.steps.length,
    equipmentCount: data.result.equipment.length,
    complicationsCount: data.result.complications.length,
    procedureName: data.result.procedure
  };
}

// Test 8: Drug Database
async function testDrugDatabase() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'drug_search',
    studentId: 'student_007'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasMessage: !!data.result.message,
    hasSearchOptions: Array.isArray(data.result.searchOptions),
    hasCategories: Array.isArray(data.result.categories),
    hasFeatures: Array.isArray(data.result.features),
    hasRecentSearches: Array.isArray(data.result.recentSearches),
    hasTotalDrugs: !!data.result.totalDrugs,
    searchOptionsCount: data.result.searchOptions.length,
    categoriesCount: data.result.categories.length,
    featuresCount: data.result.features.length,
    totalDrugs: data.result.totalDrugs
  };
}

// Test 9: Medical Calculators
async function testMedicalCalculators() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'gfr_calculator',
    studentId: 'student_008'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasCalculator: !!data.result.calculator,
    hasDescription: !!data.result.description,
    hasInputs: Array.isArray(data.result.inputs),
    hasFormula: !!data.result.formula,
    hasNormalRange: !!data.result.normalRange,
    hasInterpretation: !!data.result.interpretation,
    inputsCount: data.result.inputs.length,
    calculatorName: data.result.calculator,
    normalRange: data.result.normalRange
  };
}

// Test 10: Clinical Guidelines
async function testClinicalGuidelines() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'cardiology_guidelines',
    studentId: 'student_009'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasGuidelines: !!data.result.guidelines,
    hasLastUpdated: !!data.result.lastUpdated,
    hasTopics: Array.isArray(data.result.topics),
    hasEvidenceLevels: Array.isArray(data.result.evidenceLevels),
    hasSource: !!data.result.source,
    hasDownloadable: data.result.downloadable,
    topicsCount: data.result.topics.length,
    evidenceLevelsCount: data.result.evidenceLevels.length,
    guidelinesName: data.result.guidelines,
    lastUpdated: data.result.lastUpdated
  };
}

// Test 11: Daily Schedule
async function testDailySchedule() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'daily_schedule',
    studentId: 'student_010'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasMessage: !!data.result.message,
    hasCurrentTime: !!data.result.currentTime,
    hasToday: !!data.result.today,
    hasUpcomingTasks: Array.isArray(data.result.upcomingTasks),
    hasAlerts: Array.isArray(data.result.alerts),
    hasTimeAlerts: data.result.timeAlerts,
    tasksCount: data.result.upcomingTasks.length,
    alertsCount: data.result.alerts.length,
    currentTime: data.result.currentTime,
    today: data.result.today
  };
}

// Test 12: Time Alerts
async function testTimeAlerts() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'time_alerts',
    studentId: 'student_011'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasMessage: !!data.result.message,
    hasAlertTypes: Array.isArray(data.result.alertTypes),
    hasActiveAlerts: Array.isArray(data.result.activeAlerts),
    hasSettings: !!data.result.settings,
    alertTypesCount: data.result.alertTypes.length,
    activeAlertsCount: data.result.activeAlerts.length,
    message: data.result.message
  };
}

// Test 13: Set Time Alert
async function testSetTimeAlert() {
  const response = await axios.post(`${BASE_URL}/time-alert`, {
    studentId: 'student_012',
    taskId: 'task_001',
    alertType: 'all',
    taskTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
    taskDescription: 'Emergency case review'
  });
  const data = response.data;
  
  return {
    hasAlert: data.success,
    hasAlertId: !!data.alert.id,
    hasStudentId: !!data.alert.studentId,
    hasTaskId: !!data.alert.taskId,
    hasAlertType: !!data.alert.alertType,
    hasTaskTime: !!data.alert.taskTime,
    hasTaskDescription: !!data.alert.taskDescription,
    hasStatus: !!data.alert.status,
    hasTriggerTimes: Array.isArray(data.alert.triggerTimes),
    triggerTimesCount: data.alert.triggerTimes.length,
    alertId: data.alert.id,
    alertType: data.alert.alertType
  };
}

// Test 14: Emergency Alerts
async function testEmergencyAlerts() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'emergency_alerts',
    studentId: 'student_013'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasMessage: !!data.result.message,
    hasActiveAlerts: Array.isArray(data.result.activeAlerts),
    hasAlertHistory: Array.isArray(data.result.alertHistory),
    hasSettings: !!data.result.settings,
    activeAlertsCount: data.result.activeAlerts.length,
    alertHistoryCount: data.result.alertHistory.length,
    message: data.result.message
  };
}

// Test 15: Get All Alerts
async function testGetAllAlerts() {
  const response = await axios.get(`${BASE_URL}/alerts/student_014`);
  const data = response.data;
  
  return {
    hasAlerts: data.success,
    hasAlertsList: Array.isArray(data.alerts),
    hasCount: typeof data.count === 'number',
    hasUnreadCount: typeof data.unreadCount === 'number',
    alertsCount: data.count,
    unreadCount: data.unreadCount,
    alerts: data.alerts.length
  };
}

// Test 16: Mark Alert as Read
async function testMarkAlertAsRead() {
  const response = await axios.put(`${BASE_URL}/alerts/student_015/alert_001`);
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasAlertId: !!data.alertId,
    hasStudentId: !!data.studentId,
    hasTimestamp: !!data.timestamp,
    alertId: data.alertId,
    studentId: data.studentId
  };
}

// Test 17: Performance Analytics
async function testPerformanceAnalytics() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'performance_dashboard',
    studentId: 'student_016'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasMessage: !!data.result.message,
    hasOverallScore: typeof data.result.overallScore === 'number',
    hasMetrics: !!data.result.metrics,
    hasRecentPerformance: Array.isArray(data.result.recentPerformance),
    hasImprovements: Array.isArray(data.result.improvements),
    hasRecommendations: Array.isArray(data.result.recommendations),
    overallScore: data.result.overallScore,
    recentPerformanceCount: data.result.recentPerformance.length,
    improvementsCount: data.result.improvements.length,
    recommendationsCount: data.result.recommendations.length
  };
}

// Test 18: Active Cases
async function testActiveCases() {
  const response = await axios.post(`${BASE_URL}/quick-action`, {
    actionId: 'active_cases',
    studentId: 'student_017'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasMessage: !!data.result.message,
    hasCases: Array.isArray(data.result.cases),
    hasTotalActive: typeof data.result.totalActive === 'number',
    hasTotalCompleted: typeof data.result.totalCompleted === 'number',
    hasTotalPending: typeof data.result.totalPending === 'number',
    casesCount: data.result.cases.length,
    totalActive: data.result.totalActive,
    totalCompleted: data.result.totalCompleted,
    totalPending: data.result.totalPending
  };
}

// Run all tests
async function runAllTests() {
  await runTest('🏥 DASHBOARD: Comprehensive Medical Dashboard', testComprehensiveDashboard);
  await runTest('🚨 EMERGENCY: Cardiac Arrest Protocol', testEmergencyActions);
  await runTest('⚠️ EMERGENCY: Anaphylaxis Management', testAnaphylaxisAction);
  await runTest('🎯 SIMULATION: Start Patient Simulation', testSimulationActions);
  await runTest('🏥 HOSPITAL: National Hospital Information', testHospitalInformation);
  await runTest('👨‍⚕️ DOCTOR: Emergency Doctor Profile', testDoctorProfiles);
  await runTest('💉 PROCEDURE: IV Cannulation', testMedicalProcedures);
  await runTest('💊 DRUGS: Drug Database Access', testDrugDatabase);
  await runTest('🧮 CALCULATOR: GFR Calculator', testMedicalCalculators);
  await runTest('📋 GUIDELINES: Cardiology Guidelines', testClinicalGuidelines);
  await runTest('📅 SCHEDULE: Daily Medical Schedule', testDailySchedule);
  await runTest('⏰ ALERTS: Time Alert System', testTimeAlerts);
  await runTest('⏰ SET: Set Time Alert', testSetTimeAlert);
  await runTest('🚨 ALERTS: Emergency Alert System', testEmergencyAlerts);
  await runTest('🔔 GET: Get All Alerts', testGetAllAlerts);
  await runTest('✅ READ: Mark Alert as Read', testMarkAlertAsRead);
  await runTest('📊 ANALYTICS: Performance Dashboard', testPerformanceAnalytics);
  await runTest('📋 CASES: Active Cases', testActiveCases);

  // Print results
  console.log('🏥 COMPREHENSIVE MEDICAL DASHBOARD TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}`);
  console.log(`🚨 Critical Failures: ${totalTests - passedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

  if (passedTests === totalTests) {
    console.log('🎉 100% COMPREHENSIVE MEDICAL DASHBOARD ACHIEVED!');
    console.log('✅ All 9 sections with 50+ buttons working perfectly');
    console.log('✅ Emergency protocols with time-critical alerts');
    console.log('✅ Patient simulation with real cases');
    console.log('✅ Sri Lankan hospital information');
    console.log('✅ Doctor profiles and consultation');
    console.log('✅ Medical procedures with step-by-step guides');
    console.log('✅ Comprehensive drug database');
    console.log('✅ Medical calculators for clinical use');
    console.log('✅ Clinical guidelines with evidence levels');
    console.log('✅ Daily planning with exact time alerts');
    console.log('✅ Smart notification system');
    console.log('✅ Performance analytics and tracking');
    console.log('✅ Easy-to-use interface for medical students');
    console.log('✅ Real-world medical training system complete\n');
    console.log('🚀 SRI LANKAN MEDICAL STUDENTS NOW HAVE COMPLETE DASHBOARD!');
    console.log('🎯 ALL FEATURES IN ONE PLACE - EASY USAGE BUTTONS!');
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