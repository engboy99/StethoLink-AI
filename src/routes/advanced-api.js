const express = require('express');
const router = express.Router();
const advancedFeatures = require('../services/advanced-features');
const { logger } = require('../utils/logger');

// Drug Interaction Checker
router.post('/drug-interactions', async (req, res) => {
  try {
    const { drugs } = req.body;
    logger.info('🔍 Drug interaction check request', { drugs });

    const result = await advancedFeatures.checkDrugInteractions(drugs);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('❌ Drug interaction check error:', error);
    res.status(500).json({
      success: false,
      error: 'Drug interaction check failed'
    });
  }
});

// Clinical Decision Support
router.post('/clinical-decision', async (req, res) => {
  try {
    const { symptoms, age, gender, comorbidities } = req.body;
    logger.info('🧠 Clinical decision support request', { symptoms, age, gender });

    const result = await advancedFeatures.clinicalDecisionSupport(symptoms, age, gender, comorbidities);
    
    res.json({
      success: true,
      differential: result.differentials || result,
      data: result
    });
  } catch (error) {
    logger.error('❌ Clinical decision support error:', error);
    res.status(500).json({
      success: false,
      error: 'Clinical decision support failed'
    });
  }
});

// Medical Image Analysis
router.post('/image-analysis', async (req, res) => {
  try {
    const { imageDescription } = req.body;
    logger.info('🖼️ Medical image analysis request', { imageDescription });

    const result = await advancedFeatures.analyzeMedicalImage(imageDescription);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('❌ Medical image analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Medical image analysis failed'
    });
  }
});

// Patient Education Generator
router.post('/patient-education', async (req, res) => {
  try {
    const { diagnosis, language } = req.body;
    logger.info('📚 Patient education request', { diagnosis, language });

    const result = await advancedFeatures.generatePatientEducation(diagnosis, language);
    
    res.json({
      success: true,
      data: {
        title: result.title,
        content: result.content,
        lifestyle: result.lifestyle,
        complications: result.complications
      }
    });
  } catch (error) {
    logger.error('❌ Patient education error:', error);
    res.status(500).json({
      success: false,
      error: 'Patient education generation failed'
    });
  }
});

// Medical Calculator
router.post('/calculator', async (req, res) => {
  try {
    const { type, parameters } = req.body;
    logger.info('🧮 Medical calculator request', { type, parameters });

    const calculator = advancedFeatures.medicalCalculators[type];
    if (!calculator) {
      return res.status(400).json({
        success: false,
        error: 'Calculator type not found'
      });
    }

    const result = calculator(...Object.values(parameters));
    
    // Add interpretation based on calculator type
    let interpretation = '';
    if (type === 'GFR') {
      if (result < 15) interpretation = 'Severe kidney disease (Stage 5 CKD)';
      else if (result < 30) interpretation = 'Severe kidney disease (Stage 4 CKD)';
      else if (result < 60) interpretation = 'Moderate kidney disease (Stage 3 CKD)';
      else if (result < 90) interpretation = 'Mild kidney disease (Stage 2 CKD)';
      else interpretation = 'Normal kidney function (Stage 1 CKD)';
    }
    
    res.json({
      success: true,
      data: {
        type,
        parameters,
        result,
        interpretation
      }
    });
  } catch (error) {
    logger.error('❌ Medical calculator error:', error);
    res.status(500).json({
      success: false,
      error: 'Medical calculation failed'
    });
  }
});

// Sri Lankan Drug Database
router.get('/drugs/:category', async (req, res) => {
  try {
    const { category } = req.params;
    logger.info('💊 Drug database request', { category });

    const drugs = advancedFeatures.getDrugsByCategory(category);
    if (!drugs || drugs.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Drug category not found'
      });
    }
    
    res.json({
      success: true,
      data: { drugs }
    });
  } catch (error) {
    logger.error('❌ Drug database error:', error);
    res.status(500).json({
      success: false,
      error: 'Drug database query failed'
    });
  }
});

// Clinical Guidelines (Sri Lankan Context)
router.get('/guidelines/:condition', async (req, res) => {
  try {
    const { condition } = req.params;
    logger.info('📋 Clinical guidelines request', { condition });

    const guideline = advancedFeatures.getClinicalGuideline(condition);
    if (!guideline) {
      return res.status(400).json({
        success: false,
        error: 'Clinical guidelines not found'
      });
    }
    
    res.json({
      success: true,
      data: guideline
    });
  } catch (error) {
    logger.error('❌ Clinical guidelines error:', error);
    res.status(500).json({
      success: false,
      error: 'Clinical guidelines query failed'
    });
  }
});

// Clinical Audit
router.post('/audit', async (req, res) => {
  try {
    const { patientData } = req.body;
    logger.info('📊 Clinical audit request', { patientCount: patientData.length });

    const result = await advancedFeatures.clinicalAudit(patientData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('❌ Clinical audit error:', error);
    res.status(500).json({
      success: false,
      error: 'Clinical audit failed'
    });
  }
});

// Telemedicine Support
router.post('/telemedicine', async (req, res) => {
  try {
    const { patientData, symptoms } = req.body;
    logger.info('📱 Telemedicine support request', { symptoms });

    const result = await advancedFeatures.telemedicineSupport(patientData, symptoms);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('❌ Telemedicine support error:', error);
    res.status(500).json({
      success: false,
      error: 'Telemedicine support failed'
    });
  }
});

// Evidence-Based Medicine
router.post('/evidence', async (req, res) => {
  try {
    const { query } = req.body;
    logger.info('🔬 Evidence-based medicine request', { query });

    const result = await advancedFeatures.evidenceBasedMedicine(query);
    
    res.json({
      success: true,
      evidence: result,
      data: result
    });
  } catch (error) {
    logger.error('❌ Evidence-based medicine error:', error);
    res.status(500).json({
      success: false,
      error: 'Evidence-based medicine search failed'
    });
  }
});

// Available Calculators List
router.get('/calculators', async (req, res) => {
  try {
    const calculators = Object.keys(advancedFeatures.medicalCalculators);
    
    res.json({
      success: true,
      data: {
        available: calculators,
        categories: {
          'Cardiovascular': ['BMI', 'GFR', 'CHADS2'],
          'Respiratory': ['FEV1_Predicted'],
          'Renal': ['Creatinine_Clearance'],
          'Pediatric': ['Pediatric_Dose'],
          'Emergency': ['Glasgow_Coma_Scale', 'APACHE_II']
        }
      }
    });
  } catch (error) {
    logger.error('❌ Calculators list error:', error);
    res.status(500).json({
      success: false,
      error: 'Calculators list failed'
    });
  }
});

// Available Drug Categories
router.get('/drug-categories', async (req, res) => {
  try {
    const categories = Object.keys(advancedFeatures.sriLankanDrugDatabase);
    
    res.json({
      success: true,
      data: {
        categories,
        description: 'Sri Lankan drug availability and pricing database'
      }
    });
  } catch (error) {
    logger.error('❌ Drug categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Drug categories list failed'
    });
  }
});

// Available Clinical Guidelines
router.get('/guidelines', async (req, res) => {
  try {
    const guidelines = Object.keys(advancedFeatures.clinicalGuidelines);
    
    res.json({
      success: true,
      data: {
        guidelines,
        description: 'Sri Lankan context-specific clinical guidelines'
      }
    });
  } catch (error) {
    logger.error('❌ Guidelines list error:', error);
    res.status(500).json({
      success: false,
      error: 'Guidelines list failed'
    });
  }
});

module.exports = router; 