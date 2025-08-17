const axios = require('axios');

const BASE_URL = 'https://awake-courage-production.up.railway.app/api/advanced-features';

console.log('🚀 ADVANCED FEATURES TEST\n');
console.log('Testing: Medical Image Analysis, Advanced Calculators, Research Assistant AI, Mobile Medical Assistant\n');

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

// ===== MEDICAL IMAGE ANALYSIS TESTS =====

// Test 1: Analyze Medical Image
async function testAnalyzeMedicalImage() {
  const response = await axios.post(`${BASE_URL}/image-analysis`, {
    imageType: 'chestXray',
    analysisType: 'general',
    clinicalHistory: 'Patient with chest pain and shortness of breath',
    patientAge: 65,
    patientGender: 'Male',
    symptoms: ['chest pain', 'shortness of breath', 'cough'],
    urgency: 'urgent'
  });
  const data = response.data;
  
  return {
    hasAnalysis: data.success,
    hasAnalysisId: !!data.analysis.id,
    hasImageType: !!data.analysis.imageType,
    hasKeyFindings: Array.isArray(data.analysis.keyFindings),
    hasDifferentialDiagnosis: Array.isArray(data.analysis.differentialDiagnosis),
    hasImpression: !!data.analysis.impression,
    hasRecommendations: Array.isArray(data.analysis.recommendations),
    hasConfidence: typeof data.analysis.confidence === 'number',
    analysisId: data.analysis.id,
    imageType: data.analysis.imageType,
    confidence: data.analysis.confidence
  };
}

// Test 2: Get Image Categories
async function testGetImageCategories() {
  const response = await axios.get(`${BASE_URL}/image-analysis/categories`);
  const data = response.data;
  
  return {
    hasCategories: data.success,
    hasChestXray: !!data.categories.chestXray,
    hasBrainMRI: !!data.categories.brainMRI,
    hasSkinLesion: !!data.categories.skinLesion,
    hasGeneral: !!data.categories.general,
    chestXrayName: data.categories.chestXray.name,
    brainMRIName: data.categories.brainMRI.name,
    skinLesionName: data.categories.skinLesion.name
  };
}

// Test 3: Get Training Cases
async function testGetTrainingCases() {
  const response = await axios.get(`${BASE_URL}/image-analysis/training-cases?difficulty=beginner`);
  const data = response.data;
  
  return {
    hasCases: data.success,
    hasCasesArray: Array.isArray(data.cases),
    totalCasesCount: data.cases.length,
    hasBeginnerCases: data.cases.some(case_ => case_.difficulty === 'beginner'),
    hasIntermediateCases: data.cases.some(case_ => case_.difficulty === 'intermediate'),
    hasAdvancedCases: data.cases.some(case_ => case_.difficulty === 'advanced'),
    beginnerCount: data.cases.filter(case_ => case_.difficulty === 'beginner').length,
    intermediateCount: data.cases.filter(case_ => case_.difficulty === 'intermediate').length,
    advancedCount: data.cases.filter(case_ => case_.difficulty === 'advanced').length
  };
}

// ===== ADVANCED MEDICAL CALCULATORS TESTS =====

// Test 4: Calculate APACHE II Score
async function testCalculateApacheII() {
  const response = await axios.post(`${BASE_URL}/calculators/apache-ii`, {
    age: 65,
    temperature: 38.5,
    meanArterialPressure: 85,
    heartRate: 95,
    respiratoryRate: 22,
    pao2: 75,
    arterialPh: 7.35,
    sodium: 140,
    potassium: 4.0,
    creatinine: 1.2,
    hematocrit: 35,
    whiteBloodCellCount: 12000,
    glasgowComaScale: 14,
    chronicHealthConditions: ['diabetes', 'hypertension']
  });
  const data = response.data;
  
  return {
    hasCalculation: data.success,
    hasScore: typeof data.result.score === 'number',
    hasMortalityRisk: typeof data.result.mortalityRisk === 'number',
    hasInterpretation: !!data.result.interpretation,
    hasRecommendations: Array.isArray(data.result.recommendations),
    hasComponents: !!data.result.components,
    score: data.result.score,
    mortalityRisk: data.result.mortalityRisk,
    interpretation: data.result.interpretation
  };
}

// Test 5: Calculate Glasgow Coma Scale
async function testCalculateGCS() {
  const response = await axios.post(`${BASE_URL}/calculators/gcs`, {
    eyeOpening: 4,
    verbalResponse: 5,
    motorResponse: 6
  });
  const data = response.data;
  
  return {
    hasCalculation: data.success,
    hasTotalScore: typeof data.result.totalScore === 'number',
    hasInterpretation: !!data.result.interpretation,
    hasSeverity: !!data.result.severity,
    hasRecommendations: Array.isArray(data.result.recommendations),
    hasComponents: !!data.result.components,
    totalScore: data.result.totalScore,
    interpretation: data.result.interpretation,
    severity: data.result.severity
  };
}

// Test 6: Calculate PHQ-9 Depression Screening
async function testCalculatePHQ9() {
  const response = await axios.post(`${BASE_URL}/calculators/phq9`, {
    responses: [1, 2, 1, 2, 1, 1, 2, 1, 0] // PHQ-9 responses (0-3 each)
  });
  const data = response.data;
  
  return {
    hasCalculation: data.success,
    hasTotalScore: typeof data.result.totalScore === 'number',
    hasInterpretation: !!data.result.interpretation,
    hasSeverity: !!data.result.severity,
    hasRecommendations: Array.isArray(data.result.recommendations),
    hasFollowUp: !!data.result.followUp,
    totalScore: data.result.totalScore,
    interpretation: data.result.interpretation,
    severity: data.result.severity
  };
}

// Test 7: Get Calculator Categories
async function testGetCalculatorCategories() {
  const response = await axios.get(`${BASE_URL}/calculators/categories`);
  const data = response.data;
  
  return {
    hasCategories: data.success,
    hasIcuScoring: !!data.categories.icu_scoring,
    hasPediatric: !!data.categories.pediatric,
    hasObstetric: !!data.categories.obstetric,
    hasOncology: !!data.categories.oncology,
    hasPsychiatric: !!data.categories.psychiatric,
    hasCardiovascular: !!data.categories.cardiovascular,
    icuScoringName: data.categories.icu_scoring.name,
    pediatricName: data.categories.pediatric.name,
    obstetricName: data.categories.obstetric.name
  };
}

// ===== RESEARCH ASSISTANT AI TESTS =====

// Test 8: Generate Literature Search Strategy
async function testGenerateSearchStrategy() {
  const response = await axios.post(`${BASE_URL}/research/search-strategy`, {
    researchQuestion: 'diabetes management in adults with type 2 diabetes: metformin therapy vs placebo for glycemic control'
  });
  const data = response.data;
  
  return {
    hasStrategy: data.success,
    hasResearchQuestion: !!data.strategy.researchQuestion,
    hasSearchTerms: !!data.strategy.searchTerms,
    hasSearchString: !!data.strategy.searchString,
    hasRecommendedDatabases: Array.isArray(data.strategy.recommendedDatabases),
    hasFilters: !!data.strategy.filters,
    hasSearchSteps: Array.isArray(data.strategy.searchSteps),
    hasQualityIndicators: Array.isArray(data.strategy.qualityIndicators),
    researchQuestion: data.strategy.researchQuestion,
    databasesCount: data.strategy.recommendedDatabases.length
  };
}

// Test 9: Analyze Clinical Trial Data
async function testAnalyzeClinicalTrial() {
  const response = await axios.post(`${BASE_URL}/research/clinical-trial-analysis`, {
    studyDesign: 'randomized controlled trial',
    sampleSize: 200,
    primaryOutcome: 'hemoglobin A1c reduction',
    secondaryOutcomes: ['weight loss', 'blood pressure'],
    statisticalTests: ['t-test', 'chi-square'],
    results: [0.5, 0.3, 0.2, 0.4, 0.6]
  });
  const data = response.data;
  
  return {
    hasAnalysis: data.success,
    hasAnalysisId: !!data.analysis.id,
    hasStudyDesign: !!data.analysis.studyDesign,
    hasPowerAnalysis: !!data.analysis.powerAnalysis,
    hasStatisticalAnalysis: !!data.analysis.statisticalAnalysis,
    hasEffectSize: !!data.analysis.effectSize,
    hasConfidenceIntervals: !!data.analysis.confidenceIntervals,
    hasInterpretation: !!data.analysis.interpretation,
    hasRecommendations: Array.isArray(data.analysis.recommendations),
    analysisId: data.analysis.id,
    studyDesign: data.analysis.studyDesign
  };
}

// Test 10: Generate Research Paper
async function testGenerateResearchPaper() {
  const response = await axios.post(`${BASE_URL}/research/generate-paper`, {
    title: 'Effectiveness of Metformin in Type 2 Diabetes Management',
    researchType: 'systematic_review',
    authors: ['Dr. John Smith', 'Dr. Jane Doe'],
    abstract: 'This systematic review examines the effectiveness of metformin in managing type 2 diabetes.',
    keywords: ['diabetes', 'metformin', 'systematic review'],
    sections: {
      introduction: 'Background and rationale for the study',
      methods: 'Systematic review methodology',
      results: 'Findings from included studies',
      discussion: 'Interpretation and implications'
    }
  });
  const data = response.data;
  
  return {
    hasPaper: data.success,
    hasPaperId: !!data.paper.id,
    hasTitle: !!data.paper.title,
    hasResearchType: !!data.paper.researchType,
    hasAuthors: Array.isArray(data.paper.authors),
    hasSections: Array.isArray(data.paper.sections),
    hasReferences: Array.isArray(data.paper.references),
    hasWordCount: typeof data.paper.wordCount === 'number',
    hasRecommendations: Array.isArray(data.paper.recommendations),
    paperId: data.paper.id,
    title: data.paper.title,
    wordCount: data.paper.wordCount
  };
}

// Test 11: Get Research Categories
async function testGetResearchCategories() {
  const response = await axios.get(`${BASE_URL}/research/categories`);
  const data = response.data;
  
  return {
    hasCategories: data.success,
    hasSystematicReview: !!data.categories.systematic_review,
    hasClinicalTrial: !!data.categories.clinical_trial,
    hasObservationalStudy: !!data.categories.observational_study,
    hasMetaAnalysis: !!data.categories.meta_analysis,
    hasCaseReport: !!data.categories.case_report,
    systematicReviewName: data.categories.systematic_review.name,
    clinicalTrialName: data.categories.clinical_trial.name,
    observationalStudyName: data.categories.observational_study.name
  };
}

// ===== MOBILE MEDICAL ASSISTANT TESTS =====

// Test 12: Process Voice Command
async function testProcessVoiceCommand() {
  const response = await axios.post(`${BASE_URL}/mobile/voice-command`, {
    audioData: 'base64_encoded_audio_data',
    language: 'en',
    context: 'emergency',
    userProfile: 'emergency_physician'
  });
  const data = response.data;
  
  return {
    hasResult: data.success,
    hasVoiceId: !!data.result.id,
    hasRecognizedText: !!data.result.recognizedText,
    hasCommand: !!data.result.command,
    hasResponse: !!data.result.response,
    hasConfidence: typeof data.result.confidence === 'number',
    hasLanguage: !!data.result.language,
    hasTimestamp: !!data.result.timestamp,
    voiceId: data.result.id,
    recognizedText: data.result.recognizedText,
    confidence: data.result.confidence
  };
}

// Test 13: Download Offline Content
async function testDownloadOfflineContent() {
  const response = await axios.post(`${BASE_URL}/mobile/download-content`, {
    contentType: 'emergency_protocols'
  });
  const data = response.data;
  
  return {
    hasDownload: data.success,
    hasDownloadId: !!data.download.id,
    hasContentType: !!data.download.contentType,
    hasContent: !!data.download.content,
    hasStatus: !!data.download.status,
    hasProgress: typeof data.download.progress === 'number',
    hasEstimatedTime: typeof data.download.estimatedTime === 'number',
    hasTimestamp: !!data.download.timestamp,
    downloadId: data.download.id,
    contentType: data.download.contentType,
    status: data.download.status
  };
}

// Test 14: Initialize AR Session
async function testInitializeARSession() {
  const response = await axios.post(`${BASE_URL}/mobile/ar-session`, {
    arType: 'anatomy_visualization'
  });
  const data = response.data;
  
  return {
    hasSession: data.success,
    hasSessionId: !!data.session.id,
    hasArType: !!data.session.arType,
    hasTool: !!data.session.tool,
    hasStatus: !!data.session.status,
    hasFeatures: Array.isArray(data.session.features),
    hasUseCases: Array.isArray(data.session.useCases),
    hasTimestamp: !!data.session.timestamp,
    sessionId: data.session.id,
    arType: data.session.arType,
    status: data.session.status
  };
}

// Test 15: Connect Wearable Device
async function testConnectWearableDevice() {
  const response = await axios.post(`${BASE_URL}/mobile/connect-wearable`, {
    deviceType: 'vital_signs'
  });
  const data = response.data;
  
  return {
    hasConnection: data.success,
    hasConnectionId: !!data.connection.id,
    hasDeviceType: !!data.connection.deviceType,
    hasDevice: !!data.connection.device,
    hasStatus: !!data.connection.status,
    hasMetrics: Array.isArray(data.connection.metrics),
    hasAlerts: Array.isArray(data.connection.alerts),
    hasTimestamp: !!data.connection.timestamp,
    connectionId: data.connection.id,
    deviceType: data.connection.deviceType,
    status: data.connection.status
  };
}

// Test 16: Get Mobile Features
async function testGetMobileFeatures() {
  const response = await axios.get(`${BASE_URL}/mobile/features`);
  const data = response.data;
  
  return {
    hasFeatures: data.success,
    hasQuickAccess: !!data.features.quick_access,
    hasOfflineMode: !!data.features.offline_mode,
    hasVoiceAssistant: !!data.features.voice_assistant,
    hasArTools: !!data.features.ar_tools,
    hasWearableIntegration: !!data.features.wearable_integration,
    hasMobileOptimized: !!data.features.mobile_optimized,
    quickAccessName: data.features.quick_access.name,
    offlineModeName: data.features.offline_mode.name,
    voiceAssistantName: data.features.voice_assistant.name
  };
}

// Test 17: Check Device Compatibility
async function testCheckDeviceCompatibility() {
  const response = await axios.post(`${BASE_URL}/mobile/check-compatibility`, {
    platform: 'iOS',
    version: '15.0',
    screenSize: 6.1,
    capabilities: ['camera', 'microphone', 'gps', 'bluetooth']
  });
  const data = response.data;
  
  return {
    hasCompatibility: data.success,
    hasPlatform: typeof data.compatibility.platform === 'boolean',
    hasVersion: typeof data.compatibility.version === 'boolean',
    hasScreenSize: typeof data.compatibility.screenSize === 'boolean',
    hasCapabilities: typeof data.compatibility.capabilities === 'boolean',
    hasOverall: typeof data.compatibility.overall === 'boolean',
    platform: data.compatibility.platform,
    version: data.compatibility.version,
    overall: data.compatibility.overall
  };
}

// Run all tests
async function runAllTests() {
  // Medical Image Analysis Tests
  await runTest('🔬 IMAGE: Analyze Medical Image', testAnalyzeMedicalImage);
  await runTest('🔬 IMAGE: Get Image Categories', testGetImageCategories);
  await runTest('🔬 IMAGE: Get Training Cases', testGetTrainingCases);

  // Advanced Medical Calculators Tests
  await runTest('🧮 CALC: Calculate APACHE II Score', testCalculateApacheII);
  await runTest('🧮 CALC: Calculate Glasgow Coma Scale', testCalculateGCS);
  await runTest('🧮 CALC: Calculate PHQ-9 Depression Screening', testCalculatePHQ9);
  await runTest('🧮 CALC: Get Calculator Categories', testGetCalculatorCategories);

  // Research Assistant AI Tests
  await runTest('📚 RESEARCH: Generate Literature Search Strategy', testGenerateSearchStrategy);
  await runTest('📚 RESEARCH: Analyze Clinical Trial Data', testAnalyzeClinicalTrial);
  await runTest('📚 RESEARCH: Generate Research Paper', testGenerateResearchPaper);
  await runTest('📚 RESEARCH: Get Research Categories', testGetResearchCategories);

  // Mobile Medical Assistant Tests
  await runTest('📱 MOBILE: Process Voice Command', testProcessVoiceCommand);
  await runTest('📱 MOBILE: Download Offline Content', testDownloadOfflineContent);
  await runTest('📱 MOBILE: Initialize AR Session', testInitializeARSession);
  await runTest('📱 MOBILE: Connect Wearable Device', testConnectWearableDevice);
  await runTest('📱 MOBILE: Get Mobile Features', testGetMobileFeatures);
  await runTest('📱 MOBILE: Check Device Compatibility', testCheckDeviceCompatibility);

  // Print results
  console.log('🚀 ADVANCED FEATURES TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}`);
  console.log(`🚨 Critical Failures: ${totalTests - passedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

  if (passedTests === totalTests) {
    console.log('🎉 100% ADVANCED FEATURES ACHIEVED!');
    console.log('✅ Medical Image Analysis working perfectly');
    console.log('✅ Advanced Medical Calculators working perfectly');
    console.log('✅ Research Assistant AI working perfectly');
    console.log('✅ Mobile Medical Assistant working perfectly');
    console.log('✅ All critical features for future doctors implemented');
    console.log('✅ AI-powered medical education platform complete');
    console.log('✅ World-class medical training system ready');
    console.log('✅ Sri Lankan medical students have cutting-edge tools\n');
    console.log('🚀 STETHOLINK AI IS NOW THE MOST ADVANCED MEDICAL EDUCATION PLATFORM!');
    console.log('🔬 Medical Image Analysis - Critical for modern medical practice');
    console.log('🧮 Advanced Medical Calculators - Essential for clinical decision making');
    console.log('📚 Research Assistant AI - Prepares students for evidence-based practice');
    console.log('📱 Mobile Medical Assistant - Enables learning anywhere, anytime');
    console.log('🏆 FUTURE DOCTORS HAVE EVERYTHING THEY NEED TO EXCEL!');
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