const express = require('express');
const router = express.Router();
const realWorldSimulation = require('../services/real-world-medical-simulation');
const { logger } = require('../utils/logger');

// 🏥 REAL-WORLD MEDICAL SIMULATION API

// Get Available Scenarios
router.get('/scenarios', async (req, res) => {
  try {
    logger.info('🏥 Getting available real-world scenarios');
    
    const scenarios = realWorldSimulation.getAvailableScenarios();
    
    res.json({
      success: true,
      message: 'Real-world scenarios retrieved successfully',
      scenarios,
      totalDepartments: Object.keys(scenarios).length,
      totalPatients: Object.values(scenarios).reduce((sum, dept) => sum + dept.length, 0)
    });
  } catch (error) {
    logger.error('❌ Error getting scenarios:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get scenarios',
      error: error.message
    });
  }
});

// Start Real-World Simulation
router.post('/start', async (req, res) => {
  try {
    const { studentId, scenarioType, patientId } = req.body;
    
    if (!studentId || !scenarioType || !patientId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: studentId, scenarioType, patientId'
      });
    }

    logger.info('🏥 Starting real-world simulation', { studentId, scenarioType, patientId });
    
    const simulation = realWorldSimulation.startSimulation(studentId, scenarioType, patientId);
    
    res.json({
      success: true,
      message: 'Real-world simulation started successfully',
      simulation: {
        id: simulation.id,
        patient: simulation.patient,
        presentation: simulation.presentation,
        vitalSigns: simulation.vitalSigns,
        examination: simulation.examination,
        timeLimit: simulation.timeLimit,
        difficulty: simulation.difficulty,
        learningObjectives: simulation.learningObjectives
      }
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

// Take Action in Simulation
router.post('/action', async (req, res) => {
  try {
    const { simulationId, action, details } = req.body;
    
    if (!simulationId || !action) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: simulationId, action'
      });
    }

    logger.info('🏥 Taking action in simulation', { simulationId, action });
    
    const result = realWorldSimulation.takeAction(simulationId, action, details);
    
    res.json({
      success: true,
      message: 'Action taken successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error taking action:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to take action',
      error: error.message
    });
  }
});

// Complete Simulation
router.post('/complete', async (req, res) => {
  try {
    const { simulationId } = req.body;
    
    if (!simulationId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: simulationId'
      });
    }

    logger.info('🏥 Completing simulation', { simulationId });
    
    const result = realWorldSimulation.completeSimulation(simulationId);
    
    res.json({
      success: true,
      message: 'Simulation completed successfully',
      result
    });
  } catch (error) {
    logger.error('❌ Error completing simulation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete simulation',
      error: error.message
    });
  }
});

// Get Sri Lankan Hospital Information
router.get('/hospitals', async (req, res) => {
  try {
    logger.info('🏥 Getting Sri Lankan hospital information');
    
    const hospitals = Object.keys(realWorldSimulation.sriLankanHospitals).map(name => ({
      name,
      location: realWorldSimulation.sriLankanHospitals[name].location,
      type: realWorldSimulation.sriLankanHospitals[name].type,
      specialties: realWorldSimulation.sriLankanHospitals[name].specialties,
      contact: realWorldSimulation.sriLankanHospitals[name].contact,
      ambulance: realWorldSimulation.sriLankanHospitals[name].ambulance
    }));
    
    res.json({
      success: true,
      message: 'Hospital information retrieved successfully',
      hospitals,
      total: hospitals.length
    });
  } catch (error) {
    logger.error('❌ Error getting hospital information:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get hospital information',
      error: error.message
    });
  }
});

// Get Hospital Daily Statistics
router.get('/hospital/:name/stats', async (req, res) => {
  try {
    const { name } = req.params;
    
    logger.info('🏥 Getting hospital daily statistics', { hospital: name });
    
    const stats = realWorldSimulation.getDailyHospitalStats(name);
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Hospital statistics retrieved successfully',
      stats
    });
  } catch (error) {
    logger.error('❌ Error getting hospital statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get hospital statistics',
      error: error.message
    });
  }
});

// Get Doctor Profiles
router.get('/doctors', async (req, res) => {
  try {
    logger.info('🏥 Getting doctor profiles');
    
    const doctors = Object.keys(realWorldSimulation.doctorSpecialties).map(name => ({
      name,
      specialty: realWorldSimulation.doctorSpecialties[name].specialty,
      experience: realWorldSimulation.doctorSpecialties[name].experience,
      hospital: realWorldSimulation.doctorSpecialties[name].hospital,
      ward: realWorldSimulation.doctorSpecialties[name].ward,
      schedule: realWorldSimulation.doctorSpecialties[name].schedule,
      expertise: realWorldSimulation.doctorSpecialties[name].expertise,
      contact: realWorldSimulation.doctorSpecialties[name].contact
    }));
    
    res.json({
      success: true,
      message: 'Doctor profiles retrieved successfully',
      doctors,
      total: doctors.length
    });
  } catch (error) {
    logger.error('❌ Error getting doctor profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor profiles',
      error: error.message
    });
  }
});

// Get Emergency Protocols
router.get('/emergency-protocols', async (req, res) => {
  try {
    logger.info('🏥 Getting emergency protocols');
    
    const protocols = realWorldSimulation.getEmergencyProtocols();
    
    res.json({
      success: true,
      message: 'Emergency protocols retrieved successfully',
      protocols
    });
  } catch (error) {
    logger.error('❌ Error getting emergency protocols:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get emergency protocols',
      error: error.message
    });
  }
});

// Get Medical Procedures
router.get('/procedures', async (req, res) => {
  try {
    logger.info('🏥 Getting medical procedures');
    
    const procedures = realWorldSimulation.getMedicalProcedures();
    
    res.json({
      success: true,
      message: 'Medical procedures retrieved successfully',
      procedures
    });
  } catch (error) {
    logger.error('❌ Error getting medical procedures:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical procedures',
      error: error.message
    });
  }
});

// Get Active Simulations
router.get('/active/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    logger.info('🏥 Getting active simulations', { studentId });
    
    const simulations = realWorldSimulation.getActiveSimulations(studentId);
    
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

// Get Simulation History
router.get('/history/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    logger.info('🏥 Getting simulation history', { studentId });
    
    const history = realWorldSimulation.getSimulationHistory(studentId);
    
    res.json({
      success: true,
      message: 'Simulation history retrieved successfully',
      history,
      count: history.length
    });
  } catch (error) {
    logger.error('❌ Error getting simulation history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get simulation history',
      error: error.message
    });
  }
});

module.exports = router; 