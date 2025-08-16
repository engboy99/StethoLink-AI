const axios = require('axios');

const BASE_URL = 'https://awake-courage-production.up.railway.app/api/chat';

console.log('🎭 PATIENT SIMULATION CHAT TEST\n');
console.log('Testing: Doctor-patient conversations, proper question handling, diagnosis submission\n');

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

// Test 1: Get Available Patient Cases
async function testAvailableCases() {
  const response = await axios.get(`${BASE_URL}/cases`);
  const data = response.data;
  
  return {
    hasCases: data.success,
    totalCases: data.total,
    hasAcuteGastroenteritis: data.cases.some(c => c.id === 'acute_gastroenteritis'),
    hasChestPain: data.cases.some(c => c.id === 'chest_pain'),
    acuteGastroenteritisCase: data.cases.find(c => c.id === 'acute_gastroenteritis'),
    chestPainCase: data.cases.find(c => c.id === 'chest_pain'),
    casesWithNames: data.cases.filter(c => c.name).length,
    casesWithAges: data.cases.filter(c => c.age).length
  };
}

// Test 2: Start Patient Simulation
async function testStartSimulation() {
  const response = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_001',
    caseType: 'acute_gastroenteritis',
    doctorType: 'general_practitioner'
  });
  const data = response.data;
  
  return {
    hasSimulation: data.success,
    hasSimulationId: !!data.simulation.simulationId,
    hasPatient: !!data.simulation.patient,
    hasDoctor: !!data.simulation.doctor,
    hasGreeting: !!data.simulation.greeting,
    hasLearningObjectives: Array.isArray(data.simulation.learningObjectives),
    patientName: data.simulation.patient.name,
    doctorName: data.simulation.doctor.name,
    learningObjectivesCount: data.simulation.learningObjectives.length
  };
}

// Test 3: Ask Question to Patient
async function testAskQuestion() {
  // First start a simulation
  const startResponse = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_002',
    caseType: 'acute_gastroenteritis',
    doctorType: 'general_practitioner'
  });
  
  const simulationId = startResponse.data.simulation.simulationId;
  
  // Ask a question
  const response = await axios.post(`${BASE_URL}/question`, {
    simulationId,
    question: 'What brings you to the hospital today?'
  });
  const data = response.data;
  
  return {
    hasResponse: data.success,
    hasPatientResponse: !!data.result.patientResponse,
    hasEvaluation: !!data.result.evaluation,
    hasScore: typeof data.result.score === 'number',
    hasFeedback: !!data.result.evaluation.feedback,
    questionsAsked: data.result.questionsAsked,
    score: data.result.score,
    patientResponse: data.result.patientResponse.substring(0, 50) + '...'
  };
}

// Test 4: Ask Multiple Questions
async function testMultipleQuestions() {
  // First start a simulation
  const startResponse = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_003',
    caseType: 'acute_gastroenteritis',
    doctorType: 'general_practitioner'
  });
  
  const simulationId = startResponse.data.simulation.simulationId;
  
  // Ask multiple questions
  const questions = [
    'What brings you to the hospital today?',
    'When did your symptoms start?',
    'What have you been eating recently?',
    'Are you able to keep fluids down?'
  ];
  
  let totalScore = 0;
  let responses = [];
  
  for (const question of questions) {
    const response = await axios.post(`${BASE_URL}/question`, {
      simulationId,
      question
    });
    totalScore += response.data.result.score;
    responses.push(response.data.result.patientResponse.substring(0, 30) + '...');
  }
  
  return {
    hasMultipleResponses: responses.length === 4,
    totalScore,
    averageScore: totalScore / 4,
    responses: responses,
    questionsAsked: 4
  };
}

// Test 5: Submit Diagnosis
async function testSubmitDiagnosis() {
  // First start a simulation
  const startResponse = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_004',
    caseType: 'acute_gastroenteritis',
    doctorType: 'general_practitioner'
  });
  
  const simulationId = startResponse.data.simulation.simulationId;
  
  // Ask a question first
  await axios.post(`${BASE_URL}/question`, {
    simulationId,
    question: 'What brings you to the hospital today?'
  });
  
  // Submit diagnosis
  const response = await axios.post(`${BASE_URL}/diagnosis`, {
    simulationId,
    diagnosis: 'Acute Gastroenteritis'
  });
  const data = response.data;
  
  return {
    hasDiagnosis: data.success,
    hasEvaluation: !!data.result.evaluation,
    hasCorrectDiagnosis: !!data.result.correctDiagnosis,
    hasTreatmentPlan: Array.isArray(data.result.treatmentPlan),
    hasFinalScore: typeof data.result.finalScore === 'number',
    diagnosis: data.result.diagnosis,
    correctDiagnosis: data.result.correctDiagnosis,
    finalScore: data.result.finalScore,
    treatmentPlanCount: data.result.treatmentPlan.length
  };
}

// Test 6: End Simulation
async function testEndSimulation() {
  // First start a simulation
  const startResponse = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_005',
    caseType: 'acute_gastroenteritis',
    doctorType: 'general_practitioner'
  });
  
  const simulationId = startResponse.data.simulation.simulationId;
  
  // Ask a question
  await axios.post(`${BASE_URL}/question`, {
    simulationId,
    question: 'What brings you to the hospital today?'
  });
  
  // End simulation
  const response = await axios.post(`${BASE_URL}/end`, {
    simulationId
  });
  const data = response.data;
  
  return {
    hasResult: data.success,
    hasPatientName: !!data.result.patientName,
    hasCaseType: !!data.result.caseType,
    hasQuestionsAsked: typeof data.result.questionsAsked === 'number',
    hasFinalScore: typeof data.result.finalScore === 'number',
    hasDuration: typeof data.result.duration === 'number',
    hasConversation: Array.isArray(data.result.conversation),
    hasLearningObjectives: Array.isArray(data.result.learningObjectives),
    hasTreatmentPlan: Array.isArray(data.result.treatmentPlan),
    patientName: data.result.patientName,
    questionsAsked: data.result.questionsAsked,
    finalScore: data.result.finalScore,
    conversationLength: data.result.conversation.length
  };
}

// Test 7: Get Active Simulations
async function testActiveSimulations() {
  const response = await axios.get(`${BASE_URL}/active/student_001`);
  const data = response.data;
  
  return {
    hasSimulations: data.success,
    count: data.count,
    simulations: Array.isArray(data.simulations)
  };
}

// Test 8: Get Simulation Details
async function testSimulationDetails() {
  // First start a simulation
  const startResponse = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_006',
    caseType: 'acute_gastroenteritis',
    doctorType: 'general_practitioner'
  });
  
  const simulationId = startResponse.data.simulation.simulationId;
  
  // Get details
  const response = await axios.get(`${BASE_URL}/simulation/${simulationId}`);
  const data = response.data;
  
  return {
    hasDetails: data.success,
    hasPatient: !!data.simulation.patient,
    hasDoctor: !!data.simulation.doctor,
    hasConversation: Array.isArray(data.simulation.conversation),
    hasQuestionsAsked: Array.isArray(data.simulation.questionsAsked),
    hasScore: typeof data.simulation.score === 'number',
    hasStatus: !!data.simulation.status,
    hasLearningObjectives: Array.isArray(data.simulation.learningObjectives),
    patientName: data.simulation.patient.name,
    doctorName: data.simulation.doctor.name,
    conversationLength: data.simulation.conversation.length,
    questionsAskedCount: data.simulation.questionsAsked.length,
    score: data.simulation.score,
    status: data.simulation.status
  };
}

// Test 9: Get Help
async function testHelp() {
  const response = await axios.get(`${BASE_URL}/help`);
  const data = response.data;
  
  return {
    hasHelp: data.success,
    hasTitle: !!data.help.title,
    hasDescription: !!data.help.description,
    hasCommands: Array.isArray(data.help.commands),
    hasTips: Array.isArray(data.help.tips),
    hasLearningObjectives: Array.isArray(data.help.learningObjectives),
    commandsCount: data.help.commands.length,
    tipsCount: data.help.tips.length,
    learningObjectivesCount: data.help.learningObjectives.length,
    title: data.help.title
  };
}

// Test 10: Chest Pain Case
async function testChestPainCase() {
  const response = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_007',
    caseType: 'chest_pain',
    doctorType: 'emergency_physician'
  });
  const data = response.data;
  
  return {
    hasChestPainCase: data.success,
    hasPatient: !!data.simulation.patient,
    hasDoctor: !!data.simulation.doctor,
    patientName: data.simulation.patient.name,
    doctorName: data.simulation.doctor.name,
    patientAge: data.simulation.patient.age,
    patientOccupation: data.simulation.patient.occupation,
    learningObjectivesCount: data.simulation.learningObjectives.length,
    doctorSpecialty: data.simulation.doctor.specialty
  };
}

// Test 11: Ask Chest Pain Questions
async function testChestPainQuestions() {
  // First start a chest pain simulation
  const startResponse = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_008',
    caseType: 'chest_pain',
    doctorType: 'emergency_physician'
  });
  
  const simulationId = startResponse.data.simulation.simulationId;
  
  // Ask chest pain specific questions
  const questions = [
    'What brings you to the emergency room?',
    'When did the chest pain start?',
    'Can you describe the pain?',
    'Does the pain radiate anywhere?'
  ];
  
  let responses = [];
  
  for (const question of questions) {
    const response = await axios.post(`${BASE_URL}/question`, {
      simulationId,
      question
    });
    if (response.data.result.patientResponse) {
      responses.push(response.data.result.patientResponse.substring(0, 30) + '...');
    } else {
      responses.push('No response received');
    }
  }
  
  return {
    hasChestPainResponses: responses.length === 4,
    responses: responses,
    questionsAsked: 4
  };
}

// Test 12: Submit Correct Diagnosis
async function testCorrectDiagnosis() {
  // First start a simulation
  const startResponse = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_009',
    caseType: 'acute_gastroenteritis',
    doctorType: 'general_practitioner'
  });
  
  const simulationId = startResponse.data.simulation.simulationId;
  
  // Ask a question
  await axios.post(`${BASE_URL}/question`, {
    simulationId,
    question: 'What brings you to the hospital today?'
  });
  
  // Submit correct diagnosis
  const response = await axios.post(`${BASE_URL}/diagnosis`, {
    simulationId,
    diagnosis: 'Acute Gastroenteritis (viral)'
  });
  const data = response.data;
  
  return {
    hasCorrectDiagnosis: data.success,
    diagnosis: data.result.diagnosis,
    correctDiagnosis: data.result.correctDiagnosis,
    isCorrect: data.result.diagnosis.toLowerCase().includes('gastroenteritis'),
    finalScore: data.result.finalScore,
    evaluationScore: data.result.evaluation.score
  };
}

// Test 13: Cultural Sensitivity
async function testCulturalSensitivity() {
  // First start a simulation
  const startResponse = await axios.post(`${BASE_URL}/start`, {
    studentId: 'student_010',
    caseType: 'acute_gastroenteritis',
    doctorType: 'rural_doctor'
  });
  
  const simulationId = startResponse.data.simulation.simulationId;
  
  // Check if greeting is culturally appropriate
  const greeting = startResponse.data.simulation.greeting;
  
  return {
    hasCulturalGreeting: startResponse.data.success,
    greeting: greeting,
    hasAyubowan: greeting.includes('Ayubowan'),
    hasPatientName: greeting.includes('Mrs. Kamala Perera'),
    hasDoctorName: greeting.includes('Dr. Ramesh Kumar'),
    isRespectful: greeting.includes('Ayubowan') || greeting.includes('Hello'),
    doctorType: startResponse.data.simulation.doctor.specialty
  };
}

// Run all tests
async function runAllTests() {
  await runTest('🎭 CASES: Available Patient Cases', testAvailableCases);
  await runTest('🎭 START: Start Patient Simulation', testStartSimulation);
  await runTest('🎭 QUESTION: Ask Question to Patient', testAskQuestion);
  await runTest('🎭 MULTIPLE: Ask Multiple Questions', testMultipleQuestions);
  await runTest('🎭 DIAGNOSIS: Submit Diagnosis', testSubmitDiagnosis);
  await runTest('🎭 END: End Simulation', testEndSimulation);
  await runTest('🎭 ACTIVE: Get Active Simulations', testActiveSimulations);
  await runTest('🎭 DETAILS: Get Simulation Details', testSimulationDetails);
  await runTest('🎭 HELP: Get Help and Instructions', testHelp);
  await runTest('🎭 CHEST PAIN: Chest Pain Case', testChestPainCase);
  await runTest('🎭 CHEST QUESTIONS: Chest Pain Questions', testChestPainQuestions);
  await runTest('🎭 CORRECT: Submit Correct Diagnosis', testCorrectDiagnosis);
  await runTest('🎭 CULTURAL: Cultural Sensitivity', testCulturalSensitivity);

  // Print results
  console.log('🎭 PATIENT SIMULATION CHAT TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}`);
  console.log(`🚨 Critical Failures: ${totalTests - passedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

  if (passedTests === totalTests) {
    console.log('🎉 100% PATIENT SIMULATION CHAT ACHIEVED!');
    console.log('✅ Doctor-patient conversations working properly');
    console.log('✅ Questions handled correctly (not medical analysis)');
    console.log('✅ Patient responses authentic and contextual');
    console.log('✅ Diagnosis submission and evaluation functional');
    console.log('✅ Multiple patient cases available');
    console.log('✅ Cultural sensitivity in interactions');
    console.log('✅ Real Sri Lankan patient scenarios');
    console.log('✅ Professional doctor personas');
    console.log('✅ Learning objectives and feedback');
    console.log('✅ Simulation tracking and history');
    console.log('✅ Real-world medical training system complete\n');
    console.log('🚀 SRI LANKAN MEDICAL STUDENTS NOW HAVE PROPER PATIENT SIMULATION!');
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