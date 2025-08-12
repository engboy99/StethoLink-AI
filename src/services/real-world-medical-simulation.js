const { logger } = require('../utils/logger');

class RealWorldMedicalSimulation {
  constructor() {
    this.activeSimulations = new Map();
    this.patientDatabase = new Map();
    this.doctorProfiles = new Map();
    this.sriLankanHospitals = this.initializeSriLankanHospitals();
    this.patientScenarios = this.initializePatientScenarios();
    this.doctorSpecialties = this.initializeDoctorSpecialties();
    this.medicalRecords = new Map();
    this.consultationHistory = new Map();
    this.emergencyProtocols = this.initializeEmergencyProtocols();
    this.wardRounds = new Map();
    this.medicalProcedures = this.initializeMedicalProcedures();
    this.labResults = new Map();
    this.imagingResults = new Map();
    this.prescriptionDatabase = new Map();
    this.followUpSchedules = new Map();
  }

  // Initialize Sri Lankan Hospital Database
  initializeSriLankanHospitals() {
    return {
      'National Hospital of Sri Lanka': {
        location: 'Regent Street, Colombo 10',
        type: 'Tertiary Care',
        specialties: ['Emergency Medicine', 'Cardiology', 'Neurology', 'General Surgery', 'Pediatrics'],
        wards: {
          'Medical Ward 1': { capacity: 45, currentPatients: 38, staff: 12 },
          'Medical Ward 2': { capacity: 45, currentPatients: 42, staff: 11 },
          'Surgical Ward 1': { capacity: 40, currentPatients: 35, staff: 10 },
          'ICU': { capacity: 20, currentPatients: 18, staff: 8 },
          'Emergency Department': { capacity: 50, currentPatients: 45, staff: 15 }
        },
        dailyStats: {
          admissions: 25,
          discharges: 22,
          emergencyVisits: 180,
          surgeries: 12,
          labTests: 450
        },
        contact: '+94 11 2691111',
        ambulance: '+94 11 2691111'
      },
      'Asiri Central Hospital': {
        location: 'No. 181, Kirula Road, Colombo 05',
        type: 'Private Tertiary Care',
        specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Obstetrics'],
        wards: {
          'Cardiac Ward': { capacity: 30, currentPatients: 28, staff: 10 },
          'Neurology Ward': { capacity: 25, currentPatients: 22, staff: 8 },
          'ICU': { capacity: 15, currentPatients: 14, staff: 6 },
          'Emergency': { capacity: 30, currentPatients: 25, staff: 12 }
        },
        dailyStats: {
          admissions: 15,
          discharges: 12,
          emergencyVisits: 80,
          surgeries: 8,
          labTests: 200
        },
        contact: '+94 11 4522000',
        ambulance: '+94 11 4522000'
      },
      'Nawaloka Hospital': {
        location: '23, Deshamanya H.K. Dharmadasa Mawatha, Colombo 02',
        type: 'Private Tertiary Care',
        specialties: ['Cardiology', 'Neurology', 'General Medicine', 'Surgery', 'Pediatrics'],
        wards: {
          'Medical Ward': { capacity: 35, currentPatients: 32, staff: 9 },
          'Surgical Ward': { capacity: 30, currentPatients: 28, staff: 8 },
          'ICU': { capacity: 12, currentPatients: 11, staff: 5 },
          'Emergency': { capacity: 25, currentPatients: 20, staff: 10 }
        },
        dailyStats: {
          admissions: 12,
          discharges: 10,
          emergencyVisits: 60,
          surgeries: 6,
          labTests: 150
        },
        contact: '+94 11 5577111',
        ambulance: '+94 11 5577111'
      },
      'Teaching Hospital Peradeniya': {
        location: 'Peradeniya, Kandy',
        type: 'Teaching Hospital',
        specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Obstetrics', 'Psychiatry'],
        wards: {
          'Medical Unit 1': { capacity: 40, currentPatients: 38, staff: 11 },
          'Medical Unit 2': { capacity: 40, currentPatients: 36, staff: 10 },
          'Surgical Unit': { capacity: 35, currentPatients: 32, staff: 9 },
          'ICU': { capacity: 15, currentPatients: 14, staff: 6 },
          'Emergency': { capacity: 40, currentPatients: 35, staff: 12 }
        },
        dailyStats: {
          admissions: 20,
          discharges: 18,
          emergencyVisits: 120,
          surgeries: 10,
          labTests: 300
        },
        contact: '+94 81 2388000',
        ambulance: '+94 81 2388000'
      }
    };
  }

  // Initialize Real Patient Scenarios
  initializePatientScenarios() {
    return {
      'Emergency Department': {
        'Chest Pain - 45M': {
          patient: {
            id: 'ED001',
            name: 'Mr. Kamal Perera',
            age: 45,
            gender: 'Male',
            address: 'No. 123, Temple Road, Colombo 04',
            contact: '+94 77 1234567',
            emergencyContact: '+94 77 7654321',
            bloodGroup: 'B+',
            allergies: ['Penicillin'],
            medications: ['Amlodipine 5mg', 'Metformin 500mg'],
            pastHistory: 'Hypertension, Diabetes Type 2',
            familyHistory: 'Father - Heart disease, Mother - Diabetes'
          },
          presentation: {
            chiefComplaint: 'Severe chest pain for 2 hours',
            onset: 'Sudden onset while watching TV',
            duration: '2 hours',
            severity: '8/10',
            radiation: 'Left arm and jaw',
            associatedSymptoms: ['Sweating', 'Shortness of breath', 'Nausea'],
            aggravatingFactors: 'Movement, deep breathing',
            relievingFactors: 'Rest, sitting position'
          },
          vitalSigns: {
            bloodPressure: '160/95 mmHg',
            heartRate: '110 bpm',
            respiratoryRate: '24/min',
            temperature: '37.2°C',
            oxygenSaturation: '92%',
            painScore: '8/10'
          },
          examination: {
            general: 'Anxious, diaphoretic, in moderate distress',
            cardiovascular: 'Tachycardic, regular rhythm, no murmurs',
            respiratory: 'Tachypneic, clear breath sounds bilaterally',
            abdomen: 'Soft, non-tender, non-distended',
            extremities: 'Warm, good pulses, no edema'
          },
          differentialDiagnosis: [
            'Acute Coronary Syndrome',
            'Unstable Angina',
            'Myocardial Infarction',
            'Aortic Dissection',
            'Pulmonary Embolism'
          ],
          requiredActions: [
            'ECG immediately',
            'Cardiac enzymes',
            'Chest X-ray',
            'IV access',
            'Aspirin 300mg',
            'Nitroglycerin if BP >100',
            'Morphine for pain',
            'Cardiology consult'
          ],
          timeLimit: 15, // minutes
          difficulty: 'High',
          learningObjectives: [
            'Recognize ACS symptoms',
            'Interpret ECG findings',
            'Manage chest pain protocol',
            'Understand cardiac biomarkers'
          ]
        },
        'Dengue Fever - 28F': {
          patient: {
            id: 'ED002',
            name: 'Ms. Nimali Silva',
            age: 28,
            gender: 'Female',
            address: 'No. 45, Lake Road, Kandy',
            contact: '+94 77 2345678',
            emergencyContact: '+94 77 8765432',
            bloodGroup: 'O+',
            allergies: 'None',
            medications: 'None',
            pastHistory: 'None significant',
            familyHistory: 'Sister had dengue 2 years ago'
          },
          presentation: {
            chiefComplaint: 'High fever and severe body aches for 5 days',
            onset: 'Gradual onset',
            duration: '5 days',
            severity: '7/10',
            associatedSymptoms: ['Headache', 'Retro-orbital pain', 'Nausea', 'Vomiting', 'Rash'],
            aggravatingFactors: 'Movement',
            relievingFactors: 'Paracetamol temporarily'
          },
          vitalSigns: {
            bloodPressure: '90/60 mmHg',
            heartRate: '105 bpm',
            respiratoryRate: '22/min',
            temperature: '39.5°C',
            oxygenSaturation: '95%',
            painScore: '7/10'
          },
          examination: {
            general: 'Febrile, appears dehydrated',
            cardiovascular: 'Tachycardic, normal heart sounds',
            respiratory: 'Normal breath sounds',
            abdomen: 'Mild epigastric tenderness, no hepatosplenomegaly',
            skin: 'Maculopapular rash on trunk and extremities',
            eyes: 'Conjunctival injection'
          },
          differentialDiagnosis: [
            'Dengue Fever',
            'Dengue Hemorrhagic Fever',
            'Viral Fever',
            'Malaria',
            'Typhoid Fever'
          ],
          requiredActions: [
            'Complete blood count',
            'Dengue NS1 antigen',
            'Dengue IgM/IgG',
            'Liver function tests',
            'IV fluids if dehydrated',
            'Monitor for warning signs',
            'Platelet count monitoring'
          ],
          timeLimit: 20,
          difficulty: 'Medium',
          learningObjectives: [
            'Recognize dengue warning signs',
            'Manage fluid therapy',
            'Monitor platelet counts',
            'Prevent complications'
          ]
        }
      },
      'Medical Ward': {
        'Diabetic Ketoacidosis - 32M': {
          patient: {
            id: 'MW001',
            name: 'Mr. Sunil Fernando',
            age: 32,
            gender: 'Male',
            address: 'No. 78, Garden Street, Galle',
            contact: '+94 77 3456789',
            emergencyContact: '+94 77 9876543',
            bloodGroup: 'A+',
            allergies: 'None',
            medications: 'Insulin (stopped 3 days ago)',
            pastHistory: 'Type 1 Diabetes for 15 years',
            familyHistory: 'Father - Type 2 Diabetes'
          },
          presentation: {
            chiefComplaint: 'Confusion and excessive thirst for 2 days',
            onset: 'Gradual over 2 days',
            duration: '2 days',
            severity: '9/10',
            associatedSymptoms: ['Polyuria', 'Polydipsia', 'Nausea', 'Vomiting', 'Abdominal pain'],
            aggravatingFactors: 'None',
            relievingFactors: 'None'
          },
          vitalSigns: {
            bloodPressure: '85/55 mmHg',
            heartRate: '120 bpm',
            respiratoryRate: '28/min (Kussmaul breathing)',
            temperature: '37.8°C',
            oxygenSaturation: '96%',
            painScore: '6/10'
          },
          examination: {
            general: 'Confused, dehydrated, Kussmaul breathing',
            cardiovascular: 'Tachycardic, normal heart sounds',
            respiratory: 'Deep, rapid breathing, fruity breath odor',
            abdomen: 'Mild diffuse tenderness',
            neurological: 'Confused, oriented to person only'
          },
          labResults: {
            bloodGlucose: '650 mg/dL',
            pH: '7.15',
            bicarbonate: '8 mEq/L',
            ketones: 'Large',
            sodium: '135 mEq/L',
            potassium: '5.2 mEq/L'
          },
          differentialDiagnosis: [
            'Diabetic Ketoacidosis',
            'Hyperosmolar Hyperglycemic State',
            'Sepsis',
            'Acute Pancreatitis'
          ],
          requiredActions: [
            'IV fluids - Normal saline',
            'Insulin infusion',
            'Potassium replacement',
            'Monitor blood glucose hourly',
            'Monitor electrolytes',
            'Treat underlying cause'
          ],
          timeLimit: 30,
          difficulty: 'High',
          learningObjectives: [
            'Manage DKA protocol',
            'Calculate insulin requirements',
            'Monitor electrolytes',
            'Prevent complications'
          ]
        }
      }
    };
  }

  // Initialize Doctor Specialties
  initializeDoctorSpecialties() {
    return {
      'Dr. Ananda Wijesinghe': {
        specialty: 'Emergency Medicine',
        experience: '15 years',
        hospital: 'National Hospital of Sri Lanka',
        ward: 'Emergency Department',
        schedule: 'Morning Shift (6 AM - 2 PM)',
        expertise: ['Trauma', 'Cardiac Emergencies', 'Toxicology'],
        personality: 'Direct, efficient, focuses on ABCs',
        teachingStyle: 'Case-based learning, quick decision making',
        contact: '+94 77 1111111'
      },
      'Dr. Priyanka Mendis': {
        specialty: 'Cardiology',
        experience: '12 years',
        hospital: 'Asiri Central Hospital',
        ward: 'Cardiac Ward',
        schedule: 'Ward Rounds (8 AM - 10 AM)',
        expertise: ['Interventional Cardiology', 'Echocardiography', 'Heart Failure'],
        personality: 'Thorough, analytical, evidence-based',
        teachingStyle: 'Detailed explanations, evidence-based approach',
        contact: '+94 77 2222222'
      },
      'Dr. Ramesh Kumar': {
        specialty: 'General Medicine',
        experience: '20 years',
        hospital: 'Teaching Hospital Peradeniya',
        ward: 'Medical Unit 1',
        schedule: 'Ward Rounds (9 AM - 11 AM)',
        expertise: ['Diabetes', 'Hypertension', 'Infectious Diseases'],
        personality: 'Patient, methodical, comprehensive',
        teachingStyle: 'Systematic approach, differential diagnosis',
        contact: '+94 77 3333333'
      },
      'Dr. Chamari Jayawardena': {
        specialty: 'Pediatrics',
        experience: '10 years',
        hospital: 'Nawaloka Hospital',
        ward: 'Pediatric Ward',
        schedule: 'Afternoon Rounds (2 PM - 4 PM)',
        expertise: ['Neonatology', 'Pediatric Emergencies', 'Vaccination'],
        personality: 'Gentle, child-friendly, family-oriented',
        teachingStyle: 'Interactive, child development focused',
        contact: '+94 77 4444444'
      }
    };
  }

  // Initialize Emergency Protocols
  initializeEmergencyProtocols() {
    return {
      'Cardiac Arrest': {
        steps: [
          'Check responsiveness',
          'Call for help',
          'Check breathing',
          'Start chest compressions (30:2)',
          'Attach AED',
          'Continue CPR until help arrives'
        ],
        medications: ['Adrenaline 1mg IV', 'Amiodarone 300mg IV'],
        timeCritical: true,
        teamRequired: true
      },
      'Anaphylaxis': {
        steps: [
          'Remove allergen',
          'Lie patient flat',
          'Administer adrenaline IM',
          'Give oxygen',
          'IV access',
          'Antihistamines and steroids'
        ],
        medications: ['Adrenaline 0.5mg IM', 'Chlorpheniramine 10mg IV', 'Hydrocortisone 200mg IV'],
        timeCritical: true,
        teamRequired: false
      },
      'Severe Bleeding': {
        steps: [
          'Apply direct pressure',
          'Elevate limb',
          'Apply pressure bandage',
          'Monitor vital signs',
          'IV access',
          'Blood transfusion if needed'
        ],
        medications: ['Tranexamic acid 1g IV'],
        timeCritical: true,
        teamRequired: true
      }
    };
  }

  // Initialize Medical Procedures
  initializeMedicalProcedures() {
    return {
      'Intravenous Cannulation': {
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
        complications: ['Infection', 'Phlebitis', 'Hematoma', 'Air embolism'],
        difficulty: 'Medium'
      },
      'Lumbar Puncture': {
        steps: [
          'Position patient (lateral decubitus)',
          'Mark L3-L4 or L4-L5 interspace',
          'Clean and drape',
          'Local anesthesia',
          'Insert needle with stylet',
          'Remove stylet and check for CSF',
          'Collect samples',
          'Remove needle and apply dressing'
        ],
        equipment: ['LP needle', 'Local anesthetic', 'Sterile gloves', 'CSF collection tubes'],
        complications: ['Headache', 'Infection', 'Bleeding', 'Nerve injury'],
        difficulty: 'High'
      },
      'Central Line Insertion': {
        steps: [
          'Sterile technique',
          'Ultrasound guidance',
          'Local anesthesia',
          'Insert needle and guidewire',
          'Dilate tract',
          'Insert catheter',
          'Confirm position',
          'Secure and dress'
        ],
        equipment: ['Central line kit', 'Ultrasound', 'Sterile drapes', 'Local anesthetic'],
        complications: ['Pneumothorax', 'Infection', 'Bleeding', 'Arrhythmia'],
        difficulty: 'High'
      }
    };
  }

  // Start Real-World Simulation
  startSimulation(studentId, scenarioType, patientId) {
    try {
      const scenario = this.patientScenarios[scenarioType][patientId];
      if (!scenario) {
        throw new Error('Scenario not found');
      }

      const simulation = {
        id: `sim_${Date.now()}`,
        studentId,
        scenarioType,
        patientId,
        patient: scenario.patient,
        presentation: scenario.presentation,
        vitalSigns: scenario.vitalSigns,
        examination: scenario.examination,
        labResults: scenario.labResults || {},
        imagingResults: {},
        differentialDiagnosis: scenario.differentialDiagnosis,
        requiredActions: scenario.requiredActions,
        timeLimit: scenario.timeLimit,
        difficulty: scenario.difficulty,
        learningObjectives: scenario.learningObjectives,
        startTime: new Date(),
        actions: [],
        decisions: [],
        timeRemaining: scenario.timeLimit * 60, // Convert to seconds
        status: 'active',
        score: 0,
        feedback: []
      };

      this.activeSimulations.set(simulation.id, simulation);
      
      logger.info('🏥 Real-world simulation started', { 
        studentId, 
        scenarioType, 
        patientId,
        patientName: scenario.patient.name 
      });
      
      return simulation;
    } catch (error) {
      logger.error('❌ Error starting simulation:', error);
      throw error;
    }
  }

  // Take Action in Simulation
  takeAction(simulationId, action, details) {
    try {
      const simulation = this.activeSimulations.get(simulationId);
      if (!simulation) {
        throw new Error('Simulation not found');
      }

      const actionRecord = {
        action,
        details,
        timestamp: new Date(),
        timeRemaining: simulation.timeRemaining
      };

      simulation.actions.push(actionRecord);

      // Evaluate action
      const evaluation = this.evaluateAction(action, details, simulation);
      simulation.score += evaluation.score;
      simulation.feedback.push(evaluation.feedback);

      // Update time remaining
      simulation.timeRemaining -= 30; // 30 seconds per action

      if (simulation.timeRemaining <= 0) {
        simulation.status = 'timeout';
      }

      this.activeSimulations.set(simulationId, simulation);
      
      logger.info('🏥 Action taken in simulation', { 
        simulationId, 
        action, 
        score: evaluation.score 
      });
      
      return {
        action: actionRecord,
        evaluation,
        timeRemaining: simulation.timeRemaining,
        score: simulation.score
      };
    } catch (error) {
      logger.error('❌ Error taking action:', error);
      throw error;
    }
  }

  // Evaluate Action
  evaluateAction(action, details, simulation) {
    const requiredActions = simulation.requiredActions;
    let score = 0;
    let feedback = '';

    switch (action) {
      case 'order_ecg':
        if (requiredActions.includes('ECG immediately')) {
          score = 10;
          feedback = '✅ Correct! ECG is essential for chest pain evaluation.';
        } else {
          score = 5;
          feedback = '⚠️ ECG ordered but may not be the most critical action.';
        }
        break;

      case 'order_lab_tests':
        if (details.includes('cardiac enzymes') || details.includes('troponin')) {
          score = 10;
          feedback = '✅ Excellent! Cardiac enzymes are crucial for ACS diagnosis.';
        } else if (details.includes('CBC') || details.includes('blood count')) {
          score = 8;
          feedback = '✅ Good! Basic lab work is appropriate.';
        } else {
          score = 3;
          feedback = '⚠️ Consider more specific tests for this presentation.';
        }
        break;

      case 'administer_medication':
        if (details.includes('aspirin') && simulation.presentation.chiefComplaint.includes('chest pain')) {
          score = 15;
          feedback = '✅ Perfect! Aspirin is first-line therapy for ACS.';
        } else if (details.includes('nitroglycerin')) {
          score = 10;
          feedback = '✅ Good choice for chest pain relief.';
        } else if (details.includes('morphine')) {
          score = 8;
          feedback = '✅ Appropriate for severe pain.';
        } else {
          score = 5;
          feedback = '⚠️ Consider if medication is appropriate for this case.';
        }
        break;

      case 'consult_specialist':
        if (details.includes('cardiology') && simulation.presentation.chiefComplaint.includes('chest pain')) {
          score = 10;
          feedback = '✅ Excellent! Cardiology consult is essential for ACS.';
        } else {
          score = 5;
          feedback = '⚠️ Consider if specialist consult is needed.';
        }
        break;

      case 'iv_access':
        score = 8;
        feedback = '✅ Good! IV access is important for emergency management.';
        break;

      case 'oxygen_therapy':
        if (simulation.vitalSigns.oxygenSaturation < 95) {
          score = 10;
          feedback = '✅ Correct! Oxygen therapy for low saturation.';
        } else {
          score = 5;
          feedback = '⚠️ Oxygen may not be necessary with normal saturation.';
        }
        break;

      default:
        score = 3;
        feedback = '⚠️ Action taken but consider if it addresses the main problem.';
    }

    return { score, feedback };
  }

  // Get Hospital Information
  getHospitalInfo(hospitalName) {
    return this.sriLankanHospitals[hospitalName] || null;
  }

  // Get Daily Hospital Statistics
  getDailyHospitalStats(hospitalName) {
    const hospital = this.sriLankanHospitals[hospitalName];
    if (!hospital) return null;

    return {
      hospital: hospitalName,
      date: new Date().toDateString(),
      admissions: hospital.dailyStats.admissions,
      discharges: hospital.dailyStats.discharges,
      emergencyVisits: hospital.dailyStats.emergencyVisits,
      surgeries: hospital.dailyStats.surgeries,
      labTests: hospital.dailyStats.labTests,
      wardOccupancy: Object.entries(hospital.wards).map(([ward, data]) => ({
        ward,
        occupancy: Math.round((data.currentPatients / data.capacity) * 100),
        availableBeds: data.capacity - data.currentPatients,
        staffOnDuty: data.staff
      }))
    };
  }

  // Get Doctor Profile
  getDoctorProfile(doctorName) {
    return this.doctorSpecialties[doctorName] || null;
  }

  // Get Available Scenarios
  getAvailableScenarios() {
    const scenarios = {};
    for (const [department, patients] of Object.entries(this.patientScenarios)) {
      scenarios[department] = Object.keys(patients).map(patientId => ({
        id: patientId,
        name: patients[patientId].patient.name,
        age: patients[patientId].patient.age,
        gender: patients[patientId].patient.gender,
        chiefComplaint: patients[patientId].presentation.chiefComplaint,
        difficulty: patients[patientId].difficulty,
        timeLimit: patients[patientId].timeLimit
      }));
    }
    return scenarios;
  }

  // Get Emergency Protocols
  getEmergencyProtocols() {
    return this.emergencyProtocols;
  }

  // Get Medical Procedures
  getMedicalProcedures() {
    return this.medicalProcedures;
  }

  // Complete Simulation
  completeSimulation(simulationId) {
    try {
      const simulation = this.activeSimulations.get(simulationId);
      if (!simulation) {
        throw new Error('Simulation not found');
      }

      simulation.status = 'completed';
      simulation.endTime = new Date();
      simulation.duration = (simulation.endTime - simulation.startTime) / 1000; // seconds

      // Calculate final score
      const maxScore = simulation.requiredActions.length * 10;
      const percentage = Math.round((simulation.score / maxScore) * 100);

      const result = {
        simulationId,
        patientName: simulation.patient.name,
        scenarioType: simulation.scenarioType,
        score: simulation.score,
        maxScore,
        percentage,
        grade: this.calculateGrade(percentage),
        duration: simulation.duration,
        actions: simulation.actions.length,
        feedback: simulation.feedback,
        learningObjectives: simulation.learningObjectives,
        recommendations: this.generateRecommendations(simulation)
      };

      this.activeSimulations.set(simulationId, simulation);
      
      logger.info('🏥 Simulation completed', { 
        simulationId, 
        score: simulation.score, 
        percentage 
      });
      
      return result;
    } catch (error) {
      logger.error('❌ Error completing simulation:', error);
      throw error;
    }
  }

  // Calculate Grade
  calculateGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  }

  // Generate Recommendations
  generateRecommendations(simulation) {
    const recommendations = [];
    
    if (simulation.score < 70) {
      recommendations.push('Review emergency protocols for this condition');
      recommendations.push('Practice time management in emergency scenarios');
      recommendations.push('Focus on critical actions first');
    }
    
    if (simulation.timeRemaining <= 0) {
      recommendations.push('Work on faster decision making');
      recommendations.push('Prioritize actions based on urgency');
    }

    const missedActions = simulation.requiredActions.filter(action => 
      !simulation.actions.some(a => 
        a.action.includes(action.toLowerCase()) || 
        a.details.includes(action.toLowerCase())
      )
    );

    if (missedActions.length > 0) {
      recommendations.push(`Review these critical actions: ${missedActions.join(', ')}`);
    }

    return recommendations;
  }

  // Get Active Simulations
  getActiveSimulations(studentId) {
    const simulations = [];
    for (const [id, simulation] of this.activeSimulations) {
      if (simulation.studentId === studentId && simulation.status === 'active') {
        simulations.push({
          id,
          patientName: simulation.patient.name,
          scenarioType: simulation.scenarioType,
          timeRemaining: simulation.timeRemaining,
          score: simulation.score
        });
      }
    }
    return simulations;
  }

  // Get Simulation History
  getSimulationHistory(studentId) {
    const history = [];
    for (const [id, simulation] of this.activeSimulations) {
      if (simulation.studentId === studentId && simulation.status === 'completed') {
        history.push({
          id,
          patientName: simulation.patient.name,
          scenarioType: simulation.scenarioType,
          score: simulation.score,
          grade: this.calculateGrade(Math.round((simulation.score / (simulation.requiredActions.length * 10)) * 100)),
          date: simulation.endTime
        });
      }
    }
    return history.sort((a, b) => b.date - a.date);
  }
}

module.exports = new RealWorldMedicalSimulation(); 