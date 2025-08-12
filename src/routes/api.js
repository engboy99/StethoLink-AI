const express = require('express');
const { generateDiagnosis, generateSimulation, generateMedicalEducation, generateMotivationalMessage } = require('../services/ai');
const { saveCase, getCases, saveConversation, logAnalytics } = require('../config/firebase');
const { asyncHandler, requireAuth, validateRequest } = require('../middleware/errorHandler');
const { logger, medicalLogger } = require('../utils/logger');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const diagnosisSchema = Joi.object({
  symptoms: Joi.string().min(3).max(1000).required(),
  language: Joi.string().valid('en', 'si', 'ta').default('en'),
  userId: Joi.string().optional()
});

const simulationSchema = Joi.object({
  condition: Joi.string().min(2).max(100).required(),
  language: Joi.string().valid('en', 'si', 'ta').default('en'),
  patientProfile: Joi.object({
    age: Joi.number().integer().min(1).max(120).default(35),
    gender: Joi.string().valid('Male', 'Female').default('Male'),
    occupation: Joi.string().max(100).default('Farmer'),
    location: Joi.string().max(100).default('Rural Sri Lanka')
  }).default({})
});

const educationSchema = Joi.object({
  topic: Joi.string().min(2).max(200).required(),
  language: Joi.string().valid('en', 'si', 'ta').default('en'),
  complexity: Joi.string().valid('student', 'patient', 'professional', 'intermediate').default('student')
});

// API Documentation
router.get('/docs', (req, res) => {
  res.json({
    title: 'StethoLink AI API Documentation',
    version: '1.0.0',
    description: 'Cross-platform multilingual medical diagnostic chatbot API',
    endpoints: {
      diagnosis: {
        path: '/api/diagnosis',
        method: 'POST',
        description: 'Generate medical diagnosis from symptoms',
        body: {
          symptoms: 'string (required)',
          language: 'string (en|si|ta)',
          userId: 'string (optional)'
        }
      },
      simulation: {
        path: '/api/simulation',
        method: 'POST',
        description: 'Generate patient simulation',
        body: {
          condition: 'string (required)',
          language: 'string (en|si|ta)',
          patientProfile: 'object (optional)'
        }
      },
      education: {
        path: '/api/education',
        method: 'POST',
        description: 'Generate medical education content',
        body: {
          topic: 'string (required)',
          language: 'string (en|si|ta)',
          complexity: 'string (student|patient|professional)'
        }
      },
      motivation: {
        path: '/api/motivation',
        method: 'GET',
        description: 'Get motivational message',
        query: {
          language: 'string (en|si|ta)',
          context: 'string (daily|exam|burnout|success)'
        }
      },
      cases: {
        path: '/api/cases',
        method: 'GET',
        description: 'Get user cases (requires authentication)',
        query: {
          limit: 'number (optional)',
          userId: 'string (required)'
        }
      },
      analytics: {
        path: '/api/analytics',
        method: 'POST',
        description: 'Log analytics event',
        body: {
          event: 'string (required)',
          userId: 'string (optional)',
          data: 'object (optional)'
        }
      }
    }
  });
});

// Generate medical diagnosis
router.post('/diagnosis', validateRequest(diagnosisSchema), asyncHandler(async (req, res) => {
  try {
    const { symptoms, language, userId } = req.body;
    
    logger.info('🏥 API diagnosis request', {
      language,
      userId: userId || 'anonymous',
      symptomsLength: symptoms.length
    });

    const diagnosis = await generateDiagnosis(symptoms, language, userId);
    
    // Save case if userId is provided
    if (userId) {
      await saveCase({
        userId,
        platform: 'api',
        symptoms,
        diagnosis: diagnosis.diagnosis,
        language,
        source: 'api',
        processingTime: diagnosis.processingTime
      });
    }

    // Log analytics
    await logAnalytics({
      event: 'api_diagnosis_request',
      userId: userId || 'anonymous',
      language,
      platform: 'api',
      processingTime: diagnosis.processingTime
    });

    res.json({
      success: true,
      data: diagnosis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in diagnosis API:', error);
    medicalLogger.medicalError(error, {
      operation: 'api_diagnosis',
      endpoint: '/api/diagnosis'
    });
    
    res.status(500).json({
      success: false,
      error: 'Diagnosis generation failed',
      message: error.message
    });
  }
}));

// Generate patient simulation
router.post('/simulation', validateRequest(simulationSchema), asyncHandler(async (req, res) => {
  try {
    const { condition, language, patientProfile } = req.body;
    
    logger.info('🎭 API simulation request', {
      condition,
      language,
      patientProfile
    });

    const simulation = await generateSimulation(condition, language, patientProfile);

    // Log analytics
    await logAnalytics({
      event: 'api_simulation_request',
      condition,
      language,
      platform: 'api',
      processingTime: simulation.processingTime
    });

    res.json({
      success: true,
      data: simulation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in simulation API:', error);
    medicalLogger.medicalError(error, {
      operation: 'api_simulation',
      endpoint: '/api/simulation'
    });
    
    res.status(500).json({
      success: false,
      error: 'Simulation generation failed',
      message: error.message
    });
  }
}));

// Generate medical education content
router.post('/education', validateRequest(educationSchema), asyncHandler(async (req, res) => {
  try {
    const { topic, language, complexity } = req.body;
    
    logger.info('📚 API education request', {
      topic,
      language,
      complexity
    });

    const education = await generateMedicalEducation(topic, language, complexity);

    // Log analytics
    await logAnalytics({
      event: 'api_education_request',
      topic,
      language,
      complexity,
      platform: 'api',
      processingTime: education.processingTime
    });

    res.json({
      success: true,
      data: education,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in education API:', error);
    medicalLogger.medicalError(error, {
      operation: 'api_education',
      endpoint: '/api/education'
    });
    
    res.status(500).json({
      success: false,
      error: 'Education content generation failed',
      message: error.message
    });
  }
}));

// Get motivational message
router.get('/motivation', asyncHandler(async (req, res) => {
  try {
    const { language = 'en', context = 'daily' } = req.query;
    
    logger.info('🎓 API motivation request', {
      language,
      context
    });

    const motivation = await generateMotivationalMessage(language, context);

    // Log analytics
    await logAnalytics({
      event: 'api_motivation_request',
      language,
      context,
      platform: 'api',
      processingTime: motivation.processingTime
    });

    res.json({
      success: true,
      data: motivation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in motivation API:', error);
    medicalLogger.medicalError(error, {
      operation: 'api_motivation',
      endpoint: '/api/motivation'
    });
    
    res.status(500).json({
      success: false,
      error: 'Motivational message generation failed',
      message: error.message
    });
  }
}));

// Get user cases (requires authentication)
router.get('/cases', requireAuth, asyncHandler(async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.user.id; // From authentication middleware
    
    logger.info('📋 API cases request', {
      userId,
      limit
    });

    const cases = await getCases(userId, parseInt(limit));

    // Log analytics
    await logAnalytics({
      event: 'api_cases_request',
      userId,
      limit: parseInt(limit),
      platform: 'api'
    });

    res.json({
      success: true,
      data: {
        cases,
        count: cases.length,
        userId
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in cases API:', error);
    medicalLogger.medicalError(error, {
      operation: 'api_cases',
      endpoint: '/api/cases'
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cases',
      message: error.message
    });
  }
}));

// Log analytics event
router.post('/analytics', asyncHandler(async (req, res) => {
  try {
    const { event, userId, data } = req.body;
    
    if (!event) {
      return res.status(400).json({
        success: false,
        error: 'Event is required'
      });
    }

    logger.info('📊 API analytics event', {
      event,
      userId: userId || 'anonymous',
      data
    });

    await logAnalytics({
      event,
      userId: userId || 'anonymous',
      data,
      platform: 'api',
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Analytics event logged successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in analytics API:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to log analytics event',
      message: error.message
    });
  }
}));

// Chat endpoint for web interface
router.post('/general-chat', async (req, res) => {
  try {
    const { message, userId, context } = req.body;
    
    logger.info('💬 API general chat request', {
      message: message.substring(0, 100) + '...',
      userId: userId || 'anonymous',
      context
    });

    // Process message based on context
    let response;
    
    switch (context) {
      case 'study-plans':
        response = await generateMedicalEducation('Study plans and curriculum', 'en', 'student');
        break;
      case 'medical-calculators':
        response = await generateMedicalEducation('Medical calculators and formulas', 'en', 'student');
        break;
      case 'drug-info':
        response = await generateMedicalEducation('Drug information and pharmacology', 'en', 'student');
        break;
      case 'clinical-guidelines':
        response = await generateMedicalEducation('Clinical guidelines and protocols', 'en', 'student');
        break;
      case 'patient-simulation':
        response = await generateSimulation('General patient case', 'en', { age: 25, gender: 'Male' });
        break;
      case 'image-analysis':
        response = await generateMedicalEducation('Medical image analysis and interpretation', 'en', 'student');
        break;
      default:
        // Generate a general medical response
        response = await generateMedicalEducation(message, 'en', 'student');
    }

    // Log analytics
    await logAnalytics({
      event: 'api_general_chat_request',
      userId: userId || 'anonymous',
      context,
      platform: 'web',
      processingTime: response.processingTime || 0
    });

    res.json({
      success: true,
      response: response.message || response.diagnosis || response.content || 'I understand your question. Let me help you with that.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in general chat API:', error);
    medicalLogger.medicalError(error, {
      operation: 'api_general_chat',
      endpoint: '/api/general-chat'
    });
    
    res.status(500).json({
      success: false,
      error: 'Chat processing failed',
      message: error.message
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'StethoLink AI API',
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get system status
router.get('/status', asyncHandler(async (req, res) => {
  try {
    const status = {
      service: 'StethoLink AI API',
      status: 'operational',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      features: {
        diagnosis: 'available',
        simulation: 'available',
        education: 'available',
        motivation: 'available',
        voiceProcessing: 'available',
        multilingual: 'available'
      },
      languages: ['en', 'si', 'ta'],
      platforms: ['whatsapp', 'telegram', 'api']
    };

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    logger.error('❌ Error in status API:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get system status',
      message: error.message
    });
  }
}));

// Test endpoint
router.post('/test', asyncHandler(async (req, res) => {
  try {
    const { testType = 'basic' } = req.body;
    
    logger.info('🧪 API test request', { testType });

    let testResult;

    switch (testType) {
      case 'diagnosis':
        testResult = await generateDiagnosis('fever and headache', 'en', 'test-user');
        break;
      case 'simulation':
        testResult = await generateSimulation('Dengue fever', 'en', { age: 25, gender: 'Male' });
        break;
      case 'education':
        testResult = await generateMedicalEducation('Dengue fever', 'en', 'student');
        break;
      case 'motivation':
        testResult = await generateMotivationalMessage('en', 'daily');
        break;
      default:
        testResult = { message: 'Test completed successfully', testType };
    }

    // Log analytics
    await logAnalytics({
      event: 'api_test_request',
      testType,
      platform: 'api'
    });

    res.json({
      success: true,
      data: testResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('❌ Error in test API:', error);
    medicalLogger.medicalError(error, {
      operation: 'api_test',
      endpoint: '/api/test'
    });
    
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message
    });
  }
}));

module.exports = router; 