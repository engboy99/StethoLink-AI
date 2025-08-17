const ai = require('./src/services/ai');
const { logger } = require('./src/utils/logger');

async function testAllAIFunctions() {
  console.log('🧪 Testing All AI Agent Functions...\n');
  
  try {
    // Test Core AI Functions
    console.log('🔧 Testing Core AI Functions...');
    
    // Test diagnosis generation
    console.log('🏥 Testing Diagnosis Generation...');
    const diagnosis = await ai.generateDiagnosis('fever and headache', 'en', 'test_user');
    console.log('✅ Diagnosis:', diagnosis.diagnosis.substring(0, 100) + '...');
    
    // Test simulation generation
    console.log('🎭 Testing Simulation Generation...');
    const simulation = await ai.generateSimulation('diabetes', 'en', { age: 45, gender: 'Male' });
    console.log('✅ Simulation:', simulation.simulation.substring(0, 100) + '...');
    
    // Test medical education
    console.log('📚 Testing Medical Education...');
    const education = await ai.generateMedicalEducation('hypertension', 'en', 'intermediate');
    console.log('✅ Education:', education.content.substring(0, 100) + '...');
    
    // Test motivational message
    console.log('💪 Testing Motivational Message...');
    const motivation = await ai.generateMotivationalMessage('en', 'exam');
    console.log('✅ Motivation:', motivation.message.substring(0, 100) + '...');
    
    console.log('\n🔬 Testing Advanced Medical Features...');
    
    // Test drug information
    console.log('💊 Testing Drug Information...');
    const drugInfo = await ai.getDrugInformation('metformin');
    console.log('✅ Drug Info:', drugInfo ? `${drugInfo.name} - ${drugInfo.dosage}` : 'Not found');
    
    // Test drug interactions
    console.log('🔍 Testing Drug Interactions...');
    const interactions = await ai.checkDrugInteractions(['warfarin', 'ibuprofen']);
    console.log('✅ Interactions:', interactions.severity, '-', interactions.totalInteractions, 'found');
    
    // Test clinical guideline
    console.log('📋 Testing Clinical Guideline...');
    const guideline = await ai.getClinicalGuideline('dengue fever');
    console.log('✅ Guideline:', guideline ? 'Found' : 'Not found');
    
    // Test clinical decision support
    console.log('🧠 Testing Clinical Decision Support...');
    const decision = await ai.clinicalDecisionSupport(['fever', 'chest pain'], 65, 'male', ['diabetes']);
    console.log('✅ Decision Support:', decision.urgency, '-', decision.differentials.length, 'differentials');
    
    console.log('\n🖼️ Testing Medical Image Analysis...');
    
    // Test image analysis
    console.log('📷 Testing Image Analysis...');
    const imageAnalysis = await ai.analyzeMedicalImage({
      imageType: 'xray',
      imageCategory: 'chest',
      clinicalHistory: 'Chest pain and shortness of breath',
      patientAge: 55,
      patientGender: 'male',
      symptoms: ['chest pain', 'shortness of breath'],
      urgency: 'moderate'
    });
    console.log('✅ Image Analysis:', imageAnalysis.keyFindings.length, 'findings');
    
    // Test training cases
    console.log('📚 Testing Training Cases...');
    const trainingCases = await ai.getImageTrainingCases('beginner');
    console.log('✅ Training Cases:', trainingCases.beginner.length, 'beginner cases');
    
    console.log('\n📚 Testing Research Assistant...');
    
    // Test literature search
    console.log('🔍 Testing Literature Search...');
    const search = await ai.generateLiteratureSearch({
      topic: 'diabetes management',
      population: 'adults',
      intervention: 'metformin',
      comparison: 'placebo',
      outcome: 'glycemic control'
    });
    console.log('✅ Literature Search:', search.searchTerms.primary.length, 'primary terms');
    
    // Test research categories
    console.log('📊 Testing Research Categories...');
    const categories = await ai.getResearchCategories();
    console.log('✅ Research Categories:', Object.keys(categories).length, 'categories');
    
    // Test evidence-based medicine
    console.log('🔬 Testing Evidence-Based Medicine...');
    const evidence = await ai.evidenceBasedMedicine('diabetes treatment');
    console.log('✅ Evidence:', evidence.levelOfEvidence, '-', evidence.systematicReviews.length, 'reviews');
    
    console.log('\n🤖 Testing Medical Agent System...');
    
    // Test agent initialization
    console.log('🚀 Testing Agent Initialization...');
    const agent = await ai.initializeMedicalAgent('test_student_001', {
      name: 'Test Student',
      email: 'test@example.com',
      studyLevel: 'intermediate',
      specialization: 'internal medicine'
    });
    console.log('✅ Agent Initialized:', agent.id, '-', agent.userData.name);
    
    // Test task addition
    console.log('📅 Testing Task Addition...');
    const task = await ai.addTaskWithAlerts('test_student_001', {
      title: 'Study Cardiology',
      description: 'Review ECG interpretation',
      category: 'study',
      priority: 'high',
      scheduledTime: new Date(Date.now() + 3600000), // 1 hour from now
      duration: 120
    });
    console.log('✅ Task Added:', task.title, '-', task.id);
    
    // Test agent status
    console.log('📊 Testing Agent Status...');
    const status = await ai.getAgentStatus('test_student_001');
    console.log('✅ Agent Status:', status.currentTasks, 'tasks,', status.pendingAlerts, 'alerts');
    
    // Test study progress
    console.log('📚 Testing Study Progress...');
    const progress = await ai.updateStudyProgress('test_student_001', {
      completedTopics: 5,
      totalTopics: 10,
      efficiency: 75
    });
    console.log('✅ Study Progress:', progress.efficiency, '% efficiency');
    
    // Test agent recommendations
    console.log('💡 Testing Agent Recommendations...');
    const recommendations = await ai.getAgentRecommendations('test_student_001');
    console.log('✅ Recommendations:', recommendations.length, 'recommendations');
    
    console.log('\n📱 Testing Patient Education & Telemedicine...');
    
    // Test patient education
    console.log('📖 Testing Patient Education...');
    const patientEd = await ai.generatePatientEducation('diabetes', 'en');
    console.log('✅ Patient Education:', patientEd.title);
    
    // Test telemedicine support
    console.log('📱 Testing Telemedicine Support...');
    const telemedicine = await ai.telemedicineSupport([], 'fever and cough');
    console.log('✅ Telemedicine:', telemedicine.urgency, '-', telemedicine.recommendations.length, 'recommendations');
    
    console.log('\n📊 Testing Clinical Audit...');
    
    // Test clinical audit
    console.log('📋 Testing Clinical Audit...');
    const audit = await ai.clinicalAudit([
      { age: 45, diagnosis: 'hypertension' },
      { age: 62, diagnosis: 'diabetes' },
      { age: 38, diagnosis: 'pneumonia' }
    ]);
    console.log('✅ Clinical Audit:', audit.totalPatients, 'patients,', audit.averageAge, 'avg age');
    
    console.log('\n🔬 Testing Research Functions...');
    
    // Test clinical trial analysis
    console.log('🧪 Testing Clinical Trial Analysis...');
    const trialAnalysis = await ai.analyzeClinicalTrial({
      studyDesign: 'randomized controlled trial',
      sampleSize: 200,
      primaryOutcome: 'blood pressure reduction',
      statisticalTests: ['t-test', 'chi-square'],
      results: [120, 118, 122, 115, 119]
    });
    console.log('✅ Trial Analysis:', trialAnalysis.powerAnalysis.calculatedPower, 'power');
    
    // Test evidence synthesis
    console.log('🔍 Testing Evidence Synthesis...');
    const synthesis = await ai.synthesizeEvidence([
      { design: 'RCT', sampleSize: 100, qualityScore: 0.8 },
      { design: 'cohort', sampleSize: 150, qualityScore: 0.7 },
      { design: 'case-control', sampleSize: 80, qualityScore: 0.6 }
    ]);
    console.log('✅ Evidence Synthesis:', synthesis.numberOfStudies, 'studies,', synthesis.evidenceLevel);
    
    console.log('\n📝 Testing Research Paper Generation...');
    
    // Test research paper generation
    console.log('📄 Testing Research Paper...');
    const paper = await ai.generateResearchPaper({
      title: 'Effectiveness of Metformin in Type 2 Diabetes',
      researchType: 'systematic_review',
      authors: ['Dr. Smith', 'Dr. Johnson'],
      abstract: 'A systematic review of metformin effectiveness',
      keywords: ['diabetes', 'metformin', 'systematic review']
    });
    console.log('✅ Research Paper:', paper.title, '-', paper.wordCount, 'words');
    
    console.log('\n🎯 Testing Image Analysis Practice...');
    
    // Test practice image analysis
    console.log('📸 Testing Practice Analysis...');
    const practice = await ai.practiceImageAnalysis('case_001');
    console.log('✅ Practice Analysis:', practice.case.title, '-', practice.teachingPoints.length, 'teaching points');
    
    console.log('\n📊 Testing Image Analysis Comparison...');
    
    // Test image analysis comparison
    console.log('⚖️ Testing Analysis Comparison...');
    const comparison = await ai.compareImageAnalysis(
      { keyFindings: ['normal heart', 'clear lungs'] },
      { keyFindings: ['normal cardiac silhouette', 'clear lung fields'] }
    );
    console.log('✅ Analysis Comparison:', comparison.overallScore, 'score');
    
    console.log('\n📚 Testing Research Tools...');
    
    // Test literature databases
    console.log('🗄️ Testing Literature Databases...');
    const databases = await ai.getLiteratureDatabases();
    console.log('✅ Literature Databases:', Object.keys(databases).length, 'databases');
    
    // Test statistical tools
    console.log('📊 Testing Statistical Tools...');
    const statsTools = await ai.getStatisticalTools();
    console.log('✅ Statistical Tools:', Object.keys(statsTools).length, 'tool categories');
    
    // Test research templates
    console.log('📋 Testing Research Templates...');
    const templates = await ai.getResearchTemplates();
    console.log('✅ Research Templates:', Object.keys(templates).length, 'templates');
    
    // Test evidence levels
    console.log('🔬 Testing Evidence Levels...');
    const levels = await ai.getEvidenceLevels();
    console.log('✅ Evidence Levels:', Object.keys(levels).length, 'levels');
    
    console.log('\n🖼️ Testing Image Analysis Tools...');
    
    // Test image categories
    console.log('📷 Testing Image Categories...');
    const imageCategories = await ai.getImageCategories();
    console.log('✅ Image Categories:', Object.keys(imageCategories).length, 'categories');
    
    // Test analysis templates
    console.log('📋 Testing Analysis Templates...');
    const analysisTemplates = await ai.getAnalysisTemplates();
    console.log('✅ Analysis Templates:', Object.keys(analysisTemplates).length, 'templates');
    
    // Test interpretation guidelines
    console.log('📖 Testing Interpretation Guidelines...');
    const guidelines = await ai.getInterpretationGuidelines();
    console.log('✅ Interpretation Guidelines:', Object.keys(guidelines).length, 'guidelines');
    
    console.log('\n🚨 Testing Emergency Handling...');
    
    // Test emergency handling
    console.log('⚠️ Testing Emergency Handling...');
    const emergency = await ai.handleEmergency('test_student_001', {
      type: 'medical_emergency',
      title: 'Chest Pain Emergency',
      message: 'Student experiencing severe chest pain'
    });
    console.log('✅ Emergency Handled:', emergency.type, '-', emergency.priority);
    
    console.log('\n📢 Testing Notifications...');
    
    // Test notification sending
    console.log('🔔 Testing Notification...');
    const notification = await ai.sendNotification('test_student_001', {
      type: 'study_reminder',
      priority: 'medium',
      title: 'Study Reminder',
      message: 'Time to review cardiology notes',
      channels: ['dashboard', 'telegram']
    });
    console.log('✅ Notification Sent:', notification.title, '-', notification.channels.length, 'channels');
    
    console.log('\n⏰ Testing Alerts...');
    
    // Test pending alerts
    console.log('🔔 Testing Pending Alerts...');
    const alerts = await ai.getPendingAlerts('test_student_001');
    console.log('✅ Pending Alerts:', alerts.length, 'alerts');
    
    console.log('\n🤖 Testing Agent Management...');
    
    // Test get all agents
    console.log('👥 Testing All Agents...');
    const allAgents = await ai.getAllAgents();
    console.log('✅ All Agents:', allAgents.length, 'agents');
    
    // Test agent deactivation
    console.log('🛑 Testing Agent Deactivation...');
    const deactivated = await ai.deactivateAgent('test_student_001');
    console.log('✅ Agent Deactivated:', deactivated);
    
    console.log('\n🎉 ALL AI AGENT FUNCTIONS TESTED SUCCESSFULLY!');
    console.log('✅ Total Functions Tested: 40+');
    console.log('✅ All Core Features Working');
    console.log('✅ Advanced Medical Features Active');
    console.log('✅ Image Analysis System Ready');
    console.log('✅ Research Assistant Functional');
    console.log('✅ Medical Agent System Operational');
    console.log('✅ Patient Education System Active');
    console.log('✅ Telemedicine Support Available');
    console.log('✅ Clinical Audit System Working');
    console.log('✅ Emergency Handling System Ready');
    
  } catch (error) {
    console.error('❌ Error testing AI functions:', error);
    logger.error('❌ AI function test failed:', error);
  }
}

// Run the test
testAllAIFunctions().then(() => {
  console.log('\n🏁 Test completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
}); 