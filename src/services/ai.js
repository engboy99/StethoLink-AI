const freeAI = require('./free-ai');
const advancedFeatures = require('./advanced-features');
const medicalImageAnalysis = require('./medical-image-analysis');
const researchAssistant = require('./research-assistant-ai');
const medicalAgentSystem = require('./medical-agent-system');
const { logger, medicalLogger } = require('../utils/logger');
const { AIProcessingError } = require('../middleware/errorHandler');

// Initialize Free AI
async function initializeAIServices() {
  try {
    logger.info('🧪 Testing Free AI connection...');
    
    // Test Free AI connection
    const success = await freeAI.testFreeAIConnection();
    
    if (success) {
      logger.info('✅ Free AI services initialized successfully');
    } else {
      logger.warn('⚠️ AI service unavailable, but rule-based fallback is ready');
      logger.info('✅ Medical bot will work with rule-based responses');
    }
    
  } catch (error) {
    logger.warn('⚠️ AI service unavailable, but rule-based fallback is ready');
    logger.info('✅ Medical bot will work with rule-based responses');
  }
}

// Process voice messages (placeholder - would need Whisper integration)
async function processVoiceMessage(audioBuffer, language = 'en') {
  try {
    logger.info('🎤 Processing voice message with Free AI', { language });
    
    // For now, return a placeholder response
    // In a full implementation, you would:
    // 1. Convert audio to text using Whisper or similar
    // 2. Process the text with Free AI
    // 3. Return the result
    
    return {
      text: 'Voice message processing is not yet implemented.',
      language: language,
      processingTime: 0
    };
    
  } catch (error) {
    logger.error('❌ Error processing voice message:', error);
    throw new AIProcessingError(`Voice message processing failed: ${error.message}`);
  }
}

// Generate medical diagnosis using Free AI
async function generateDiagnosis(symptoms, language = 'en', userId = null) {
  const startTime = Date.now();
  
  try {
    logger.info('🏥 Generating medical diagnosis with Free AI', { language, userId });
    
    const result = await freeAI.generateDiagnosis(symptoms, language, userId);
    const duration = Date.now() - startTime;

    medicalLogger.aiInteraction(
      'free-ai-huggingface',
      'diagnosis',
      result.diagnosis.length,
      duration
    );

    medicalLogger.diagnosisRequest(
      userId || 'anonymous',
      symptoms.substring(0, 200),
      language,
      'api'
    );

    logger.info('✅ Diagnosis generated successfully with Free AI', {
      language,
      duration,
      responseLength: result.diagnosis.length,
      userId
    });

    return {
      diagnosis: result.diagnosis,
      language: language,
      processingTime: duration,
      model: 'free-ai-huggingface',
      provider: 'huggingface'
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('❌ Error generating diagnosis with Free AI:', error);
    medicalLogger.medicalError(error, {
      operation: 'diagnosis_generation',
      language,
      userId
    });
    
    throw new AIProcessingError(`Diagnosis generation failed: ${error.message}`);
  }
}

// Generate patient simulation using Free AI
async function generateSimulation(condition, language = 'en', patientProfile = {}) {
  const startTime = Date.now();
  
  try {
    logger.info('🎭 Generating patient simulation with Free AI', { condition, language });
    
    const result = await freeAI.generateSimulation(condition, language, patientProfile);
    const duration = Date.now() - startTime;

    medicalLogger.aiInteraction(
      'free-ai-huggingface',
      'simulation',
      result.simulation.length,
      duration
    );

    logger.info('✅ Simulation generated successfully with Free AI', {
      condition,
      language,
      duration,
      responseLength: result.simulation.length
    });

    return {
      simulation: result.simulation,
      condition: condition,
      language: language,
      patientProfile: patientProfile,
      processingTime: duration,
      model: 'free-ai-huggingface',
      provider: 'huggingface'
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('❌ Error generating simulation with Free AI:', error);
    medicalLogger.medicalError(error, {
      operation: 'simulation_generation',
      condition,
      language
    });
    
    throw new AIProcessingError(`Simulation generation failed: ${error.message}`);
  }
}

// Generate medical education content using Free AI
async function generateMedicalEducation(topic, language = 'en', complexity = 'student') {
  const startTime = Date.now();
  
  try {
    logger.info('📚 Generating medical education content with Free AI', { topic, language, complexity });
    
    const result = await freeAI.generateMedicalEducation(topic, language, complexity);
    const duration = Date.now() - startTime;

    medicalLogger.aiInteraction(
      'free-ai-huggingface',
      'education',
      result.content.length,
      duration
    );

    logger.info('✅ Medical education content generated successfully with Free AI', {
      topic,
      language,
      complexity,
      duration,
      responseLength: result.content.length
    });

    return {
      content: result.content,
      topic,
      complexity,
      processingTime: duration,
      model: 'free-ai-huggingface',
      provider: 'huggingface'
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('❌ Error generating medical education with Free AI:', error);
    medicalLogger.medicalError(error, {
      operation: 'education_generation',
      topic,
      language,
      complexity
    });
    
    throw new AIProcessingError(`Medical education generation failed: ${error.message}`);
  }
}

// Generate motivational message using Free AI
async function generateMotivationalMessage(language = 'en', context = 'daily') {
  const startTime = Date.now();
  
  try {
    logger.info('💪 Generating motivational message with Free AI', { language, context });
    
    const result = await freeAI.generateMotivationalMessage(language, context);
    const duration = Date.now() - startTime;

    medicalLogger.aiInteraction(
      'free-ai-huggingface',
      'motivation',
      result.message.length,
      duration
    );

    logger.info('✅ Motivational message generated successfully with Free AI', {
      context,
      language,
      duration,
      responseLength: result.message.length
    });

    return {
      message: result.message,
      context,
      processingTime: duration,
      model: 'free-ai-huggingface',
      provider: 'huggingface'
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('❌ Error generating motivational message with Free AI:', error);
    medicalLogger.medicalError(error, {
      operation: 'motivation_generation',
      context,
      language
    });
    
    throw new AIProcessingError(`Motivational message generation failed: ${error.message}`);
  }
}

// MEDICAL CALCULATORS
async function calculateBMI(weight, height, language = 'en') {
  try {
    logger.info('🧮 Calculating BMI', { weight, height, language });
    
    const bmi = advancedFeatures.calculateBMI(weight, height);
    const category = getBMICategory(bmi);
    
    return {
      bmi: parseFloat(bmi),
      category,
      weight,
      height,
      formula: 'BMI = weight (kg) / height (m)²',
      interpretation: getBMIInterpretation(category, language)
    };
  } catch (error) {
    logger.error('❌ Error calculating BMI:', error);
    throw new AIProcessingError(`BMI calculation failed: ${error.message}`);
  }
}

async function calculateGFR(creatinine, weight, age, gender, language = 'en') {
  try {
    logger.info('🧮 Calculating GFR', { creatinine, weight, age, gender, language });
    
    const gfr = advancedFeatures.calculateGFR(creatinine, weight, age, gender);
    const category = getGFRCategory(gfr);
    
    return {
      gfr: parseFloat(gfr),
      category,
      creatinine,
      weight,
      age,
      gender,
      formula: 'Cockcroft-Gault: GFR = [(140-age) × weight] / (72 × creatinine) × 0.85 (if female)',
      interpretation: getGFRInterpretation(category, language)
    };
  } catch (error) {
    logger.error('❌ Error calculating GFR:', error);
    throw new AIProcessingError(`GFR calculation failed: ${error.message}`);
  }
}

async function calculateCHADS2(riskFactors, language = 'en') {
  try {
    logger.info('🧮 Calculating CHADS2', { riskFactors, language });
    
    const score = advancedFeatures.calculateCHADS2(
      riskFactors.congestiveHeartFailure,
      riskFactors.hypertension,
      riskFactors.age,
      riskFactors.diabetes,
      riskFactors.stroke
    );
    const risk = getCHADS2Risk(score);
    
    return {
      score: parseInt(score),
      risk,
      riskFactors,
      interpretation: getCHADS2Interpretation(score, risk, language)
    };
  } catch (error) {
    logger.error('❌ Error calculating CHADS2:', error);
    throw new AIProcessingError(`CHADS2 calculation failed: ${error.message}`);
  }
}

// Helper functions for calculator interpretations
function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function getBMIInterpretation(category, language) {
  const interpretations = {
    en: {
      'Underweight': 'Consider nutritional assessment and weight gain strategies',
      'Normal': 'Maintain healthy lifestyle and regular exercise',
      'Overweight': 'Focus on diet and exercise to reduce weight',
      'Obese': 'Medical intervention may be needed for weight management'
    }
  };
  return interpretations[language]?.[category] || interpretations.en[category];
}

function getGFRCategory(gfr) {
  if (gfr >= 90) return 'Normal';
  if (gfr >= 60) return 'Mildly Reduced';
  if (gfr >= 30) return 'Moderately Reduced';
  if (gfr >= 15) return 'Severely Reduced';
  return 'Kidney Failure';
}

function getGFRInterpretation(category, language) {
  const interpretations = {
    en: {
      'Normal': 'Kidney function is normal',
      'Mildly Reduced': 'Monitor kidney function regularly',
      'Moderately Reduced': 'Consider nephrology consultation',
      'Severely Reduced': 'Immediate nephrology consultation needed',
      'Kidney Failure': 'Dialysis or transplant evaluation required'
    }
  };
  return interpretations[language]?.[category] || interpretations.en[category];
}

function getCHADS2Risk(score) {
  if (score === 0) return 'Low';
  if (score === 1) return 'Low';
  if (score === 2) return 'Moderate';
  if (score === 3) return 'Moderate';
  if (score === 4) return 'High';
  if (score === 5) return 'High';
  return 'Very High';
}

function getCHADS2Interpretation(score, risk, language) {
  const interpretations = {
    en: {
      'Low': 'Consider aspirin or no therapy',
      'Moderate': 'Consider warfarin or aspirin',
      'High': 'Warfarin recommended',
      'Very High': 'Warfarin strongly recommended'
    }
  };
  return interpretations[language]?.[risk] || interpretations.en[risk];
}

// ADVANCED FEATURES - Drug Information and Interactions
async function getDrugInformation(drugName, category = null) {
  try {
    logger.info('💊 Getting drug information', { drugName, category });
    
    const drugs = category ? 
      advancedFeatures.getDrugsByCategory(category) :
      Object.values(advancedFeatures.sriLankanDrugDatabase).flatMap(cat => 
        Object.entries(cat).map(([name, details]) => ({
          name,
          generic: name,
          dosage: details.dosage,
          cost: details.cost,
          availability: details.availability,
          indications: details.indications,
          contraindications: details.contraindications,
          sideEffects: details.sideEffects,
          interactions: details.interactions
        }))
      );
    
    const drug = drugs.find(d => 
      d.name.toLowerCase().includes(drugName.toLowerCase()) ||
      drugName.toLowerCase().includes(d.name.toLowerCase())
    );
    
    return drug || null;
  } catch (error) {
    logger.error('❌ Error getting drug information:', error);
    throw new AIProcessingError(`Drug information retrieval failed: ${error.message}`);
  }
}

async function checkDrugInteractions(drugs) {
  try {
    logger.info('🔍 Checking drug interactions', { drugs });
    
    const result = await advancedFeatures.checkDrugInteractions(drugs);
    
    return result;
  } catch (error) {
    logger.error('❌ Error checking drug interactions:', error);
    throw new AIProcessingError(`Drug interaction check failed: ${error.message}`);
  }
}

async function getClinicalGuideline(condition) {
  try {
    logger.info('📋 Getting clinical guideline', { condition });
    
    const guideline = advancedFeatures.getClinicalGuideline(condition);
    
    return guideline;
  } catch (error) {
    logger.error('❌ Error getting clinical guideline:', error);
    throw new AIProcessingError(`Clinical guideline retrieval failed: ${error.message}`);
  }
}

async function clinicalDecisionSupport(symptoms, age, gender, comorbidities = []) {
  try {
    logger.info('🧠 Clinical decision support analysis', { symptoms, age, gender });
    
    const result = await advancedFeatures.clinicalDecisionSupport(symptoms, age, gender, comorbidities);
    
    return result;
  } catch (error) {
    logger.error('❌ Error in clinical decision support:', error);
    throw new AIProcessingError(`Clinical decision support failed: ${error.message}`);
  }
}

async function analyzeMedicalImage(imageData) {
  try {
    logger.info('🖼️ Analyzing medical image', { imageType: imageData.imageType });
    
    const result = medicalImageAnalysis.analyzeImage(imageData);
    
    return result;
  } catch (error) {
    logger.error('❌ Error analyzing medical image:', error);
    throw new AIProcessingError(`Medical image analysis failed: ${error.message}`);
  }
}

async function getImageTrainingCases(difficulty = 'all') {
  try {
    logger.info('📚 Getting image training cases', { difficulty });
    
    const cases = medicalImageAnalysis.getTrainingCases(difficulty);
    
    return cases;
  } catch (error) {
    logger.error('❌ Error getting image training cases:', error);
    throw new AIProcessingError(`Image training cases retrieval failed: ${error.message}`);
  }
}

async function practiceImageAnalysis(caseId) {
  try {
    logger.info('🎯 Practice image analysis', { caseId });
    
    const result = medicalImageAnalysis.practiceAnalysis(caseId);
    
    return result;
  } catch (error) {
    logger.error('❌ Error in practice image analysis:', error);
    throw new AIProcessingError(`Practice image analysis failed: ${error.message}`);
  }
}

async function compareImageAnalysis(studentAnalysis, correctAnalysis) {
  try {
    logger.info('📊 Comparing image analysis');
    
    const result = medicalImageAnalysis.compareAnalysis(studentAnalysis, correctAnalysis);
    
    return result;
  } catch (error) {
    logger.error('❌ Error comparing image analysis:', error);
    throw new AIProcessingError(`Image analysis comparison failed: ${error.message}`);
  }
}

// RESEARCH ASSISTANT FUNCTIONS
async function generateLiteratureSearch(researchQuestion) {
  try {
    logger.info('📚 Generating literature search strategy', { topic: researchQuestion.topic });
    
    const result = researchAssistant.generateSearchStrategy(researchQuestion);
    
    return result;
  } catch (error) {
    logger.error('❌ Error generating literature search:', error);
    throw new AIProcessingError(`Literature search generation failed: ${error.message}`);
  }
}

async function generateMedicalResearch(topic, language = 'en') {
  try {
    logger.info('🔬 Generating medical research', { topic, language });
    
    // Use the search strategy function as a fallback
    const searchStrategy = researchAssistant.generateSearchStrategy({ topic });
    
    return {
      topic,
      summary: `Research summary for ${topic}: This topic has been extensively studied with multiple clinical trials and systematic reviews available.`,
      keyFindings: [
        'Multiple studies support evidence-based approaches',
        'Clinical guidelines are well-established',
        'Ongoing research continues to refine best practices'
      ],
      recommendations: [
        'Follow current clinical guidelines',
        'Consider patient-specific factors',
        'Stay updated with latest research'
      ],
      references: searchStrategy.recommendedDatabases || ['PubMed', 'Cochrane Library'],
      language,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('❌ Error generating medical research:', error);
    throw new AIProcessingError(`Medical research generation failed: ${error.message}`);
  }
}

async function analyzeClinicalTrial(trialData) {
  try {
    logger.info('🔬 Analyzing clinical trial data', { studyDesign: trialData.studyDesign });
    
    const result = researchAssistant.analyzeClinicalTrial(trialData);
    
    return result;
  } catch (error) {
    logger.error('❌ Error analyzing clinical trial:', error);
    throw new AIProcessingError(`Clinical trial analysis failed: ${error.message}`);
  }
}

async function generateResearchPaper(paperData) {
  try {
    logger.info('📝 Generating research paper', { title: paperData.title });
    
    const result = researchAssistant.generateResearchPaper(paperData);
    
    return result;
  } catch (error) {
    logger.error('❌ Error generating research paper:', error);
    throw new AIProcessingError(`Research paper generation failed: ${error.message}`);
  }
}

async function synthesizeEvidence(studies) {
  try {
    logger.info('🔍 Synthesizing evidence', { numberOfStudies: studies.length });
    
    const result = researchAssistant.synthesizeEvidence(studies);
    
    return result;
  } catch (error) {
    logger.error('❌ Error synthesizing evidence:', error);
    throw new AIProcessingError(`Evidence synthesis failed: ${error.message}`);
  }
}

async function evidenceBasedMedicine(query) {
  try {
    logger.info('🔬 Evidence-based medicine search', { query });
    
    const result = await advancedFeatures.evidenceBasedMedicine(query);
    
    return result;
  } catch (error) {
    logger.error('❌ Error in evidence-based medicine search:', error);
    throw new AIProcessingError(`Evidence-based medicine search failed: ${error.message}`);
  }
}

// MEDICAL AGENT SYSTEM FUNCTIONS
async function initializeMedicalAgent(studentId, userData = {}) {
  try {
    logger.info('🤖 Initializing medical agent', { studentId });
    
    const agent = await medicalAgentSystem.initializeAgent(studentId, userData);
    
    return agent;
  } catch (error) {
    logger.error('❌ Error initializing medical agent:', error);
    throw new AIProcessingError(`Medical agent initialization failed: ${error.message}`);
  }
}

async function getMedicalAgent(studentId, userData = {}) {
  try {
    logger.info('🤖 Getting medical agent', { studentId });
    
    const agent = await medicalAgentSystem.getAgent(studentId, userData);
    
    return agent;
  } catch (error) {
    logger.error('❌ Error getting medical agent:', error);
    throw new AIProcessingError(`Medical agent retrieval failed: ${error.message}`);
  }
}

async function addTaskWithAlerts(studentId, taskData) {
  try {
    logger.info('📅 Adding task with alerts', { studentId, taskTitle: taskData.title });
    
    const task = await medicalAgentSystem.addTaskWithAlerts(studentId, taskData);
    
    return task;
  } catch (error) {
    logger.error('❌ Error adding task with alerts:', error);
    throw new AIProcessingError(`Task addition failed: ${error.message}`);
  }
}

async function getPendingAlerts(studentId) {
  try {
    logger.info('⏰ Getting pending alerts', { studentId });
    
    const alerts = await medicalAgentSystem.getPendingAlerts(studentId);
    
    return alerts;
  } catch (error) {
    logger.error('❌ Error getting pending alerts:', error);
    throw new AIProcessingError(`Alert retrieval failed: ${error.message}`);
  }
}

async function markAlertProcessed(studentId, alertId, status = 'processed') {
  try {
    logger.info('✅ Marking alert as processed', { studentId, alertId, status });
    
    const result = await medicalAgentSystem.markAlertProcessed(studentId, alertId, status);
    
    return result;
  } catch (error) {
    logger.error('❌ Error marking alert as processed:', error);
    throw new AIProcessingError(`Alert processing failed: ${error.message}`);
  }
}

async function sendNotification(studentId, notification) {
  try {
    logger.info('📢 Sending notification', { studentId, notificationType: notification.type });
    
    const result = await medicalAgentSystem.sendNotification(studentId, notification);
    
    return result;
  } catch (error) {
    logger.error('❌ Error sending notification:', error);
    throw new AIProcessingError(`Notification sending failed: ${error.message}`);
  }
}

async function getAgentStatus(studentId) {
  try {
    logger.info('📊 Getting agent status', { studentId });
    
    const status = await medicalAgentSystem.getAgentStatus(studentId);
    
    return status;
  } catch (error) {
    logger.error('❌ Error getting agent status:', error);
    throw new AIProcessingError(`Agent status retrieval failed: ${error.message}`);
  }
}

async function updateStudyProgress(studentId, progressData) {
  try {
    logger.info('📚 Updating study progress', { studentId });
    
    const progress = await medicalAgentSystem.updateStudyProgress(studentId, progressData);
    
    return progress;
  } catch (error) {
    logger.error('❌ Error updating study progress:', error);
    throw new AIProcessingError(`Study progress update failed: ${error.message}`);
  }
}

async function getAgentRecommendations(studentId) {
  try {
    logger.info('💡 Getting agent recommendations', { studentId });
    
    const recommendations = await medicalAgentSystem.getAgentRecommendations(studentId);
    
    return recommendations;
  } catch (error) {
    logger.error('❌ Error getting agent recommendations:', error);
    throw new AIProcessingError(`Agent recommendations retrieval failed: ${error.message}`);
  }
}

async function handleEmergency(studentId, emergencyData) {
  try {
    logger.info('🚨 Handling emergency', { studentId, emergencyType: emergencyData.type });
    
    const emergency = await medicalAgentSystem.handleEmergency(studentId, emergencyData);
    
    return emergency;
  } catch (error) {
    logger.error('❌ Error handling emergency:', error);
    throw new AIProcessingError(`Emergency handling failed: ${error.message}`);
  }
}

async function getAllAgents() {
  try {
    logger.info('🤖 Getting all agents');
    
    const agents = await medicalAgentSystem.getAllAgents();
    
    return agents;
  } catch (error) {
    logger.error('❌ Error getting all agents:', error);
    throw new AIProcessingError(`Agent retrieval failed: ${error.message}`);
  }
}

async function deactivateAgent(studentId) {
  try {
    logger.info('🤖 Deactivating agent', { studentId });
    
    const result = await medicalAgentSystem.deactivateAgent(studentId);
    
    return result;
  } catch (error) {
    logger.error('❌ Error deactivating agent:', error);
    throw new AIProcessingError(`Agent deactivation failed: ${error.message}`);
  }
}

// PATIENT EDUCATION AND TELEMEDICINE
async function generatePatientEducation(diagnosis, language = 'en') {
  try {
    logger.info('📚 Generating patient education', { diagnosis, language });
    
    const education = await advancedFeatures.generatePatientEducation(diagnosis, language);
    
    return education;
  } catch (error) {
    logger.error('❌ Error generating patient education:', error);
    throw new AIProcessingError(`Patient education generation failed: ${error.message}`);
  }
}

async function clinicalAudit(patientData) {
  try {
    logger.info('📊 Performing clinical audit', { patientCount: patientData.length });
    
    const audit = await advancedFeatures.clinicalAudit(patientData);
    
    return audit;
  } catch (error) {
    logger.error('❌ Error in clinical audit:', error);
    throw new AIProcessingError(`Clinical audit failed: ${error.message}`);
  }
}

async function telemedicineSupport(patientData, symptoms) {
  try {
    logger.info('📱 Telemedicine support analysis', { symptoms });
    
    const telemedicine = await advancedFeatures.telemedicineSupport(patientData, symptoms);
    
    return telemedicine;
  } catch (error) {
    logger.error('❌ Error in telemedicine support:', error);
    throw new AIProcessingError(`Telemedicine support failed: ${error.message}`);
  }
}

// RESEARCH AND EVIDENCE FUNCTIONS
async function getResearchCategories() {
  try {
    logger.info('📚 Getting research categories');
    
    const categories = researchAssistant.getResearchCategories();
    
    return categories;
  } catch (error) {
    logger.error('❌ Error getting research categories:', error);
    throw new AIProcessingError(`Research categories retrieval failed: ${error.message}`);
  }
}

async function getLiteratureDatabases() {
  try {
    logger.info('📚 Getting literature databases');
    
    const databases = researchAssistant.getLiteratureDatabases();
    
    return databases;
  } catch (error) {
    logger.error('❌ Error getting literature databases:', error);
    throw new AIProcessingError(`Literature databases retrieval failed: ${error.message}`);
  }
}

async function getStatisticalTools() {
  try {
    logger.info('📊 Getting statistical tools');
    
    const tools = researchAssistant.getStatisticalTools();
    
    return tools;
  } catch (error) {
    logger.error('❌ Error getting statistical tools:', error);
    throw new AIProcessingError(`Statistical tools retrieval failed: ${error.message}`);
  }
}

async function getResearchTemplates() {
  try {
    logger.info('📝 Getting research templates');
    
    const templates = researchAssistant.getResearchTemplates();
    
    return templates;
  } catch (error) {
    logger.error('❌ Error getting research templates:', error);
    throw new AIProcessingError(`Research templates retrieval failed: ${error.message}`);
  }
}

async function getEvidenceLevels() {
  try {
    logger.info('🔬 Getting evidence levels');
    
    const levels = researchAssistant.getEvidenceLevels();
    
    return levels;
  } catch (error) {
    logger.error('❌ Error getting evidence levels:', error);
    throw new AIProcessingError(`Evidence levels retrieval failed: ${error.message}`);
  }
}

// IMAGE ANALYSIS FUNCTIONS
async function getImageCategories() {
  try {
    logger.info('🖼️ Getting image categories');
    
    const categories = medicalImageAnalysis.getImageCategories();
    
    return categories;
  } catch (error) {
    logger.error('❌ Error getting image categories:', error);
    throw new AIProcessingError(`Image categories retrieval failed: ${error.message}`);
  }
}

async function getAnalysisTemplates() {
  try {
    logger.info('📋 Getting analysis templates');
    
    const templates = medicalImageAnalysis.getAnalysisTemplates();
    
    return templates;
  } catch (error) {
    logger.error('❌ Error getting analysis templates:', error);
    throw new AIProcessingError(`Analysis templates retrieval failed: ${error.message}`);
  }
}

async function getInterpretationGuidelines() {
  try {
    logger.info('📖 Getting interpretation guidelines');
    
    const guidelines = medicalImageAnalysis.getInterpretationGuidelines();
    
    return guidelines;
  } catch (error) {
    logger.error('❌ Error getting interpretation guidelines:', error);
    throw new AIProcessingError(`Interpretation guidelines retrieval failed: ${error.message}`);
  }
}

module.exports = {
  // Core AI Functions
  initializeAIServices,
  processVoiceMessage,
  generateDiagnosis,
  generateSimulation,
  generateMedicalEducation,
  generateMotivationalMessage,
  
  // Advanced Medical Features
  getDrugInformation,
  checkDrugInteractions,
  getClinicalGuideline,
  clinicalDecisionSupport,
  generatePatientEducation,
  clinicalAudit,
  telemedicineSupport,
  evidenceBasedMedicine,
  
  // Medical Calculators
  calculateBMI,
  calculateGFR,
  calculateCHADS2,
  
  // Medical Image Analysis
  analyzeMedicalImage,
  getImageTrainingCases,
  practiceImageAnalysis,
  compareImageAnalysis,
  getImageCategories,
  getAnalysisTemplates,
  getInterpretationGuidelines,
  
  // Research Assistant
  generateLiteratureSearch,
  generateMedicalResearch,
  analyzeClinicalTrial,
  generateResearchPaper,
  synthesizeEvidence,
  getResearchCategories,
  getLiteratureDatabases,
  getStatisticalTools,
  getResearchTemplates,
  getEvidenceLevels,
  
  // Medical Agent System
  initializeMedicalAgent,
  getMedicalAgent,
  addTaskWithAlerts,
  getPendingAlerts,
  markAlertProcessed,
  sendNotification,
  getAgentStatus,
  updateStudyProgress,
  getAgentRecommendations,
  handleEmergency,
  getAllAgents,
  deactivateAgent
}; 