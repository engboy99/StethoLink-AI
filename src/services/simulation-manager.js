const { logger } = require('../utils/logger');

// Enhanced simulation state management with intelligence and memory
class SimulationManager {
  constructor() {
    this.activeSimulations = new Map(); // userId -> simulation state
    this.userMemories = new Map(); // userId -> user memory
  }

  // Start a new simulation with enhanced intelligence
  startSimulation(userId, condition, language = 'en', patientProfile = {}) {
    const simulationState = {
      userId,
      condition: condition.toLowerCase(),
      language,
      patientProfile: {
        age: patientProfile.age || Math.floor(Math.random() * 50) + 20,
        gender: patientProfile.gender || (Math.random() > 0.5 ? 'Male' : 'Female'),
        occupation: patientProfile.occupation || 'Farmer',
        location: patientProfile.location || 'Rural Sri Lanka',
        education: patientProfile.education || 'Primary school',
        familyHistory: patientProfile.familyHistory || 'No significant family history',
        ...patientProfile
      },
      conversationHistory: [],
      currentStage: 'initial',
      symptoms: this.getInitialSymptoms(condition),
      vitalSigns: this.getVitalSigns(condition),
      labResults: this.getLabResults(condition),
      physicalExam: this.getPhysicalExam(condition),
      startTime: new Date(),
      // Enhanced intelligence features
      symptomProgression: this.getSymptomProgression(condition),
      currentSymptomStage: 0,
      patientMood: 'cooperative', // cooperative, anxious, irritable, confused
      painLevel: 5, // 1-10 scale
      consciousness: 'alert', // alert, drowsy, confused, unconscious
      revealedInformation: new Set(), // Track what information has been revealed
      emotionalState: 'worried', // worried, calm, angry, scared
      culturalContext: this.getCulturalContext(language),
      learningObjectives: this.getLearningObjectives(condition)
    };

    this.activeSimulations.set(userId, simulationState);
    
    // Initialize or update user memory
    this.initializeUserMemory(userId, condition, language);
    
    logger.info('🎭 Enhanced simulation started', { userId, condition, language });
    
    return this.getInitialPresentation(simulationState);
  }

  // Enhanced question handling with intelligence
  handleQuestion(userId, question, language = 'en') {
    const simulation = this.activeSimulations.get(userId);
    if (!simulation) {
      return {
        response: this.getNoActiveSimulationMessage(language),
        isSimulationActive: false
      };
    }

    // Add question to conversation history
    simulation.conversationHistory.push({
      type: 'question',
      content: question,
      timestamp: new Date()
    });

    // Analyze question intent and context
    const questionAnalysis = this.analyzeQuestion(question, simulation);
    
    // Generate intelligent patient response
    const patientResponse = this.generateIntelligentPatientResponse(simulation, question, questionAnalysis, language);
    
    // Update simulation state based on interaction
    this.updateSimulationState(simulation, questionAnalysis);
    
    // Add response to conversation history
    simulation.conversationHistory.push({
      type: 'response',
      content: patientResponse,
      timestamp: new Date(),
      analysis: questionAnalysis
    });

    // Update user memory
    this.updateUserMemory(userId, question, patientResponse, questionAnalysis);

    return {
      response: patientResponse,
      isSimulationActive: true,
      simulation: simulation,
      hints: this.getLearningHints(simulation, questionAnalysis)
    };
  }

  // Analyze question intent and context
  analyzeQuestion(question, simulation) {
    const lowerQuestion = question.toLowerCase();
    const analysis = {
      intent: 'general',
      topic: 'general',
      urgency: 'low',
      specificity: 'low',
      followUp: false,
      culturalSensitivity: 'neutral'
    };

    // Analyze intent
    if (lowerQuestion.includes('what happened') || lowerQuestion.includes('how did it start')) {
      analysis.intent = 'history_taking';
      analysis.topic = 'onset';
    } else if (lowerQuestion.includes('pain') || lowerQuestion.includes('hurt')) {
      analysis.intent = 'symptom_assessment';
      analysis.topic = 'pain';
      analysis.specificity = 'high';
    } else if (lowerQuestion.includes('fever') || lowerQuestion.includes('temperature')) {
      analysis.intent = 'symptom_assessment';
      analysis.topic = 'fever';
    } else if (lowerQuestion.includes('family') || lowerQuestion.includes('children')) {
      analysis.intent = 'social_history';
      analysis.topic = 'family';
    } else if (lowerQuestion.includes('work') || lowerQuestion.includes('occupation')) {
      analysis.intent = 'occupational_history';
      analysis.topic = 'occupation';
    } else if (lowerQuestion.includes('urine') || lowerQuestion.includes('water')) {
      analysis.intent = 'symptom_assessment';
      analysis.topic = 'urinary';
    } else if (lowerQuestion.includes('allergy') || lowerQuestion.includes('drug')) {
      analysis.intent = 'medication_history';
      analysis.topic = 'allergies';
    } else if (lowerQuestion.includes('name') || lowerQuestion.includes('who')) {
      analysis.intent = 'identification';
      analysis.topic = 'demographics';
    } else if (lowerQuestion.includes('when') || lowerQuestion.includes('how long')) {
      analysis.intent = 'timeline';
      analysis.topic = 'duration';
    } else if (lowerQuestion.includes('where') || lowerQuestion.includes('location')) {
      analysis.intent = 'geographic_history';
      analysis.topic = 'location';
    }

    // Check for follow-up questions
    if (lowerQuestion.includes('and') || lowerQuestion.includes('also') || lowerQuestion.includes('what about')) {
      analysis.followUp = true;
    }

    // Check urgency
    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('urgent') || lowerQuestion.includes('severe')) {
      analysis.urgency = 'high';
    }

    return analysis;
  }

  // Generate intelligent patient response
  generateIntelligentPatientResponse(simulation, question, analysis, language) {
    const { condition, patientProfile, revealedInformation, emotionalState, culturalContext } = simulation;
    
    // Check if this information has already been revealed
    const questionKey = analysis.topic + '_' + analysis.intent;
    if (revealedInformation.has(questionKey)) {
      return this.generateFollowUpResponse(simulation, question, analysis, language);
    }

    // Mark information as revealed
    revealedInformation.add(questionKey);

    // Generate context-aware response
    let response = this.generateContextualResponse(simulation, question, analysis, language);
    
    // Add emotional and cultural context
    response = this.addEmotionalContext(response, simulation, language);
    
    // Add realistic patient behavior
    response = this.addPatientBehavior(response, simulation, analysis, language);

    return response;
  }

  // Generate contextual response based on condition and analysis
  generateContextualResponse(simulation, question, analysis, language) {
    const { condition, patientProfile } = simulation;
    const lowerQuestion = question.toLowerCase();
    
    // Leptospirosis responses with enhanced intelligence
    if (condition === 'leptospirosis') {
      if (analysis.intent === 'history_taking' && analysis.topic === 'onset') {
        return language === 'si' ? 
          'මම පසුගිය සතියේ වතුරේ වැඩ කරමින් සිටියෙමි. එදින රාත්‍රියේ මට උණ ආරම්භ විය. මම සිතුවේ එය සාමාන්‍ය උණක් බවයි, නමුත් එය වැඩි විය. දැන් මට මාංශ පේශි වල වේදනාව, හිසරදය සහ ඇස් වල වේදනාව තිබේ. මට තවද ඇස් කහ පැහැයක් ඇත.' :
          language === 'ta' ? 
          'நான் கடந்த வாரம் வயலில் வேலை செய்து கொண்டிருந்தேன். அன்று இரவு காய்ச்சல் தொடங்கியது. இது சாதாரண காய்ச்சல் என்று நினைத்தேன், ஆனால் அது மோசமாகியது. இப்போது தசைகளில் வலி, தலைவலி மற்றும் கண்களில் வலி உள்ளது. எனக்கு கண்களில் மஞ்சள் நிறமும் உள்ளது.' :
          'I was working in the paddy field last week, handling water and mud. That night I developed fever. I thought it was just a common fever, but it got worse. Now I have severe muscle pain, especially in my calves, headache, and eye pain. My eyes also look yellow.';
      }
      
      if (analysis.intent === 'symptom_assessment' && analysis.topic === 'pain') {
        return language === 'si' ? 
          'මට මාංශ පේශි වල ඉතා වේදනාව තිබේ, විශේෂයෙන් කකුල් වල. එය ඉතා තද ය. මට ඇවිදීමට පවා අපහසු ය. මට හිසරදය සහ ඇස් වල වේදනාවද තිබේ.' :
          language === 'ta' ? 
          'தசைகளில் மிகவும் வலி உள்ளது, குறிப்பாக கால்களில். இது மிகவும் கடுமையானது. நடப்பதற்கு கூட கஷ்டமாக உள்ளது. தலைவலி மற்றும் கண்களில் வலியும் உள்ளது.' :
          'I have severe muscle pain, especially in my legs and calves. It is very intense, like deep aching. I can barely walk. I also have headache and eye pain. The pain is worse when I move.';
      }
      
      if (analysis.intent === 'symptom_assessment' && analysis.topic === 'urinary') {
        return language === 'si' ? 
          'මම අඩු ප්‍රමාණයක මුත්‍රා බහිමි. එය තද පැහැයක් ඇත. මට තෘෂ්ණාව තිබේ නමුත් බොන්නට අවශ්‍ය නැත. මට බඩවැල් වල අපහසුතාවයක්ද තිබේ.' :
          language === 'ta' ? 
          'நான் குறைந்த அளவு சிறுநீர் கழிக்கிறேன். இது கருமையான நிறம். தாகம் உள்ளது ஆனால் குடிக்க விரும்பவில்லை. வயிற்றில் சிரமமும் உள்ளது.' :
          'I pass less urine than usual. It is dark colored, like tea. I feel thirsty but don\'t want to drink much. I also have some abdominal discomfort.';
      }
    }
    
    // Dengue fever responses with enhanced intelligence
    if (condition === 'dengue fever') {
      if (analysis.intent === 'history_taking' && analysis.topic === 'onset') {
        return language === 'si' ? 
          'මම පසුගිය සතියේ මදුරුවන් බොහෝ ස්ථානවල දැක ඇත. එදින රාත්‍රියේ මට උණ ආරම්භ විය. මම සිතුවේ එය සාමාන්‍ය උණක් බවයි, නමුත් එය වැඩි විය. මට හිසරදය සහ මාංශ පේශි වල වේදනාව තිබේ.' :
          language === 'ta' ? 
          'நான் கடந்த வாரம் பல இடங்களில் கொசுக்களை பார்த்தேன். அன்று இரவு காய்ச்சல் தொடங்கியது. இது சாதாரண காய்ச்சல் என்று நினைத்தேன், ஆனால் அது மோசமாகியது. தலைவலி மற்றும் தசைகளில் வலியும் உள்ளது.' :
          'I saw many mosquitoes around my house and workplace last week. That night I developed fever. I thought it was just a common fever, but it got worse. I have severe headache and muscle pain.';
      }
      
      if (analysis.intent === 'symptom_assessment' && analysis.topic === 'pain') {
        return language === 'si' ? 
          'මට ඉතා තද හිසරදය තිබේ. එය ඉදිරිපස සහ පසුපස දෙපැත්තෙන්ම තිබේ. මට මාංශ පේශි සහ බන්ධන වල වේදනාවද තිබේ. එය ඉතා තද ය.' :
          language === 'ta' ? 
          'மிகவும் கடுமையான தலைவலி உள்ளது. இது முன் மற்றும் பின்புறம் இரண்டு பக்கங்களிலும் உள்ளது. தசைகள் மற்றும் மூட்டுகளில் வலியும் உள்ளது. இது மிகவும் கடுமையானது.' :
          'I have very severe headache. It is in the front and back of my head, like a band around my head. I also have muscle and joint pain. It is very intense.';
      }
    }

    // Generic intelligent responses
    if (analysis.intent === 'identification' && analysis.topic === 'demographics') {
      return language === 'si' ? 
        `මගේ නම ${patientProfile.gender === 'Male' ? 'කුමාර' : 'කුමාරි'} ${patientProfile.occupation === 'Farmer' ? 'සිල්වා' : 'පෙරේරා'}. මගේ වයස ${patientProfile.age} ය. මම ${patientProfile.location} හි ජීවත් වෙමි.` :
        language === 'ta' ? 
        `என் பெயர் ${patientProfile.gender === 'Male' ? 'குமார்' : 'குமாரி'} ${patientProfile.occupation === 'Farmer' ? 'சில்வா' : 'பெரேரா'}. என் வயது ${patientProfile.age}. நான் ${patientProfile.location} இல் வசிக்கிறேன்.` :
        `My name is ${patientProfile.gender === 'Male' ? 'Kumar' : 'Kumari'} ${patientProfile.occupation === 'Farmer' ? 'Silva' : 'Perera'}. I am ${patientProfile.age} years old. I live in ${patientProfile.location}.`;
    }
    
    if (analysis.intent === 'occupational_history' && analysis.topic === 'occupation') {
      return language === 'si' ? 
        `මම ${patientProfile.occupation} කම් කරමි. මම දිනකට පැය 8-10 ක් වැඩ කරමි. මම වතුරේ වැඩ කරන විට රබර් බූට් සහ රබර් අත්වැසුම් භාවිතා කරමි.` :
        language === 'ta' ? 
        `நான் ${patientProfile.occupation} வேலை செய்கிறேன். நான் ஒரு நாளைக்கு 8-10 மணி நேரம் வேலை செய்கிறேன். நான் வயலில் வேலை செய்யும்போது ரப்பர் பூட்ஸ் மற்றும் ரப்பர் கையுறைகள் பயன்படுத்துகிறேன்.` :
        `I work as a ${patientProfile.occupation}. I work 8-10 hours a day. When I work in the fields, I wear rubber boots and gloves for protection.`;
    }

    // Default intelligent response
    return language === 'si' ? 
      'සමාවන්න, මට ඔබේ ප්‍රශ්නය තේරෙන්නේ නැත. කරුණාකර වෙනත් ආකාරයකින් අසන්න. මට ඔබට උදව් කිරීමට අවශ්‍ය ය.' :
      language === 'ta' ? 
      'மன்னிக்கவும், உங்கள் கேள்வியை புரிந்து கொள்ள முடியவில்லை. தயவுசெய்து வேறு விதமாக கேள்வி கேள்வி. நான் உங்களுக்கு உதவ விரும்புகிறேன்.' :
      'I\'m sorry, I don\'t understand your question clearly. Please ask in a different way. I want to help you.';
  }

  // Add emotional context to responses
  addEmotionalContext(response, simulation, language) {
    const { emotionalState, painLevel } = simulation;
    
    if (emotionalState === 'worried') {
      const worryPhrases = {
        en: ' I am worried about my condition.',
        si: ' මට මගේ තත්වය ගැන කනස්සල්ලක් තිබේ.',
        ta: ' எனக்கு என் நிலை பற்றி கவலை உள்ளது.'
      };
      return response + (worryPhrases[language] || worryPhrases.en);
    }
    
    if (painLevel > 7) {
      const painPhrases = {
        en: ' The pain is very severe and affecting my daily activities.',
        si: ' වේදනාව ඉතා තද ය සහ මගේ දෛනික කටයුත්තට බලපායි.',
        ta: ' வலி மிகவும் கடுமையானது மற்றும் எனது தினசரி செயல்பாடுகளை பாதிக்கிறது.'
      };
      return response + (painPhrases[language] || painPhrases.en);
    }
    
    return response;
  }

  // Add realistic patient behavior
  addPatientBehavior(response, simulation, analysis, language) {
    const { patientMood, consciousness } = simulation;
    
    if (patientMood === 'anxious') {
      const anxiousPhrases = {
        en: ' I am very anxious about what is happening to me.',
        si: ' මට මගේ සිදුවන දේ ගැන ඉතා කනස්සල්ලක් තිබේ.',
        ta: ' எனக்கு என்ன நடக்கிறது என்பதில் மிகவும் கவலை உள்ளது.'
      };
      return response + (anxiousPhrases[language] || anxiousPhrases.en);
    }
    
    if (consciousness === 'drowsy') {
      const drowsyPhrases = {
        en: ' I feel very tired and sleepy.',
        si: ' මට ඉතා වෙහෙසක් සහ නින්දක් තිබේ.',
        ta: ' நான் மிகவும் சோர்வாகவும் தூக்கமாகவும் உணர்கிறேன்.'
      };
      return response + (drowsyPhrases[language] || drowsyPhrases.en);
    }
    
    return response;
  }

  // Generate follow-up responses for repeated questions
  generateFollowUpResponse(simulation, question, analysis, language) {
    const responses = {
      en: 'I already told you about that. Is there something specific you want to know more about?',
      si: 'මම එය ගැන දැනටමත් ඔබට පැවසුවෙමි. ඔබට වැඩිදුර දැන ගැනීමට අවශ්‍ය විශේෂිත දෙයක් තිබේද?',
      ta: 'நான் அதைப் பற்றி ஏற்கனவே சொன்னேன். நீங்கள் மேலும் தெரிந்து கொள்ள விரும்பும் குறிப்பிட்ட ஒன்று உள்ளதா?'
    };
    return responses[language] || responses.en;
  }

  // Update simulation state based on interaction
  updateSimulationState(simulation, analysis) {
    // Progress symptoms based on time and interactions
    const timeElapsed = (new Date() - simulation.startTime) / 1000 / 60; // minutes
    
    if (timeElapsed > 10 && simulation.currentSymptomStage < simulation.symptomProgression.length - 1) {
      simulation.currentSymptomStage++;
      simulation.painLevel = Math.min(10, simulation.painLevel + 1);
    }
    
    // Update patient mood based on interactions
    if (analysis.urgency === 'high') {
      simulation.patientMood = 'anxious';
      simulation.emotionalState = 'scared';
    }
  }

  // Get learning hints for medical students
  getLearningHints(simulation, analysis) {
    const hints = [];
    
    if (analysis.intent === 'history_taking' && analysis.topic === 'onset') {
      hints.push('Good! You\'re taking a proper history. Consider asking about occupational exposure.');
    }
    
    if (analysis.intent === 'symptom_assessment' && analysis.topic === 'pain') {
      hints.push('Excellent pain assessment. Remember to ask about pain characteristics: location, severity, duration, aggravating factors.');
    }
    
    if (analysis.intent === 'symptom_assessment' && analysis.topic === 'urinary') {
      hints.push('Good urinary assessment. Consider asking about urine color, frequency, and associated symptoms.');
    }
    
    return hints;
  }

  // Initialize user memory
  initializeUserMemory(userId, condition, language) {
    if (!this.userMemories.has(userId)) {
      this.userMemories.set(userId, {
        userId,
        totalSimulations: 0,
        completedCases: [],
        learningProgress: {},
        preferences: { language },
        lastActive: new Date(),
        strengths: [],
        areasForImprovement: []
      });
    }
    
    const memory = this.userMemories.get(userId);
    memory.totalSimulations++;
    memory.lastActive = new Date();
  }

  // Update user memory
  updateUserMemory(userId, question, response, analysis) {
    const memory = this.userMemories.get(userId);
    if (memory) {
      // Track question types and quality
      if (!memory.learningProgress.questionTypes) {
        memory.learningProgress.questionTypes = {};
      }
      
      memory.learningProgress.questionTypes[analysis.intent] = 
        (memory.learningProgress.questionTypes[analysis.intent] || 0) + 1;
      
      // Track strengths and areas for improvement
      if (analysis.specificity === 'high') {
        memory.strengths.push('Detailed questioning');
      }
      
      if (analysis.followUp) {
        memory.strengths.push('Follow-up questions');
      }
    }
  }

  // Get symptom progression for conditions
  getSymptomProgression(condition) {
    const progressions = {
      'leptospirosis': [
        'Initial fever and muscle pain',
        'Progressive jaundice and renal dysfunction',
        'Severe complications if untreated'
      ],
      'dengue fever': [
        'Initial fever and headache',
        'Critical phase with plasma leakage',
        'Recovery phase'
      ]
    };
    return progressions[condition] || ['Initial symptoms', 'Progressive symptoms', 'Complications'];
  }

  // Get cultural context
  getCulturalContext(language) {
    const contexts = {
      'si': {
        respectForElders: true,
        familyInvolvement: true,
        traditionalBeliefs: true,
        communicationStyle: 'polite'
      },
      'ta': {
        respectForElders: true,
        familyInvolvement: true,
        traditionalBeliefs: true,
        communicationStyle: 'polite'
      },
      'en': {
        respectForElders: true,
        familyInvolvement: true,
        traditionalBeliefs: false,
        communicationStyle: 'direct'
      }
    };
    return contexts[language] || contexts.en;
  }

  // Get learning objectives for conditions
  getLearningObjectives(condition) {
    const objectives = {
      'leptospirosis': [
        'Recognize occupational risk factors',
        'Identify key symptoms: fever, muscle pain, jaundice',
        'Understand renal complications',
        'Know appropriate antibiotic treatment'
      ],
      'dengue fever': [
        'Recognize warning signs',
        'Understand fluid management',
        'Know when to hospitalize',
        'Prevent complications'
      ]
    };
    return objectives[condition] || ['History taking', 'Physical examination', 'Differential diagnosis'];
  }

  // End simulation with enhanced feedback
  endSimulation(userId) {
    const simulation = this.activeSimulations.get(userId);
    if (simulation) {
      // Generate comprehensive feedback
      const feedback = this.generateSimulationFeedback(simulation);
      
      // Update user memory with simulation results
      this.updateSimulationMemory(userId, simulation, feedback);
      
      this.activeSimulations.delete(userId);
      logger.info('🎭 Enhanced simulation ended', { userId, condition: simulation.condition });
      return { success: true, feedback };
    }
    return { success: false };
  }

  // Generate comprehensive simulation feedback
  generateSimulationFeedback(simulation) {
    const questionsAsked = simulation.conversationHistory.filter(c => c.type === 'question').length;
    const topicsCovered = new Set(simulation.conversationHistory
      .filter(c => c.type === 'question')
      .map(c => c.analysis?.topic)
      .filter(Boolean)).size;
    
    return {
      condition: simulation.condition,
      duration: Math.round((new Date() - simulation.startTime) / 1000 / 60),
      questionsAsked,
      topicsCovered,
      learningObjectives: simulation.learningObjectives,
      strengths: this.identifyStrengths(simulation),
      areasForImprovement: this.identifyAreasForImprovement(simulation)
    };
  }

  // Identify student strengths
  identifyStrengths(simulation) {
    const strengths = [];
    const questions = simulation.conversationHistory.filter(c => c.type === 'question');
    
    const questionTypes = questions.map(q => q.analysis?.intent).filter(Boolean);
    const uniqueTypes = new Set(questionTypes).size;
    
    if (uniqueTypes >= 5) strengths.push('Comprehensive history taking');
    if (questions.length >= 10) strengths.push('Thorough questioning');
    if (questionTypes.includes('symptom_assessment')) strengths.push('Good symptom assessment');
    if (questionTypes.includes('occupational_history')) strengths.push('Occupational history awareness');
    
    return strengths;
  }

  // Identify areas for improvement
  identifyAreasForImprovement(simulation) {
    const areas = [];
    const questions = simulation.conversationHistory.filter(c => c.type === 'question');
    
    const questionTypes = questions.map(q => q.analysis?.intent).filter(Boolean);
    
    if (!questionTypes.includes('medication_history')) areas.push('Medication history');
    if (!questionTypes.includes('social_history')) areas.push('Social history');
    if (!questionTypes.includes('family_history')) areas.push('Family history');
    
    return areas;
  }

  // Update simulation memory
  updateSimulationMemory(userId, simulation, feedback) {
    const memory = this.userMemories.get(userId);
    if (memory) {
      memory.completedCases.push({
        condition: simulation.condition,
        date: new Date(),
        feedback,
        duration: feedback.duration
      });
      
      // Update learning progress
      if (!memory.learningProgress.conditions) {
        memory.learningProgress.conditions = {};
      }
      
      memory.learningProgress.conditions[simulation.condition] = {
        attempts: (memory.learningProgress.conditions[simulation.condition]?.attempts || 0) + 1,
        lastAttempt: new Date(),
        strengths: feedback.strengths,
        areasForImprovement: feedback.areasForImprovement
      };
    }
  }

  // Get simulation status with enhanced information
  getSimulationStatus(userId) {
    const simulation = this.activeSimulations.get(userId);
    if (simulation) {
      return {
        ...simulation,
        memory: this.userMemories.get(userId),
        timeElapsed: Math.round((new Date() - simulation.startTime) / 1000 / 60)
      };
    }
    return null;
  }

  // Get user memory
  getUserMemory(userId) {
    return this.userMemories.get(userId);
  }

  // Get initial symptoms based on condition
  getInitialSymptoms(condition) {
    const symptoms = {
      'leptospirosis': ['fever', 'muscle pain', 'headache', 'jaundice', 'oliguria'],
      'dengue fever': ['fever', 'headache', 'muscle pain', 'rash', 'bleeding'],
      'typhoid fever': ['fever', 'headache', 'abdominal pain', 'constipation'],
      'malaria': ['fever', 'chills', 'sweating', 'headache', 'nausea']
    };
    return symptoms[condition] || ['fever', 'general malaise'];
  }

  // Get vital signs based on condition
  getVitalSigns(condition) {
    const vitals = {
      'leptospirosis': { temp: 39.2, bp: '100/60', pulse: 110, rr: 20 },
      'dengue fever': { temp: 39.5, bp: '110/70', pulse: 88, rr: 18 },
      'typhoid fever': { temp: 38.8, bp: '105/65', pulse: 95, rr: 19 },
      'malaria': { temp: 40.0, bp: '95/60', pulse: 120, rr: 22 }
    };
    return vitals[condition] || { temp: 38.5, bp: '120/80', pulse: 80, rr: 16 };
  }

  // Get lab results based on condition
  getLabResults(condition) {
    const labs = {
      'leptospirosis': { wbc: 12000, platelets: 95000, bilirubin: 3.2, creatinine: 2.1 },
      'dengue fever': { wbc: 2500, platelets: 85000, hematocrit: 45, alt: 40 },
      'typhoid fever': { wbc: 8000, platelets: 150000, esr: 45, crp: 80 },
      'malaria': { wbc: 6000, platelets: 120000, hemoglobin: 10.5, parasitemia: 2.5 }
    };
    return labs[condition] || { wbc: 8000, platelets: 200000 };
  }

  // Get physical examination findings
  getPhysicalExam(condition) {
    const exams = {
      'leptospirosis': ['jaundice', 'calf tenderness', 'conjunctival suffusion'],
      'dengue fever': ['petechiae', 'positive tourniquet test', 'mild hepatomegaly'],
      'typhoid fever': ['relative bradycardia', 'rose spots', 'hepatosplenomegaly'],
      'malaria': ['pallor', 'splenomegaly', 'jaundice']
    };
    return exams[condition] || ['normal examination'];
  }

  // Get message for no active simulation
  getNoActiveSimulationMessage(language) {
    const messages = {
      en: 'You don\'t have an active patient simulation. Use /simulate to start a new case.',
      si: 'ඔබට ක්‍රියාකාරී රෝගී සිමියුලේෂනයක් නැත. නව රෝගයක් ආරම්භ කිරීමට /simulate භාවිතා කරන්න.',
      ta: 'உங்களுக்கு செயலில் உள்ள நோயாளி சிமுலேஷன் இல்லை. புதிய வழக்கைத் தொடங்க /simulate ஐப் பயன்படுத்தவும்.'
    };
    return messages[language] || messages.en;
  }

  // Generate initial presentation
  getInitialPresentation(simulation) {
    const { condition, patientProfile, language } = simulation;
    
    const presentations = {
      'leptospirosis': {
        en: `Patient Case: Leptospirosis Simulation

Patient: ${patientProfile.age} year old ${patientProfile.gender}, ${patientProfile.occupation} from ${patientProfile.location}

Presenting Symptoms:
- High fever (39-40°C) for 5 days
- Severe muscle pain, especially in calves
- Headache and eye pain
- Nausea and vomiting
- Yellow discoloration of eyes
- Decreased urine output

Physical Examination:
- Temperature: 39.2°C
- Blood pressure: 100/60 mmHg
- Pulse: 110/min
- Jaundice present
- Tenderness in calf muscles
- Conjunctival suffusion

Laboratory Results:
- WBC: 12,000/μL (elevated)
- Platelets: 95,000/μL (low)
- Bilirubin: 3.2 mg/dL (elevated)
- Creatinine: 2.1 mg/dL (elevated)
- ALT: 180 U/L (elevated)

Differential Diagnosis:
1. Leptospirosis
2. Dengue fever
3. Hepatitis
4. Typhoid fever
5. Malaria

Management:
- IV fluids
- Doxycycline or Penicillin G
- Monitor renal function
- Supportive care

Questions for students:
- What is the most likely diagnosis?
- What investigations would you order?
- How would you manage this patient?
- What complications should you watch for?`,
        
        si: `Patient Case: Leptospirosis Simulation

Patient: ${patientProfile.age} year old ${patientProfile.gender}, ${patientProfile.occupation} from ${patientProfile.location}

Presenting Symptoms:
- High fever (39-40°C) for 5 days
- Severe muscle pain, especially in calves
- Headache and eye pain
- Nausea and vomiting
- Yellow discoloration of eyes
- Decreased urine output

Physical Examination:
- Temperature: 39.2°C
- Blood pressure: 100/60 mmHg
- Pulse: 110/min
- Jaundice present
- Tenderness in calf muscles
- Conjunctival suffusion

Laboratory Results:
- WBC: 12,000/μL (elevated)
- Platelets: 95,000/μL (low)
- Bilirubin: 3.2 mg/dL (elevated)
- Creatinine: 2.1 mg/dL (elevated)
- ALT: 180 U/L (elevated)

Differential Diagnosis:
1. Leptospirosis
2. Dengue fever
3. Hepatitis
4. Typhoid fever
5. Malaria

Management:
- IV fluids
- Doxycycline or Penicillin G
- Monitor renal function
- Supportive care

Questions for students:
- What is the most likely diagnosis?
- What investigations would you order?
- How would you manage this patient?
- What complications should you watch for?`,
        
        ta: `Patient Case: Leptospirosis Simulation

Patient: ${patientProfile.age} year old ${patientProfile.gender}, ${patientProfile.occupation} from ${patientProfile.location}

Presenting Symptoms:
- High fever (39-40°C) for 5 days
- Severe muscle pain, especially in calves
- Headache and eye pain
- Nausea and vomiting
- Yellow discoloration of eyes
- Decreased urine output

Physical Examination:
- Temperature: 39.2°C
- Blood pressure: 100/60 mmHg
- Pulse: 110/min
- Jaundice present
- Tenderness in calf muscles
- Conjunctival suffusion

Laboratory Results:
- WBC: 12,000/μL (elevated)
- Platelets: 95,000/μL (low)
- Bilirubin: 3.2 mg/dL (elevated)
- Creatinine: 2.1 mg/dL (elevated)
- ALT: 180 U/L (elevated)

Differential Diagnosis:
1. Leptospirosis
2. Dengue fever
3. Hepatitis
4. Typhoid fever
5. Malaria

Management:
- IV fluids
- Doxycycline or Penicillin G
- Monitor renal function
- Supportive care

Questions for students:
- What is the most likely diagnosis?
- What investigations would you order?
- How would you manage this patient?
- What complications should you watch for?`
      },
      
      'dengue fever': {
        en: `Patient Case: Dengue Fever Simulation

Patient: ${patientProfile.age} year old ${patientProfile.gender}, ${patientProfile.occupation} from ${patientProfile.location}

Presenting Symptoms:
- High fever (39-40°C) for 3 days
- Severe headache
- Muscle and joint pain
- Nausea and vomiting
- Mild bleeding from gums
- Rash on arms and legs

Physical Examination:
- Temperature: 39.5°C
- Blood pressure: 110/70 mmHg
- Pulse: 88/min
- Petechiae on arms and legs
- Positive tourniquet test
- Mild hepatomegaly

Laboratory Results:
- WBC: 2,500/μL (low)
- Platelets: 85,000/μL (low)
- Hematocrit: 45% (elevated)
- Liver enzymes: Normal

Differential Diagnosis:
1. Dengue fever
2. Chikungunya
3. Typhoid fever
4. Malaria

Management:
- IV fluids
- Paracetamol for fever
- Monitor platelet count
- Hospital admission for severe cases

Questions for students:
- What are the warning signs of severe dengue?
- How would you manage this patient?
- What complications should you watch for?`
      }
    };

    return presentations[condition]?.[language] || presentations[condition]?.en || 
           `Patient Case: ${condition} Simulation

Patient: ${patientProfile.age} year old ${patientProfile.gender}, ${patientProfile.occupation} from ${patientProfile.location}

This is a simulated patient case for educational purposes. Please ask questions to gather more information about the patient's condition and develop your diagnostic and management plan.

Key Learning Objectives:
- History taking skills
- Physical examination
- Differential diagnosis
- Treatment planning
- Patient communication`;
  }
}

module.exports = new SimulationManager(); 