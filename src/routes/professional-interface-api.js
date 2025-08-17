const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

// 🏥 PROFESSIONAL MEDICAL INTERFACE API

// Professional Dashboard with Quick Access Buttons
router.get('/dashboard', async (req, res) => {
  try {
    logger.info('🏥 Getting professional medical dashboard');
    
    const dashboard = {
      emergency: {
        title: '🚨 Emergency Protocols',
        buttons: [
          { id: 'cardiac_arrest', label: 'Cardiac Arrest', color: 'red', icon: '🫀' },
          { id: 'anaphylaxis', label: 'Anaphylaxis', color: 'orange', icon: '⚠️' },
          { id: 'severe_bleeding', label: 'Severe Bleeding', color: 'red', icon: '🩸' },
          { id: 'stroke', label: 'Stroke Protocol', color: 'purple', icon: '🧠' }
        ]
      },
      simulation: {
        title: '🏥 Real-World Simulation',
        buttons: [
          { id: 'start_simulation', label: 'Start Simulation', color: 'blue', icon: '🎯' },
          { id: 'active_cases', label: 'Active Cases', color: 'green', icon: '📋' },
          { id: 'history', label: 'Simulation History', color: 'gray', icon: '📊' },
          { id: 'scenarios', label: 'Available Scenarios', color: 'purple', icon: '📚' }
        ]
      },
      hospitals: {
        title: '🏥 Sri Lankan Hospitals',
        buttons: [
          { id: 'national_hospital', label: 'National Hospital', color: 'blue', icon: '🏥' },
          { id: 'asiri_hospital', label: 'Asiri Central', color: 'green', icon: '🏥' },
          { id: 'nawaloka_hospital', label: 'Nawaloka', color: 'purple', icon: '🏥' },
          { id: 'peradeniya_hospital', label: 'Teaching Hospital', color: 'orange', icon: '🏥' }
        ]
      },
      doctors: {
        title: '👨‍⚕️ Doctor Profiles',
        buttons: [
          { id: 'emergency_doctor', label: 'Emergency Medicine', color: 'red', icon: '🚑' },
          { id: 'cardiologist', label: 'Cardiology', color: 'pink', icon: '🫀' },
          { id: 'general_medicine', label: 'General Medicine', color: 'blue', icon: '👨‍⚕️' },
          { id: 'pediatrician', label: 'Pediatrics', color: 'yellow', icon: '👶' }
        ]
      },
      procedures: {
        title: '🔬 Medical Procedures',
        buttons: [
          { id: 'iv_cannulation', label: 'IV Cannulation', color: 'blue', icon: '💉' },
          { id: 'lumbar_puncture', label: 'Lumbar Puncture', color: 'purple', icon: '🩺' },
          { id: 'central_line', label: 'Central Line', color: 'red', icon: '🩸' },
          { id: 'intubation', label: 'Intubation', color: 'orange', icon: '🫁' }
        ]
      },
      tools: {
        title: '🛠️ Medical Tools',
        buttons: [
          { id: 'drug_database', label: 'Drug Database', color: 'green', icon: '💊' },
          { id: 'calculators', label: 'Medical Calculators', color: 'blue', icon: '🧮' },
          { id: 'guidelines', label: 'Clinical Guidelines', color: 'purple', icon: '📋' },
          { id: 'ebm', label: 'Evidence-Based Medicine', color: 'orange', icon: '📊' }
        ]
      },
      planning: {
        title: '📅 Daily Planning',
        buttons: [
          { id: 'daily_schedule', label: 'Daily Schedule', color: 'blue', icon: '📅' },
          { id: 'career_path', label: 'Career Path', color: 'green', icon: '🎯' },
          { id: 'learning_tracks', label: 'Learning Tracks', color: 'purple', icon: '📚' },
          { id: 'alerts', label: 'Alerts & Notifications', color: 'red', icon: '🔔' }
        ]
      }
    };
    
    res.json({
      success: true,
      message: 'Professional medical dashboard retrieved successfully',
      dashboard,
      totalButtons: Object.values(dashboard).reduce((sum, section) => sum + section.buttons.length, 0),
      sections: Object.keys(dashboard).length
    });
  } catch (error) {
    logger.error('❌ Error getting dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard',
      error: error.message
    });
  }
});

// Quick Action Buttons
router.post('/quick-action', async (req, res) => {
  try {
    const { actionId, studentId, additionalData } = req.body;
    
    if (!actionId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: actionId'
      });
    }

    logger.info('🏥 Quick action requested', { actionId, studentId });
    
    let result = {};
    
    switch (actionId) {
      case 'cardiac_arrest':
        result = {
          protocol: 'Cardiac Arrest Protocol',
          steps: [
            'Check responsiveness',
            'Call for help',
            'Check breathing',
            'Start chest compressions (30:2)',
            'Attach AED',
            'Continue CPR until help arrives'
          ],
          medications: ['Adrenaline 1mg IV', 'Amiodarone 300mg IV'],
          timeCritical: true
        };
        break;
        
      case 'start_simulation':
        result = {
          message: 'Starting real-world simulation',
          availableScenarios: [
            'Emergency Department - Chest Pain',
            'Emergency Department - Dengue Fever',
            'Medical Ward - Diabetic Ketoacidosis'
          ],
          nextStep: 'Select a scenario to begin'
        };
        break;
        
      case 'national_hospital':
        result = {
          hospital: 'National Hospital of Sri Lanka',
          location: 'Regent Street, Colombo 10',
          contact: '+94 11 2691111',
          ambulance: '+94 11 2691111',
          specialties: ['Emergency Medicine', 'Cardiology', 'Neurology', 'General Surgery', 'Pediatrics'],
          currentOccupancy: '85%',
          emergencyCases: '45 active cases'
        };
        break;
        
      case 'emergency_doctor':
        result = {
          doctor: 'Dr. Ananda Wijesinghe',
          specialty: 'Emergency Medicine',
          experience: '15 years',
          hospital: 'National Hospital of Sri Lanka',
          schedule: 'Morning Shift (6 AM - 2 PM)',
          expertise: ['Trauma', 'Cardiac Emergencies', 'Toxicology'],
          contact: '+94 77 1111111'
        };
        break;
        
      case 'iv_cannulation':
        result = {
          procedure: 'Intravenous Cannulation',
          steps: [
            'Wash hands and wear gloves',
            'Apply tourniquet',
            'Clean site with alcohol',
            'Insert cannula at 15-30 degree angle',
            'Remove tourniquet',
            'Secure with tape',
            'Flush with saline'
          ],
          equipment: ['IV cannula', 'Tourniquet', 'Alcohol swab', 'Tape', 'Saline flush'],
          complications: ['Infection', 'Phlebitis', 'Hematoma', 'Air embolism']
        };
        break;
        
      case 'drug_database':
        result = {
          message: 'Accessing comprehensive drug database',
          categories: ['Antibiotics', 'Cardiovascular', 'Analgesics', 'Anticoagulants', 'Emergency Drugs'],
          searchOptions: ['By name', 'By category', 'By indication', 'By contraindication'],
          features: ['Drug interactions checker', 'Dosage calculator', 'Side effects database', 'Contraindications', 'Pregnancy safety'],
          recentSearches: ['Aspirin', 'Warfarin', 'Metformin', 'Amlodipine']
        };
        break;
        
      case 'daily_schedule':
        result = {
          message: 'Daily medical schedule',
          currentTime: new Date().toLocaleTimeString(),
          upcomingTasks: [
            'Ward rounds - 9:00 AM',
            'Patient consultation - 10:30 AM',
            'Emergency case - 2:00 PM',
            'Study session - 4:00 PM'
          ],
          alerts: ['Critical patient in ICU', 'Lab results ready']
        };
        break;
        
      default:
        result = {
          message: 'Action not found',
          availableActions: [
            'cardiac_arrest', 'start_simulation', 'national_hospital', 
            'emergency_doctor', 'iv_cannulation', 'drug_database', 'daily_schedule'
          ]
        };
    }
    
    res.json({
      success: true,
      message: 'Quick action executed successfully',
      actionId,
      result
    });
  } catch (error) {
    logger.error('❌ Error executing quick action:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to execute quick action',
      error: error.message
    });
  }
});

// Professional Medical Search
router.post('/search', async (req, res) => {
  try {
    const { query, category, filters } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: query'
      });
    }

    logger.info('🏥 Professional medical search', { query, category });
    
    // Simulate search results based on query
    const searchResults = {
      query,
      category: category || 'all',
      results: [
        {
          type: 'protocol',
          title: 'Emergency Protocol',
          description: 'Emergency management protocol for medical conditions',
          relevance: 95,
          category: 'emergency'
        },
        {
          type: 'procedure',
          title: 'Medical Procedure',
          description: 'Step-by-step medical procedure guide',
          relevance: 88,
          category: 'procedure'
        },
        {
          type: 'drug',
          title: 'Drug Information',
          description: 'Comprehensive drug database and interactions',
          relevance: 82,
          category: 'pharmacy'
        },
        {
          type: 'guideline',
          title: 'Clinical Guideline',
          description: 'Evidence-based clinical practice guidelines',
          relevance: 78,
          category: 'guidelines'
        }
      ],
      suggestions: [
        'Emergency protocols',
        'Medical procedures',
        'Drug interactions',
        'Clinical guidelines'
      ],
      filters: {
        category: ['emergency', 'procedure', 'pharmacy', 'guidelines'],
        type: ['protocol', 'procedure', 'drug', 'guideline'],
        relevance: ['high', 'medium', 'low']
      }
    };
    
    res.json({
      success: true,
      message: 'Professional medical search completed',
      searchResults
    });
  } catch (error) {
    logger.error('❌ Error in medical search:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform medical search',
      error: error.message
    });
  }
});

// Professional Medical Case Interface
router.get('/case/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    logger.info('🏥 Getting professional medical case', { caseId: id });
    
    const medicalCase = {
      id,
      patient: {
        name: 'Mr. Kamal Perera',
        age: 45,
        gender: 'Male',
        bloodGroup: 'B+',
        allergies: ['Penicillin'],
        medications: ['Amlodipine 5mg', 'Metformin 500mg']
      },
      presentation: {
        chiefComplaint: 'Severe chest pain for 2 hours',
        vitalSigns: {
          bloodPressure: '160/95 mmHg',
          heartRate: '110 bpm',
          respiratoryRate: '24/min',
          temperature: '37.2°C',
          oxygenSaturation: '92%'
        },
        examination: {
          general: 'Anxious, diaphoretic, in moderate distress',
          cardiovascular: 'Tachycardic, regular rhythm, no murmurs',
          respiratory: 'Tachypneic, clear breath sounds bilaterally'
        }
      },
      actions: [
        { id: 'order_ecg', label: 'Order ECG', status: 'pending', priority: 'high' },
        { id: 'cardiac_enzymes', label: 'Cardiac Enzymes', status: 'pending', priority: 'high' },
        { id: 'aspirin', label: 'Administer Aspirin', status: 'pending', priority: 'critical' },
        { id: 'cardiology_consult', label: 'Cardiology Consult', status: 'pending', priority: 'medium' }
      ],
      timeline: [
        { time: '08:00', event: 'Patient arrived', status: 'completed' },
        { time: '08:05', event: 'Initial assessment', status: 'completed' },
        { time: '08:10', event: 'ECG ordered', status: 'in_progress' },
        { time: '08:15', event: 'Aspirin administered', status: 'pending' }
      ],
      notes: 'Patient presents with typical ACS symptoms. Immediate intervention required.',
      status: 'active',
      priority: 'critical'
    };
    
    res.json({
      success: true,
      message: 'Professional medical case retrieved successfully',
      medicalCase
    });
  } catch (error) {
    logger.error('❌ Error getting medical case:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical case',
      error: error.message
    });
  }
});

// Professional Medical Calculators
router.get('/calculators', async (req, res) => {
  try {
    logger.info('🏥 Getting professional medical calculators');
    
    const calculators = {
      cardiovascular: [
        { id: 'gfr_calculator', name: 'GFR Calculator', description: 'Calculate glomerular filtration rate' },
        { id: 'cardiac_risk', name: 'Cardiac Risk Calculator', description: 'Assess cardiovascular risk' },
        { id: 'chads2_vasc', name: 'CHADS2-VASc Score', description: 'Stroke risk in atrial fibrillation' }
      ],
      respiratory: [
        { id: 'oxygen_saturation', name: 'Oxygen Saturation', description: 'Calculate oxygen saturation' },
        { id: 'lung_function', name: 'Lung Function Tests', description: 'Interpret pulmonary function tests' }
      ],
      endocrine: [
        { id: 'diabetes_risk', name: 'Diabetes Risk Calculator', description: 'Assess diabetes risk' },
        { id: 'insulin_dose', name: 'Insulin Dose Calculator', description: 'Calculate insulin requirements' }
      ],
      emergency: [
        { id: 'gcs_score', name: 'Glasgow Coma Scale', description: 'Assess level of consciousness' },
        { id: 'apache_score', name: 'APACHE II Score', description: 'Intensive care mortality prediction' }
      ]
    };
    
    res.json({
      success: true,
      message: 'Professional medical calculators retrieved successfully',
      calculators,
      totalCalculators: Object.values(calculators).reduce((sum, category) => sum + category.length, 0)
    });
  } catch (error) {
    logger.error('❌ Error getting calculators:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get calculators',
      error: error.message
    });
  }
});

// Professional Drug Database Interface
router.get('/drugs', async (req, res) => {
  try {
    logger.info('🏥 Getting professional drug database interface');
    
    const drugDatabase = {
      categories: [
        { id: 'antibiotics', name: 'Antibiotics', count: 150 },
        { id: 'cardiovascular', name: 'Cardiovascular', count: 200 },
        { id: 'analgesics', name: 'Analgesics', count: 100 },
        { id: 'anticoagulants', name: 'Anticoagulants', count: 50 },
        { id: 'emergency', name: 'Emergency Drugs', count: 75 }
      ],
      searchOptions: [
        'Search by drug name',
        'Search by indication',
        'Search by contraindication',
        'Search by drug class',
        'Search by side effects'
      ],
      features: [
        'Drug interactions checker',
        'Dosage calculator',
        'Side effects database',
        'Contraindications',
        'Pregnancy and lactation safety'
      ],
      recentSearches: [
        'Aspirin',
        'Warfarin',
        'Metformin',
        'Amlodipine'
      ]
    };
    
    res.json({
      success: true,
      message: 'Professional drug database interface retrieved successfully',
      drugDatabase
    });
  } catch (error) {
    logger.error('❌ Error getting drug database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get drug database',
      error: error.message
    });
  }
});

// Professional Guidelines Interface
router.get('/guidelines', async (req, res) => {
  try {
    logger.info('🏥 Getting professional guidelines interface');
    
    const guidelines = {
      categories: [
        { id: 'cardiology', name: 'Cardiology Guidelines', count: 25 },
        { id: 'diabetes', name: 'Diabetes Management', count: 15 },
        { id: 'hypertension', name: 'Hypertension Guidelines', count: 20 },
        { id: 'infectious_diseases', name: 'Infectious Diseases', count: 30 },
        { id: 'emergency', name: 'Emergency Medicine', count: 40 }
      ],
      latestUpdates: [
        { title: '2024 ACS Guidelines', date: '2024-01-15', category: 'cardiology' },
        { title: 'Diabetes Type 2 Management', date: '2024-01-10', category: 'diabetes' },
        { title: 'Hypertension Treatment', date: '2024-01-05', category: 'hypertension' }
      ],
      evidenceLevels: [
        'Level A - High quality evidence',
        'Level B - Moderate quality evidence',
        'Level C - Low quality evidence'
      ]
    };
    
    res.json({
      success: true,
      message: 'Professional guidelines interface retrieved successfully',
      guidelines
    });
  } catch (error) {
    logger.error('❌ Error getting guidelines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get guidelines',
      error: error.message
    });
  }
});

module.exports = router; 