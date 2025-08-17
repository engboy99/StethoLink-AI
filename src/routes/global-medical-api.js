const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const globalMedicalKnowledge = require('../services/global-medical-knowledge');

// Global Medical Knowledge API for Medical Students

// Get Disease Information
router.get('/disease/:name', async (req, res) => {
  try {
    const { name } = req.params;
    logger.info('🌍 Global disease info request', { disease: name });
    
    const diseaseInfo = globalMedicalKnowledge.getDiseaseInfo(name);
    if (!diseaseInfo) {
      return res.status(404).json({
        success: false,
        error: 'Disease not found in global database'
      });
    }
    
    res.json({
      success: true,
      data: diseaseInfo
    });
  } catch (error) {
    logger.error('❌ Global disease info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve disease information'
    });
  }
});

// Search Diseases by Symptoms
router.post('/search/symptoms', async (req, res) => {
  try {
    const { symptoms } = req.body;
    logger.info('🔍 Global disease search by symptoms', { symptoms });
    
    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({
        success: false,
        error: 'Symptoms array is required'
      });
    }
    
    const results = globalMedicalKnowledge.searchDiseasesBySymptoms(symptoms);
    
    res.json({
      success: true,
      data: {
        symptoms: symptoms,
        results: results,
        totalMatches: results.length
      }
    });
  } catch (error) {
    logger.error('❌ Global disease search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search diseases'
    });
  }
});

// Get Real-Time Updates
router.get('/updates', async (req, res) => {
  try {
    logger.info('🔄 Global medical updates request');
    
    const updates = globalMedicalKnowledge.getRealTimeUpdates();
    
    res.json({
      success: true,
      data: updates
    });
  } catch (error) {
    logger.error('❌ Global updates error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve updates'
    });
  }
});

// Get Diseases by Medical Specialty
router.get('/specialty/:specialty', async (req, res) => {
  try {
    const { specialty } = req.params;
    logger.info('🏥 Global specialty diseases request', { specialty });
    
    const specialtyInfo = globalMedicalKnowledge.getDiseasesBySpecialty(specialty);
    if (!specialtyInfo) {
      return res.status(404).json({
        success: false,
        error: 'Medical specialty not found'
      });
    }
    
    res.json({
      success: true,
      data: specialtyInfo
    });
  } catch (error) {
    logger.error('❌ Global specialty error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve specialty information'
    });
  }
});

// Get Global Disease Statistics
router.get('/statistics', async (req, res) => {
  try {
    logger.info('📊 Global disease statistics request');
    
    const stats = globalMedicalKnowledge.getGlobalStatistics();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('❌ Global statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
});

// Get All Available Diseases
router.get('/diseases', async (req, res) => {
  try {
    logger.info('📋 Global diseases list request');
    
    const diseases = Object.keys(globalMedicalKnowledge.diseaseDatabase).map(name => ({
      name: name,
      category: globalMedicalKnowledge.getDiseaseCategory(name),
      lastUpdated: globalMedicalKnowledge.diseaseDatabase[name].lastUpdated
    }));
    
    res.json({
      success: true,
      data: {
        diseases: diseases,
        total: diseases.length,
        lastUpdate: globalMedicalKnowledge.lastUpdate
      }
    });
  } catch (error) {
    logger.error('❌ Global diseases list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve diseases list'
    });
  }
});

// Get Disease Categories
router.get('/categories', async (req, res) => {
  try {
    logger.info('📂 Global disease categories request');
    
    const categories = {
      'Infectious Diseases': ['COVID-19', 'Ebola Virus Disease', 'Malaria', 'Tuberculosis', 'HIV/AIDS'],
      'Cardiovascular Diseases': ['Coronary Artery Disease', 'Hypertension', 'Heart Failure'],
      'Neurological Diseases': ['Alzheimer\'s Disease', 'Parkinson\'s Disease', 'Multiple Sclerosis'],
      'Cancer': ['Lung Cancer', 'Breast Cancer', 'Colorectal Cancer'],
      'Endocrine Diseases': ['Diabetes Mellitus', 'Thyroid Disorders'],
      'Respiratory Diseases': ['Chronic Obstructive Pulmonary Disease', 'Asthma'],
      'Gastrointestinal Diseases': ['Inflammatory Bowel Disease', 'Cirrhosis'],
      'Renal Diseases': ['Chronic Kidney Disease'],
      'Autoimmune Diseases': ['Rheumatoid Arthritis', 'Systemic Lupus Erythematosus'],
      'Pediatric Diseases': ['Childhood Leukemia', 'Cerebral Palsy']
    };
    
    res.json({
      success: true,
      data: {
        categories: categories,
        totalCategories: Object.keys(categories).length,
        totalDiseases: Object.values(categories).flat().length
      }
    });
  } catch (error) {
    logger.error('❌ Global categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve categories'
    });
  }
});

// Get Medical Specialties
router.get('/specialties', async (req, res) => {
  try {
    logger.info('👨‍⚕️ Global medical specialties request');
    
    const specialties = Object.keys(globalMedicalKnowledge.medicalSpecialties).map(name => ({
      name: name,
      diseaseCount: globalMedicalKnowledge.medicalSpecialties[name].diseases.length,
      skillCount: globalMedicalKnowledge.medicalSpecialties[name].skills.length,
      lastUpdated: globalMedicalKnowledge.medicalSpecialties[name].lastUpdated
    }));
    
    res.json({
      success: true,
      data: {
        specialties: specialties,
        total: specialties.length,
        lastUpdate: globalMedicalKnowledge.lastUpdate
      }
    });
  } catch (error) {
    logger.error('❌ Global specialties error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve specialties'
    });
  }
});

// Update Disease Information (Admin/Research Use)
router.put('/disease/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { updateData } = req.body;
    
    logger.info('🔄 Global disease update request', { disease: name });
    
    if (!updateData) {
      return res.status(400).json({
        success: false,
        error: 'Update data is required'
      });
    }
    
    const success = globalMedicalKnowledge.updateDiseaseInfo(name, updateData);
    
    if (success) {
      res.json({
        success: true,
        message: `Disease information updated for ${name}`,
        lastUpdate: globalMedicalKnowledge.lastUpdate
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Disease not found for update'
      });
    }
  } catch (error) {
    logger.error('❌ Global disease update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update disease information'
    });
  }
});

// Get Disease Comparison
router.post('/compare', async (req, res) => {
  try {
    const { diseases } = req.body;
    logger.info('⚖️ Global disease comparison request', { diseases });
    
    if (!diseases || !Array.isArray(diseases) || diseases.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least 2 diseases required for comparison'
      });
    }
    
    const comparison = {
      diseases: [],
      similarities: [],
      differences: []
    };
    
    for (const diseaseName of diseases) {
      const diseaseInfo = globalMedicalKnowledge.getDiseaseInfo(diseaseName);
      if (diseaseInfo) {
        comparison.diseases.push(diseaseInfo);
      }
    }
    
    if (comparison.diseases.length >= 2) {
      // Find similarities and differences
      const disease1 = comparison.diseases[0];
      const disease2 = comparison.diseases[1];
      
      // Compare symptoms
      const commonSymptoms = disease1.symptoms.filter(s => disease2.symptoms.includes(s));
      const uniqueSymptoms1 = disease1.symptoms.filter(s => !disease2.symptoms.includes(s));
      const uniqueSymptoms2 = disease2.symptoms.filter(s => !disease1.symptoms.includes(s));
      
      comparison.similarities = {
        commonSymptoms: commonSymptoms,
        commonTreatments: disease1.treatments.filter(t => disease2.treatments.includes(t))
      };
      
      comparison.differences = {
        uniqueSymptoms1: uniqueSymptoms1,
        uniqueSymptoms2: uniqueSymptoms2,
        uniqueTreatments1: disease1.treatments.filter(t => !disease2.treatments.includes(t)),
        uniqueTreatments2: disease2.treatments.filter(t => !disease1.treatments.includes(t))
      };
    }
    
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    logger.error('❌ Global disease comparison error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare diseases'
    });
  }
});

module.exports = router; 