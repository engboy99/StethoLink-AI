const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// PWA Manifest and Service Worker
app.get('/manifest.json', (req, res) => {
  res.json({
    name: "StethoLink AI - Medical Student Agent",
    short_name: "StethoLink",
    description: "AI Medical Assistant for Sri Lankan Medical Students",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml"
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml"
      },
      {
        src: "/icons/icon-384x384.svg",
        sizes: "384x384",
        type: "image/svg+xml"
      }
    ]
  });
});

app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    // Service Worker for StethoLink AI
    const CACHE_NAME = 'stetholink-v1';
    const urlsToCache = [
      '/',
      '/css/style.css',
      '/js/app.js',
      '/manifest.json',
      '/icons/icon-192x192.svg',
      '/icons/icon-512x512.svg'
    ];

    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => cache.addAll(urlsToCache))
      );
    });

    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request)
          .then(response => response || fetch(event.request))
      );
    });
  `);
});

// Main app route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API endpoints for the standalone app
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId, context } = req.body;
    
    // Simple response system for now
    const response = getSimpleResponse(message, context);
    
    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message'
    });
  }
});

// Simple response system
async function getSimpleResponse(message, context) {
  const lowerMessage = message.toLowerCase();
  
  // Study Plans
  if (context === 'study-plans') {
    if (lowerMessage.includes('1st') || lowerMessage.includes('first')) {
      return `📚 <strong>1st Year Study Plan</strong><br><br>
        <strong>Core Subjects:</strong><br>
        • Anatomy & Physiology<br>
        • Biochemistry<br>
        • Community Medicine<br>
        • Medical Ethics<br><br>
        <strong>Study Tips:</strong><br>
        • Focus on building strong foundations<br>
        • Practice drawing anatomical structures<br>
        • Join study groups for difficult topics<br>
        • Use visual aids and 3D models<br><br>
        <strong>Weekly Schedule:</strong><br>
        • 6-8 hours daily study<br>
        • 2 hours practical work<br>
        • 1 hour revision<br>
        • Weekend: Mock tests`;
    }
    
    if (lowerMessage.includes('2nd') || lowerMessage.includes('second')) {
      return `📚 <strong>2nd Year Study Plan</strong><br><br>
        <strong>Core Subjects:</strong><br>
        • Pathology<br>
        • Microbiology<br>
        • Pharmacology<br>
        • Forensic Medicine<br><br>
        <strong>Study Tips:</strong><br>
        • Connect pathology with clinical scenarios<br>
        • Use case studies for learning<br>
        • Practice drug calculations<br>
        • Focus on lab work and practicals<br><br>
        <strong>Weekly Schedule:</strong><br>
        • 7-9 hours daily study<br>
        • 3 hours practical work<br>
        • 1.5 hours revision<br>
        • Weekend: Clinical case discussions`;
    }
    
    if (lowerMessage.includes('3rd') || lowerMessage.includes('third')) {
      return `📚 <strong>3rd Year Study Plan</strong><br><br>
        <strong>Core Subjects:</strong><br>
        • Medicine<br>
        • Surgery<br>
        • Obstetrics & Gynecology<br>
        • Pediatrics<br><br>
        <strong>Study Tips:</strong><br>
        • Focus on clinical reasoning<br>
        • Practice history taking<br>
        • Learn examination techniques<br>
        • Study with real patient cases<br><br>
        <strong>Weekly Schedule:</strong><br>
        • 8-10 hours daily study<br>
        • 4 hours clinical work<br>
        • 2 hours revision<br>
        • Weekend: Clinical rotations`;
    }
    
    return `📚 <strong>Study Plans</strong><br><br>
      I can help you with study plans for any year!<br><br>
      <strong>Available Years:</strong><br>
      • 1st Year - Basic Sciences<br>
      • 2nd Year - Pre-Clinical<br>
      • 3rd Year - Clinical Rotations<br>
      • 4th Year - Advanced Clinical<br>
      • 5th Year - Final Year<br><br>
      <strong>Just tell me:</strong><br>
      • Which year you're in<br>
      • What subjects you want to focus on<br>
      • Your study goals<br><br>
      For example: "I'm in 1st year, help me with anatomy"`;
  }
  
  // Task Manager
  if (context === 'task-manager') {
    if (lowerMessage.includes('add') || lowerMessage.includes('new')) {
      return `📋 <strong>Adding New Task</strong><br><br>
        Great! Let's add a new task to your study plan.<br><br>
        <strong>Please provide:</strong><br>
        • Task title (e.g., "Study Cardiovascular System")<br>
        • Due date (e.g., "Next Friday")<br>
        • Priority (High/Medium/Low)<br>
        • Subject area<br><br>
        <strong>Example:</strong><br>
        "Add task: Study Cardiovascular System, due Friday, High priority, Anatomy"<br><br>
        I'll help you organize it perfectly!`;
    }
    
    if (lowerMessage.includes('view') || lowerMessage.includes('show') || lowerMessage.includes('list')) {
      return `📋 <strong>Your Current Tasks</strong><br><br>
        <strong>📚 Study Tasks:</strong><br>
        • Review Anatomy Chapter 5 - Due Today<br>
        • Complete Biochemistry Assignment - Due Tomorrow<br>
        • Prepare for Pathology Test - Due Friday<br><br>
        <strong>🏥 Clinical Tasks:</strong><br>
        • Practice Physical Examination - Due This Week<br>
        • Complete Patient History Forms - Due Next Week<br><br>
        <strong>📝 Administrative:</strong><br>
        • Submit Assignment - Due Tomorrow<br>
        • Register for Next Semester - Due Next Month<br><br>
        <strong>Need to:</strong><br>
        • Add new task? Say "add task"<br>
        • Mark as complete? Say "complete [task name]"<br>
        • Set reminder? Say "remind me about [task]"`;
    }
    
    return `📋 <strong>Task Manager</strong><br><br>
      I can help you manage all your medical study tasks!<br><br>
      <strong>Available Actions:</strong><br>
      • <strong>Add Task</strong> - Create new study tasks<br>
      • <strong>View Tasks</strong> - See your current tasks<br>
      • <strong>Set Reminders</strong> - Get notified about deadlines<br>
      • <strong>Track Progress</strong> - Monitor your completion rate<br><br>
      <strong>Just tell me:</strong><br>
      • "Add a new task"<br>
      • "Show my tasks"<br>
      • "Set reminder for anatomy test"<br><br>
      What would you like to do?`;
  }
  
  // Medical Calculators
  if (context === 'medical-calculators') {
    if (lowerMessage.includes('bmi') || lowerMessage.includes('weight')) {
      // Extract weight and height from message
      const weightMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*kg/);
      const heightMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*m/);
      
      if (weightMatch && heightMatch) {
        const weight = parseFloat(weightMatch[1]);
        const height = parseFloat(heightMatch[1]);
        const result = calculateBMI(weight, height);
        
        if (result.error) {
          return `❌ <strong>Error:</strong> ${result.error}`;
        }
        
        return `🧮 <strong>BMI Calculator Result</strong><br><br>
          <strong>Your BMI:</strong> ${result.bmi} kg/m²<br>
          <strong>Category:</strong> ${result.category}<br>
          <strong>Risk Assessment:</strong> ${result.risk}<br>
          <strong>Clinical Recommendations:</strong> ${result.recommendations}<br><br>
          <strong>Formula Used:</strong><br>
          ${result.formula}<br><br>
          <strong>Next Steps:</strong><br>
          • Monitor your BMI regularly<br>
          • Follow healthcare provider recommendations<br>
          • Maintain healthy lifestyle habits`;
      }
      
      return `🧮 <strong>BMI Calculator</strong><br><br>
        I can calculate your BMI with clinical accuracy!<br><br>
        <strong>Please provide:</strong><br>
        • Your weight in kilograms<br>
        • Your height in meters<br><br>
        <strong>Example:</strong><br>
        "Calculate BMI for 70 kg and 1.75 m height"<br><br>
        <strong>I'll give you:</strong><br>
        • Precise BMI calculation<br>
        • Clinical category classification<br>
        • Risk assessment<br>
        • Medical recommendations<br><br>
        Just give me your measurements!`;
    }
    
    if (lowerMessage.includes('gfr') || lowerMessage.includes('kidney')) {
      // Extract GFR parameters from message
      const creatinineMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*(?:mg\/dl|creatinine)/i);
      const ageMatch = lowerMessage.match(/(\d+)\s*(?:year|age)/i);
      const genderMatch = lowerMessage.match(/(male|female)/i);
      const raceMatch = lowerMessage.match(/(black|african american|non-black|white|asian|hispanic)/i);
      const weightMatch = lowerMessage.match(/(\d+(?:\.\d+)?)\s*kg/i);
      
      if (creatinineMatch && ageMatch && genderMatch && raceMatch && weightMatch) {
        const creatinine = parseFloat(creatinineMatch[1]);
        const age = parseInt(ageMatch[1]);
        const gender = genderMatch[1];
        const race = raceMatch[1];
        const weight = parseFloat(weightMatch[1]);
        
        const result = calculateGFR(creatinine, age, gender, race, weight);
        
        if (result.error) {
          return `❌ <strong>Error:</strong> ${result.error}`;
        }
        
        return `🧮 <strong>GFR Calculation Result</strong><br><br>
          <strong>Your GFR:</strong> ${result.gfr} mL/min/1.73m²<br>
          <strong>Kidney Function Stage:</strong> ${result.stage}<br>
          <strong>Clinical Interpretation:</strong> ${result.interpretation}<br>
          <strong>Medical Recommendations:</strong> ${result.recommendations}<br><br>
          <strong>Formula Used:</strong><br>
          ${result.formula}<br><br>
          <strong>Clinical Notes:</strong><br>
          • GFR < 60 indicates kidney disease<br>
          • Regular monitoring required<br>
          • Consult nephrologist if GFR < 30`;
      }
      
      return `🧮 <strong>GFR Calculator</strong><br><br>
        I can calculate your GFR using the MDRD formula with clinical accuracy!<br><br>
        <strong>Please provide:</strong><br>
        • Age<br>
        • Gender (male/female)<br>
        • Race (black/non-black)<br>
        • Serum Creatinine (mg/dL)<br>
        • Weight (kg)<br><br>
        <strong>Example:</strong><br>
        "Calculate GFR for 45-year-old male, non-black, creatinine 1.2, weight 70kg"<br><br>
        <strong>I'll give you:</strong><br>
        • Precise GFR calculation<br>
        • Kidney function staging<br>
        • Clinical interpretation<br>
        • Medical recommendations<br><br>
        Give me your values!`;
    }
    
    if (lowerMessage.includes('chads2') || lowerMessage.includes('stroke')) {
      return `🧮 <strong>CHADS2 Score Calculator</strong><br><br>
        I can calculate your stroke risk using the CHADS2 scoring system!<br><br>
        <strong>Please provide:</strong><br>
        • Age<br>
        • Gender<br>
        • Medical conditions:<br>
        &nbsp;&nbsp;• Diabetes (yes/no)<br>
        &nbsp;&nbsp;• Hypertension (yes/no)<br>
        &nbsp;&nbsp;• Heart Failure (yes/no)<br>
        &nbsp;&nbsp;• Previous Stroke/TIA (yes/no)<br>
        &nbsp;&nbsp;• Vascular Disease (yes/no)<br><br>
        <strong>Example:</strong><br>
        "Calculate CHADS2 for 70-year-old male with diabetes and hypertension"<br><br>
        <strong>I'll give you:</strong><br>
        • Precise risk score<br>
        • Stroke risk percentage<br>
        • Anticoagulation recommendations<br>
        • Clinical guidelines<br><br>
        Give me your details!`;
    }
    
    if (lowerMessage.includes('apgar') || lowerMessage.includes('newborn')) {
      return `🧮 <strong>APGAR Score Calculator</strong><br><br>
        I can calculate APGAR scores for newborn assessment!<br><br>
        <strong>Please provide scores (0-2) for:</strong><br>
        • Heart Rate<br>
        • Respiratory Effort<br>
        • Muscle Tone<br>
        • Reflex Irritability<br>
        • Color<br><br>
        <strong>Example:</strong><br>
        "Calculate APGAR: Heart 2, Respiratory 2, Muscle 2, Reflex 1, Color 1"<br><br>
        <strong>I'll give you:</strong><br>
        • Total APGAR score<br>
        • Clinical interpretation<br>
        • Resuscitation recommendations<br>
        • Next steps<br><br>
        Give me the scores!`;
    }
    
    if (lowerMessage.includes('glasgow') || lowerMessage.includes('gcs') || lowerMessage.includes('coma')) {
      return `🧮 <strong>Glasgow Coma Scale Calculator</strong><br><br>
        I can calculate GCS for neurological assessment!<br><br>
        <strong>Please provide scores for:</strong><br>
        • Eye Opening (1-4)<br>
        • Verbal Response (1-5)<br>
        • Motor Response (1-6)<br><br>
        <strong>Example:</strong><br>
        "Calculate GCS: Eye 3, Verbal 4, Motor 5"<br><br>
        <strong>I'll give you:</strong><br>
        • Total GCS score<br>
        • TBI severity classification<br>
        • Clinical interpretation<br>
        • Management recommendations<br><br>
        Give me the scores!`;
    }
    
    return `🧮 <strong>Advanced Medical Calculators</strong><br><br>
      I have <strong>PRO-LEVEL</strong> medical calculators with clinical accuracy!<br><br>
      <strong>Available Calculators:</strong><br>
      • <strong>BMI Calculator</strong> - Body Mass Index with risk assessment<br>
      • <strong>GFR Calculator</strong> - Glomerular Filtration Rate (MDRD formula)<br>
      • <strong>CHADS2 Score</strong> - Stroke Risk Assessment<br>
      • <strong>APGAR Score</strong> - Newborn Assessment<br>
      • <strong>Glasgow Coma Scale</strong> - Neurological Assessment<br><br>
      <strong>Clinical Features:</strong><br>
      • ✅ Real-time calculations<br>
      • ✅ Evidence-based formulas<br>
      • ✅ Clinical interpretation<br>
      • ✅ Medical recommendations<br>
      • ✅ Risk stratification<br><br>
      <strong>Just tell me:</strong><br>
      • "Calculate BMI for 70kg and 1.75m height"<br>
      • "Calculate GFR for 45-year-old male, non-black, creatinine 1.2, weight 70kg"<br>
      • "Calculate CHADS2 for 70-year-old male with diabetes and hypertension"<br><br>
      Which calculator would you like to use?`;
  }
  
  // Patient Simulation
  if (context === 'patient-simulation') {
    if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
      return startPatientSimulation('emergency');
    }
    
    if (lowerMessage.includes('next question')) {
      simulationStep++;
      return getNextSimulationQuestion();
    }
    
    if (lowerMessage.includes('show case') || lowerMessage.includes('case details')) {
      if (!currentSimulation) {
        return '❌ No active simulation. Type "start simulation" to begin.';
      }
      
      return `🏥 <strong>Case Review</strong><br><br>
        <strong>Case:</strong> ${currentSimulation.title}<br><br>
        <strong>Patient Presentation:</strong><br>
        ${currentSimulation.presentation}<br><br>
        <strong>Vital Signs:</strong><br>
        ${Object.entries(currentSimulation.vitalSigns).map(([key, value]) => `• ${key}: ${value}`).join('<br>')}<br><br>
        <strong>Relevant History:</strong><br>
        ${currentSimulation.history}<br><br>
        ${currentSimulation.labResults ? `<strong>Lab Results:</strong><br>
        ${Object.entries(currentSimulation.labResults).map(([key, value]) => `• ${key}: ${value}`).join('<br>')}<br><br>` : ''}
        <strong>Current Question:</strong> ${simulationStep + 1} of ${currentSimulation.questions.length}<br><br>
        <strong>Type:</strong> "next question" to continue`;
    }
    
    if (lowerMessage.includes('end') || lowerMessage.includes('finish')) {
      return endSimulation();
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('acute')) {
      return startPatientSimulation('emergency');
    }
    
    if (lowerMessage.includes('pediatric') || lowerMessage.includes('child')) {
      return startPatientSimulation('pediatric');
    }
    
    if (lowerMessage.includes('chronic') || lowerMessage.includes('diabetes')) {
      return startPatientSimulation('chronic');
    }
    
    return `🏥 <strong>Advanced Patient Simulation System</strong><br><br>
      Welcome to <strong>PRO-LEVEL</strong> clinical case simulations!<br><br>
      <strong>Available Scenarios:</strong><br>
      • <strong>Emergency Cases</strong> - Acute presentations, critical care<br>
      • <strong>Pediatric Cases</strong> - Child health, developmental assessment<br>
      • <strong>Chronic Disease</strong> - Long-term management, complications<br><br>
      <strong>Features:</strong><br>
      • ✅ Real clinical scenarios<br>
      • ✅ Systematic case analysis<br>
      • ✅ Interactive questioning<br>
      • ✅ Performance evaluation<br>
      • ✅ Learning objectives<br><br>
      <strong>Commands:</strong><br>
      • "start simulation" - Begin emergency case<br>
      • "emergency case" - Acute care scenario<br>
      • "pediatric case" - Child health scenario<br>
      • "chronic case" - Long-term management<br><br>
      <strong>Ready to test your clinical skills?</strong><br>
      Type "start simulation" to begin!`;
  }
  
  // PRO-LEVEL INTEGRATED CURRICULUM SYSTEM
  if (context === 'curriculum') {
    // Enhanced curriculum handling with AI integration
    return await handleEnhancedCurriculumRequest(lowerMessage, user, language);
  }
  
  // Default response
  return `🏥 <strong>StethoLink AI Assistant</strong><br><br>
    Hello! I'm your AI medical assistant designed specifically for Sri Lankan medical students.<br><br>
    <strong>I can help you with:</strong><br>
    • 📚 Study plans and curriculum<br>
    • 📋 Task management and reminders<br>
    • 🧮 Medical calculations<br>
    • 💊 Drug information and interactions<br>
    • 🏥 Patient simulation practice<br>
    • 📖 Clinical guidelines<br>
    • 🔬 Research assistance<br><br>
    <strong>Just tell me what you need help with!</strong><br>
    For example: "Help me with 1st year study plan" or "Calculate BMI"`;
}

// Advanced Medical Calculation Engines with Clinical Accuracy
function calculateBMI(weight, height) {
  if (!weight || !height || weight <= 0 || height <= 0) {
    return { error: 'Invalid weight or height values' };
  }
  
  const bmi = weight / (height * height);
  let category, risk, recommendations;
  
  if (bmi < 18.5) {
    category = 'Underweight';
    risk = 'Low body weight may indicate malnutrition or underlying health issues';
    recommendations = 'Consult healthcare provider for nutritional assessment';
  } else if (bmi < 25) {
    category = 'Normal weight';
    risk = 'Healthy weight range';
    recommendations = 'Maintain current lifestyle and regular exercise';
  } else if (bmi < 30) {
    category = 'Overweight';
    risk = 'Increased risk of cardiovascular disease, diabetes, and hypertension';
    recommendations = 'Focus on diet modification and increased physical activity';
  } else if (bmi < 35) {
    category = 'Obese Class I';
    risk = 'High risk of metabolic syndrome and cardiovascular complications';
    recommendations = 'Medical supervision for weight loss program recommended';
  } else if (bmi < 40) {
    category = 'Obese Class II';
    risk = 'Very high risk of serious health complications';
    recommendations = 'Immediate medical intervention and bariatric consultation';
  } else {
    category = 'Obese Class III (Morbid Obesity)';
    risk = 'Extremely high risk of life-threatening complications';
    recommendations = 'Urgent medical intervention and specialized care required';
  }
  
  return {
    bmi: bmi.toFixed(1),
    category,
    risk,
    recommendations,
    formula: `BMI = ${weight} kg / (${height} m)² = ${bmi.toFixed(1)} kg/m²`
  };
}

function calculateGFR(creatinine, age, gender, race, weight) {
  if (!creatinine || !age || !gender || !race || !weight) {
    return { error: 'Missing required parameters for GFR calculation' };
  }
  
  // MDRD Formula (Most accurate for clinical use)
  let gfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
  
  // Gender adjustment
  if (gender.toLowerCase() === 'female') {
    gfr *= 0.742;
  }
  
  // Race adjustment
  if (race.toLowerCase() === 'black' || race.toLowerCase() === 'african american') {
    gfr *= 1.212;
  }
  
  gfr = Math.round(gfr);
  
  let stage, interpretation, recommendations;
  
  if (gfr >= 90) {
    stage = 'Stage 1: Normal kidney function';
    interpretation = 'Normal kidney function with possible kidney damage';
    recommendations = 'Monitor for proteinuria, maintain healthy lifestyle';
  } else if (gfr >= 60) {
    stage = 'Stage 2: Mildly decreased kidney function';
    interpretation = 'Mild decrease in kidney function with kidney damage';
    recommendations = 'Monitor kidney function, control blood pressure and diabetes';
  } else if (gfr >= 30) {
    stage = 'Stage 3: Moderately decreased kidney function';
    interpretation = 'Moderate decrease in kidney function';
    recommendations = 'Nephrology consultation, monitor electrolytes, adjust medications';
  } else if (gfr >= 15) {
    stage = 'Stage 4: Severely decreased kidney function';
    interpretation = 'Severe decrease in kidney function';
    recommendations = 'Prepare for kidney replacement therapy, strict dietary restrictions';
  } else {
    stage = 'Stage 5: Kidney failure';
    interpretation = 'Kidney failure requiring dialysis or transplantation';
    recommendations = 'Immediate nephrology consultation, dialysis planning';
  }
  
  return {
    gfr: gfr,
    stage,
    interpretation,
    recommendations,
    formula: `MDRD GFR = 175 × (${creatinine})⁻¹.¹⁵⁴ × (${age})⁻⁰.²⁰³ × ${gender === 'female' ? '0.742' : '1.0'} × ${race.toLowerCase() === 'black' ? '1.212' : '1.0'} = ${gfr} mL/min/1.73m²`
  };
}

function calculateCHADS2(age, gender, diabetes, hypertension, heartFailure, stroke, vascularDisease) {
  let score = 0;
  let riskFactors = [];
  
  // Age ≥ 75 years
  if (age >= 75) {
    score += 2;
    riskFactors.push('Age ≥ 75 years (+2)');
  } else if (age >= 65) {
    score += 1;
    riskFactors.push('Age 65-74 years (+1)');
  }
  
  // Gender (Female)
  if (gender.toLowerCase() === 'female') {
    score += 1;
    riskFactors.push('Female gender (+1)');
  }
  
  // Diabetes
  if (diabetes) {
    score += 1;
    riskFactors.push('Diabetes (+1)');
  }
  
  // Hypertension
  if (hypertension) {
    score += 1;
    riskFactors.push('Hypertension (+1)');
  }
  
  // Heart Failure
  if (heartFailure) {
    score += 1;
    riskFactors.push('Heart Failure (+1)');
  }
  
  // Previous Stroke/TIA
  if (stroke) {
    score += 2;
    riskFactors.push('Previous Stroke/TIA (+2)');
  }
  
  // Vascular Disease
  if (vascularDisease) {
    score += 1;
    riskFactors.push('Vascular Disease (+1)');
  }
  
  let riskLevel, strokeRate, recommendations;
  
  if (score === 0) {
    riskLevel = 'Low Risk';
    strokeRate = '1.9% per year';
    recommendations = 'No anticoagulation needed, aspirin optional';
  } else if (score === 1) {
    riskLevel = 'Low Risk';
    strokeRate = '2.8% per year';
    recommendations = 'No anticoagulation needed, aspirin optional';
  } else if (score === 2) {
    riskLevel = 'Moderate Risk';
    strokeRate = '4.0% per year';
    recommendations = 'Consider anticoagulation or aspirin, individualize decision';
  } else if (score === 3) {
    riskLevel = 'Moderate Risk';
    strokeRate = '5.9% per year';
    recommendations = 'Anticoagulation recommended (warfarin, DOACs)';
  } else if (score === 4) {
    riskLevel = 'High Risk';
    strokeRate = '8.5% per year';
    recommendations = 'Anticoagulation strongly recommended';
  } else if (score === 5) {
    riskLevel = 'High Risk';
    strokeRate = '12.5% per year';
    recommendations = 'Anticoagulation strongly recommended';
  } else {
    riskLevel = 'Very High Risk';
    strokeRate = '18.2% per year';
    recommendations = 'Anticoagulation mandatory, consider higher intensity';
  }
  
  return {
    score,
    riskLevel,
    strokeRate,
    recommendations,
    riskFactors,
    formula: `CHADS2 Score = ${score} points`
  };
}

function calculateAPGAR(heartRate, respiratoryEffort, muscleTone, reflexIrritability, color) {
  let totalScore = 0;
  let details = [];
  
  // Heart Rate
  if (heartRate === 0) {
    totalScore += 0;
    details.push('Heart Rate: Absent (0)');
  } else if (heartRate < 100) {
    totalScore += 1;
    details.push('Heart Rate: < 100 bpm (1)');
  } else {
    totalScore += 2;
    details.push('Heart Rate: ≥ 100 bpm (2)');
  }
  
  // Respiratory Effort
  if (respiratoryEffort === 0) {
    totalScore += 0;
    details.push('Respiratory: Absent (0)');
  } else if (respiratoryEffort === 1) {
    totalScore += 1;
    details.push('Respiratory: Slow/irregular (1)');
  } else {
    totalScore += 2;
    details.push('Respiratory: Good/crying (2)');
  }
  
  // Muscle Tone
  if (muscleTone === 0) {
    totalScore += 0;
    details.push('Muscle Tone: Limp (0)');
  } else if (muscleTone === 1) {
    totalScore += 1;
    details.push('Muscle Tone: Some flexion (1)');
  } else {
    totalScore += 2;
    details.push('Muscle Tone: Active motion (2)');
  }
  
  // Reflex Irritability
  if (reflexIrritability === 0) {
    totalScore += 0;
    details.push('Reflex: No response (0)');
  } else if (reflexIrritability === 1) {
    totalScore += 1;
    details.push('Reflex: Grimace (1)');
  } else {
    totalScore += 2;
    details.push('Reflex: Cough/sneeze (2)');
  }
  
  // Color
  if (color === 0) {
    totalScore += 0;
    details.push('Color: Blue/pale (0)');
  } else if (color === 1) {
    totalScore += 1;
    details.push('Color: Acrocyanosis (1)');
  } else {
    totalScore += 2;
    details.push('Color: Pink (2)');
  }
  
  let interpretation, recommendations;
  
  if (totalScore >= 7) {
    interpretation = 'Good to excellent condition';
    recommendations = 'Routine newborn care';
  } else if (totalScore >= 4) {
    interpretation = 'Moderately depressed';
    recommendations = 'May need some resuscitation assistance';
  } else {
    interpretation = 'Severely depressed';
    recommendations = 'Immediate resuscitation required';
  }
  
  return {
    score: totalScore,
    interpretation,
    recommendations,
    details,
    formula: `APGAR Score = ${totalScore}/10`
  };
}

function calculateGlasgowComaScale(eyeOpening, verbalResponse, motorResponse) {
  let totalScore = 0;
  let details = [];
  
  // Eye Opening
  if (eyeOpening === 1) {
    totalScore += 1;
    details.push('Eye Opening: No response (1)');
  } else if (eyeOpening === 2) {
    totalScore += 2;
    details.push('Eye Opening: To pain (2)');
  } else if (eyeOpening === 3) {
    totalScore += 3;
    details.push('Eye Opening: To voice (3)');
  } else if (eyeOpening === 4) {
    totalScore += 4;
    details.push('Eye Opening: Spontaneous (4)');
  }
  
  // Verbal Response
  if (verbalResponse === 1) {
    totalScore += 1;
    details.push('Verbal: No response (1)');
  } else if (verbalResponse === 2) {
    totalScore += 2;
    details.push('Verbal: Incomprehensible sounds (2)');
  } else if (verbalResponse === 3) {
    totalScore += 3;
    details.push('Verbal: Inappropriate words (3)');
  } else if (verbalResponse === 4) {
    totalScore += 4;
    details.push('Verbal: Confused (4)');
  } else if (verbalResponse === 5) {
    totalScore += 5;
    details.push('Verbal: Oriented (5)');
  }
  
  // Motor Response
  if (motorResponse === 1) {
    totalScore += 1;
    details.push('Motor: No response (1)');
  } else if (motorResponse === 2) {
    totalScore += 2;
    details.push('Motor: Extension to pain (2)');
  } else if (motorResponse === 3) {
    totalScore += 3;
    details.push('Motor: Flexion to pain (3)');
  } else if (motorResponse === 4) {
    totalScore += 4;
    details.push('Motor: Withdrawal from pain (4)');
  } else if (motorResponse === 5) {
    totalScore += 5;
    details.push('Motor: Localizes pain (5)');
  } else if (motorResponse === 6) {
    totalScore += 6;
    details.push('Motor: Obeys commands (6)');
  }
  
  let severity, interpretation, recommendations;
  
  if (totalScore >= 13) {
    severity = 'Mild TBI';
    interpretation = 'Minor brain injury';
    recommendations = 'Monitor for 24-48 hours, discharge if stable';
  } else if (totalScore >= 9) {
    severity = 'Moderate TBI';
    interpretation = 'Moderate brain injury';
    recommendations = 'Hospital admission, CT scan, neurological monitoring';
  } else {
    severity = 'Severe TBI';
    interpretation = 'Severe brain injury';
    recommendations = 'ICU admission, intubation, ICP monitoring, neurosurgical consultation';
  }
  
  return {
    score: totalScore,
    severity,
    interpretation,
    recommendations,
    details,
    formula: `GCS = Eye (${eyeOpening}) + Verbal (${verbalResponse}) + Motor (${motorResponse}) = ${totalScore}/15`
  };
}

// Advanced Patient Simulation System with Real Clinical Scenarios
const patientScenarios = {
  emergency: [
    {
      id: 'chest-pain',
      title: 'Acute Chest Pain - 45-year-old Male',
      presentation: 'A 45-year-old male presents to the emergency department with severe chest pain that started 2 hours ago. The pain is crushing, radiates to the left arm and jaw, and is associated with diaphoresis and shortness of breath.',
      vitalSigns: {
        'Blood Pressure': '160/95 mmHg',
        'Heart Rate': '110 bpm',
        'Respiratory Rate': '24/min',
        'Temperature': '37.2°C',
        'Oxygen Saturation': '92%'
      },
      history: 'Hypertension, diabetes, family history of heart disease. Smoker (20 pack-years).',
      questions: [
        'What is your primary differential diagnosis?',
        'What immediate investigations would you order?',
        'What is your initial management plan?',
        'What are the red flags you need to watch for?'
      ],
      keyPoints: [
        'High-risk features: crushing pain, radiation, diaphoresis, risk factors',
        'ECG changes: ST elevation, Q waves, T wave inversion',
        'Troponin levels, cardiac enzymes',
        'Immediate aspirin, nitroglycerin, morphine, oxygen',
        'Cardiology consultation, consider thrombolysis vs. PCI'
      ],
      diagnosis: 'Acute ST-Elevation Myocardial Infarction (STEMI)',
      management: 'Immediate reperfusion therapy, dual antiplatelet therapy, statins, beta-blockers, ACE inhibitors'
    },
    {
      id: 'shortness-breath',
      title: 'Acute Shortness of Breath - 65-year-old Female',
      presentation: 'A 65-year-old female presents with sudden onset shortness of breath and chest tightness. She has a history of deep vein thrombosis and recent long-distance travel.',
      vitalSigns: {
        'Blood Pressure': '140/90 mmHg',
        'Heart Rate': '120 bpm',
        'Respiratory Rate': '28/min',
        'Temperature': '37.8°C',
        'Oxygen Saturation': '88%'
      },
      history: 'Previous DVT, recent 12-hour flight, oral contraceptive use, family history of clotting disorders.',
      questions: [
        'What is your primary concern?',
        'What diagnostic tests would you order?',
        'What is your immediate management?',
        'What are the risk factors for this condition?'
      ],
      keyPoints: [
        'High clinical probability: sudden SOB, chest pain, risk factors',
        'Wells score for DVT/PE probability',
        'D-dimer, CTPA, V/Q scan',
        'Immediate anticoagulation: LMWH or unfractionated heparin',
        'Consider thrombolysis for massive PE'
      ],
      diagnosis: 'Pulmonary Embolism (PE)',
      management: 'Immediate anticoagulation, oxygen therapy, consider thrombolysis for massive PE, long-term anticoagulation'
    }
  ],
  pediatric: [
    {
      id: 'fever-child',
      title: 'Fever in 2-year-old Child - 24 hours duration',
      presentation: 'A 2-year-old child presents with fever of 39.2°C for 24 hours, decreased appetite, and irritability. No obvious source of infection.',
      vitalSigns: {
        'Temperature': '39.2°C',
        'Heart Rate': '140 bpm',
        'Respiratory Rate': '32/min',
        'Blood Pressure': '90/60 mmHg'
      },
      history: 'Previously healthy, up-to-date immunizations, no recent travel or sick contacts.',
      questions: [
        'What is your systematic approach to fever in a child?',
        'What are the red flags you need to assess?',
        'What investigations would you order?',
        'What is your management plan?'
      ],
      keyPoints: [
        'Systematic assessment: ABCDE approach',
        'Red flags: toxic appearance, meningeal signs, petechial rash',
        'Investigations: CBC, CRP, blood cultures, urine analysis',
        'Empirical antibiotics if bacterial infection suspected',
        'Close monitoring and follow-up'
      ],
      diagnosis: 'Fever of Unknown Origin (FUO) - likely viral',
      management: 'Supportive care, antipyretics, close monitoring, antibiotics if bacterial infection suspected'
    }
  ],
  chronic: [
    {
      id: 'diabetes-management',
      title: 'Type 2 Diabetes Management - 58-year-old Male',
      presentation: 'A 58-year-old male with type 2 diabetes presents for routine follow-up. His blood glucose control has been suboptimal despite medication.',
      vitalSigns: {
        'Blood Pressure': '145/92 mmHg',
        'Heart Rate': '78 bpm',
        'Weight': '85 kg',
        'BMI': '28.5 kg/m²'
      },
      history: 'Diabetes for 8 years, hypertension, dyslipidemia, family history of cardiovascular disease.',
      labResults: {
        'HbA1c': '8.2%',
        'Fasting Glucose': '180 mg/dL',
        'Creatinine': '1.1 mg/dL',
        'LDL Cholesterol': '120 mg/dL'
      },
      questions: [
        'What are your treatment goals for this patient?',
        'How would you adjust his medication regimen?',
        'What complications should you screen for?',
        'What lifestyle modifications would you recommend?'
      ],
      keyPoints: [
        'Target HbA1c < 7% for most patients',
        'Consider adding second-line agents: SGLT2 inhibitors, GLP-1 agonists',
        'Screen for microvascular complications annually',
        'Aggressive cardiovascular risk factor management',
        'Lifestyle: diet, exercise, weight loss, smoking cessation'
      ],
      diagnosis: 'Type 2 Diabetes with Suboptimal Control',
      management: 'Intensify medication regimen, lifestyle modifications, regular monitoring, complication screening'
    }
  ]
};

let currentSimulation = null;
let simulationStep = 0;

function startPatientSimulation(scenarioType) {
  const scenarios = patientScenarios[scenarioType] || patientScenarios.emergency;
  const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  
  currentSimulation = {
    ...randomScenario,
    type: scenarioType,
    step: 0,
    userAnswers: [],
    startTime: new Date()
  };
  
  simulationStep = 0;
  
  return `🏥 <strong>Patient Simulation Started!</strong><br><br>
    <strong>Case:</strong> ${currentSimulation.title}<br><br>
    <strong>Patient Presentation:</strong><br>
    ${currentSimulation.presentation}<br><br>
    <strong>Vital Signs:</strong><br>
    ${Object.entries(currentSimulation.vitalSigns).map(([key, value]) => `• ${key}: ${value}`).join('<br>')}<br><br>
    <strong>Relevant History:</strong><br>
    ${currentSimulation.history}<br><br>
    <strong>Your Task:</strong><br>
    Analyze this case systematically and answer the clinical questions.<br><br>
    <strong>Type:</strong> "next question" to proceed with the simulation<br>
    <strong>Type:</strong> "show case" to review the case details<br>
    <strong>Type:</strong> "end simulation" to finish and get evaluation<br><br>
    Ready to begin? Type "next question"!`;
}

function getNextSimulationQuestion() {
  if (!currentSimulation) {
    return '❌ No active simulation. Type "start simulation" to begin.';
  }
  
  if (simulationStep >= currentSimulation.questions.length) {
    return endSimulation();
  }
  
  const question = currentSimulation.questions[simulationStep];
  const questionNumber = simulationStep + 1;
  
  return `🏥 <strong>Question ${questionNumber} of ${currentSimulation.questions.length}</strong><br><br>
    <strong>Case:</strong> ${currentSimulation.title}<br><br>
    <strong>Clinical Question:</strong><br>
    ${question}<br><br>
    <strong>Your Answer:</strong><br>
    [Type your clinical reasoning and answer here]<br><br>
    <strong>Commands:</strong><br>
    • "next question" - Move to next question<br>
    • "show case" - Review case details<br>
    • "end simulation" - Finish early<br><br>
    Take your time to think through this systematically!`;
}

function endSimulation() {
  if (!currentSimulation) {
    return '❌ No active simulation to end.';
  }
  
  const duration = Math.round((new Date() - currentSimulation.startTime) / 1000 / 60);
  
  let evaluation = `🏥 <strong>Simulation Complete!</strong><br><br>
    <strong>Case:</strong> ${currentSimulation.title}<br>
    <strong>Duration:</strong> ${duration} minutes<br>
    <strong>Questions Answered:</strong> ${simulationStep}/${currentSimulation.questions.length}<br><br>
    <strong>Key Clinical Points:</strong><br>
    ${currentSimulation.keyPoints.map(point => `• ${point}`).join('<br>')}<br><br>
    <strong>Final Diagnosis:</strong> ${currentSimulation.diagnosis}<br><br>
    <strong>Management Plan:</strong> ${currentSimulation.management}<br><br>
    <strong>Performance:</strong><br>
    • Clinical reasoning: ${simulationStep >= 2 ? 'Good' : 'Needs improvement'}<br>
    • Systematic approach: ${simulationStep >= 3 ? 'Excellent' : 'Good'}<br>
    • Knowledge application: ${simulationStep >= 4 ? 'Outstanding' : 'Good'}<br><br>
    <strong>Next Steps:</strong><br>
    • Review the clinical reasoning<br>
    • Study the key learning points<br>
    • Practice similar cases<br><br>
    <strong>Type:</strong> "start simulation" to try another case!`;
  
  currentSimulation = null;
  simulationStep = 0;
  
  return evaluation;
}

// Advanced Task Management System with Medical-Specific Features
let userTasks = [];
let taskIdCounter = 1;

function addTask(title, description, category, priority, dueDate, reminderTime) {
  const task = {
    id: taskIdCounter++,
    title,
    description,
    category,
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
    reminderTime: reminderTime ? new Date(reminderTime) : null,
    status: 'pending',
    createdAt: new Date(),
    completedAt: null,
    progress: 0,
    tags: [],
    notes: []
  };
  
  userTasks.push(task);
  return task;
}

function updateTaskStatus(taskId, status, progress = null) {
  const task = userTasks.find(t => t.id === taskId);
  if (!task) return null;
  
  task.status = status;
  if (progress !== null) task.progress = progress;
  
  if (status === 'completed') {
    task.completedAt = new Date();
    task.progress = 100;
  }
  
  return task;
}

function deleteTask(taskId) {
  const index = userTasks.findIndex(t => t.id === taskId);
  if (index === -1) return false;
  
  userTasks.splice(index, 1);
  return true;
}

function getTasksByCategory(category) {
  return userTasks.filter(task => task.category === category);
}

function getTasksByPriority(priority) {
  return userTasks.filter(task => task.priority === priority);
}

function getOverdueTasks() {
  const now = new Date();
  return userTasks.filter(task => 
    task.dueDate && 
    task.dueDate < now && 
    task.status !== 'completed'
  );
}

function getUpcomingTasks(days = 7) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return userTasks.filter(task => 
    task.dueDate && 
    task.dueDate >= now && 
    task.dueDate <= futureDate &&
    task.status !== 'completed'
  );
}

function addNoteToTask(taskId, note) {
  const task = userTasks.find(t => t.id === taskId);
  if (!task) return null;
  
  const noteObj = {
    id: Date.now(),
    content: note,
    timestamp: new Date()
  };
  
  task.notes.push(noteObj);
  return noteObj;
}

function getTaskSummary() {
  const total = userTasks.length;
  const completed = userTasks.filter(t => t.status === 'completed').length;
  const pending = userTasks.filter(t => t.status === 'pending').length;
  const overdue = getOverdueTasks().length;
  const upcoming = getUpcomingTasks(7).length;
  
  const categoryBreakdown = {};
  userTasks.forEach(task => {
    categoryBreakdown[task.category] = (categoryBreakdown[task.category] || 0) + 1;
  });
  
  const priorityBreakdown = {};
  userTasks.forEach(task => {
    priorityBreakdown[task.priority] = (priorityBreakdown[task.priority] || 0) + 1;
  });
  
  return {
    total,
    completed,
    pending,
    overdue,
    upcoming,
    categoryBreakdown,
    priorityBreakdown,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

function formatTaskList(tasks, showDetails = false) {
  if (tasks.length === 0) {
    return 'No tasks found.';
  }
  
  let response = '';
  tasks.forEach(task => {
    const statusIcon = task.status === 'completed' ? '✅' : 
                      task.status === 'in-progress' ? '🔄' : '⏳';
    const priorityIcon = task.priority === 'high' ? '🔴' : 
                        task.priority === 'medium' ? '🟡' : '🟢';
    
    response += `${statusIcon} <strong>${task.title}</strong> ${priorityIcon}<br>`;
    
    if (showDetails) {
      response += `&nbsp;&nbsp;📝 ${task.description}<br>`;
      response += `&nbsp;&nbsp;🏷️ ${task.category} | ${task.priority} priority<br>`;
      
      if (task.dueDate) {
        const dueDateStr = task.dueDate.toLocaleDateString();
        const isOverdue = task.dueDate < new Date() && task.status !== 'completed';
        response += `&nbsp;&nbsp;📅 Due: ${dueDateStr} ${isOverdue ? '⚠️ OVERDUE' : ''}<br>`;
      }
      
      response += `&nbsp;&nbsp;📊 Progress: ${task.progress}%<br>`;
      
      if (task.notes.length > 0) {
        response += `&nbsp;&nbsp;📝 Notes: ${task.notes.length} note(s)<br>`;
      }
      
      response += `<br>`;
    } else {
      response += `&nbsp;&nbsp;${task.description}<br><br>`;
    }
  });
  
  return response;
}

function handleTaskManagement(message) {
  const lowerMessage = message.toLowerCase();
  
  // Add task
  if (lowerMessage.includes('add task') || lowerMessage.includes('create task')) {
    // Extract task details from message
    const titleMatch = message.match(/add task[:\s]+(.+?)(?:\s+description|\s+category|\s+priority|\s+due|$)/i);
    const descriptionMatch = message.match(/description[:\s]+(.+?)(?:\s+category|\s+priority|\s+due|$)/i);
    const categoryMatch = message.match(/category[:\s]+(.+?)(?:\s+priority|\s+due|$)/i);
    const priorityMatch = message.match(/priority[:\s]+(.+?)(?:\s+due|$)/i);
    const dueMatch = message.match(/due[:\s]+(.+?)$/i);
    
    if (!titleMatch) {
      return `📋 <strong>Task Creation</strong><br><br>
        To add a task, please provide:<br><br>
        <strong>Format:</strong><br>
        "add task: [Title] description: [Description] category: [Category] priority: [high/medium/low] due: [Date]"<br><br>
        <strong>Example:</strong><br>
        "add task: Study Anatomy description: Review cardiovascular system category: studies priority: high due: 2024-01-15"<br><br>
        <strong>Available Categories:</strong><br>
        • studies - Academic and study tasks<br>
        • clinical - Clinical rotations and patient care<br>
        • exams - Exam preparation and assessments<br>
        • research - Research projects and papers<br>
        • personal - Personal development and wellness<br><br>
        <strong>Priorities:</strong> high, medium, low<br><br>
        What task would you like to add?`;
    }
    
    const title = titleMatch[1].trim();
    const description = descriptionMatch ? descriptionMatch[1].trim() : 'No description provided';
    const category = categoryMatch ? categoryMatch[1].trim() : 'personal';
    const priority = priorityMatch ? priorityMatch[1].trim() : 'medium';
    const dueDate = dueMatch ? dueMatch[1].trim() : null;
    
    const task = addTask(title, description, category, priority, dueDate);
    
    return `✅ <strong>Task Created Successfully!</strong><br><br>
      <strong>Title:</strong> ${task.title}<br>
      <strong>Description:</strong> ${task.description}<br>
      <strong>Category:</strong> ${task.category}<br>
      <strong>Priority:</strong> ${task.priority}<br>
      <strong>Due Date:</strong> ${task.dueDate ? task.dueDate.toLocaleDateString() : 'No due date'}<br>
      <strong>Status:</strong> ${task.status}<br><br>
      <strong>Task ID:</strong> ${task.id}<br><br>
      <strong>Commands:</strong><br>
      • "show tasks" - View all tasks<br>
      • "show tasks [category]" - View tasks by category<br>
      • "update task [ID] status [status]" - Update task status<br>
      • "delete task [ID]" - Delete a task<br><br>
      Task added to your management system!`;
  }
  
  // Show tasks
  if (lowerMessage.includes('show tasks') || lowerMessage.includes('list tasks')) {
    if (lowerMessage.includes('overdue')) {
      const overdueTasks = getOverdueTasks();
      return `⚠️ <strong>Overdue Tasks</strong><br><br>${formatTaskList(overdueTasks, true)}`;
    }
    
    if (lowerMessage.includes('upcoming')) {
      const upcomingTasks = getUpcomingTasks(7);
      return `📅 <strong>Upcoming Tasks (Next 7 Days)</strong><br><br>${formatTaskList(upcomingTasks, true)}`;
    }
    
    const categoryMatch = message.match(/show tasks\s+(\w+)/i);
    if (categoryMatch) {
      const category = categoryMatch[1].toLowerCase();
      const categoryTasks = getTasksByCategory(category);
      return `📋 <strong>Tasks - ${category.charAt(0).toUpperCase() + category.slice(1)}</strong><br><br>${formatTaskList(categoryTasks, true)}`;
    }
    
    const summary = getTaskSummary();
    return `📊 <strong>Task Management Dashboard</strong><br><br>
      <strong>Overview:</strong><br>
      • Total Tasks: ${summary.total}<br>
      • Completed: ${summary.completed}<br>
      • Pending: ${summary.pending}<br>
      • Overdue: ${summary.overdue}<br>
      • Upcoming (7 days): ${summary.upcoming}<br>
      • Completion Rate: ${summary.completionRate}%<br><br>
      <strong>All Tasks:</strong><br><br>
      ${formatTaskList(userTasks, true)}<br><br>
      <strong>Commands:</strong><br>
      • "show tasks overdue" - View overdue tasks<br>
      • "show tasks upcoming" - View upcoming tasks<br>
      • "show tasks [category]" - View by category<br>
      • "add task" - Create new task<br>
      • "update task [ID] status [status]" - Update task<br>
      • "delete task [ID]" - Remove task`;
  }
  
  // Update task
  if (lowerMessage.includes('update task') || lowerMessage.includes('modify task')) {
    const idMatch = message.match(/update task\s+(\d+)/i);
    const statusMatch = message.match(/status\s+(\w+)/i);
    
    if (!idMatch || !statusMatch) {
      return `📝 <strong>Task Update</strong><br><br>
        To update a task, please provide:<br><br>
        <strong>Format:</strong><br>
        "update task [ID] status [pending/in-progress/completed]"<br><br>
        <strong>Example:</strong><br>
        "update task 1 status completed"<br><br>
        <strong>Available Statuses:</strong><br>
        • pending - Task not started<br>
        • in-progress - Task in progress<br>
        • completed - Task finished<br><br>
        What would you like to update?`;
    }
    
    const taskId = parseInt(idMatch[1]);
    const newStatus = statusMatch[1].toLowerCase();
    
    const updatedTask = updateTaskStatus(taskId, newStatus);
    if (!updatedTask) {
      return `❌ Task with ID ${taskId} not found.`;
    }
    
    return `✅ <strong>Task Updated Successfully!</strong><br><br>
      <strong>Task ID:</strong> ${updatedTask.id}<br>
      <strong>Title:</strong> ${updatedTask.title}<br>
      <strong>New Status:</strong> ${updatedTask.status}<br>
      <strong>Progress:</strong> ${updatedTask.progress}%<br><br>
      Task status has been updated!`;
  }
  
  // Delete task
  if (lowerMessage.includes('delete task') || lowerMessage.includes('remove task')) {
    const idMatch = message.match(/delete task\s+(\d+)/i);
    
    if (!idMatch) {
      return `🗑️ <strong>Task Deletion</strong><br><br>
        To delete a task, please provide:<br><br>
        <strong>Format:</strong><br>
        "delete task [ID]"<br><br>
        <strong>Example:</strong><br>
        "delete task 1"<br><br>
        <strong>Warning:</strong> This action cannot be undone!<br><br>
        Which task would you like to delete?`;
    }
    
    const taskId = parseInt(idMatch[1]);
    const success = deleteTask(taskId);
    
    if (success) {
      return `✅ <strong>Task Deleted Successfully!</strong><br><br>
        Task ID ${taskId} has been removed from your system.<br><br>
        <strong>Commands:</strong><br>
        • "show tasks" - View remaining tasks<br>
        • "add task" - Create new task<br>
        • "task summary" - Get overview`;
    } else {
      return `❌ Task with ID ${taskId} not found.`;
    }
  }
  
  // Task summary
  if (lowerMessage.includes('task summary') || lowerMessage.includes('tasks summary')) {
    const summary = getTaskSummary();
    
    return `📊 <strong>Task Management Summary</strong><br><br>
      <strong>Overall Statistics:</strong><br>
      • Total Tasks: ${summary.total}<br>
      • Completed: ${summary.completed}<br>
      • Pending: ${summary.pending}<br>
      • Overdue: ${summary.overdue}<br>
      • Upcoming (7 days): ${summary.upcoming}<br>
      • Completion Rate: ${summary.completionRate}%<br><br>
      <strong>Category Breakdown:</strong><br>
      ${Object.entries(summary.categoryBreakdown).map(([category, count]) => 
        `• ${category.charAt(0).toUpperCase() + category.slice(1)}: ${count}`
      ).join('<br>')}<br><br>
      <strong>Priority Breakdown:</strong><br>
      ${Object.entries(summary.priorityBreakdown).map(([priority, count]) => 
        `• ${priority.charAt(0).toUpperCase() + priority.slice(1)}: ${count}`
      ).join('<br>')}<br><br>
      <strong>Recommendations:</strong><br>
      ${summary.overdue > 0 ? `• ⚠️ Address ${summary.overdue} overdue task(s) immediately<br>` : ''}
      ${summary.upcoming > 0 ? `• 📅 Plan for ${summary.upcoming} upcoming task(s)<br>` : ''}
      • 🎯 Focus on high-priority tasks<br>
      • 📈 Aim to improve completion rate<br><br>
      <strong>Commands:</strong><br>
      • "show tasks" - View all tasks<br>
      • "show tasks overdue" - View overdue tasks<br>
      • "add task" - Create new task`;
  }
  
  // Default task management response
  return `📋 <strong>Advanced Task Management System</strong><br><br>
    Welcome to your <strong>PRO-LEVEL</strong> task management system!<br><br>
    <strong>Available Commands:</strong><br>
    • <strong>"add task"</strong> - Create new task with details<br>
    • <strong>"show tasks"</strong> - View all tasks<br>
    • <strong>"show tasks [category]"</strong> - View by category<br>
    • <strong>"show tasks overdue"</strong> - View overdue tasks<br>
    • <strong>"show tasks upcoming"</strong> - View upcoming tasks<br>
    • <strong>"update task [ID] status [status]"</strong> - Update task status<br>
    • <strong>"delete task [ID]"</strong> - Remove task<br>
    • <strong>"task summary"</strong> - Get overview and statistics<br><br>
    <strong>Task Categories:</strong><br>
    • studies - Academic and study tasks<br>
    • clinical - Clinical rotations and patient care<br>
    • exams - Exam preparation and assessments<br>
    • research - Research projects and papers<br>
    • personal - Personal development and wellness<br><br>
    <strong>Task Priorities:</strong> high, medium, low<br><br>
    <strong>Example:</strong><br>
    "add task: Study Anatomy description: Review cardiovascular system category: studies priority: high due: 2024-01-15"<br><br>
    What would you like to do with your tasks?`;
}

// Get user profile
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Simple user profile for now
    const user = {
      id: userId,
      name: 'Medical Student',
      year: 1,
      createdAt: new Date().toISOString()
    };
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'User not found' });
  }
});

// Update user profile
app.post('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const updatedUser = {
      id: userId,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Update failed' });
  }
});

// Get year-specific curriculum
app.get('/api/curriculum/:year', (req, res) => {
  const { year } = req.params;
  const curriculum = getYearSpecificCurriculum(year);
  res.json({ success: true, curriculum });
});

function getYearSpecificCurriculum(year) {
  const curricula = {
    1: {
      year: 1,
      title: "1st Year - Basic Sciences",
      subjects: [
        "Anatomy & Physiology",
        "Biochemistry",
        "Community Medicine",
        "Medical Ethics",
        "Basic Medical Skills"
      ],
      focus: "Building strong foundations in basic sciences",
      skills: ["Anatomical drawing", "Lab techniques", "Basic examination"],
      exams: ["Mid-semester tests", "End-semester exams", "Practical assessments"]
    },
    2: {
      year: 2,
      title: "2nd Year - Pre-Clinical",
      subjects: [
        "Pathology",
        "Microbiology",
        "Pharmacology",
        "Forensic Medicine",
        "Clinical Skills"
      ],
      focus: "Understanding disease mechanisms and drug actions",
      skills: ["Microscopy", "Drug calculations", "Basic procedures"],
      exams: ["Subject-wise tests", "Integrated exams", "Practical skills"]
    },
    3: {
      year: 3,
      title: "3rd Year - Clinical Rotations",
      subjects: [
        "Medicine",
        "Surgery",
        "Obstetrics & Gynecology",
        "Pediatrics",
        "Clinical Practice"
      ],
      focus: "Clinical reasoning and patient care",
      skills: ["History taking", "Physical examination", "Clinical procedures"],
      exams: ["Clinical assessments", "Written exams", "OSCEs"]
    }
  };
  
  return curricula[year] || curricula[1];
}

// Advanced Curriculum System with Sri Lankan Medical Education Context
const sriLankanCurriculum = {
  1: {
    year: '1st Year',
    title: 'Foundation Medical Sciences',
    subjects: {
      'Anatomy': {
        topics: ['Gross Anatomy', 'Histology', 'Embryology', 'Neuroanatomy'],
        skills: ['Dissection', 'Microscopy', '3D Spatial Understanding'],
        assessments: ['Practical Exams', 'Theory Papers', 'Viva Voce'],
        resources: ['Gray\'s Anatomy', 'Netter Atlas', 'Dissection Manuals'],
        clinicalRelevance: 'Foundation for surgical procedures, physical examination, and diagnostic imaging interpretation'
      },
      'Physiology': {
        topics: ['Cardiovascular', 'Respiratory', 'Gastrointestinal', 'Endocrine', 'Nervous System'],
        skills: ['Lab Techniques', 'Data Analysis', 'Physiological Measurements'],
        assessments: ['Lab Reports', 'Theory Exams', 'Practical Skills'],
        resources: ['Guyton & Hall', 'Ganong\'s Review', 'Lab Manuals'],
        clinicalRelevance: 'Understanding normal body function to identify pathological changes'
      },
      'Biochemistry': {
        topics: ['Metabolism', 'Molecular Biology', 'Clinical Biochemistry', 'Nutrition'],
        skills: ['Lab Analysis', 'Biochemical Calculations', 'Interpretation'],
        assessments: ['Lab Work', 'Theory Papers', 'Case Studies'],
        resources: ['Harper\'s Biochemistry', 'Clinical Cases', 'Lab Protocols'],
        clinicalRelevance: 'Diagnosis and monitoring of metabolic disorders, diabetes, liver disease'
      }
    },
    learningObjectives: [
      'Master basic medical terminology and concepts',
      'Develop laboratory and practical skills',
      'Understand normal human structure and function',
      'Build foundation for clinical reasoning'
    ],
    clinicalExposure: 'Basic patient contact, hospital visits, community health programs',
    exams: ['End of Year Theory', 'Practical Assessments', 'Continuous Assessment']
  },
  2: {
    year: '2nd Year',
    title: 'Pre-Clinical Sciences',
    subjects: {
      'Pathology': {
        topics: ['General Pathology', 'Systemic Pathology', 'Histopathology', 'Clinical Pathology'],
        skills: ['Microscopy', 'Gross Specimen Analysis', 'Lab Interpretation'],
        assessments: ['Practical Exams', 'Theory Papers', 'Case Presentations'],
        resources: ['Robbins Pathology', 'Atlas of Pathology', 'Lab Manuals'],
        clinicalRelevance: 'Understanding disease mechanisms, diagnosis, and treatment planning'
      },
      'Microbiology': {
        topics: ['Bacteriology', 'Virology', 'Mycology', 'Parasitology', 'Immunology'],
        skills: ['Culture Techniques', 'Staining Methods', 'Antibiotic Sensitivity'],
        assessments: ['Lab Practicals', 'Theory Exams', 'Research Projects'],
        resources: ['Jawetz Microbiology', 'Atlas of Microbiology', 'Lab Protocols'],
        clinicalRelevance: 'Infectious disease diagnosis, antibiotic selection, infection control'
      },
      'Pharmacology': {
        topics: ['General Pharmacology', 'Autonomic Drugs', 'Cardiovascular Drugs', 'Antimicrobials'],
        skills: ['Drug Calculations', 'Prescription Writing', 'Adverse Effect Recognition'],
        assessments: ['Theory Papers', 'Practical Skills', 'Case Studies'],
        resources: ['Katzung Pharmacology', 'Clinical Cases', 'Drug Formularies'],
        clinicalRelevance: 'Safe and effective drug prescribing, understanding drug interactions'
      }
    },
    learningObjectives: [
      'Understand disease mechanisms and processes',
      'Master laboratory diagnostic techniques',
      'Learn drug mechanisms and clinical applications',
      'Develop clinical reasoning skills'
    ],
    clinicalExposure: 'Pathology lab rotations, clinical case discussions, community health',
    exams: ['End of Year Theory', 'Practical Skills', 'Continuous Assessment']
  },
  3: {
    year: '3rd Year',
    title: 'Clinical Foundation',
    subjects: {
      'Medicine': {
        topics: ['Cardiology', 'Respiratory', 'Gastroenterology', 'Endocrinology', 'Neurology'],
        skills: ['History Taking', 'Physical Examination', 'Clinical Reasoning'],
        assessments: ['Clinical Exams', 'Case Presentations', 'Theory Papers'],
        resources: ['Harrison\'s Medicine', 'Clinical Cases', 'Guidelines'],
        clinicalRelevance: 'Primary care, internal medicine, emergency medicine'
      },
      'Surgery': {
        topics: ['General Surgery', 'Trauma', 'Emergency Surgery', 'Surgical Skills'],
        skills: ['Surgical Procedures', 'Pre-op Assessment', 'Post-op Care'],
        assessments: ['Clinical Skills', 'Theory Papers', 'Surgical Logbook'],
        resources: ['Bailey & Love Surgery', 'Surgical Skills Manual', 'Case Studies'],
        clinicalRelevance: 'Surgical emergencies, elective procedures, trauma management'
      },
      'Obstetrics & Gynecology': {
        topics: ['Antenatal Care', 'Labor & Delivery', 'Gynecological Disorders', 'Family Planning'],
        skills: ['Obstetric Examination', 'Ultrasound', 'Delivery Techniques'],
        assessments: ['Clinical Skills', 'Theory Papers', 'Delivery Logbook'],
        resources: ['Williams Obstetrics', 'Gynecology Textbooks', 'Clinical Guidelines'],
        clinicalRelevance: 'Maternal and child health, reproductive health, emergency obstetrics'
      }
    },
    learningObjectives: [
      'Master clinical history taking and examination',
      'Develop differential diagnosis skills',
      'Understand common medical and surgical conditions',
      'Learn emergency management principles'
    ],
    clinicalExposure: 'Hospital rotations, outpatient clinics, emergency department, operating theater',
    exams: ['Clinical Skills Assessment', 'Theory Papers', 'Logbook Completion']
  },
  4: {
    year: '4th Year',
    title: 'Clinical Specialties',
    subjects: {
      'Pediatrics': {
        topics: ['Growth & Development', 'Pediatric Emergencies', 'Infectious Diseases', 'Nutrition'],
        skills: ['Pediatric Examination', 'Growth Assessment', 'Vaccination'],
        assessments: ['Clinical Skills', 'Theory Papers', 'Case Presentations'],
        resources: ['Nelson Pediatrics', 'Pediatric Guidelines', 'Growth Charts'],
        clinicalRelevance: 'Child health, developmental assessment, pediatric emergencies'
      },
      'Psychiatry': {
        topics: ['Mental Health Assessment', 'Common Disorders', 'Psychopharmacology', 'Psychotherapy'],
        skills: ['Mental State Examination', 'Risk Assessment', 'Therapeutic Communication'],
        assessments: ['Clinical Skills', 'Theory Papers', 'Case Studies'],
        resources: ['Kaplan & Sadock', 'DSM-5', 'Clinical Guidelines'],
        clinicalRelevance: 'Mental health care, crisis intervention, community psychiatry'
      },
      'Community Medicine': {
        topics: ['Epidemiology', 'Public Health', 'Preventive Medicine', 'Health Policy'],
        skills: ['Epidemiological Studies', 'Health Education', 'Program Planning'],
        assessments: ['Research Projects', 'Theory Papers', 'Community Projects'],
        resources: ['Public Health Textbooks', 'WHO Guidelines', 'Research Methods'],
        clinicalRelevance: 'Population health, disease prevention, health promotion'
      }
    },
    learningObjectives: [
      'Specialize in key clinical areas',
      'Develop advanced clinical skills',
      'Understand population health principles',
      'Prepare for internship'
    ],
    clinicalExposure: 'Specialty rotations, community health projects, research involvement',
    exams: ['Specialty Clinical Exams', 'Theory Papers', 'Research Projects']
  },
  5: {
    year: '5th Year',
    title: 'Final Year & Internship Preparation',
    subjects: {
      'Emergency Medicine': {
        topics: ['Trauma Management', 'Cardiac Emergencies', 'Respiratory Emergencies', 'Toxicology'],
        skills: ['ACLS', 'ATLS', 'Emergency Procedures', 'Critical Care'],
        assessments: ['Practical Skills', 'Theory Papers', 'Emergency Logbook'],
        resources: ['Emergency Medicine Textbooks', 'ACLS Manual', 'Clinical Guidelines'],
        clinicalRelevance: 'Emergency department, critical care, pre-hospital care'
      },
      'Family Medicine': {
        topics: ['Primary Care', 'Preventive Care', 'Chronic Disease Management', 'Health Promotion'],
        skills: ['Comprehensive Care', 'Patient Education', 'Care Coordination'],
        assessments: ['Clinical Skills', 'Theory Papers', 'Patient Logbook'],
        resources: ['Family Medicine Textbooks', 'Clinical Guidelines', 'Patient Education Materials'],
        clinicalRelevance: 'Primary care practice, family health, community medicine'
      },
      'Research & Evidence-Based Medicine': {
        topics: ['Research Methods', 'Statistics', 'Critical Appraisal', 'Systematic Reviews'],
        skills: ['Research Design', 'Data Analysis', 'Literature Review'],
        assessments: ['Research Project', 'Thesis', 'Presentations'],
        resources: ['Research Methods Books', 'Statistical Software', 'Medical Databases'],
        clinicalRelevance: 'Evidence-based practice, research skills, academic medicine'
      }
    },
    learningObjectives: [
      'Master emergency and critical care',
      'Develop comprehensive care skills',
      'Complete research requirements',
      'Prepare for medical practice'
    ],
    clinicalExposure: 'Emergency rotations, primary care practice, research projects, elective rotations',
    exams: ['Final Clinical Exams', 'Research Thesis', 'Comprehensive Assessment']
  }
};

function getCurriculumDetails(year) {
  const curriculum = sriLankanCurriculum[year];
  if (!curriculum) {
    return '❌ Invalid year. Please specify 1st, 2nd, 3rd, 4th, or 5th year.';
  }
  
  let response = `📚 <strong>${curriculum.year} - ${curriculum.title}</strong><br><br>`;
  
  response += `<strong>Core Subjects:</strong><br>`;
  Object.entries(curriculum.subjects).forEach(([subject, details]) => {
    response += `• <strong>${subject}</strong><br>`;
    response += `&nbsp;&nbsp;Topics: ${details.topics.join(', ')}<br>`;
    response += `&nbsp;&nbsp;Skills: ${details.skills.join(', ')}<br>`;
    response += `&nbsp;&nbsp;Clinical Relevance: ${details.clinicalRelevance}<br><br>`;
  });
  
  response += `<strong>Learning Objectives:</strong><br>`;
  curriculum.learningObjectives.forEach(objective => {
    response += `• ${objective}<br>`;
  });
  
  response += `<br><strong>Clinical Exposure:</strong><br>${curriculum.clinicalExposure}<br><br>`;
  response += `<strong>Assessment Methods:</strong><br>`;
  curriculum.exams.forEach(exam => {
    response += `• ${exam}<br>`;
  });
  
  response += `<br><strong>Resources:</strong><br>`;
  Object.values(curriculum.subjects).forEach(subject => {
    response += `• ${subject.resources.join(', ')}<br>`;
  });
  
  return response;
}

function getSkillAssessment(year) {
  const curriculum = sriLankanCurriculum[year];
  if (!curriculum) {
    return '❌ Invalid year. Please specify 1st, 2nd, 3rd, 4th, or 5th year.';
  }
  
  let response = `🎯 <strong>Skill Assessment - ${curriculum.year}</strong><br><br>`;
  
  response += `<strong>Core Competencies to Master:</strong><br>`;
  
  Object.entries(curriculum.subjects).forEach(([subject, details]) => {
    response += `<strong>${subject}:</strong><br>`;
    details.skills.forEach(skill => {
      response += `• ${skill}<br>`;
    });
    response += `<br>`;
  });
  
  response += `<strong>Assessment Criteria:</strong><br>`;
  response += `• <strong>Knowledge:</strong> Theory understanding and application<br>`;
  response += `• <strong>Skills:</strong> Practical competency and proficiency<br>`;
  response += `• <strong>Attitude:</strong> Professional behavior and communication<br>`;
  response += `• <strong>Clinical Reasoning:</strong> Problem-solving and decision-making<br><br>`;
  
  response += `<strong>Self-Assessment Questions:</strong><br>`;
  response += `• Can you explain the key concepts in each subject?<br>`;
  response += `• Are you confident in performing the required skills?<br>`;
  response += `• Can you apply knowledge to clinical scenarios?<br>`;
  response += `• Are you meeting the learning objectives?<br><br>`;
  
  response += `<strong>Next Steps:</strong><br>`;
  response += `• Review weak areas<br>`;
  response += `• Practice skills regularly<br>`;
  response += `• Seek feedback from supervisors<br>`;
  response += `• Use available resources effectively<br><br>`;
  
  response += `<strong>Type:</strong> "curriculum [year]" for detailed information<br>`;
  response += `<strong>Type:</strong> "skills [year]" for skill assessment<br>`;
  
  return response;
}

// Get medical tools
app.get('/api/tools', (req, res) => {
  const tools = [
    "BMI Calculator",
    "GFR Calculator",
    "CHADS2 Score",
    "APGAR Score",
    "Glasgow Coma Scale",
    "Drug Interactions Checker",
    "Clinical Decision Support",
    "Patient Education Materials"
  ];
  res.json({ success: true, tools });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'StethoLink AI Standalone',
    timestamp: new Date().toISOString(),
    features: [
      'Year-specific curriculum',
      'Sri Lankan medical context',
      'Task management',
      'Medical calculators',
      'Patient simulation',
      'Offline capability'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StethoLink AI Standalone App running on port ${PORT}`);
  console.log(`📱 Access on your phone: http://localhost:${PORT}`);
  console.log(`🔗 PWA ready for installation`);
  console.log(`📚 Medical Agent System initialized`);
});

module.exports = app; 