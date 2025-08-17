const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

// Mock dashboard data
const dashboardData = {
  students: {
    'student_001': {
      id: 'student_001',
      name: 'Dr. Sarah Johnson',
      level: 'Final Year',
      progress: 85,
      completedCases: 127,
      averageScore: 92.5,
      lastActive: '2025-08-07T18:30:00Z',
      currentTask: 'Cardiology Module - Case Study 3',
      upcomingDeadlines: [
        { id: 'deadline_001', title: 'Cardiology Final Exam', date: '2025-08-15', priority: 'high' },
        { id: 'deadline_002', title: 'Research Paper Submission', date: '2025-08-20', priority: 'medium' }
      ],
      recentActivities: [
        { id: 'activity_001', type: 'case_completed', title: 'Completed Cardiology Case', timestamp: '2025-08-07T18:25:00Z' },
        { id: 'activity_002', type: 'exam_taken', title: 'Took Pharmacology Quiz', timestamp: '2025-08-07T17:45:00Z' }
      ]
    },
    'student_002': {
      id: 'student_002',
      name: 'Dr. Michael Chen',
      level: 'Third Year',
      progress: 72,
      completedCases: 89,
      averageScore: 88.3,
      lastActive: '2025-08-07T18:15:00Z',
      currentTask: 'Neurology Module - Patient Assessment',
      upcomingDeadlines: [
        { id: 'deadline_003', title: 'Neurology Practical', date: '2025-08-12', priority: 'high' }
      ],
      recentActivities: [
        { id: 'activity_003', type: 'case_started', title: 'Started Neurology Case', timestamp: '2025-08-07T18:10:00Z' }
      ]
    }
  },
  alerts: {
    'student_001': [
      { id: 'alert_001', type: 'deadline_approaching', message: 'Cardiology Final Exam in 8 days', priority: 'high', timestamp: '2025-08-07T18:00:00Z' },
      { id: 'alert_002', type: 'performance_drop', message: 'Recent quiz scores below average', priority: 'medium', timestamp: '2025-08-07T17:30:00Z' }
    ],
    'student_002': [
      { id: 'alert_003', type: 'inactivity', message: 'No activity for 3 days', priority: 'low', timestamp: '2025-08-07T16:00:00Z' }
    ]
  },
  quickActions: [
    { id: 'action_001', title: 'Start New Case', description: 'Begin a new medical case study', icon: 'case', endpoint: '/api/student/cases/start' },
    { id: 'action_002', title: 'Take Quiz', description: 'Practice with medical quizzes', icon: 'quiz', endpoint: '/api/student/quizzes' },
    { id: 'action_003', title: 'Review Progress', description: 'View detailed progress report', icon: 'progress', endpoint: '/api/student/progress' },
    { id: 'action_004', title: 'Schedule Session', description: 'Book a tutoring session', icon: 'schedule', endpoint: '/api/student/sessions' }
  ]
};

// Get dashboard overview
router.get('/overview', async (req, res) => {
  try {
    logger.info('📊 Getting dashboard overview');
    
    const overview = {
      totalStudents: Object.keys(dashboardData.students).length,
      activeStudents: Object.values(dashboardData.students).filter(s => 
        new Date(s.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      totalCases: Object.values(dashboardData.students).reduce((sum, s) => sum + s.completedCases, 0),
      averageProgress: Object.values(dashboardData.students).reduce((sum, s) => sum + s.progress, 0) / Object.keys(dashboardData.students).length,
      totalAlerts: Object.values(dashboardData.alerts).flat().length,
      highPriorityAlerts: Object.values(dashboardData.alerts).flat().filter(a => a.priority === 'high').length
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    logger.error('❌ Error getting dashboard overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard overview'
    });
  }
});

// Get student dashboard
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    logger.info(`📊 Getting dashboard for student ${studentId}`);
    
    const student = dashboardData.students[studentId];
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const alerts = dashboardData.alerts[studentId] || [];
    
    res.json({
      success: true,
      data: {
        student,
        alerts,
        quickActions: dashboardData.quickActions
      }
    });
  } catch (error) {
    logger.error('❌ Error getting student dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get student dashboard'
    });
  }
});

// Get alerts for student
router.get('/alerts/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    logger.info(`📊 Getting alerts for student ${studentId}`);
    
    const alerts = dashboardData.alerts[studentId] || [];
    
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    logger.error('❌ Error getting student alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get student alerts'
    });
  }
});

// Get all alerts (for dashboard overview)
router.get('/alerts', async (req, res) => {
  try {
    logger.info('📊 Getting all alerts');
    
    const allAlerts = Object.values(dashboardData.alerts).flat();
    
    res.json({
      success: true,
      data: allAlerts
    });
  } catch (error) {
    logger.error('❌ Error getting all alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get all alerts'
    });
  }
});

// Update alert status
router.put('/alerts/:studentId/:alertId', async (req, res) => {
  try {
    const { studentId, alertId } = req.params;
    const { status } = req.body;
    
    logger.info(`📊 Updating alert ${alertId} for student ${studentId} to status: ${status}`);
    
    const alerts = dashboardData.alerts[studentId] || [];
    const alertIndex = alerts.findIndex(a => a.id === alertId);
    
    if (alertIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }
    
    alerts[alertIndex].status = status;
    alerts[alertIndex].updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: alerts[alertIndex]
    });
  } catch (error) {
    logger.error('❌ Error updating alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update alert'
    });
  }
});

// Execute quick action
router.post('/quick-action', async (req, res) => {
  try {
    const { actionId, studentId } = req.body;
    logger.info(`📊 Executing quick action ${actionId} for student ${studentId}`);
    
    // Comprehensive action mapping for Sri Lankan medical students
    const actionMap = {
      // Emergency actions
      'cardiac_arrest': {
        title: 'Cardiac Arrest Protocol',
        description: 'Emergency cardiac arrest management protocol',
        priority: 'critical',
        endpoint: '/api/emergency/cardiac-arrest'
      },
      'anaphylaxis': {
        title: 'Anaphylaxis Management',
        description: 'Anaphylaxis emergency treatment protocol',
        priority: 'critical',
        endpoint: '/api/emergency/anaphylaxis'
      },
      'stroke': {
        title: 'Stroke Protocol',
        description: 'Acute stroke management protocol',
        priority: 'high',
        endpoint: '/api/emergency/stroke'
      },
      'trauma': {
        title: 'Trauma Assessment',
        description: 'Trauma patient assessment protocol',
        priority: 'high',
        endpoint: '/api/emergency/trauma'
      },
      
      // Simulation actions
      'start_simulation': {
        title: 'Start Patient Simulation',
        description: 'Begin a new patient simulation',
        priority: 'normal',
        endpoint: '/api/simulation/start'
      },
      'case_study': {
        title: 'Case Study Mode',
        description: 'Access case study learning mode',
        priority: 'normal',
        endpoint: '/api/simulation/case-study'
      },
      'virtual_patient': {
        title: 'Virtual Patient',
        description: 'Interact with virtual patient scenarios',
        priority: 'normal',
        endpoint: '/api/simulation/virtual-patient'
      },
      
      // Hospital actions
      'national_hospital': {
        title: 'National Hospital Info',
        description: 'Access National Hospital information',
        priority: 'normal',
        endpoint: '/api/hospitals/national'
      },
      'teaching_hospital': {
        title: 'Teaching Hospital Info',
        description: 'Access Teaching Hospital information',
        priority: 'normal',
        endpoint: '/api/hospitals/teaching'
      },
      'emergency_center': {
        title: 'Emergency Center',
        description: 'Emergency center information and protocols',
        priority: 'high',
        endpoint: '/api/hospitals/emergency-center'
      },
      
      // Doctor actions
      'emergency_doctor': {
        title: 'Emergency Doctor Profile',
        description: 'Emergency medicine specialist information',
        priority: 'normal',
        endpoint: '/api/doctors/emergency'
      },
      'cardiology_consultant': {
        title: 'Cardiology Consultant',
        description: 'Cardiology specialist information',
        priority: 'normal',
        endpoint: '/api/doctors/cardiology'
      },
      'general_practitioner': {
        title: 'General Practitioner',
        description: 'General practice information',
        priority: 'normal',
        endpoint: '/api/doctors/general'
      },
      
      // Procedure actions
      'iv_cannulation': {
        title: 'IV Cannulation',
        description: 'IV cannulation procedure guide',
        priority: 'normal',
        endpoint: '/api/procedures/iv-cannulation'
      },
      'intubation': {
        title: 'Intubation',
        description: 'Endotracheal intubation procedure',
        priority: 'high',
        endpoint: '/api/procedures/intubation'
      },
      'cpr': {
        title: 'CPR Protocol',
        description: 'Cardiopulmonary resuscitation protocol',
        priority: 'critical',
        endpoint: '/api/procedures/cpr'
      },
      
      // Drug actions
      'drug_search': {
        title: 'Drug Database Access',
        description: 'Access comprehensive drug database',
        priority: 'normal',
        endpoint: '/api/drugs/search'
      },
      'drug_interactions': {
        title: 'Drug Interactions',
        description: 'Check drug interaction database',
        priority: 'high',
        endpoint: '/api/drugs/interactions'
      },
      'dosage_calculator': {
        title: 'Dosage Calculator',
        description: 'Medical dosage calculation tool',
        priority: 'normal',
        endpoint: '/api/drugs/dosage-calculator'
      },
      
      // Calculator actions
      'gfr_calculator': {
        title: 'GFR Calculator',
        description: 'Glomerular filtration rate calculator',
        priority: 'normal',
        endpoint: '/api/calculators/gfr'
      },
      'bmi_calculator': {
        title: 'BMI Calculator',
        description: 'Body mass index calculator',
        priority: 'normal',
        endpoint: '/api/calculators/bmi'
      },
      'apache_score': {
        title: 'APACHE Score',
        description: 'APACHE II severity scoring system',
        priority: 'normal',
        endpoint: '/api/calculators/apache'
      },
      
      // Guideline actions
      'cardiology_guidelines': {
        title: 'Cardiology Guidelines',
        description: 'Cardiology clinical guidelines',
        priority: 'normal',
        endpoint: '/api/guidelines/cardiology'
      },
      'emergency_guidelines': {
        title: 'Emergency Guidelines',
        description: 'Emergency medicine guidelines',
        priority: 'high',
        endpoint: '/api/guidelines/emergency'
      },
      'infectious_disease': {
        title: 'Infectious Disease Guidelines',
        description: 'Infectious disease management guidelines',
        priority: 'normal',
        endpoint: '/api/guidelines/infectious-disease'
      },
      
      // Planning actions
      'daily_schedule': {
        title: 'Daily Medical Schedule',
        description: 'Daily medical training schedule',
        priority: 'normal',
        endpoint: '/api/planning/daily-schedule'
      },
      'weekly_plan': {
        title: 'Weekly Learning Plan',
        description: 'Weekly learning objectives and plan',
        priority: 'normal',
        endpoint: '/api/planning/weekly-plan'
      },
      'exam_preparation': {
        title: 'Exam Preparation',
        description: 'Medical exam preparation resources',
        priority: 'high',
        endpoint: '/api/planning/exam-preparation'
      },
      
      // Notification actions
      'time_alerts': {
        title: 'Time Alert System',
        description: 'Time-based alert system',
        priority: 'normal',
        endpoint: '/api/notifications/time-alerts'
      },
      'emergency_alerts': {
        title: 'Emergency Alert System',
        description: 'Emergency notification system',
        priority: 'high',
        endpoint: '/api/notifications/emergency-alerts'
      },
      'performance_alerts': {
        title: 'Performance Alerts',
        description: 'Performance monitoring alerts',
        priority: 'normal',
        endpoint: '/api/notifications/performance-alerts'
      },
      
      // Analytics actions
      'performance_dashboard': {
        title: 'Performance Dashboard',
        description: 'Student performance analytics',
        priority: 'normal',
        endpoint: '/api/analytics/performance'
      },
      'active_cases': {
        title: 'Active Cases',
        description: 'Currently active medical cases',
        priority: 'normal',
        endpoint: '/api/analytics/active-cases'
      },
      'learning_progress': {
        title: 'Learning Progress',
        description: 'Learning progress tracking',
        priority: 'normal',
        endpoint: '/api/analytics/learning-progress'
      }
    };
    
    const action = actionMap[actionId];
    if (!action) {
      return res.status(404).json({
        success: false,
        error: 'Quick action not found',
        availableActions: Object.keys(actionMap)
      });
    }
    
    // Comprehensive protocol data for Sri Lankan medical students
    const protocolData = {
      // Emergency protocols
      'cardiac_arrest': {
        protocol: 'Cardiac Arrest Protocol',
        timeCritical: true,
        timeLimit: 'Immediate',
        steps: [
          'Check responsiveness and breathing',
          'Call for help and activate emergency response',
          'Start chest compressions (30:2 ratio)',
          'Apply AED when available',
          'Continue CPR until help arrives',
          'Prepare for advanced life support'
        ],
        medications: ['Adrenaline 1mg IV', 'Amiodarone 300mg IV', 'Atropine 1mg IV'],
        alert: 'CRITICAL: Immediate intervention required',
        sriLankanContext: 'Follow National Hospital protocols'
      },
      'anaphylaxis': {
        protocol: 'Anaphylaxis Management Protocol',
        timeCritical: true,
        timeLimit: 'Immediate',
        steps: [
          'Remove allergen if possible',
          'Administer adrenaline 0.5mg IM',
          'Lie patient flat with legs elevated',
          'Give oxygen if available',
          'Establish IV access',
          'Monitor vital signs closely'
        ],
        medications: ['Adrenaline 0.5mg IM', 'Hydrocortisone 200mg IV', 'Chlorpheniramine 10mg IV'],
        alert: 'URGENT: Anaphylaxis requires immediate treatment',
        sriLankanContext: 'Follow Sri Lankan anaphylaxis guidelines'
      },
      
      // Simulation protocols
      'start_simulation': {
        protocol: 'Patient Simulation Protocol',
        timeCritical: false,
        timeLimit: 'Flexible',
        steps: [
          'Select patient case',
          'Review patient history',
          'Begin assessment',
          'Make clinical decisions',
          'Receive feedback',
          'Review learning objectives'
        ],
        medications: ['Simulated medications available'],
        alert: 'Educational simulation mode',
        sriLankanContext: 'Sri Lankan patient scenarios available',
        availableCases: [
          'Cardiac Arrest Simulation',
          'Diabetic Emergency',
          'Trauma Assessment',
          'Respiratory Distress',
          'Pediatric Emergency'
        ],
        nextStep: 'Begin patient assessment',
        features: [
          'Real-time vital signs',
          'Interactive decision making',
          'Immediate feedback',
          'Progress tracking',
          'Performance analytics'
        ]
      },
      
      // Hospital information
      'national_hospital': {
        protocol: 'National Hospital Information',
        timeCritical: false,
        timeLimit: 'N/A',
        steps: [
          'Access hospital directory',
          'Find department contacts',
          'Check bed availability',
          'Review admission protocols',
          'Access emergency contacts'
        ],
        medications: ['Hospital formulary available'],
        alert: 'Hospital information system',
        sriLankanContext: 'Sri Lankan National Hospital protocols',
        hospital: 'National Hospital of Sri Lanka',
        location: 'Regent Street, Colombo 10, Sri Lanka',
        contact: '+94 11 2691111',
        specialties: [
          'Emergency Medicine',
          'Cardiology',
          'Neurology',
          'General Surgery',
          'Internal Medicine',
          'Pediatrics',
          'Obstetrics & Gynecology'
        ],
        currentStats: 'Current bed occupancy: 85%',
        realTime: true
      },
      
      // Doctor profiles
      'emergency_doctor': {
        protocol: 'Emergency Medicine Specialist Profile',
        timeCritical: false,
        timeLimit: 'N/A',
        steps: [
          'Review specialist qualifications',
          'Check availability schedule',
          'Access contact information',
          'Review specializations',
          'Check consultation protocols'
        ],
        medications: ['Specialist prescribing protocols'],
        alert: 'Emergency medicine specialist information',
        sriLankanContext: 'Sri Lankan emergency medicine specialists',
        doctor: 'Dr. Priya Fernando',
        specialty: 'Emergency Medicine',
        experience: '15 years',
        hospital: 'National Hospital of Sri Lanka',
        schedule: 'Monday-Friday, 8 AM - 6 PM',
        expertise: [
          'Trauma Management',
          'Cardiac Emergencies',
          'Pediatric Emergencies',
          'Toxicology',
          'Disaster Medicine'
        ],
        contact: '+94 11 2691111 ext 234',
        availability: 'Available for consultation'
      },
      
      // Medical procedures
      'iv_cannulation': {
        protocol: 'IV Cannulation Procedure',
        timeCritical: false,
        timeLimit: '10-15 minutes',
        steps: [
          'Assess patient and explain procedure',
          'Select appropriate vein',
          'Apply tourniquet',
          'Clean site with antiseptic',
          'Insert cannula at 15-30 degree angle',
          'Secure cannula and document'
        ],
        medications: ['Local anesthetic if needed'],
        alert: 'Standard procedure - follow aseptic technique',
        sriLankanContext: 'Sri Lankan IV cannulation guidelines',
        procedure: 'IV Cannulation',
        equipment: [
          'IV cannula (18-22G)',
          'Tourniquet',
          'Antiseptic solution',
          'Gauze and tape',
          'Saline flush',
          'Gloves and protective equipment'
        ],
        complications: [
          'Infiltration',
          'Phlebitis',
          'Infection',
          'Hematoma',
          'Air embolism'
        ],
        difficulty: 'Moderate',
        duration: '10-15 minutes'
      },
      
      // Drug database
      'drug_search': {
        protocol: 'Drug Database Search',
        timeCritical: false,
        timeLimit: 'N/A',
        steps: [
          'Enter drug name or category',
          'Review drug information',
          'Check contraindications',
          'Review dosing guidelines',
          'Check interactions',
          'Access patient information'
        ],
        medications: ['Comprehensive drug database'],
        alert: 'Drug information system',
        sriLankanContext: 'Sri Lankan drug formulary included'
      },
      
      // Medical calculators
      'gfr_calculator': {
        protocol: 'GFR Calculator',
        timeCritical: false,
        timeLimit: 'N/A',
        steps: [
          'Enter patient age and gender',
          'Input serum creatinine',
          'Enter weight and height',
          'Calculate GFR',
          'Interpret results',
          'Document findings'
        ],
        medications: ['Dose adjustments based on GFR'],
        alert: 'Renal function assessment tool',
        sriLankanContext: 'Adapted for Sri Lankan population'
      },
      
      // Clinical guidelines
      'cardiology_guidelines': {
        protocol: 'Cardiology Clinical Guidelines',
        timeCritical: false,
        timeLimit: 'N/A',
        steps: [
          'Access cardiology guidelines',
          'Review diagnostic criteria',
          'Check treatment protocols',
          'Review follow-up guidelines',
          'Access patient education materials'
        ],
        medications: ['Cardiology medication protocols'],
        alert: 'Clinical guideline system',
        sriLankanContext: 'Sri Lankan cardiology guidelines'
      },
      
      // Planning tools
      'daily_schedule': {
        protocol: 'Daily Medical Schedule',
        timeCritical: false,
        timeLimit: 'Daily',
        steps: [
          'Review daily objectives',
          'Check patient appointments',
          'Review learning goals',
          'Plan study sessions',
          'Schedule assessments'
        ],
        medications: ['Medication administration schedule'],
        alert: 'Daily planning tool',
        sriLankanContext: 'Sri Lankan medical education schedule'
      },
      
      // Alert systems
      'time_alerts': {
        protocol: 'Time Alert System',
        timeCritical: false,
        timeLimit: 'Configurable',
        steps: [
          'Set alert parameters',
          'Configure notification preferences',
          'Test alert system',
          'Monitor alert delivery',
          'Review alert history'
        ],
        medications: ['Medication reminder alerts'],
        alert: 'Time-based alert system',
        sriLankanContext: 'Sri Lankan time zone and schedule'
      },
      
      // Emergency alerts
      'emergency_alerts': {
        protocol: 'Emergency Alert System',
        timeCritical: true,
        timeLimit: 'Immediate',
        steps: [
          'Activate emergency alert',
          'Notify relevant personnel',
          'Coordinate response',
          'Monitor situation',
          'Document incident'
        ],
        medications: ['Emergency medication protocols'],
        alert: 'Emergency notification system',
        sriLankanContext: 'Sri Lankan emergency response protocols'
      },
      
      // Analytics
      'performance_dashboard': {
        protocol: 'Performance Analytics Dashboard',
        timeCritical: false,
        timeLimit: 'N/A',
        steps: [
          'Review performance metrics',
          'Analyze learning progress',
          'Identify areas for improvement',
          'Set learning goals',
          'Track achievements'
        ],
        medications: ['Performance tracking tools'],
        alert: 'Analytics dashboard',
        sriLankanContext: 'Sri Lankan medical education metrics'
      },
      
      // Active cases
      'active_cases': {
        protocol: 'Active Cases Management',
        timeCritical: false,
        timeLimit: 'Ongoing',
        steps: [
          'Review active patient cases',
          'Update case progress',
          'Document clinical decisions',
          'Plan follow-up care',
          'Coordinate with team'
        ],
        medications: ['Case-specific medication plans'],
        alert: 'Active case management system',
        sriLankanContext: 'Sri Lankan patient case management'
      }
    };

    // Get protocol data for the action
    const protocol = protocolData[actionId] || {
      protocol: action.title,
      timeCritical: false,
      timeLimit: 'N/A',
      steps: ['Standard procedure'],
      medications: ['As required'],
      alert: 'Standard alert',
      sriLankanContext: 'Sri Lankan medical practice'
    };

    // Simulate action execution with comprehensive protocol data
    const result = {
      actionId,
      studentId,
      title: action.title,
      description: action.description,
      priority: action.priority,
      protocol: protocol.protocol,
      timeCritical: protocol.timeCritical,
      timeLimit: protocol.timeLimit,
      steps: protocol.steps,
      medications: protocol.medications,
      alert: protocol.alert,
      sriLankanContext: protocol.sriLankanContext,
      // Additional properties for specific action types
      availableCases: protocol.availableCases || [],
      nextStep: protocol.nextStep || 'Proceed with standard protocol',
      features: protocol.features || [],
      hospital: protocol.hospital || null,
      location: protocol.location || null,
      contact: protocol.contact || null,
      specialties: protocol.specialties || [],
      currentStats: protocol.currentStats || null,
      realTime: protocol.realTime || false,
      doctor: protocol.doctor || null,
      specialty: protocol.specialty || null,
      experience: protocol.experience || null,
      schedule: protocol.schedule || null,
      expertise: protocol.expertise || [],
      availability: protocol.availability || null,
      procedure: protocol.procedure || null,
      equipment: protocol.equipment || [],
      complications: protocol.complications || [],
      difficulty: protocol.difficulty || null,
      duration: protocol.duration || null,
      status: 'executed',
      timestamp: new Date().toISOString(),
      message: `Successfully executed ${action.title}`,
      endpoint: action.endpoint,
      executionTime: Math.random() * 1000 + 100, // Simulate execution time
      success: true
    };
    
    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    logger.error('❌ Error executing quick action:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute quick action'
    });
  }
});

// Get all students summary
router.get('/students', async (req, res) => {
  try {
    logger.info('📊 Getting all students summary');
    
    const students = Object.values(dashboardData.students).map(student => ({
      id: student.id,
      name: student.name,
      level: student.level,
      progress: student.progress,
      completedCases: student.completedCases,
      averageScore: student.averageScore,
      lastActive: student.lastActive,
      currentTask: student.currentTask,
      alertCount: (dashboardData.alerts[student.id] || []).length
    }));
    
    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    logger.error('❌ Error getting students summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get students summary'
    });
  }
});

// Get system statistics
router.get('/statistics', async (req, res) => {
  try {
    logger.info('📊 Getting system statistics');
    
    const stats = {
      totalStudents: Object.keys(dashboardData.students).length,
      totalCases: Object.values(dashboardData.students).reduce((sum, s) => sum + s.completedCases, 0),
      averageProgress: Object.values(dashboardData.students).reduce((sum, s) => sum + s.progress, 0) / Object.keys(dashboardData.students).length,
      averageScore: Object.values(dashboardData.students).reduce((sum, s) => sum + s.averageScore, 0) / Object.keys(dashboardData.students).length,
      totalAlerts: Object.values(dashboardData.alerts).flat().length,
      activeStudents: Object.values(dashboardData.students).filter(s => 
        new Date(s.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      systemHealth: 'excellent',
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('❌ Error getting system statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get system statistics'
    });
  }
});

// Time alert system endpoint
router.post('/time-alert', async (req, res) => {
  try {
    const { studentId, alertType, message, scheduledTime } = req.body;
    logger.info(`⏰ Setting time alert for student ${studentId}`);
    
    const timeAlert = {
      id: `time_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      alertType: alertType || 'reminder',
      message: message || 'Time-based reminder',
      scheduledTime: scheduledTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Default 1 hour from now
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      priority: alertType === 'emergency' ? 'high' : 'normal'
    };
    
    // Add to student's alerts
    if (!dashboardData.alerts[studentId]) {
      dashboardData.alerts[studentId] = [];
    }
    dashboardData.alerts[studentId].push(timeAlert);
    
    res.json({
      success: true,
      data: timeAlert,
      message: 'Time alert scheduled successfully'
    });
  } catch (error) {
    logger.error('❌ Error setting time alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set time alert'
    });
  }
});

// Get comprehensive dashboard
router.get('/dashboard', async (req, res) => {
  try {
    logger.info('📊 Getting comprehensive dashboard');
    
    const dashboard = {
      emergency: {
        buttons: [
          { id: 'cardiac_arrest', title: 'Cardiac Arrest Protocol', icon: 'heart', priority: 'critical' },
          { id: 'anaphylaxis', title: 'Anaphylaxis Management', icon: 'alert', priority: 'critical' },
          { id: 'stroke', title: 'Stroke Protocol', icon: 'brain', priority: 'high' },
          { id: 'trauma', title: 'Trauma Assessment', icon: 'injury', priority: 'high' }
        ]
      },
      simulation: {
        buttons: [
          { id: 'start_simulation', title: 'Start Patient Simulation', icon: 'play', priority: 'normal' },
          { id: 'case_study', title: 'Case Study Mode', icon: 'book', priority: 'normal' },
          { id: 'virtual_patient', title: 'Virtual Patient', icon: 'user', priority: 'normal' }
        ]
      },
      hospitals: {
        buttons: [
          { id: 'national_hospital', title: 'National Hospital Info', icon: 'hospital', priority: 'normal' },
          { id: 'teaching_hospital', title: 'Teaching Hospital Info', icon: 'school', priority: 'normal' },
          { id: 'emergency_center', title: 'Emergency Center', icon: 'emergency', priority: 'high' }
        ]
      },
      doctors: {
        buttons: [
          { id: 'emergency_doctor', title: 'Emergency Doctor Profile', icon: 'doctor', priority: 'normal' },
          { id: 'specialist', title: 'Specialist Directory', icon: 'specialist', priority: 'normal' },
          { id: 'consultant', title: 'Consultant Info', icon: 'consultant', priority: 'normal' }
        ]
      },
      procedures: {
        buttons: [
          { id: 'surgical', title: 'Surgical Procedures', icon: 'scalpel', priority: 'normal' },
          { id: 'diagnostic', title: 'Diagnostic Procedures', icon: 'microscope', priority: 'normal' },
          { id: 'therapeutic', title: 'Therapeutic Procedures', icon: 'treatment', priority: 'normal' }
        ]
      },
      drugs: {
        buttons: [
          { id: 'emergency_drugs', title: 'Emergency Drugs', icon: 'pill', priority: 'high' },
          { id: 'antibiotics', title: 'Antibiotics Guide', icon: 'antibiotic', priority: 'normal' },
          { id: 'analgesics', title: 'Analgesics', icon: 'pain', priority: 'normal' }
        ]
      },
      calculators: {
        buttons: [
          { id: 'gfr_calculator', title: 'GFR Calculator', icon: 'calculator', priority: 'normal' },
          { id: 'bmi_calculator', title: 'BMI Calculator', icon: 'weight', priority: 'normal' },
          { id: 'dose_calculator', title: 'Dose Calculator', icon: 'dose', priority: 'normal' }
        ]
      },
      guidelines: {
        buttons: [
          { id: 'cardiology', title: 'Cardiology Guidelines', icon: 'heart', priority: 'normal' },
          { id: 'neurology', title: 'Neurology Guidelines', icon: 'brain', priority: 'normal' },
          { id: 'pediatrics', title: 'Pediatrics Guidelines', icon: 'child', priority: 'normal' }
        ]
      },
      planning: {
        buttons: [
          { id: 'daily_schedule', title: 'Daily Schedule', icon: 'calendar', priority: 'normal' },
          { id: 'time_alerts', title: 'Time Alerts', icon: 'clock', priority: 'normal' },
          { id: 'task_manager', title: 'Task Manager', icon: 'tasks', priority: 'normal' }
        ]
      },
      notifications: {
        buttons: [
          { id: 'emergency_alerts', title: 'Emergency Alerts', icon: 'alert', priority: 'high' },
          { id: 'patient_alerts', title: 'Patient Alerts', icon: 'patient', priority: 'normal' },
          { id: 'system_alerts', title: 'System Alerts', icon: 'system', priority: 'normal' }
        ]
      },
      analytics: {
        buttons: [
          { id: 'performance', title: 'Performance Analytics', icon: 'chart', priority: 'normal' },
          { id: 'active_cases', title: 'Active Cases', icon: 'cases', priority: 'normal' },
          { id: 'progress_tracking', title: 'Progress Tracking', icon: 'progress', priority: 'normal' }
        ]
      }
    };
    
    const totalButtons = Object.values(dashboard).reduce((sum, section) => sum + section.buttons.length, 0);
    const sections = Object.keys(dashboard);
    
    res.json({
      success: true,
      totalButtons,
      sections,
      dashboard
    });
  } catch (error) {
    logger.error('❌ Error getting comprehensive dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get comprehensive dashboard'
    });
  }
});

// Enhanced quick action with emergency protocols
router.post('/quick-action', async (req, res) => {
  try {
    const { actionId, studentId } = req.body;
    logger.info(`📊 Executing quick action ${actionId} for student ${studentId}`);
    
    let result = {
      actionId,
      studentId,
      status: 'executed',
      timestamp: new Date().toISOString(),
      message: `Successfully executed ${actionId}`
    };
    
    // Handle specific emergency protocols
    if (actionId === 'cardiac_arrest') {
      result = {
        ...result,
        protocol: 'Cardiac Arrest Protocol',
        timeCritical: true,
        timeLimit: 'Immediate',
        steps: [
          'Check responsiveness',
          'Call for help',
          'Start chest compressions',
          'Give rescue breaths',
          'Continue CPR until help arrives'
        ],
        medications: ['Epinephrine', 'Amiodarone', 'Atropine'],
        alert: 'CRITICAL: Cardiac arrest in progress'
      };
    } else if (actionId === 'anaphylaxis') {
      result = {
        ...result,
        protocol: 'Anaphylaxis Management',
        timeCritical: true,
        timeLimit: '5 minutes',
        steps: [
          'Remove allergen if possible',
          'Administer epinephrine',
          'Position patient supine',
          'Monitor vital signs',
          'Prepare for intubation if needed'
        ],
        medications: ['Epinephrine', 'Antihistamines', 'Corticosteroids'],
        alert: 'URGENT: Anaphylaxis in progress'
      };
    } else if (actionId === 'start_simulation') {
      result = {
        ...result,
        protocol: 'Patient Simulation',
        simulationId: `sim_${Date.now()}`,
        patientType: 'random',
        difficulty: 'intermediate',
        estimatedDuration: '30 minutes'
      };
    } else if (actionId === 'national_hospital') {
      result = {
        ...result,
        hospital: 'National Hospital of Sri Lanka',
        location: 'Colombo',
        specialties: ['Emergency Medicine', 'Cardiology', 'Neurology'],
        contact: '+94-11-2691111'
      };
    } else if (actionId === 'emergency_doctor') {
      result = {
        ...result,
        doctor: 'Dr. Emergency Specialist',
        department: 'Emergency Medicine',
        experience: '15 years',
        specializations: ['Trauma', 'Critical Care', 'Resuscitation']
      };
    } else if (actionId === 'gfr_calculator') {
      result = {
        ...result,
        calculator: 'GFR Calculator',
        formula: 'Cockcroft-Gault',
        inputs: ['Age', 'Weight', 'Serum Creatinine', 'Gender'],
        output: 'Estimated GFR'
      };
    } else if (actionId === 'cardiology') {
      result = {
        ...result,
        guidelines: 'Cardiology Guidelines',
        source: 'American Heart Association',
        lastUpdated: '2024',
        topics: ['Hypertension', 'Heart Failure', 'Arrhythmias']
      };
    } else if (actionId === 'daily_schedule') {
      result = {
        ...result,
        schedule: 'Daily Medical Schedule',
        date: new Date().toISOString().split('T')[0],
        activities: [
          'Morning rounds',
          'Patient consultations',
          'Lunch break',
          'Afternoon procedures',
          'Evening review'
        ]
      };
    } else if (actionId === 'time_alerts') {
      result = {
        ...result,
        alerts: 'Time Alert System',
        activeAlerts: 3,
        types: ['Medication reminders', 'Patient check-ins', 'Meeting reminders']
      };
    } else if (actionId === 'emergency_alerts') {
      result = {
        ...result,
        alerts: 'Emergency Alert System',
        activeAlerts: 2,
        types: ['Critical patient', 'System maintenance']
      };
    } else if (actionId === 'performance') {
      result = {
        ...result,
        analytics: 'Performance Analytics',
        metrics: ['Cases completed', 'Average score', 'Time efficiency'],
        period: 'Last 30 days'
      };
    } else if (actionId === 'active_cases') {
      result = {
        ...result,
        cases: 'Active Cases',
        totalCases: 5,
        caseTypes: ['Cardiology', 'Neurology', 'Emergency']
      };
    }
    
    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    logger.error('❌ Error executing quick action:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute quick action'
    });
  }
});

module.exports = router;
