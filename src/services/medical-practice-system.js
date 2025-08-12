const { logger } = require('../utils/logger');

// Advanced Medical Practice System for Sri Lankan Medical Students
class MedicalPracticeSystem {
  constructor() {
    this.activeCases = new Map();
    this.studentProgress = new Map();
    this.dailyTasks = new Map();
    this.notifications = new Map();
    this.clinicalScenarios = this.initializeAdvancedClinicalScenarios();
    this.diagnosticChallenges = this.initializeDiagnosticChallenges();
    this.medicalResponsibilities = this.initializeMedicalResponsibilities();
  }

  // Initialize Advanced Clinical Scenarios for Real Doctor Practice
  initializeAdvancedClinicalScenarios() {
    return {
      'Emergency Department': {
        'Chest Pain Emergency': {
          scenario: `You are the on-call doctor in the Emergency Department at Colombo National Hospital. 
          A 65-year-old male patient presents with severe chest pain radiating to left arm and jaw, 
          sweating, shortness of breath, and nausea. Pain started 2 hours ago and is worse with exertion. 
          Patient has history of hypertension and diabetes. Vital signs: BP 160/95, HR 110, RR 24, Temp 37.2°C, SpO2 94%.`,
          patientData: {
            name: 'Mr. Perera',
            age: 65,
            gender: 'Male',
            occupation: 'Retired Bank Manager',
            location: 'Colombo',
            vitalSigns: {
              bloodPressure: '160/95 mmHg',
              heartRate: '110/min',
              respiratoryRate: '24/min',
              temperature: '37.2°C',
              oxygenSaturation: '94%'
            },
            history: {
              presenting: 'Severe chest pain radiating to left arm and jaw, sweating, shortness of breath, nausea',
              onset: '2 hours ago',
              duration: '2 hours',
              severity: 'Severe (8/10)',
              aggravating: 'Exertion',
              relieving: 'None',
              associated: 'Sweating, shortness of breath, nausea'
            },
            pastMedical: ['Hypertension (10 years)', 'Diabetes Type 2 (8 years)', 'Hyperlipidemia'],
            medications: ['Amlodipine 5mg OD', 'Metformin 500mg BD', 'Atorvastatin 20mg OD'],
            socialHistory: ['Former smoker (quit 5 years ago)', 'Moderate alcohol use', 'Sedentary lifestyle'],
            familyHistory: ['Father - MI at age 60', 'Mother - Diabetes', 'Brother - Hypertension']
          },
          requiredActions: [
            'Immediate ECG interpretation',
            'Cardiac enzyme ordering',
            'Aspirin administration',
            'Oxygen therapy',
            'IV access establishment',
            'Pain management',
            'Risk stratification',
            'Disposition decision'
          ],
          timeCritical: true,
          timeLimit: 15, // minutes
          difficulty: 'Advanced',
          learningObjectives: [
            'Recognize acute coronary syndrome',
            'Interpret ECG findings',
            'Implement STEMI protocol',
            'Manage cardiac emergency',
            'Make disposition decisions'
          ]
        },

        'Dengue Hemorrhagic Fever': {
          scenario: `You are the medical officer in the Medical Ward at Kandy Teaching Hospital. 
          A 28-year-old female presents with high fever (39.5°C) for 5 days, severe headache, 
          retro-orbital pain, myalgia, and now severe abdominal pain with persistent vomiting. 
          Patient has petechial rash and positive tourniquet test. Vital signs: BP 90/60, HR 120, RR 28, Temp 39.5°C.`,
          patientData: {
            name: 'Ms. Silva',
            age: 28,
            gender: 'Female',
            occupation: 'Teacher',
            location: 'Kandy',
            vitalSigns: {
              bloodPressure: '90/60 mmHg',
              heartRate: '120/min',
              respiratoryRate: '28/min',
              temperature: '39.5°C',
              oxygenSaturation: '96%'
            },
            history: {
              presenting: 'High fever, severe headache, retro-orbital pain, myalgia, severe abdominal pain, persistent vomiting',
              onset: '5 days ago',
              duration: '5 days',
              severity: 'Severe',
              aggravating: 'Movement',
              relieving: 'None',
              associated: 'Petechial rash, positive tourniquet test'
            },
            pastMedical: ['None significant'],
            medications: ['Paracetamol 1g QID'],
            socialHistory: ['Lives in dengue-endemic area', 'No travel history'],
            familyHistory: ['Sister had dengue 2 years ago']
          },
          requiredActions: [
            'Dengue NS1 antigen test',
            'Complete blood count',
            'Hematocrit monitoring',
            'Platelet count',
            'IV fluid resuscitation',
            'Warning signs assessment',
            'Shock management',
            'ICU referral decision'
          ],
          timeCritical: true,
          timeLimit: 20,
          difficulty: 'Advanced',
          learningObjectives: [
            'Recognize dengue warning signs',
            'Manage dengue hemorrhagic fever',
            'Monitor for shock',
            'Implement fluid resuscitation',
            'Make ICU referral decisions'
          ]
        },

        'Bacterial Meningitis': {
          scenario: `You are the medical officer in the Emergency Department at Jaffna Teaching Hospital. 
          A 25-year-old male presents with severe headache, neck stiffness, photophobia, high fever (40°C), 
          and altered consciousness (GCS 12/15). Patient has petechial rash and positive Kernig's sign. 
          Vital signs: BP 110/70, HR 110, RR 24, Temp 40°C, SpO2 95%.`,
          patientData: {
            name: 'Mr. Kumar',
            age: 25,
            gender: 'Male',
            occupation: 'University Student',
            location: 'Jaffna',
            vitalSigns: {
              bloodPressure: '110/70 mmHg',
              heartRate: '110/min',
              respiratoryRate: '24/min',
              temperature: '40°C',
              oxygenSaturation: '95%'
            },
            history: {
              presenting: 'Severe headache, neck stiffness, photophobia, high fever, altered consciousness',
              onset: '24 hours ago',
              duration: '24 hours',
              severity: 'Severe',
              aggravating: 'Light, movement',
              relieving: 'None',
              associated: 'Petechial rash, positive Kernig\'s sign'
            },
            pastMedical: ['None significant'],
            medications: ['None'],
            socialHistory: ['Lives in university hostel', 'No recent travel'],
            familyHistory: ['No significant family history']
          },
          requiredActions: [
            'Lumbar puncture preparation',
            'Blood cultures',
            'CT head (if indicated)',
            'IV antibiotics (ceftriaxone + vancomycin)',
            'Dexamethasone administration',
            'ICP monitoring',
            'Seizure prophylaxis',
            'ICU admission'
          ],
          timeCritical: true,
          timeLimit: 25,
          difficulty: 'Advanced',
          learningObjectives: [
            'Recognize bacterial meningitis',
            'Perform lumbar puncture',
            'Manage meningococcal disease',
            'Implement antibiotic therapy',
            'Monitor for complications'
          ]
        }
      },

      'Medical Ward': {
        'Diabetic Ketoacidosis': {
          scenario: `You are the medical officer in the Medical Ward at Galle Teaching Hospital. 
          A 45-year-old female with known Type 1 diabetes presents with polyuria, polydipsia, 
          weight loss, nausea, vomiting, and altered mental status. Patient has Kussmaul breathing 
          and fruity breath odor. Blood glucose: 650 mg/dL, pH: 7.1, HCO3: 8 mEq/L.`,
          patientData: {
            name: 'Mrs. Fernando',
            age: 45,
            gender: 'Female',
            occupation: 'Housewife',
            location: 'Galle',
            vitalSigns: {
              bloodPressure: '100/60 mmHg',
              heartRate: '120/min',
              respiratoryRate: '32/min',
              temperature: '37.8°C',
              oxygenSaturation: '98%'
            },
            history: {
              presenting: 'Polyuria, polydipsia, weight loss, nausea, vomiting, altered mental status',
              onset: '3 days ago',
              duration: '3 days',
              severity: 'Severe',
              aggravating: 'None',
              relieving: 'None',
              associated: 'Kussmaul breathing, fruity breath odor'
            },
            pastMedical: ['Type 1 Diabetes (20 years)', 'Diabetic retinopathy'],
            medications: ['Insulin glargine 30 units OD', 'Insulin aspart TDS'],
            socialHistory: ['Poor compliance with insulin', 'Irregular follow-up'],
            familyHistory: ['Father - Type 2 Diabetes', 'Mother - Hypertension']
          },
          requiredActions: [
            'IV fluid resuscitation',
            'IV insulin therapy',
            'Electrolyte monitoring',
            'ABG monitoring',
            'Ketone monitoring',
            'Underlying cause identification',
            'ICU admission decision',
            'Diabetes education planning'
          ],
          timeCritical: true,
          timeLimit: 30,
          difficulty: 'Advanced',
          learningObjectives: [
            'Manage diabetic ketoacidosis',
            'Interpret ABG results',
            'Calculate insulin requirements',
            'Monitor electrolytes',
            'Prevent complications'
          ]
        }
      },

      'Intensive Care Unit': {
        'Septic Shock': {
          scenario: `You are the ICU medical officer at Anuradhapura Teaching Hospital. 
          A 70-year-old male with community-acquired pneumonia presents with fever, 
          hypotension (BP 80/50), tachycardia (HR 130), tachypnea (RR 30), and altered mental status. 
          Lactate: 6.2 mmol/L, WBC: 22,000/μL, CRP: 180 mg/L.`,
          patientData: {
            name: 'Mr. Bandara',
            age: 70,
            gender: 'Male',
            occupation: 'Farmer',
            location: 'Anuradhapura',
            vitalSigns: {
              bloodPressure: '80/50 mmHg',
              heartRate: '130/min',
              respiratoryRate: '30/min',
              temperature: '39.2°C',
              oxygenSaturation: '88%'
            },
            history: {
              presenting: 'Fever, cough, shortness of breath, confusion',
              onset: '5 days ago',
              duration: '5 days',
              severity: 'Severe',
              aggravating: 'None',
              relieving: 'None',
              associated: 'Hypotension, altered mental status'
            },
            pastMedical: ['COPD', 'Hypertension', 'Diabetes'],
            medications: ['Salbutamol inhaler', 'Amlodipine', 'Metformin'],
            socialHistory: ['Smoker (40 pack-years)', 'Lives in rural area'],
            familyHistory: ['No significant family history']
          },
          requiredActions: [
            'SEPSIS BUNDLE implementation',
            'IV antibiotics within 1 hour',
            'Fluid resuscitation (30ml/kg)',
            'Vasopressor therapy',
            'Source control',
            'Corticosteroids',
            'Mechanical ventilation',
            'Hemodynamic monitoring'
          ],
          timeCritical: true,
          timeLimit: 45,
          difficulty: 'Expert',
          learningObjectives: [
            'Implement sepsis bundle',
            'Manage septic shock',
            'Use vasopressors',
            'Monitor hemodynamics',
            'Prevent organ failure'
          ]
        }
      }
    };
  }

  // Initialize Diagnostic Challenges
  initializeDiagnosticChallenges() {
    return {
      'ECG Interpretation': {
        'STEMI': {
          image: 'ECG_STEMI_Lead_II.png',
          description: 'Interpret this ECG and provide immediate management plan',
          findings: ['ST elevation in leads II, III, aVF', 'Q waves in inferior leads', 'T wave inversion'],
          diagnosis: 'Inferior STEMI',
          management: 'Immediate PCI or thrombolysis',
          timeLimit: 5,
          difficulty: 'Advanced'
        },
        'Atrial Fibrillation': {
          image: 'ECG_AF.png',
          description: 'Interpret this ECG and provide management plan',
          findings: ['Irregularly irregular rhythm', 'No P waves', 'Variable QRS complexes'],
          diagnosis: 'Atrial Fibrillation',
          management: 'Rate control, anticoagulation, rhythm control if indicated',
          timeLimit: 5,
          difficulty: 'Intermediate'
        }
      },
      'Chest X-ray Interpretation': {
        'Pneumonia': {
          image: 'CXR_Pneumonia.png',
          description: 'Interpret this chest X-ray and provide management plan',
          findings: ['Right lower lobe infiltrate', 'Air bronchograms', 'Pleural effusion'],
          diagnosis: 'Right lower lobe pneumonia',
          management: 'Antibiotics, oxygen therapy, chest physiotherapy',
          timeLimit: 8,
          difficulty: 'Intermediate'
        },
        'Pneumothorax': {
          image: 'CXR_Pneumothorax.png',
          description: 'Interpret this chest X-ray and provide immediate management',
          findings: ['Lung edge visible', 'No lung markings peripherally', 'Mediastinal shift'],
          diagnosis: 'Tension pneumothorax',
          management: 'Immediate needle decompression, chest tube insertion',
          timeLimit: 3,
          difficulty: 'Advanced'
        }
      },
      'Laboratory Results': {
        'DKA': {
          results: {
            'Blood Glucose': '650 mg/dL',
            'pH': '7.1',
            'HCO3': '8 mEq/L',
            'K+': '5.2 mEq/L',
            'Na+': '130 mEq/L',
            'Ketones': 'Positive (4+)',
            'WBC': '15,000/μL'
          },
          description: 'Interpret these laboratory results and provide management plan',
          diagnosis: 'Diabetic Ketoacidosis',
          management: 'IV fluids, IV insulin, electrolyte replacement',
          timeLimit: 10,
          difficulty: 'Advanced'
        },
        'Sepsis': {
          results: {
            'WBC': '22,000/μL',
            'CRP': '180 mg/L',
            'Procalcitonin': '15 ng/mL',
            'Lactate': '6.2 mmol/L',
            'Creatinine': '2.8 mg/dL',
            'Platelets': '85,000/μL'
          },
          description: 'Interpret these laboratory results and provide management plan',
          diagnosis: 'Severe Sepsis with Acute Kidney Injury',
          management: 'SEPSIS BUNDLE, IV antibiotics, fluid resuscitation',
          timeLimit: 8,
          difficulty: 'Advanced'
        }
      }
    };
  }

  // Initialize Medical Responsibilities
  initializeMedicalResponsibilities() {
    return {
      'Daily Ward Rounds': {
        description: 'Conduct comprehensive ward rounds with patient assessment, treatment planning, and documentation',
        tasks: [
          'Review patient charts and vital signs',
          'Perform physical examination',
          'Interpret laboratory results',
          'Update treatment plans',
          'Write progress notes',
          'Communicate with patients and families',
          'Coordinate with nursing staff',
          'Order investigations and medications'
        ],
        timeRequired: 120, // minutes
        priority: 'High',
        frequency: 'Daily'
      },
      'Emergency Department Shifts': {
        description: 'Manage emergency cases with rapid assessment and intervention',
        tasks: [
          'Triage patients by urgency',
          'Perform rapid assessment',
          'Order immediate investigations',
          'Provide emergency interventions',
          'Coordinate with specialists',
          'Document emergency care',
          'Handover to next shift'
        ],
        timeRequired: 480, // minutes (8 hours)
        priority: 'Critical',
        frequency: 'As scheduled'
      },
      'ICU Management': {
        description: 'Manage critically ill patients with advanced monitoring and interventions',
        tasks: [
          'Monitor hemodynamic parameters',
          'Manage mechanical ventilation',
          'Administer vasopressors',
          'Monitor organ function',
          'Coordinate multidisciplinary care',
          'Communicate with families',
          'Document critical care'
        ],
        timeRequired: 480,
        priority: 'Critical',
        frequency: 'As scheduled'
      },
      'Outpatient Clinic': {
        description: 'Manage outpatient consultations with comprehensive assessment and follow-up',
        tasks: [
          'Review patient history',
          'Perform focused examination',
          'Order appropriate investigations',
          'Prescribe medications',
          'Provide patient education',
          'Schedule follow-up',
          'Document consultation'
        ],
        timeRequired: 240,
        priority: 'Medium',
        frequency: 'Weekly'
      }
    };
  }

  // Start Medical Practice Session
  startPracticeSession(studentId, scenarioType, scenarioName) {
    try {
      const scenario = this.clinicalScenarios[scenarioType][scenarioName];
      if (!scenario) {
        throw new Error('Scenario not found');
      }

      const session = {
        studentId,
        scenarioType,
        scenarioName,
        startTime: new Date(),
        patientData: scenario.patientData,
        requiredActions: scenario.requiredActions,
        timeLimit: scenario.timeLimit,
        difficulty: scenario.difficulty,
        learningObjectives: scenario.learningObjectives,
        actionsTaken: [],
        decisionsMade: [],
        timeRemaining: scenario.timeLimit * 60, // Convert to seconds
        status: 'active'
      };

      this.activeCases.set(studentId, session);
      
      // Set up notifications for time-critical scenarios
      if (scenario.timeCritical) {
        this.setupTimeNotifications(studentId, session);
      }

      logger.info('🏥 Medical practice session started', { studentId, scenarioName });
      return session;
    } catch (error) {
      logger.error('❌ Error starting practice session:', error);
      throw error;
    }
  }

  // Take Medical Action
  takeAction(studentId, action, details) {
    try {
      const session = this.activeCases.get(studentId);
      if (!session) {
        throw new Error('No active session found');
      }

      const actionRecord = {
        action,
        details,
        timestamp: new Date(),
        timeRemaining: session.timeRemaining
      };

      session.actionsTaken.push(actionRecord);
      
      // Evaluate action correctness
      const evaluation = this.evaluateAction(action, session.requiredActions);
      actionRecord.evaluation = evaluation;

      // Update progress
      this.updateStudentProgress(studentId, action, evaluation);

      logger.info('🏥 Medical action taken', { studentId, action, evaluation });
      return { actionRecord, evaluation };
    } catch (error) {
      logger.error('❌ Error taking medical action:', error);
      throw error;
    }
  }

  // Make Medical Decision
  makeDecision(studentId, decision, reasoning) {
    try {
      const session = this.activeCases.get(studentId);
      if (!session) {
        throw new Error('No active session found');
      }

      const decisionRecord = {
        decision,
        reasoning,
        timestamp: new Date(),
        timeRemaining: session.timeRemaining
      };

      session.decisionsMade.push(decisionRecord);
      
      // Evaluate decision quality
      const evaluation = this.evaluateDecision(decision, session.scenarioName);
      decisionRecord.evaluation = evaluation;

      logger.info('🏥 Medical decision made', { studentId, decision, evaluation });
      return { decisionRecord, evaluation };
    } catch (error) {
      logger.error('❌ Error making medical decision:', error);
      throw error;
    }
  }

  // Complete Practice Session
  completeSession(studentId) {
    try {
      const session = this.activeCases.get(studentId);
      if (!session) {
        throw new Error('No active session found');
      }

      session.endTime = new Date();
      session.duration = (session.endTime - session.startTime) / 1000 / 60; // minutes
      session.status = 'completed';

      // Calculate performance metrics
      const performance = this.calculatePerformance(session);
      session.performance = performance;

      // Update student progress
      this.updateStudentProgress(studentId, 'session_completion', performance);

      // Generate feedback
      const feedback = this.generateFeedback(session);
      session.feedback = feedback;

      this.activeCases.delete(studentId);
      
      logger.info('🏥 Medical practice session completed', { studentId, performance });
      return { session, performance, feedback };
    } catch (error) {
      logger.error('❌ Error completing practice session:', error);
      throw error;
    }
  }

  // Set Daily Medical Tasks
  setDailyTasks(studentId, tasks) {
    try {
      const dailyTasks = {
        studentId,
        date: new Date().toDateString(),
        tasks: tasks.map(task => ({
          ...task,
          status: 'pending',
          startTime: null,
          endTime: null,
          completed: false
        })),
        notifications: []
      };

      this.dailyTasks.set(studentId, dailyTasks);
      
      // Set up notifications for each task
      tasks.forEach(task => {
        this.setupTaskNotification(studentId, task);
      });

      logger.info('📋 Daily medical tasks set', { studentId, taskCount: tasks.length });
      return dailyTasks;
    } catch (error) {
      logger.error('❌ Error setting daily tasks:', error);
      throw error;
    }
  }

  // Complete Daily Task
  completeTask(studentId, taskId) {
    try {
      const dailyTasks = this.dailyTasks.get(studentId);
      if (!dailyTasks) {
        throw new Error('No daily tasks found');
      }

      const task = dailyTasks.tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      task.status = 'completed';
      task.completed = true;
      task.endTime = new Date();

      // Update student progress
      this.updateStudentProgress(studentId, 'task_completion', task);

      logger.info('✅ Daily task completed', { studentId, taskId });
      return task;
    } catch (error) {
      logger.error('❌ Error completing task:', error);
      throw error;
    }
  }

  // Get Student Progress
  getStudentProgress(studentId) {
    try {
      const progress = this.studentProgress.get(studentId) || {
        studentId,
        totalSessions: 0,
        completedSessions: 0,
        averagePerformance: 0,
        completedTasks: 0,
        totalTasks: 0,
        skills: {},
        areas: {}
      };

      return progress;
    } catch (error) {
      logger.error('❌ Error getting student progress:', error);
      throw error;
    }
  }

  // Get Notifications
  getNotifications(studentId) {
    try {
      const notifications = this.notifications.get(studentId) || [];
      return notifications.filter(n => !n.read);
    } catch (error) {
      logger.error('❌ Error getting notifications:', error);
      throw error;
    }
  }

  // Private helper methods
  evaluateAction(action, requiredActions) {
    const actionLower = action.toLowerCase();
    const requiredLower = requiredActions.map(a => a.toLowerCase());
    
    const exactMatch = requiredLower.some(r => r.includes(actionLower) || actionLower.includes(r));
    const partialMatch = requiredLower.some(r => 
      r.split(' ').some(word => actionLower.includes(word)) ||
      actionLower.split(' ').some(word => r.includes(word))
    );

    if (exactMatch) return { score: 100, feedback: 'Excellent! Action perfectly matches required intervention.' };
    if (partialMatch) return { score: 75, feedback: 'Good! Action is relevant but could be more specific.' };
    return { score: 25, feedback: 'Action may not be appropriate for this scenario. Review required interventions.' };
  }

  evaluateDecision(decision, scenarioName) {
    // Scenario-specific decision evaluation
    const evaluations = {
      'Chest Pain Emergency': {
        'Immediate PCI': { score: 100, feedback: 'Excellent! Correct management for STEMI.' },
        'Thrombolysis': { score: 90, feedback: 'Good alternative when PCI not available.' },
        'Conservative management': { score: 30, feedback: 'Inappropriate for STEMI. Immediate intervention required.' }
      },
      'Dengue Hemorrhagic Fever': {
        'ICU admission': { score: 100, feedback: 'Correct! Patient shows warning signs requiring ICU care.' },
        'IV fluid resuscitation': { score: 95, feedback: 'Excellent! Essential for dengue management.' },
        'Discharge home': { score: 20, feedback: 'Dangerous! Patient has warning signs requiring hospitalization.' }
      }
    };

    const scenarioEval = evaluations[scenarioName];
    if (scenarioEval && scenarioEval[decision]) {
      return scenarioEval[decision];
    }

    return { score: 50, feedback: 'Decision requires clinical judgment. Consider patient safety and evidence-based guidelines.' };
  }

  calculatePerformance(session) {
    const actionScores = session.actionsTaken.map(a => a.evaluation.score);
    const decisionScores = session.decisionsMade.map(d => d.evaluation.score);
    
    const averageActionScore = actionScores.length > 0 ? actionScores.reduce((a, b) => a + b, 0) / actionScores.length : 0;
    const averageDecisionScore = decisionScores.length > 0 ? decisionScores.reduce((a, b) => a + b, 0) / decisionScores.length : 0;
    
    const timeEfficiency = session.timeRemaining > 0 ? 100 : 50;
    const completionRate = (session.actionsTaken.length / session.requiredActions.length) * 100;
    
    const overallScore = (averageActionScore * 0.4 + averageDecisionScore * 0.4 + timeEfficiency * 0.1 + completionRate * 0.1);
    
    return {
      overallScore: Math.round(overallScore),
      actionScore: Math.round(averageActionScore),
      decisionScore: Math.round(averageDecisionScore),
      timeEfficiency: Math.round(timeEfficiency),
      completionRate: Math.round(completionRate),
      grade: this.getGrade(overallScore)
    };
  }

  getGrade(score) {
    if (score >= 90) return 'A+ (Excellent)';
    if (score >= 80) return 'A (Very Good)';
    if (score >= 70) return 'B+ (Good)';
    if (score >= 60) return 'B (Satisfactory)';
    if (score >= 50) return 'C (Needs Improvement)';
    return 'D (Unsatisfactory)';
  }

  generateFeedback(session) {
    const feedback = {
      strengths: [],
      areas: [],
      recommendations: [],
      nextSteps: []
    };

    // Analyze strengths
    if (session.performance.actionScore >= 80) {
      feedback.strengths.push('Excellent clinical decision-making skills');
    }
    if (session.performance.decisionScore >= 80) {
      feedback.strengths.push('Strong diagnostic reasoning');
    }
    if (session.performance.timeEfficiency >= 80) {
      feedback.strengths.push('Good time management under pressure');
    }

    // Identify areas for improvement
    if (session.performance.actionScore < 70) {
      feedback.areas.push('Clinical interventions need improvement');
    }
    if (session.performance.decisionScore < 70) {
      feedback.areas.push('Diagnostic reasoning requires enhancement');
    }
    if (session.performance.completionRate < 80) {
      feedback.areas.push('Incomplete patient management');
    }

    // Provide recommendations
    feedback.recommendations.push('Review evidence-based guidelines for this condition');
    feedback.recommendations.push('Practice similar scenarios to improve confidence');
    feedback.recommendations.push('Focus on systematic approach to patient assessment');

    // Suggest next steps
    feedback.nextSteps.push('Complete additional scenarios in this specialty');
    feedback.nextSteps.push('Review relevant clinical guidelines');
    feedback.nextSteps.push('Practice with more complex cases');

    return feedback;
  }

  updateStudentProgress(studentId, type, data) {
    let progress = this.studentProgress.get(studentId);
    if (!progress) {
      progress = {
        studentId,
        totalSessions: 0,
        completedSessions: 0,
        averagePerformance: 0,
        completedTasks: 0,
        totalTasks: 0,
        skills: {},
        areas: {}
      };
    }

    if (type === 'session_completion') {
      progress.completedSessions++;
      progress.averagePerformance = (progress.averagePerformance * (progress.completedSessions - 1) + data.overallScore) / progress.completedSessions;
    } else if (type === 'task_completion') {
      progress.completedTasks++;
    }

    this.studentProgress.set(studentId, progress);
  }

  setupTimeNotifications(studentId, session) {
    const notifications = [
      { time: session.timeLimit * 0.5, message: '⚠️ 50% of time remaining! Focus on critical interventions.' },
      { time: session.timeLimit * 0.25, message: '🚨 25% of time remaining! Make final decisions quickly.' },
      { time: 0, message: '⏰ Time\'s up! Complete your final assessment and decisions.' }
    ];

    notifications.forEach(notification => {
      setTimeout(() => {
        this.addNotification(studentId, notification.message, 'time_alert');
      }, notification.time * 60 * 1000);
    });
  }

  setupTaskNotification(studentId, task) {
    const notification = {
      id: Date.now(),
      studentId,
      message: `📋 Medical Task Due: ${task.description}`,
      type: 'task_reminder',
      priority: task.priority,
      timestamp: new Date(),
      read: false
    };

    this.addNotification(studentId, notification.message, 'task_reminder');
  }

  addNotification(studentId, message, type) {
    let notifications = this.notifications.get(studentId) || [];
    notifications.push({
      id: Date.now(),
      studentId,
      message,
      type,
      timestamp: new Date(),
      read: false
    });
    this.notifications.set(studentId, notifications);
  }
}

module.exports = new MedicalPracticeSystem(); 