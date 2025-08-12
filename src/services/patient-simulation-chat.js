const { logger } = require('../utils/logger');

class PatientSimulationChat {
  constructor() {
    this.activeSimulations = new Map();
    this.patientDatabase = this.initializePatientDatabase();
    this.doctorPersonas = this.initializeDoctorPersonas();
    this.conversationHistory = new Map();
    this.diagnosisTracking = new Map();
  }

  // Initialize Patient Database with Real Sri Lankan Cases
  initializePatientDatabase() {
    return {
      'acute_gastroenteritis': {
        patient: {
          name: 'Mrs. Kamala Perera',
          age: 67,
          gender: 'Female',
          occupation: 'Farmer',
          location: 'Rural Sri Lanka',
          education: 'Primary school',
          language: 'Sinhala',
          family: 'Lives with son and daughter-in-law',
          economicStatus: 'Low income'
        },
        presentation: {
          chiefComplaint: 'Vomiting and diarrhea for 2 days',
          onset: 'Gradual onset 2 days ago',
          duration: '2 days',
          severity: 'Moderate',
          associatedSymptoms: [
            'Abdominal pain',
            'Loss of appetite',
            'Weakness',
            'Mild fever'
          ],
          aggravatingFactors: 'Eating food',
          relievingFactors: 'Rest',
          previousEpisodes: 'Similar episode 6 months ago',
          medications: 'None currently',
          allergies: 'None known',
          pastHistory: 'Hypertension (controlled with medication)',
          familyHistory: 'Son had similar symptoms last week',
          socialHistory: 'Drinks well water, eats home-cooked food'
        },
        vitalSigns: {
          bloodPressure: '140/90 mmHg',
          heartRate: '95 bpm',
          respiratoryRate: '18/min',
          temperature: '37.8°C',
          oxygenSaturation: '98%',
          weight: '55 kg',
          height: '155 cm'
        },
        examination: {
          general: 'Mildly dehydrated, alert, oriented',
          cardiovascular: 'Tachycardic, normal heart sounds',
          respiratory: 'Normal breath sounds',
          abdomen: 'Mild tenderness in epigastrium, no guarding or rigidity',
          extremities: 'Warm, good pulses, no edema',
          skin: 'Slightly dry, poor skin turgor'
        },
        labResults: {
          'Complete Blood Count': 'WBC: 12,000/μL, Hb: 12 g/dL',
          'Electrolytes': 'Na: 135 mEq/L, K: 3.8 mEq/L, Cl: 102 mEq/L',
          'Stool Analysis': 'Pending',
          'Blood Glucose': '95 mg/dL'
        },
        differentialDiagnosis: [
          'Acute Gastroenteritis (viral)',
          'Food Poisoning',
          'Gastroenteritis (bacterial)',
          'Dehydration',
          'Gastritis'
        ],
        correctDiagnosis: 'Acute Gastroenteritis (viral)',
        treatmentPlan: [
          'Oral rehydration therapy',
          'Clear fluids initially',
          'Gradual return to normal diet',
          'Rest',
          'Monitor for signs of severe dehydration',
          'Follow-up in 2 days'
        ],
        learningObjectives: [
          'History taking in elderly patients',
          'Assessment of dehydration',
          'Management of acute gastroenteritis',
          'Patient communication in rural setting',
          'Cultural sensitivity in medical practice'
        ],
        expectedQuestions: [
          'What brings you to the hospital today?',
          'When did your symptoms start?',
          'What have you been eating recently?',
          'Are you able to keep fluids down?',
          'Have you had similar symptoms before?',
          'Are you taking any medications?',
          'Do you have any allergies?',
          'How is your appetite?',
          'Have you noticed any blood in your stool?',
          'Are you feeling weak or dizzy?'
        ],
        patientResponses: {
          'chief_complaint': 'Ayya, I have been vomiting and having loose stools for 2 days. I cannot eat anything.',
          'onset': 'It started 2 days ago in the morning. I was fine the day before.',
          'diet': 'I ate rice and curry yesterday, but I could not finish it. Everything makes me feel sick.',
          'fluids': 'I try to drink water, but I vomit it out. I am very thirsty.',
          'previous': 'Yes, I had similar problem 6 months ago. It lasted for 3 days.',
          'medications': 'I take medicine for blood pressure. Doctor gave me amlodipine.',
          'allergies': 'No, I don\'t have any allergies.',
          'appetite': 'I have no appetite at all. Even the smell of food makes me sick.',
          'blood_stool': 'No, I have not seen any blood.',
          'weakness': 'Yes, I feel very weak. I cannot do my farm work.',
          'family': 'My son had similar symptoms last week. He is better now.',
          'water': 'I drink water from our well. We boil it sometimes.',
          'pain': 'I have mild pain in my stomach, especially after eating.',
          'fever': 'I feel slightly hot, but I don\'t have a thermometer.',
          'sleep': 'I cannot sleep well because of the vomiting and diarrhea.'
        }
      },
      'chest_pain': {
        patient: {
          name: 'Mr. Sunil Fernando',
          age: 58,
          gender: 'Male',
          occupation: 'Bus Driver',
          location: 'Colombo',
          education: 'Secondary school',
          language: 'Sinhala/English',
          family: 'Lives with wife and two children',
          economicStatus: 'Middle income'
        },
        presentation: {
          chiefComplaint: 'Chest pain for 3 hours',
          onset: 'Sudden onset while driving',
          duration: '3 hours',
          severity: 'Severe (8/10)',
          associatedSymptoms: [
            'Shortness of breath',
            'Sweating',
            'Nausea',
            'Pain radiating to left arm'
          ],
          aggravatingFactors: 'Movement, deep breathing',
          relievingFactors: 'Rest, sitting position',
          previousEpisodes: 'Mild chest discomfort for past week',
          medications: 'None',
          allergies: 'None known',
          pastHistory: 'Diabetes type 2, Hypertension',
          familyHistory: 'Father died of heart attack at age 60',
          socialHistory: 'Smokes 20 cigarettes/day for 30 years'
        },
        vitalSigns: {
          bloodPressure: '160/95 mmHg',
          heartRate: '110 bpm',
          respiratoryRate: '24/min',
          temperature: '37.2°C',
          oxygenSaturation: '92%',
          weight: '75 kg',
          height: '170 cm'
        },
        examination: {
          general: 'Anxious, diaphoretic, in moderate distress',
          cardiovascular: 'Tachycardic, regular rhythm, no murmurs',
          respiratory: 'Tachypneic, clear breath sounds bilaterally',
          abdomen: 'Soft, non-tender, non-distended',
          extremities: 'Warm, good pulses, no edema'
        },
        labResults: {
          'ECG': 'ST elevation in leads II, III, aVF',
          'Troponin': 'Elevated',
          'Complete Blood Count': 'WBC: 11,000/μL, Hb: 14 g/dL',
          'Blood Glucose': '180 mg/dL'
        },
        differentialDiagnosis: [
          'Acute Myocardial Infarction',
          'Unstable Angina',
          'Aortic Dissection',
          'Pulmonary Embolism',
          'Gastroesophageal Reflux Disease'
        ],
        correctDiagnosis: 'Acute Myocardial Infarction (Inferior Wall)',
        treatmentPlan: [
          'Immediate aspirin 300mg',
          'Nitroglycerin if BP >100',
          'Morphine for pain',
          'Oxygen therapy',
          'Cardiology consult',
          'Prepare for thrombolysis or PCI'
        ],
        learningObjectives: [
          'Recognition of ACS symptoms',
          'ECG interpretation',
          'Emergency management of MI',
          'Risk factor assessment',
          'Patient communication in emergency'
        ],
        expectedQuestions: [
          'What brings you to the emergency room?',
          'When did the chest pain start?',
          'Can you describe the pain?',
          'Does the pain radiate anywhere?',
          'What makes the pain worse or better?',
          'Do you have any other symptoms?',
          'Have you had similar pain before?',
          'Do you have any medical conditions?',
          'Are you taking any medications?',
          'Do you smoke or drink alcohol?',
          'Is there a family history of heart disease?'
        ],
        patientResponses: {
          'chief_complaint': 'Doctor, I have severe chest pain. It started 3 hours ago while I was driving.',
          'onset': 'It came suddenly while I was driving my bus. I had to stop the bus.',
          'pain_description': 'It feels like someone is sitting on my chest. Very heavy and crushing pain.',
          'radiation': 'Yes, the pain goes to my left arm and jaw.',
          'aggravating': 'It gets worse when I move or take deep breaths.',
          'relieving': 'It feels slightly better when I sit still and rest.',
          'associated_symptoms': 'I feel short of breath and I am sweating a lot.',
          'previous': 'I had mild chest discomfort for the past week, but nothing like this.',
          'medical_conditions': 'I have diabetes and high blood pressure.',
          'medications': 'I take metformin and amlodipine.',
          'smoking': 'I smoke 20 cigarettes per day for 30 years.',
          'alcohol': 'I drink occasionally, maybe 2-3 times per week.',
          'family_history': 'My father died of a heart attack when he was 60.',
          'stress': 'I have been under a lot of stress at work recently.',
          'exercise': 'I don\'t exercise much because of my work schedule.'
        }
      }
    };
  }

  // Initialize Doctor Personas
  initializeDoctorPersonas() {
    return {
      'general_practitioner': {
        name: 'Dr. Ananda Wijesinghe',
        specialty: 'General Medicine',
        experience: '15 years',
        style: 'Gentle, thorough, patient-focused',
        language: 'Sinhala/English',
        approach: 'Systematic history taking, clear explanations',
        personality: 'Calm, reassuring, professional'
      },
      'emergency_physician': {
        name: 'Dr. Priyanka Mendis',
        specialty: 'Emergency Medicine',
        experience: '12 years',
        style: 'Efficient, direct, focused on critical issues',
        language: 'Sinhala/English',
        approach: 'Rapid assessment, immediate intervention',
        personality: 'Confident, decisive, caring'
      },
      'rural_doctor': {
        name: 'Dr. Ramesh Kumar',
        specialty: 'General Practice',
        experience: '20 years',
        style: 'Cultural, family-oriented, community-focused',
        language: 'Sinhala/Tamil',
        approach: 'Holistic care, family involvement',
        personality: 'Warm, understanding, community-minded'
      }
    };
  }

  // Start Patient Simulation
  startSimulation(studentId, caseType, doctorType = 'general_practitioner') {
    try {
      const patientCase = this.patientDatabase[caseType];
      if (!patientCase) {
        throw new Error('Patient case not found');
      }

      const doctor = this.doctorPersonas[doctorType];
      if (!doctor) {
        throw new Error('Doctor type not found');
      }

      const simulation = {
        id: `sim_${Date.now()}`,
        studentId,
        caseType,
        doctorType,
        patient: patientCase.patient,
        presentation: patientCase.presentation,
        vitalSigns: patientCase.vitalSigns,
        examination: patientCase.examination,
        labResults: patientCase.labResults,
        differentialDiagnosis: patientCase.differentialDiagnosis,
        correctDiagnosis: patientCase.correctDiagnosis,
        treatmentPlan: patientCase.treatmentPlan,
        learningObjectives: patientCase.learningObjectives,
        expectedQuestions: patientCase.expectedQuestions,
        patientResponses: patientCase.patientResponses,
        doctor: doctor,
        startTime: new Date(),
        conversation: [],
        questionsAsked: [],
        diagnosisSubmitted: null,
        status: 'active',
        score: 0
      };

      this.activeSimulations.set(simulation.id, simulation);
      
      // Initialize conversation with doctor's greeting
      const greeting = this.generateDoctorGreeting(simulation);
      simulation.conversation.push({
        speaker: 'doctor',
        message: greeting,
        timestamp: new Date()
      });

      logger.info('🎭 Patient simulation started', { 
        studentId, 
        caseType, 
        patientName: patientCase.patient.name 
      });
      
      return {
        simulationId: simulation.id,
        patient: simulation.patient,
        doctor: simulation.doctor,
        greeting: greeting,
        learningObjectives: simulation.learningObjectives,
        instructions: 'Ask questions to gather patient history and develop your diagnostic plan.'
      };
    } catch (error) {
      logger.error('❌ Error starting simulation:', error);
      throw error;
    }
  }

  // Generate Doctor Greeting
  generateDoctorGreeting(simulation) {
    const { patient, doctor } = simulation;
    
    if (doctor.language.includes('Sinhala')) {
      return `Ayubowan ${patient.name}. I am ${doctor.name}. I understand you are not feeling well. Can you tell me what brings you to the hospital today?`;
    } else {
      return `Hello ${patient.name}. I am ${doctor.name}. I understand you are not feeling well. Can you tell me what brings you to the hospital today?`;
    }
  }

  // Process Student Question
  processQuestion(simulationId, question) {
    try {
      const simulation = this.activeSimulations.get(simulationId);
      if (!simulation) {
        throw new Error('Simulation not found');
      }

      // Add student question to conversation
      simulation.conversation.push({
        speaker: 'student',
        message: question,
        timestamp: new Date()
      });

      // Track questions asked
      simulation.questionsAsked.push(question);

      // Generate patient response based on question content
      const patientResponse = this.generatePatientResponse(simulation, question);

      // Add patient response to conversation
      simulation.conversation.push({
        speaker: 'patient',
        message: patientResponse,
        timestamp: new Date()
      });

      // Evaluate question quality
      const evaluation = this.evaluateQuestion(simulation, question);
      simulation.score += evaluation.score;

      logger.info('🎭 Question processed in simulation', { 
        simulationId, 
        question: question.substring(0, 50) + '...',
        score: evaluation.score 
      });

      return {
        patientResponse,
        evaluation,
        score: simulation.score,
        questionsAsked: simulation.questionsAsked.length
      };
    } catch (error) {
      logger.error('❌ Error processing question:', error);
      throw error;
    }
  }

  // Generate Patient Response
  generatePatientResponse(simulation, question) {
    const { patient, patientResponses } = simulation;
    const questionLower = question.toLowerCase();

    // Check for specific question types and return appropriate responses
    if (questionLower.includes('chief complaint') || questionLower.includes('what brings you') || questionLower.includes('problem')) {
      return patientResponses.chief_complaint;
    }
    
    if (questionLower.includes('when') && questionLower.includes('start')) {
      return patientResponses.onset;
    }
    
    if (questionLower.includes('eat') || questionLower.includes('food') || questionLower.includes('diet')) {
      return patientResponses.diet;
    }
    
    if (questionLower.includes('drink') || questionLower.includes('water') || questionLower.includes('fluid')) {
      return patientResponses.fluids;
    }
    
    if (questionLower.includes('before') || questionLower.includes('previous') || questionLower.includes('similar')) {
      return patientResponses.previous;
    }
    
    if (questionLower.includes('medication') || questionLower.includes('medicine') || questionLower.includes('drug')) {
      return patientResponses.medications;
    }
    
    if (questionLower.includes('allergy') || questionLower.includes('allergic')) {
      return patientResponses.allergies;
    }
    
    if (questionLower.includes('appetite') || questionLower.includes('hungry')) {
      return patientResponses.appetite;
    }
    
    if (questionLower.includes('blood') && questionLower.includes('stool')) {
      return patientResponses.blood_stool;
    }
    
    if (questionLower.includes('weak') || questionLower.includes('tired') || questionLower.includes('energy')) {
      return patientResponses.weakness;
    }
    
    if (questionLower.includes('family') || questionLower.includes('son') || questionLower.includes('daughter')) {
      return patientResponses.family;
    }
    
    if (questionLower.includes('water') || questionLower.includes('drink')) {
      return patientResponses.water;
    }
    
    if (questionLower.includes('pain') || questionLower.includes('hurt')) {
      return patientResponses.pain;
    }
    
    if (questionLower.includes('fever') || questionLower.includes('hot') || questionLower.includes('temperature')) {
      return patientResponses.fever;
    }
    
    if (questionLower.includes('sleep') || questionLower.includes('rest')) {
      return patientResponses.sleep;
    }

    // For chest pain cases
    if (questionLower.includes('chest pain') || questionLower.includes('chest discomfort')) {
      return patientResponses.chief_complaint;
    }
    
    if (questionLower.includes('describe') && questionLower.includes('pain')) {
      return patientResponses.pain_description;
    }
    
    if (questionLower.includes('radiate') || questionLower.includes('arm') || questionLower.includes('jaw')) {
      return patientResponses.radiation;
    }
    
    if (questionLower.includes('worse') || questionLower.includes('better')) {
      return patientResponses.aggravating;
    }
    
    if (questionLower.includes('short') && questionLower.includes('breath')) {
      return patientResponses.associated_symptoms;
    }
    
    if (questionLower.includes('medical condition') || questionLower.includes('health problem')) {
      return patientResponses.medical_conditions;
    }
    
    if (questionLower.includes('smoke') || questionLower.includes('cigarette')) {
      return patientResponses.smoking;
    }
    
    if (questionLower.includes('alcohol') || questionLower.includes('drink')) {
      return patientResponses.alcohol;
    }
    
    if (questionLower.includes('family history') || questionLower.includes('father') || questionLower.includes('mother')) {
      return patientResponses.family_history;
    }

    // Default response for unrecognized questions
    return "I'm not sure I understand. Could you please ask me in a different way?";
  }

  // Evaluate Question Quality
  evaluateQuestion(simulation, question) {
    const { expectedQuestions } = simulation;
    let score = 0;
    let feedback = '';

    // Check if question is relevant to the case
    const questionLower = question.toLowerCase();
    
    // Score based on question relevance
    if (expectedQuestions.some(expected => 
      questionLower.includes(expected.toLowerCase().split(' ').slice(-2).join(' '))
    )) {
      score = 10;
      feedback = '✅ Excellent question! This is directly relevant to the case.';
    } else if (questionLower.includes('chief complaint') || questionLower.includes('symptom')) {
      score = 8;
      feedback = '✅ Good question! Starting with the chief complaint is appropriate.';
    } else if (questionLower.includes('when') || questionLower.includes('how long')) {
      score = 7;
      feedback = '✅ Good question! Understanding the timeline is important.';
    } else if (questionLower.includes('pain') || questionLower.includes('discomfort')) {
      score = 6;
      feedback = '✅ Relevant question! Pain assessment is crucial.';
    } else {
      score = 3;
      feedback = '⚠️ Consider asking more specific questions about the patient\'s symptoms and history.';
    }

    return { score, feedback };
  }

  // Submit Diagnosis
  submitDiagnosis(simulationId, diagnosis) {
    try {
      const simulation = this.activeSimulations.get(simulationId);
      if (!simulation) {
        throw new Error('Simulation not found');
      }

      simulation.diagnosisSubmitted = diagnosis;
      simulation.status = 'diagnosis_submitted';

      // Evaluate diagnosis
      const evaluation = this.evaluateDiagnosis(simulation, diagnosis);
      simulation.score += evaluation.score;

      logger.info('🎭 Diagnosis submitted', { 
        simulationId, 
        diagnosis,
        score: evaluation.score 
      });

      return {
        diagnosis,
        evaluation,
        correctDiagnosis: simulation.correctDiagnosis,
        treatmentPlan: simulation.treatmentPlan,
        finalScore: simulation.score
      };
    } catch (error) {
      logger.error('❌ Error submitting diagnosis:', error);
      throw error;
    }
  }

  // Evaluate Diagnosis
  evaluateDiagnosis(simulation, diagnosis) {
    const { correctDiagnosis, differentialDiagnosis } = simulation;
    let score = 0;
    let feedback = '';

    const diagnosisLower = diagnosis.toLowerCase();
    const correctLower = correctDiagnosis.toLowerCase();

    if (diagnosisLower.includes(correctLower.split(' ')[0]) || 
        diagnosisLower.includes(correctLower.split(' ')[1])) {
      score = 50;
      feedback = '🎉 Excellent! You have correctly identified the primary diagnosis.';
    } else if (differentialDiagnosis.some(diff => 
      diagnosisLower.includes(diff.toLowerCase().split(' ')[0])
    )) {
      score = 30;
      feedback = '✅ Good! You have identified one of the differential diagnoses.';
    } else {
      score = 10;
      feedback = '⚠️ Consider reviewing the patient\'s symptoms and history more carefully.';
    }

    return { score, feedback };
  }

  // End Simulation
  endSimulation(simulationId) {
    try {
      const simulation = this.activeSimulations.get(simulationId);
      if (!simulation) {
        throw new Error('Simulation not found');
      }

      simulation.status = 'completed';
      simulation.endTime = new Date();
      simulation.duration = (simulation.endTime - simulation.startTime) / 1000; // seconds

      const result = {
        simulationId,
        patientName: simulation.patient.name,
        caseType: simulation.caseType,
        questionsAsked: simulation.questionsAsked.length,
        diagnosisSubmitted: simulation.diagnosisSubmitted,
        correctDiagnosis: simulation.correctDiagnosis,
        finalScore: simulation.score,
        duration: simulation.duration,
        conversation: simulation.conversation,
        learningObjectives: simulation.learningObjectives,
        treatmentPlan: simulation.treatmentPlan
      };

      this.activeSimulations.set(simulationId, simulation);
      
      logger.info('🎭 Simulation ended', { 
        simulationId, 
        finalScore: simulation.score 
      });
      
      return result;
    } catch (error) {
      logger.error('❌ Error ending simulation:', error);
      throw error;
    }
  }

  // Get Active Simulations
  getActiveSimulations(studentId) {
    const simulations = [];
    for (const [id, simulation] of this.activeSimulations) {
      if (simulation.studentId === studentId && simulation.status === 'active') {
        simulations.push({
          id,
          patientName: simulation.patient.name,
          caseType: simulation.caseType,
          doctorName: simulation.doctor.name,
          questionsAsked: simulation.questionsAsked.length,
          score: simulation.score
        });
      }
    }
    return simulations;
  }

  // Get Available Cases
  getAvailableCases() {
    return Object.keys(this.patientDatabase).map(caseType => ({
      id: caseType,
      name: this.patientDatabase[caseType].patient.name,
      age: this.patientDatabase[caseType].patient.age,
      gender: this.patientDatabase[caseType].patient.gender,
      occupation: this.patientDatabase[caseType].patient.occupation,
      chiefComplaint: this.patientDatabase[caseType].presentation.chiefComplaint,
      difficulty: this.patientDatabase[caseType].learningObjectives.length > 4 ? 'High' : 'Medium'
    }));
  }
}

module.exports = new PatientSimulationChat(); 