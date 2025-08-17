const express = require('express');
const router = express.Router();
const patientSimulationChat = require('../services/patient-simulation-chat');
const { logger } = require('../utils/logger');

// 🎭 PATIENT SIMULATION CHAT API

// Get Available Patient Cases
router.get('/cases', async (req, res) => {
  try {
    logger.info('🎭 Getting available patient cases');
    
    const cases = patientSimulationChat.getAvailableCases();
    
    res.json({
      success: true,
      message: 'Available patient cases retrieved successfully',
      cases,
      total: cases.length
    });
  } catch (error) {
    logger.error('❌ Error getting cases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cases',
      error: error.message
    });
  }
});

// Start Patient Simulation
router.post('/start', async (req, res) => {
  try {
    const { studentId, caseType, doctorType } = req.body;
    
    if (!studentId || !caseType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: studentId, caseType'
      });
    }

    logger.info('🎭 Starting patient simulation', { studentId, caseType, doctorType });
    
    const simulation = patientSimulationChat.startSimulation(studentId, caseType, doctorType);
    
    res.json({
      success: true,
      message: 'Patient simulation started successfully',
      simulation
    });
  } catch (error) {
    logger.error('❌ Error starting simulation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start simulation',
      error: error.message
    });
  }
});

// Ask Question to Patient
router.post('/question', async (req, res) => {
  try {
    const { simulationId, question } = req.body;
    
    if (!simulationId || !question) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: simulationId, question'
      });
    }

    logger.info('🎭 Student asking question', { simulationId, question: question.substring(0, 50) + '...' });
    
    const result = patientSimulationChat.processQuestion(simulationId, question);
    
    res.json({
      success: true,
      message: 'Question processed successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error processing question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process question',
      error: error.message
    });
  }
});

// Submit Diagnosis
router.post('/diagnosis', async (req, res) => {
  try {
    const { simulationId, diagnosis } = req.body;
    
    if (!simulationId || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: simulationId, diagnosis'
      });
    }

    logger.info('🎭 Student submitting diagnosis', { simulationId, diagnosis });
    
    const result = patientSimulationChat.submitDiagnosis(simulationId, diagnosis);
    
    res.json({
      success: true,
      message: 'Diagnosis submitted successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error submitting diagnosis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit diagnosis',
      error: error.message
    });
  }
});

// End Simulation
router.post('/end', async (req, res) => {
  try {
    const { simulationId } = req.body;
    
    if (!simulationId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: simulationId'
      });
    }

    logger.info('🎭 Ending patient simulation', { simulationId });
    
    const result = patientSimulationChat.endSimulation(simulationId);
    
    res.json({
      success: true,
      message: 'Simulation ended successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error ending simulation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end simulation',
      error: error.message
    });
  }
});

// Get Active Simulations
router.get('/active/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    logger.info('🎭 Getting active simulations', { studentId });
    
    const simulations = patientSimulationChat.getActiveSimulations(studentId);
    
    res.json({
      success: true,
      message: 'Active simulations retrieved successfully',
      simulations,
      count: simulations.length
    });
  } catch (error) {
    logger.error('❌ Error getting active simulations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get active simulations',
      error: error.message
    });
  }
});

// Get Simulation Details
router.get('/simulation/:simulationId', async (req, res) => {
  try {
    const { simulationId } = req.params;
    
    logger.info('🎭 Getting simulation details', { simulationId });
    
    const simulation = patientSimulationChat.activeSimulations.get(simulationId);
    
    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: 'Simulation not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Simulation details retrieved successfully',
      simulation: {
        id: simulation.id,
        patient: simulation.patient,
        doctor: simulation.doctor,
        conversation: simulation.conversation,
        questionsAsked: simulation.questionsAsked,
        score: simulation.score,
        status: simulation.status,
        learningObjectives: simulation.learningObjectives
      }
    });
  } catch (error) {
    logger.error('❌ Error getting simulation details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get simulation details',
      error: error.message
    });
  }
});

// Get Help/Instructions
router.get('/help', async (req, res) => {
  try {
    logger.info('🎭 Getting simulation help');
    
    const help = {
      title: 'Patient Simulation Help',
      description: 'Interactive patient simulation for medical students',
      commands: [
        {
          command: '/start [case_type]',
          description: 'Start a new patient simulation',
          examples: ['/start acute_gastroenteritis', '/start chest_pain']
        },
        {
          command: '/question [your_question]',
          description: 'Ask a question to the patient',
          examples: ['/question What brings you to the hospital today?', '/question When did your symptoms start?']
        },
        {
          command: '/diagnosis [your_diagnosis]',
          description: 'Submit your final diagnosis',
          examples: ['/diagnosis Acute Gastroenteritis', '/diagnosis Acute Myocardial Infarction']
        },
        {
          command: '/end',
          description: 'End the current simulation'
        },
        {
          command: '/help',
          description: 'Show this help message'
        }
      ],
      tips: [
        'Start with the chief complaint',
        'Ask about onset, duration, and severity',
        'Explore associated symptoms',
        'Check medical history and medications',
        'Consider social and family history',
        'Be culturally sensitive and respectful'
      ],
      learningObjectives: [
        'History taking skills',
        'Physical examination',
        'Differential diagnosis',
        'Treatment planning',
        'Patient communication'
      ]
    };
    
    res.json({
      success: true,
      message: 'Help information retrieved successfully',
      help
    });
  } catch (error) {
    logger.error('❌ Error getting help:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get help',
      error: error.message
    });
  }
});

module.exports = router; 