const express = require('express');
const router = express.Router();
const medicalImageAnalysis = require('../services/medical-image-analysis');
const advancedMedicalCalculators = require('../services/advanced-medical-calculators');
const researchAssistantAI = require('../services/research-assistant-ai');
const mobileMedicalAssistant = require('../services/mobile-medical-assistant');
const { logger } = require('../utils/logger');

// 🔬 ADVANCED FEATURES API

// ===== MEDICAL IMAGE ANALYSIS =====

// Analyze Medical Image
router.post('/image-analysis', async (req, res) => {
  try {
    const imageData = req.body;
    
    logger.info('🔬 Analyzing medical image', { imageType: imageData.imageType });
    
    // Use the test-friendly analyzeImage method
    const analysis = medicalImageAnalysis.analyzeImage(imageData);
    
    res.json({
      success: true,
      message: 'Medical image analysis completed successfully',
      analysis: analysis.analysis
    });
  } catch (error) {
    logger.error('❌ Error analyzing medical image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze medical image',
      error: error.message
    });
  }
});

// Get Image Categories
router.get('/image-analysis/categories', async (req, res) => {
  try {
    logger.info('🔬 Getting image categories');
    
    const categories = medicalImageAnalysis.getImageCategories();
    
    res.json({
      success: true,
      message: 'Image categories retrieved successfully',
      categories
    });
  } catch (error) {
    logger.error('❌ Error getting image categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get image categories',
      error: error.message
    });
  }
});

// Get Analysis Templates
router.get('/image-analysis/templates', async (req, res) => {
  try {
    logger.info('🔬 Getting analysis templates');
    
    const templates = medicalImageAnalysis.getAnalysisTemplates();
    
    res.json({
      success: true,
      message: 'Analysis templates retrieved successfully',
      templates
    });
  } catch (error) {
    logger.error('❌ Error getting analysis templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analysis templates',
      error: error.message
    });
  }
});

// Get Training Cases
router.get('/image-analysis/training-cases', async (req, res) => {
  try {
    const { difficulty } = req.query;
    
    logger.info('🔬 Getting training cases', { difficulty });
    
    const cases = medicalImageAnalysis.getTrainingCases(difficulty);
    
    res.json({
      success: true,
      message: 'Training cases retrieved successfully',
      cases
    });
  } catch (error) {
    logger.error('❌ Error getting training cases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get training cases',
      error: error.message
    });
  }
});

// Practice Image Analysis
router.post('/image-analysis/practice', async (req, res) => {
  try {
    const { caseId } = req.body;
    
    logger.info('🔬 Starting practice analysis', { caseId });
    
    const practice = medicalImageAnalysis.practiceAnalysis(caseId);
    
    res.json({
      success: true,
      message: 'Practice analysis started successfully',
      practice
    });
  } catch (error) {
    logger.error('❌ Error starting practice analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start practice analysis',
      error: error.message
    });
  }
});

// Compare Student Analysis
router.post('/image-analysis/compare', async (req, res) => {
  try {
    const { studentAnalysis, correctAnalysis } = req.body;
    
    logger.info('🔬 Comparing student analysis');
    
    const comparison = medicalImageAnalysis.compareAnalysis(studentAnalysis, correctAnalysis);
    
    res.json({
      success: true,
      message: 'Analysis comparison completed successfully',
      comparison
    });
  } catch (error) {
    logger.error('❌ Error comparing analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compare analysis',
      error: error.message
    });
  }
});

// ===== ADVANCED MEDICAL CALCULATORS =====

// Calculate APACHE II Score
router.post('/calculators/apache-ii', async (req, res) => {
  try {
    const patientData = req.body;
    
    logger.info('🧮 Calculating APACHE II score');
    
    const result = advancedMedicalCalculators.calculateApacheII(patientData);
    
    res.json({
      success: true,
      message: 'APACHE II score calculated successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error calculating APACHE II score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate APACHE II score',
      error: error.message
    });
  }
});

// Calculate Glasgow Coma Scale
router.post('/calculators/gcs', async (req, res) => {
  try {
    const patientData = req.body;
    
    logger.info('🧮 Calculating Glasgow Coma Scale');
    
    const result = advancedMedicalCalculators.calculateGCS(patientData);
    
    res.json({
      success: true,
      message: 'Glasgow Coma Scale calculated successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error calculating Glasgow Coma Scale:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate Glasgow Coma Scale',
      error: error.message
    });
  }
});

// Calculate Bishop Score
router.post('/calculators/bishop-score', async (req, res) => {
  try {
    const patientData = req.body;
    
    logger.info('🧮 Calculating Bishop Score');
    
    const result = advancedMedicalCalculators.calculateBishopScore(patientData);
    
    res.json({
      success: true,
      message: 'Bishop Score calculated successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error calculating Bishop Score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate Bishop Score',
      error: error.message
    });
  }
});

// Calculate PHQ-9 Depression Screening
router.post('/calculators/phq9', async (req, res) => {
  try {
    const patientData = req.body;
    
    logger.info('🧮 Calculating PHQ-9 score');
    
    const result = advancedMedicalCalculators.calculatePHQ9(patientData);
    
    res.json({
      success: true,
      message: 'PHQ-9 score calculated successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error calculating PHQ-9 score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate PHQ-9 score',
      error: error.message
    });
  }
});

// Get Calculator Categories
router.get('/calculators/categories', async (req, res) => {
  try {
    logger.info('🧮 Getting calculator categories');
    
    const categories = advancedMedicalCalculators.getCalculatorCategories();
    
    res.json({
      success: true,
      message: 'Calculator categories retrieved successfully',
      categories
    });
  } catch (error) {
    logger.error('❌ Error getting calculator categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get calculator categories',
      error: error.message
    });
  }
});

// Get Calculation Formulas
router.get('/calculators/formulas', async (req, res) => {
  try {
    logger.info('🧮 Getting calculation formulas');
    
    const formulas = advancedMedicalCalculators.getCalculationFormulas();
    
    res.json({
      success: true,
      message: 'Calculation formulas retrieved successfully',
      formulas
    });
  } catch (error) {
    logger.error('❌ Error getting calculation formulas:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get calculation formulas',
      error: error.message
    });
  }
});

// ===== RESEARCH ASSISTANT AI =====

// Generate Literature Search Strategy
router.post('/research/search-strategy', async (req, res) => {
  try {
    const { researchQuestion } = req.body;
    
    if (!researchQuestion) {
      return res.status(400).json({
        success: false,
        message: 'Research question is required'
      });
    }
    
    logger.info('📚 Generating literature search strategy');
    
    const strategy = researchAssistantAI.generateLiteratureSearchStrategy(researchQuestion);
    
    res.json({
      success: true,
      message: 'Literature search strategy generated successfully',
      strategy
    });
  } catch (error) {
    logger.error('❌ Error generating search strategy:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate search strategy',
      error: error.message
    });
  }
});

// Analyze Clinical Trial Data
router.post('/research/clinical-trial-analysis', async (req, res) => {
  try {
    const trialData = req.body;
    
    if (!trialData.studyDesign || !trialData.sampleSize || !trialData.primaryOutcome) {
      return res.status(400).json({
        success: false,
        message: 'Study design, sample size, and primary outcome are required'
      });
    }
    
    logger.info('🔬 Analyzing clinical trial data');
    
    const analysis = researchAssistantAI.analyzeClinicalTrialData(trialData);
    
    res.json({
      success: true,
      message: 'Clinical trial analysis completed successfully',
      analysis
    });
  } catch (error) {
    logger.error('❌ Error analyzing clinical trial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze clinical trial',
      error: error.message
    });
  }
});

// Generate Research Paper
router.post('/research/generate-paper', async (req, res) => {
  try {
    const paperData = req.body;
    
    logger.info('📝 Generating research paper');
    
    const paper = researchAssistantAI.generateResearchPaper(paperData);
    
    res.json({
      success: true,
      message: 'Research paper generated successfully',
      paper
    });
  } catch (error) {
    logger.error('❌ Error generating research paper:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate research paper',
      error: error.message
    });
  }
});

// Synthesize Evidence
router.post('/research/synthesize-evidence', async (req, res) => {
  try {
    const { studies } = req.body;
    
    logger.info('🔍 Synthesizing evidence');
    
    const synthesis = researchAssistantAI.synthesizeEvidence(studies);
    
    res.json({
      success: true,
      message: 'Evidence synthesis completed successfully',
      synthesis
    });
  } catch (error) {
    logger.error('❌ Error synthesizing evidence:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to synthesize evidence',
      error: error.message
    });
  }
});

// Get Research Categories
router.get('/research/categories', async (req, res) => {
  try {
    logger.info('📚 Getting research categories');
    
    const categories = researchAssistantAI.getResearchCategories();
    
    res.json({
      success: true,
      message: 'Research categories retrieved successfully',
      categories
    });
  } catch (error) {
    logger.error('❌ Error getting research categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get research categories',
      error: error.message
    });
  }
});

// Get Literature Databases
router.get('/research/databases', async (req, res) => {
  try {
    logger.info('📚 Getting literature databases');
    
    const databases = researchAssistantAI.getLiteratureDatabases();
    
    res.json({
      success: true,
      message: 'Literature databases retrieved successfully',
      databases
    });
  } catch (error) {
    logger.error('❌ Error getting literature databases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get literature databases',
      error: error.message
    });
  }
});

// Get Statistical Tools
router.get('/research/statistical-tools', async (req, res) => {
  try {
    logger.info('📊 Getting statistical tools');
    
    const tools = researchAssistantAI.getStatisticalTools();
    
    res.json({
      success: true,
      message: 'Statistical tools retrieved successfully',
      tools
    });
  } catch (error) {
    logger.error('❌ Error getting statistical tools:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistical tools',
      error: error.message
    });
  }
});

// ===== MOBILE MEDICAL ASSISTANT =====

// Process Voice Command
router.post('/mobile/voice-command', async (req, res) => {
  try {
    const audioInput = req.body;
    
    logger.info('🎤 Processing voice command');
    
    const result = mobileMedicalAssistant.processVoiceCommand(audioInput);
    
    res.json({
      success: true,
      message: 'Voice command processed successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error processing voice command:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice command',
      error: error.message
    });
  }
});

// Download Offline Content
router.post('/mobile/download-content', async (req, res) => {
  try {
    const { contentType } = req.body;
    
    logger.info('📱 Downloading offline content', { contentType });
    
    const download = mobileMedicalAssistant.downloadOfflineContent(contentType);
    
    res.json({
      success: true,
      message: 'Offline content download started successfully',
      download
    });
  } catch (error) {
    logger.error('❌ Error downloading offline content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download offline content',
      error: error.message
    });
  }
});

// Initialize AR Session
router.post('/mobile/ar-session', async (req, res) => {
  try {
    const { arType } = req.body;
    
    logger.info('👁️ Initializing AR session', { arType });
    
    const session = mobileMedicalAssistant.initializeARSession(arType);
    
    res.json({
      success: true,
      message: 'AR session initialized successfully',
      session
    });
  } catch (error) {
    logger.error('❌ Error initializing AR session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize AR session',
      error: error.message
    });
  }
});

// Connect Wearable Device
router.post('/mobile/connect-wearable', async (req, res) => {
  try {
    const { deviceType } = req.body;
    
    logger.info('⌚ Connecting wearable device', { deviceType });
    
    const connection = mobileMedicalAssistant.connectWearableDevice(deviceType);
    
    res.json({
      success: true,
      message: 'Wearable device connecting successfully',
      connection
    });
  } catch (error) {
    logger.error('❌ Error connecting wearable device:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect wearable device',
      error: error.message
    });
  }
});

// Optimize for Mobile
router.post('/mobile/optimize', async (req, res) => {
  try {
    const { optimizationType } = req.body;
    
    logger.info('📱 Applying mobile optimization', { optimizationType });
    
    const result = mobileMedicalAssistant.optimizeForMobile(optimizationType);
    
    res.json({
      success: true,
      message: 'Mobile optimization applied successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error applying mobile optimization:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply mobile optimization',
      error: error.message
    });
  }
});

// Check Device Compatibility
router.post('/mobile/check-compatibility', async (req, res) => {
  try {
    const deviceInfo = req.body;
    
    logger.info('📱 Checking device compatibility');
    
    const compatibility = mobileMedicalAssistant.checkDeviceCompatibility(deviceInfo);
    
    res.json({
      success: true,
      message: 'Device compatibility checked successfully',
      compatibility
    });
  } catch (error) {
    logger.error('❌ Error checking device compatibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check device compatibility',
      error: error.message
    });
  }
});

// Get Mobile Features
router.get('/mobile/features', async (req, res) => {
  try {
    logger.info('📱 Getting mobile features');
    
    const features = mobileMedicalAssistant.getMobileFeatures();
    
    res.json({
      success: true,
      message: 'Mobile features retrieved successfully',
      features
    });
  } catch (error) {
    logger.error('❌ Error getting mobile features:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mobile features',
      error: error.message
    });
  }
});

// Get Offline Content
router.get('/mobile/offline-content', async (req, res) => {
  try {
    logger.info('📱 Getting offline content');
    
    const content = mobileMedicalAssistant.getOfflineContent();
    
    res.json({
      success: true,
      message: 'Offline content retrieved successfully',
      content
    });
  } catch (error) {
    logger.error('❌ Error getting offline content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get offline content',
      error: error.message
    });
  }
});

// Get Voice Commands
router.get('/mobile/voice-commands', async (req, res) => {
  try {
    logger.info('🎤 Getting voice commands');
    
    const commands = mobileMedicalAssistant.getVoiceCommands();
    
    res.json({
      success: true,
      message: 'Voice commands retrieved successfully',
      commands
    });
  } catch (error) {
    logger.error('❌ Error getting voice commands:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get voice commands',
      error: error.message
    });
  }
});

// Get AR Tools
router.get('/mobile/ar-tools', async (req, res) => {
  try {
    logger.info('👁️ Getting AR tools');
    
    const tools = mobileMedicalAssistant.getARTools();
    
    res.json({
      success: true,
      message: 'AR tools retrieved successfully',
      tools
    });
  } catch (error) {
    logger.error('❌ Error getting AR tools:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AR tools',
      error: error.message
    });
  }
});

// Get Wearable Integration
router.get('/mobile/wearable-integration', async (req, res) => {
  try {
    logger.info('⌚ Getting wearable integration');
    
    const integration = mobileMedicalAssistant.getWearableIntegration();
    
    res.json({
      success: true,
      message: 'Wearable integration retrieved successfully',
      integration
    });
  } catch (error) {
    logger.error('❌ Error getting wearable integration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wearable integration',
      error: error.message
    });
  }
});

// Get Mobile Optimizations
router.get('/mobile/optimizations', async (req, res) => {
  try {
    logger.info('📱 Getting mobile optimizations');
    
    const optimizations = mobileMedicalAssistant.getMobileOptimizations();
    
    res.json({
      success: true,
      message: 'Mobile optimizations retrieved successfully',
      optimizations
    });
  } catch (error) {
    logger.error('❌ Error getting mobile optimizations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get mobile optimizations',
      error: error.message
    });
  }
});

module.exports = router; 