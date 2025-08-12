const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

// Professional Medical Interface API for Medical Students

// Get Professional Dashboard Data
router.get('/dashboard', async (req, res) => {
  try {
    logger.info('🏥 Professional dashboard request');
    
    const dashboard = {
      quickAccess: {
        emergencyProtocols: [
          'Chest Pain Protocol',
          'Sepsis Recognition',
          'Stroke Protocol',
          'Dengue Warning Signs',
          'Diabetic Emergencies'
        ],
        calculators: [
          'GFR Calculator',
          'BMI Calculator',
          'CHADS2 Score',
          'Glasgow Coma Scale',
          'APACHE II Score'
        ],
        drugDatabase: [
          'Antibiotics',
          'Analgesics',
          'Antihypertensives',
          'Antidiabetics',
          'Psychotropics'
        ]
      },
      recentUpdates: {
        guidelines: [
          'WHO COVID-19 Guidelines 2024',
          'Sri Lanka Dengue Guidelines 2023',
          'ESC Heart Failure Guidelines 2023',
          'ADA Diabetes Guidelines 2024'
        ],
        research: [
          'RECOVERY Trial Results',
          'EMPA-REG OUTCOME Trial',
          'SPRINT Trial Analysis',
          'DAPA-HF Trial Results'
        ]
      },
      learningModules: [
        'Emergency Medicine',
        'Infectious Diseases',
        'Cardiovascular Medicine',
        'Endocrinology',
        'Neurology'
      ]
    };
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    logger.error('❌ Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Dashboard generation failed'
    });
  }
});

// Get Professional Medical Search Interface
router.post('/search', async (req, res) => {
  try {
    const { query, category } = req.body;
    logger.info('🔍 Professional medical search', { query, category });
    
    const searchResults = {
      query: query,
      category: category,
      results: [],
      suggestions: [],
      filters: {
        evidenceLevel: ['A', 'B', 'C'],
        specialty: ['Emergency', 'Internal Medicine', 'Surgery', 'Pediatrics'],
        urgency: ['High', 'Moderate', 'Low']
      }
    };
    
    // Add professional search suggestions based on query
    if (query.toLowerCase().includes('chest pain')) {
      searchResults.suggestions = [
        'Acute Coronary Syndrome',
        'Pulmonary Embolism',
        'Aortic Dissection',
        'Pneumonia',
        'Costochondritis'
      ];
    } else if (query.toLowerCase().includes('fever')) {
      searchResults.suggestions = [
        'Dengue Fever',
        'Malaria',
        'Typhoid Fever',
        'COVID-19',
        'Sepsis'
      ];
    }
    
    res.json({
      success: true,
      data: searchResults
    });
  } catch (error) {
    logger.error('❌ Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// Get Professional Medical Case Interface
router.get('/case/:id', async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('📋 Professional medical case request', { id });
    
    const medicalCase = {
      id: id,
      title: 'Professional Medical Case Study',
      patient: {
        demographics: '25-year-old female medical student',
        presentingComplaint: 'Severe headache and fever',
        vitalSigns: {
          temperature: '39.5°C',
          bloodPressure: '110/70 mmHg',
          pulse: '100/min',
          respiratoryRate: '20/min'
        }
      },
      clinicalData: {
        history: '24-hour history of severe headache, photophobia, neck stiffness',
        examination: 'Glasgow Coma Scale 13/15, positive Kernig\'s sign',
        investigations: 'FBC: WBC 18,000/μL, CRP 120 mg/L'
      },
      learningObjectives: [
        'Recognize signs of bacterial meningitis',
        'Understand emergency management protocols',
        'Interpret laboratory findings',
        'Develop differential diagnosis'
      ],
      questions: [
        'What are the most common causative organisms?',
        'How would you interpret CSF findings?',
        'What complications should you watch for?',
        'When would you consider brain imaging?'
      ]
    };
    
    res.json({
      success: true,
      data: medicalCase
    });
  } catch (error) {
    logger.error('❌ Medical case error:', error);
    res.status(500).json({
      success: false,
      error: 'Medical case generation failed'
    });
  }
});

// Get Professional Medical Calculator Interface
router.get('/calculators', async (req, res) => {
  try {
    logger.info('🧮 Professional calculator interface request');
    
    const calculators = {
      cardiovascular: [
        {
          name: 'GFR Calculator',
          description: 'Calculate glomerular filtration rate using MDRD formula',
          inputs: ['Age', 'Weight', 'Creatinine', 'Gender'],
          output: 'GFR in mL/min/1.73m²'
        },
        {
          name: 'CHADS2 Score',
          description: 'Assess stroke risk in atrial fibrillation',
          inputs: ['CHF', 'Hypertension', 'Age', 'Diabetes', 'Stroke'],
          output: 'Stroke risk score (0-6)'
        }
      ],
      respiratory: [
        {
          name: 'FEV1 Predicted',
          description: 'Calculate predicted FEV1 based on age, height, gender',
          inputs: ['Age', 'Height', 'Gender'],
          output: 'Predicted FEV1 in L'
        }
      ],
      emergency: [
        {
          name: 'Glasgow Coma Scale',
          description: 'Assess level of consciousness',
          inputs: ['Eye Opening', 'Verbal Response', 'Motor Response'],
          output: 'GCS Score (3-15)'
        },
        {
          name: 'APACHE II Score',
          description: 'Assess severity of illness in ICU patients',
          inputs: ['Multiple physiological parameters'],
          output: 'APACHE II Score (0-71)'
        }
      ]
    };
    
    res.json({
      success: true,
      data: calculators
    });
  } catch (error) {
    logger.error('❌ Calculator interface error:', error);
    res.status(500).json({
      success: false,
      error: 'Calculator interface failed'
    });
  }
});

// Get Professional Drug Database Interface
router.get('/drugs', async (req, res) => {
  try {
    logger.info('💊 Professional drug database interface request');
    
    const drugInterface = {
      categories: [
        {
          name: 'Antibiotics',
          description: 'Comprehensive antibiotic database with resistance patterns',
          count: 7,
          examples: ['Amoxicillin', 'Ciprofloxacin', 'Doxycycline', 'Ceftriaxone']
        },
        {
          name: 'Analgesics',
          description: 'Pain management medications with safety considerations',
          count: 4,
          examples: ['Paracetamol', 'Ibuprofen', 'Diclofenac', 'Morphine']
        },
        {
          name: 'Antihypertensives',
          description: 'Blood pressure management with cardiovascular protection',
          count: 4,
          examples: ['Amlodipine', 'Losartan', 'Metoprolol', 'Lisinopril']
        },
        {
          name: 'Antidiabetics',
          description: 'Diabetes management with cardiovascular benefits',
          count: 3,
          examples: ['Metformin', 'Gliclazide', 'Insulin Glargine']
        }
      ],
      searchFeatures: [
        'Drug name search',
        'Category filter',
        'Interaction checker',
        'Dosage calculator',
        'Safety information'
      ],
      professionalFeatures: [
        'Pregnancy categories',
        'Breastfeeding safety',
        'Pediatric dosing',
        'Geriatric considerations',
        'Drug interactions',
        'Monitoring requirements'
      ]
    };
    
    res.json({
      success: true,
      data: drugInterface
    });
  } catch (error) {
    logger.error('❌ Drug interface error:', error);
    res.status(500).json({
      success: false,
      error: 'Drug interface failed'
    });
  }
});

// Get Professional Guidelines Interface
router.get('/guidelines', async (req, res) => {
  try {
    logger.info('📋 Professional guidelines interface request');
    
    const guidelinesInterface = {
      categories: [
        {
          name: 'Emergency Medicine',
          conditions: ['Chest Pain', 'Sepsis', 'Stroke', 'Diabetic Emergencies'],
          evidenceLevel: 'A',
          lastUpdated: '2024'
        },
        {
          name: 'Infectious Diseases',
          conditions: ['Dengue Fever', 'COVID-19', 'Tuberculosis', 'Malaria'],
          evidenceLevel: 'A',
          lastUpdated: '2024'
        },
        {
          name: 'Cardiovascular',
          conditions: ['Hypertension', 'Heart Failure', 'Acute Coronary Syndrome'],
          evidenceLevel: 'A',
          lastUpdated: '2024'
        },
        {
          name: 'Endocrinology',
          conditions: ['Diabetes Mellitus', 'Thyroid Disorders'],
          evidenceLevel: 'A',
          lastUpdated: '2024'
        }
      ],
      features: [
        'Evidence-based recommendations',
        'Clinical decision support',
        'Risk assessment tools',
        'Treatment algorithms',
        'Monitoring protocols'
      ],
      sources: [
        'WHO Guidelines',
        'Sri Lankan Medical Council',
        'International Medical Societies',
        'Peer-reviewed journals',
        'Clinical trials'
      ]
    };
    
    res.json({
      success: true,
      data: guidelinesInterface
    });
  } catch (error) {
    logger.error('❌ Guidelines interface error:', error);
    res.status(500).json({
      success: false,
      error: 'Guidelines interface failed'
    });
  }
});

module.exports = router; 