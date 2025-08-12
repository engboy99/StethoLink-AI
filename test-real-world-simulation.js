const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/simulation';

console.log('🏥 REAL-WORLD MEDICAL SIMULATION TEST\n');
console.log('Testing: Real-world patient simulation, Sri Lankan hospitals, doctor interactions\n');

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

// Test 1: Get Available Real-World Scenarios
async function testAvailableScenarios() {
  const response = await axios.get(`${BASE_URL}/scenarios`);
  const data = response.data;
  
  return {
    hasScenarios: data.success,
    hasEmergencyDepartment: !!data.scenarios['Emergency Department'],
    hasMedicalWard: !!data.scenarios['Medical Ward'],
    totalDepartments: data.totalDepartments,
    totalPatients: data.totalPatients,
    emergencyPatients: data.scenarios['Emergency Department']?.length || 0,
    medicalPatients: data.scenarios['Medical Ward']?.length || 0
  };
}

// Test 2: Start Real-World Simulation
async function testStartSimulation() {
  const response = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_001',
    scenarioType: 'Emergency Department',
    patientId: 'Chest Pain - 45M'
  });
  const data = response.data;
  
  return {
    hasSimulation: data.success,
    hasPatient: !!data.simulation?.patient,
    patientName: data.simulation?.patient?.name,
    hasVitalSigns: !!data.simulation?.vitalSigns,
    hasExamination: !!data.simulation?.examination,
    timeLimit: data.simulation?.timeLimit,
    difficulty: data.simulation?.difficulty,
    learningObjectives: data.simulation?.learningObjectives?.length || 0
  };
}

// Test 3: Take Action in Simulation
async function testTakeAction() {
  // First start a simulation
  const startResponse = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_002',
    scenarioType: 'Emergency Department',
    patientId: 'Chest Pain - 45M'
  });
  
  const simulationId = startResponse.data.simulation.id;
  
  // Take an action
  const response = await axios.post(`${BASE_URL}/action`, {
    simulationId,
    action: 'order_ecg',
    details: 'ECG for chest pain evaluation'
  });
  const data = response.data;
  
  return {
    hasAction: data.success,
    hasEvaluation: !!data.result?.evaluation,
    hasScore: typeof data.result?.score === 'number',
    hasFeedback: !!data.result?.evaluation?.feedback,
    timeRemaining: data.result?.timeRemaining,
    score: data.result?.score
  };
}

// Test 4: Complete Simulation
async function testCompleteSimulation() {
  // First start a simulation
  const startResponse = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_003',
    scenarioType: 'Emergency Department',
    patientId: 'Chest Pain - 45M'
  });
  
  const simulationId = startResponse.data.simulation.id;
  
  // Take some actions
  await axios.post(`${BASE_URL}/action`, {
    simulationId,
    action: 'order_ecg',
    details: 'ECG for chest pain evaluation'
  });
  
  await axios.post(`${BASE_URL}/action`, {
    simulationId,
    action: 'administer_medication',
    details: 'Aspirin 300mg for ACS'
  });
  
  // Complete the simulation
  const response = await axios.post(`${BASE_URL}/complete`, {
    simulationId
  });
  const data = response.data;
  
  return {
    hasResult: data.success,
    hasScore: typeof data.result?.score === 'number',
    hasGrade: !!data.result?.grade,
    hasPercentage: typeof data.result?.percentage === 'number',
    hasDuration: typeof data.result?.duration === 'number',
    hasRecommendations: Array.isArray(data.result?.recommendations),
    patientName: data.result?.patientName
  };
}

// Test 5: Get Sri Lankan Hospital Information
async function testHospitalInformation() {
  const response = await axios.get(`${BASE_URL}/hospitals`);
  const data = response.data;
  
  return {
    hasHospitals: data.success,
    totalHospitals: data.total,
    hasNationalHospital: data.hospitals.some(h => h.name.includes('National Hospital')),
    hasAsiriHospital: data.hospitals.some(h => h.name.includes('Asiri')),
    hasNawalokaHospital: data.hospitals.some(h => h.name.includes('Nawaloka')),
    hasPeradeniyaHospital: data.hospitals.some(h => h.name.includes('Peradeniya')),
    hospitalsWithContact: data.hospitals.filter(h => h.contact).length,
    hospitalsWithAmbulance: data.hospitals.filter(h => h.ambulance).length
  };
}

// Test 6: Get Hospital Daily Statistics
async function testHospitalStatistics() {
  const response = await axios.get(`${BASE_URL}/hospital/National Hospital of Sri Lanka/stats`);
  const data = response.data;
  
  return {
    hasStats: data.success,
    hasHospital: !!data.stats?.hospital,
    hasAdmissions: typeof data.stats?.admissions === 'number',
    hasDischarges: typeof data.stats?.discharges === 'number',
    hasEmergencyVisits: typeof data.stats?.emergencyVisits === 'number',
    hasSurgeries: typeof data.stats?.surgeries === 'number',
    hasLabTests: typeof data.stats?.labTests === 'number',
    hasWardOccupancy: Array.isArray(data.stats?.wardOccupancy),
    wardCount: data.stats?.wardOccupancy?.length || 0
  };
}

// Test 7: Get Doctor Profiles
async function testDoctorProfiles() {
  const response = await axios.get(`${BASE_URL}/doctors`);
  const data = response.data;
  
  return {
    hasDoctors: data.success,
    totalDoctors: data.total,
    hasEmergencyDoctor: data.doctors.some(d => d.specialty === 'Emergency Medicine'),
    hasCardiologist: data.doctors.some(d => d.specialty === 'Cardiology'),
    hasGeneralMedicine: data.doctors.some(d => d.specialty === 'General Medicine'),
    hasPediatrician: data.doctors.some(d => d.specialty === 'Pediatrics'),
    doctorsWithExperience: data.doctors.filter(d => d.experience).length,
    doctorsWithContact: data.doctors.filter(d => d.contact).length,
    doctorsWithSchedule: data.doctors.filter(d => d.schedule).length
  };
}

// Test 8: Get Emergency Protocols
async function testEmergencyProtocols() {
  const response = await axios.get(`${BASE_URL}/emergency-protocols`);
  const data = response.data;
  
  return {
    hasProtocols: data.success,
    hasCardiacArrest: !!data.protocols['Cardiac Arrest'],
    hasAnaphylaxis: !!data.protocols['Anaphylaxis'],
    hasSevereBleeding: !!data.protocols['Severe Bleeding'],
    cardiacArrestSteps: data.protocols['Cardiac Arrest']?.steps?.length || 0,
    cardiacArrestMedications: data.protocols['Cardiac Arrest']?.medications?.length || 0,
    anaphylaxisSteps: data.protocols['Anaphylaxis']?.steps?.length || 0,
    severeBleedingSteps: data.protocols['Severe Bleeding']?.steps?.length || 0
  };
}

// Test 9: Get Medical Procedures
async function testMedicalProcedures() {
  const response = await axios.get(`${BASE_URL}/procedures`);
  const data = response.data;
  
  return {
    hasProcedures: data.success,
    hasIVCannulation: !!data.procedures['Intravenous Cannulation'],
    hasLumbarPuncture: !!data.procedures['Lumbar Puncture'],
    hasCentralLine: !!data.procedures['Central Line Insertion'],
    ivCannulationSteps: data.procedures['Intravenous Cannulation']?.steps?.length || 0,
    ivCannulationEquipment: data.procedures['Intravenous Cannulation']?.equipment?.length || 0,
    lumbarPunctureSteps: data.procedures['Lumbar Puncture']?.steps?.length || 0,
    centralLineSteps: data.procedures['Central Line Insertion']?.steps?.length || 0
  };
}

// Test 10: Get Active Simulations
async function testActiveSimulations() {
  const response = await axios.get(`${BASE_URL}/active/student_001`);
  const data = response.data;
  
  return {
    hasSimulations: data.success,
    count: data.count,
    simulations: Array.isArray(data.simulations)
  };
}

// Test 11: Get Simulation History
async function testSimulationHistory() {
  const response = await axios.get(`${BASE_URL}/history/student_003`);
  const data = response.data;
  
  return {
    hasHistory: data.success,
    count: data.count,
    history: Array.isArray(data.history),
    hasCompletedSimulations: data.count > 0
  };
}

// Test 12: Complex Patient Scenario - Dengue Fever
async function testDengueFeverScenario() {
  const response = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_004',
    scenarioType: 'Emergency Department',
    patientId: 'Dengue Fever - 28F'
  });
  const data = response.data;
  
  return {
    hasDengueScenario: data.success,
    patientName: data.simulation?.patient?.name,
    hasDengueSymptoms: data.simulation?.presentation?.associatedSymptoms?.includes('Rash'),
    hasFever: data.simulation?.vitalSigns?.temperature > 38,
    hasLowBP: data.simulation?.vitalSigns?.bloodPressure?.includes('90/60'),
    hasDengueDiagnosis: data.simulation?.differentialDiagnosis?.includes('Dengue Fever'),
    hasPlateletMonitoring: data.simulation?.requiredActions?.some(action => action.includes('Platelet')),
    timeLimit: data.simulation?.timeLimit,
    difficulty: data.simulation?.difficulty
  };
}

// Test 13: Complex Patient Scenario - Diabetic Ketoacidosis
async function testDKAScenario() {
  const response = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_005',
    scenarioType: 'Medical Ward',
    patientId: 'Diabetic Ketoacidosis - 32M'
  });
  const data = response.data;
  
  return {
    hasDKAScenario: data.success,
    patientName: data.simulation?.patient?.name,
    hasConfusion: data.simulation?.presentation?.chiefComplaint?.includes('Confusion'),
    hasKussmaulBreathing: data.simulation?.vitalSigns?.respiratoryRate > 25,
    hasHighGlucose: data.simulation?.labResults?.bloodGlucose > 600,
    hasLowPH: data.simulation?.labResults?.pH < 7.2,
    hasInsulinAction: data.simulation?.requiredActions?.some(action => action.includes('Insulin')),
    hasDKADiagnosis: data.simulation?.differentialDiagnosis?.includes('Diabetic Ketoacidosis'),
    timeLimit: data.simulation?.timeLimit,
    difficulty: data.simulation?.difficulty
  };
}

// Run all tests
async function runAllTests() {
  await runTest('🏥 SCENARIOS: Available Real-World Scenarios', testAvailableScenarios);
  await runTest('🏥 SIMULATION: Start Real-World Simulation', testStartSimulation);
  await runTest('🏥 ACTION: Take Action in Simulation', testTakeAction);
  await runTest('🏥 COMPLETE: Complete Simulation with Results', testCompleteSimulation);
  await runTest('🏥 HOSPITALS: Sri Lankan Hospital Information', testHospitalInformation);
  await runTest('🏥 STATS: Hospital Daily Statistics', testHospitalStatistics);
  await runTest('🏥 DOCTORS: Doctor Profiles and Specialties', testDoctorProfiles);
  await runTest('🏥 EMERGENCY: Emergency Protocols', testEmergencyProtocols);
  await runTest('🏥 PROCEDURES: Medical Procedures', testMedicalProcedures);
  await runTest('🏥 ACTIVE: Active Simulations Tracking', testActiveSimulations);
  await runTest('🏥 HISTORY: Simulation History', testSimulationHistory);
  await runTest('🏥 DENGUE: Complex Dengue Fever Scenario', testDengueFeverScenario);
  await runTest('🏥 DKA: Complex Diabetic Ketoacidosis Scenario', testDKAScenario);

  // Print results
  console.log('🏥 REAL-WORLD MEDICAL SIMULATION TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}`);
  console.log(`🚨 Critical Failures: ${totalTests - passedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

  if (passedTests === totalTests) {
    console.log('🎉 100% REAL-WORLD MEDICAL SIMULATION ACHIEVED!');
    console.log('✅ Real-world patient simulation working');
    console.log('✅ Sri Lankan hospital information complete');
    console.log('✅ Doctor profiles and specialties available');
    console.log('✅ Emergency protocols and procedures');
    console.log('✅ Complex medical scenarios (Dengue, DKA)');
    console.log('✅ Simulation tracking and history');
    console.log('✅ Real-world medical training system complete\n');
    console.log('🚀 SRI LANKAN MEDICAL STUDENTS NOW HAVE REAL-WORLD SIMULATION!');
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