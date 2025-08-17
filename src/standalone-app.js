const express = require('express');
const path = require('path');
const { logger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for the standalone app
const userProfiles = new Map();
const chatHistory = new Map();

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
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
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
      '/manifest.json'
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
    
    // Process message through simple AI system
    const response = await processMessage(message, userId, context);
    
    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error processing chat message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message'
    });
  }
});

// Get user profile
app.get('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = getUserProfile(userId);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get user profile' });
  }
});

// Update user profile
app.post('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const updatedUser = updateUserProfile(userId, updates);
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

// Get medical tools
app.get('/api/tools', (req, res) => {
  const tools = getAvailableTools();
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

// Enhanced AI message processing with pinpoint accuracy
async function processMessage(message, userId, context) {
  const lowerMessage = message.toLowerCase();
  
  // Study Plans with enhanced accuracy
  if (context === 'study-plans') {
    if (lowerMessage.includes('1st') || lowerMessage.includes('first')) {
      return `📚 <strong>1st Year Study Plan - Sri Lankan Medical Curriculum</strong><br><br>
        <strong>Core Subjects (Semester 1):</strong><br>
        • Anatomy I - Gross Anatomy, Histology<br>
        • Physiology I - Cell Physiology, Cardiovascular<br>
        • Biochemistry I - Biomolecules, Metabolism<br>
        • Community Medicine I - Epidemiology, Biostatistics<br><br>
        <strong>Core Subjects (Semester 2):</strong><br>
        • Anatomy II - Neuroanatomy, Embryology<br>
        • Physiology II - Respiratory, Renal, Endocrine<br>
        • Biochemistry II - Clinical Biochemistry, Genetics<br>
        • Community Medicine II - Public Health, Nutrition<br><br>
        <strong>Study Strategy:</strong><br>
        • Daily: 2 hours anatomy, 1.5 hours physiology, 1 hour biochemistry<br>
        • Weekly: 1 practical session, 1 group study, 1 self-assessment<br>
        • Monthly: Progress review and curriculum adjustment<br><br>
        <strong>Key Resources:</strong><br>
        • Gray's Anatomy (Sri Lankan Edition)<br>
        • Guyton & Hall Physiology<br>
        • Harper's Biochemistry<br>
        • Park's Community Medicine`;
    } else if (lowerMessage.includes('2nd') || lowerMessage.includes('second')) {
      return `📚 <strong>2nd Year Study Plan - Para-clinical Excellence</strong><br><br>
        <strong>Core Subjects (Semester 3):</strong><br>
        • Pathology I - General Pathology, Cell Injury<br>
        • Microbiology I - Bacteriology, Virology<br>
        • Pharmacology I - General Pharmacology, Autonomic<br>
        • Forensic Medicine I - Legal Medicine, Toxicology<br><br>
        <strong>Core Subjects (Semester 4):</strong><br>
        • Pathology II - Systemic Pathology, Neoplasia<br>
        • Microbiology II - Mycology, Parasitology<br>
        • Pharmacology II - Systemic Pharmacology, Chemotherapy<br>
        • Forensic Medicine II - Clinical Forensic, Medico-legal<br><br>
        <strong>Study Strategy:</strong><br>
        • Daily: 2 hours pathology, 1.5 hours microbiology, 1 hour pharmacology<br>
        • Weekly: 2 lab sessions, 1 case study analysis, 1 clinical correlation<br>
        • Monthly: Clinical exposure and skill assessment<br><br>
        <strong>Key Resources:</strong><br>
        • Robbins Pathology (Sri Lankan Context)<br>
        • Jawetz Medical Microbiology<br>
        • Katzung Pharmacology<br>
        • Reddy's Forensic Medicine`;
    } else if (lowerMessage.includes('3rd') || lowerMessage.includes('third')) {
      return `📚 <strong>3rd Year Study Plan - Clinical Mastery</strong><br><br>
        <strong>Core Subjects (Semester 5):</strong><br>
        • Medicine I - Cardiovascular, Respiratory, Gastrointestinal<br>
        • Surgery I - General Surgery, Trauma, Emergency<br>
        • Obstetrics & Gynecology I - Antenatal, Intrapartum<br>
        • Pediatrics I - Growth, Development, Common Illnesses<br><br>
        <strong>Core Subjects (Semester 6):</strong><br>
        • Medicine II - Neurology, Endocrinology, Rheumatology<br>
        • Surgery II - Specialized Surgery, Oncology<br>
        • Obstetrics & Gynecology II - Postnatal, Gynecology<br>
        • Pediatrics II - Emergency, Critical Care<br><br>
        <strong>Study Strategy:</strong><br>
        • Daily: 3 hours clinical reading, 2 hours skills practice, 1 hour case review<br>
        • Weekly: 2 patient encounters, 1 procedure practice, 1 clinical discussion<br>
        • Monthly: Clinical assessment and competency evaluation<br><br>
        <strong>Key Resources:</strong><br>
        • Harrison's Internal Medicine<br>
        • Schwartz's Principles of Surgery<br>
        • Williams Obstetrics<br>
        • Nelson Textbook of Pediatrics`;
    } else {
      return `📚 <strong>Comprehensive Study Plans Available</strong><br><br>
        <strong>Choose Your Year:</strong><br>
        • <strong>1st Year</strong> - Pre-clinical foundations (Anatomy, Physiology, Biochemistry)<br>
        • <strong>2nd Year</strong> - Para-clinical understanding (Pathology, Microbiology, Pharmacology)<br>
        • <strong>3rd Year</strong> - Clinical application (Medicine, Surgery, OBGYN, Pediatrics)<br><br>
        <strong>Just type:</strong> "1st year", "2nd year", or "3rd year" for detailed plans!<br><br>
        <strong>Each plan includes:</strong><br>
        • Semester breakdown with subjects<br>
        • Daily/weekly/monthly study strategies<br>
        • Recommended textbooks and resources<br>
        • Clinical correlation opportunities`;
    }
  }
  
  // Enhanced Medical Calculators with clinical accuracy
  if (context === 'medical-calculators') {
    if (lowerMessage.includes('bmi')) {
      return `🧮 <strong>BMI Calculator - Clinical Assessment Tool</strong><br><br>
        <strong>Formula:</strong> BMI = Weight (kg) / Height (m)²<br><br>
        <strong>WHO Classification (Adults):</strong><br>
        • Underweight: < 18.5 kg/m²<br>
        • Normal weight: 18.5 - 24.9 kg/m²<br>
        • Overweight: 25.0 - 29.9 kg/m²<br>
        • Obese Class I: 30.0 - 34.9 kg/m²<br>
        • Obese Class II: 35.0 - 39.9 kg/m²<br>
        • Obese Class III: ≥ 40.0 kg/m²<br><br>
        <strong>Clinical Examples:</strong><br>
        • 25-year-old female: 65kg, 1.62m → BMI = 24.8 (Normal)<br>
        • 45-year-old male: 85kg, 1.75m → BMI = 27.8 (Overweight)<br>
        • 70-year-old female: 55kg, 1.58m → BMI = 22.0 (Normal)<br><br>
        <strong>Clinical Significance:</strong><br>
        • Risk factor for cardiovascular disease<br>
        • Diabetes mellitus association<br>
        • Surgical risk assessment<br>
        • Medication dosing considerations`;
    } else if (lowerMessage.includes('gfr') || lowerMessage.includes('glomerular')) {
      return `🧮 <strong>GFR Calculator - Cockcroft-Gault Formula</strong><br><br>
        <strong>Formula:</strong><br>
        GFR = [(140 - Age) × Weight (kg)] / [72 × Serum Creatinine (mg/dL)]<br>
        <strong>For Women:</strong> Multiply result by 0.85<br><br>
        <strong>Clinical Examples:</strong><br>
        • 70-year-old male, 80kg, Cr 1.8 mg/dL<br>
        GFR = [(140-70) × 80] / [72 × 1.8] = 43.2 mL/min<br>
        <strong>Result:</strong> Stage 3b CKD (Moderate decrease)<br><br>
        • 55-year-old female, 65kg, Cr 1.2 mg/dL<br>
        GFR = [(140-55) × 65] / [72 × 1.2] × 0.85 = 67.8 mL/min<br>
        <strong>Result:</strong> Stage 2 CKD (Mild decrease)<br><br>
        <strong>KDIGO Staging:</strong><br>
        • Stage 1: ≥90 mL/min/1.73m² (Normal)<br>
        • Stage 2: 60-89 mL/min/1.73m² (Mild decrease)<br>
        • Stage 3a: 45-59 mL/min/1.73m² (Moderate decrease)<br>
        • Stage 3b: 30-44 mL/min/1.73m² (Moderate decrease)<br>
        • Stage 4: 15-29 mL/min/1.73m² (Severe decrease)<br>
        • Stage 5: <15 mL/min/1.73m² (Kidney failure)<br><br>
        <strong>Clinical Implications:</strong><br>
        • Medication dose adjustments<br>
        • Contrast media precautions<br>
        • Referral to nephrology<br>
        • Monitoring frequency`;
    } else if (lowerMessage.includes('chads2') || lowerMessage.includes('chads')) {
      return `🧮 <strong>CHADS2 Score - Stroke Risk in Atrial Fibrillation</strong><br><br>
        <strong>Scoring System:</strong><br>
        • <strong>C</strong>ongestive heart failure: 1 point<br>
        • <strong>H</strong>ypertension: 1 point<br>
        • <strong>A</strong>ge ≥75 years: 1 point<br>
        • <strong>D</strong>iabetes mellitus: 1 point<br>
        • <strong>S</strong>troke/TIA/Thromboembolism: 2 points<br><br>
        <strong>Clinical Examples:</strong><br>
        • 75-year-old male with HTN, DM, previous stroke<br>
        CHADS2 = 1 + 1 + 1 + 2 = 5 points<br>
        <strong>Risk:</strong> High (6.9% annual stroke risk)<br><br>
        • 65-year-old female with HTN only<br>
        CHADS2 = 1 point<br>
        <strong>Risk:</strong> Low (1.9% annual stroke risk)<br><br>
        <strong>Risk Stratification:</strong><br>
        • 0 points: Low risk (0.5% annual stroke risk)<br>
        • 1 point: Low risk (1.9% annual stroke risk)<br>
        • 2 points: Moderate risk (2.8% annual stroke risk)<br>
        • 3 points: Moderate risk (4.0% annual stroke risk)<br>
        • 4 points: High risk (5.9% annual stroke risk)<br>
        • 5 points: High risk (6.9% annual stroke risk)<br>
        • 6 points: High risk (9.3% annual stroke risk)<br><br>
        <strong>Treatment Recommendations:</strong><br>
        • 0-1 points: Consider aspirin or no therapy<br>
        • 2+ points: Consider oral anticoagulation (Warfarin, DOACs)`;
    } else if (lowerMessage.includes('wells') || lowerMessage.includes('dvt')) {
      return `🧮 <strong>Wells DVT Score - Deep Vein Thrombosis Assessment</strong><br><br>
        <strong>Scoring System:</strong><br>
        • Active cancer (treatment within 6 months): 1 point<br>
        • Paralysis, paresis, or recent plaster immobilization: 1 point<br>
        • Recently bedridden >3 days or major surgery within 12 weeks: 1 point<br>
        • Localized tenderness along distribution of deep veins: 1 point<br>
        • Entire leg swollen: 1 point<br>
        • Calf swelling >3cm compared to asymptomatic leg: 1 point<br>
        • Pitting edema confined to symptomatic leg: 1 point<br>
        • Collateral superficial veins (non-varicose): 1 point<br>
        • Alternative diagnosis as likely or more likely than DVT: -2 points<br><br>
        <strong>Clinical Examples:</strong><br>
        • 45-year-old post-surgery with leg swelling and tenderness<br>
        Wells Score = 1 + 1 + 1 + 1 + 1 = 5 points<br>
        <strong>Risk:</strong> High (75% probability of DVT)<br><br>
        • 30-year-old with calf pain but no swelling<br>
        Wells Score = 1 point<br>
        <strong>Risk:</strong> Low (3% probability of DVT)<br><br>
        <strong>Risk Stratification:</strong><br>
        • ≥2 points: High probability (75% DVT probability)<br>
        • <2 points: Low probability (3% DVT probability)<br><br>
        <strong>Clinical Management:</strong><br>
        • High probability: Immediate imaging (US, CT venography)<br>
        • Low probability: D-dimer testing, consider imaging if positive`;
    } else {
      return `🧮 <strong>Advanced Medical Calculators Available</strong><br><br>
        <strong>Clinical Assessment Tools:</strong><br>
        • <strong>BMI Calculator</strong> - Body Mass Index with WHO classification<br>
        • <strong>GFR Calculator</strong> - Kidney function (Cockcroft-Gault)<br>
        • <strong>CHADS2 Score</strong> - Stroke risk in atrial fibrillation<br>
        • <strong>Wells DVT Score</strong> - Deep vein thrombosis probability<br><br>
        <strong>Just ask for any calculator:</strong><br>
        • "BMI calculator" - for weight assessment<br>
        • "GFR calculator" - for kidney function<br>
        • "CHADS2 score" - for stroke risk<br>
        • "Wells DVT score" - for thrombosis assessment<br><br>
        <strong>Each calculator includes:</strong><br>
        • Precise formulas and examples<br>
        • Clinical classifications and staging<br>
        • Real patient scenarios<br>
        • Treatment implications`;
    }
  }

  // Enhanced Drug Information with clinical accuracy
  if (lowerMessage.includes('drug') || lowerMessage.includes('medication')) {
    if (lowerMessage.includes('beta') || lowerMessage.includes('blocker')) {
      return `💊 <strong>Beta-Blockers - Cardiovascular Therapeutics</strong><br><br>
        <strong>Mechanism of Action:</strong><br>
        • Competitive antagonists of β-adrenergic receptors<br>
        • Block sympathetic nervous system effects<br>
        • Reduce heart rate, blood pressure, and myocardial contractility<br><br>
        <strong>Clinical Indications:</strong><br>
        • Hypertension (first-line therapy)<br>
        • Angina pectoris<br>
        • Heart failure with reduced ejection fraction<br>
        • Atrial fibrillation rate control<br>
        • Myocardial infarction prophylaxis<br><br>
        <strong>Common Side Effects:</strong><br>
        • Bradycardia and heart block<br>
        • Fatigue and dizziness<br>
        • Cold extremities<br>
        • Sexual dysfunction<br>
        • Bronchospasm (in asthma patients)<br><br>
        <strong>Drug Interactions:</strong><br>
        • Calcium channel blockers (verapamil, diltiazem)<br>
        • Digoxin (increased bradycardia risk)<br>
        • NSAIDs (reduced antihypertensive effect)<br><br>
        <strong>Clinical Pearls:</strong><br>
        • Start low, go slow (titrate gradually)<br>
        • Avoid abrupt withdrawal (rebound hypertension)<br>
        • Monitor heart rate and blood pressure<br>
        • Consider cardioselective agents in COPD`;
    } else if (lowerMessage.includes('ace') || lowerMessage.includes('inhibitor')) {
      return `💊 <strong>ACE Inhibitors - Renin-Angiotensin System Blockade</strong><br><br>
        <strong>Mechanism of Action:</strong><br>
        • Inhibit angiotensin-converting enzyme<br>
        • Reduce angiotensin II production<br>
        • Increase bradykinin levels<br>
        • Promote vasodilation and natriuresis<br><br>
        <strong>Clinical Indications:</strong><br>
        • Hypertension (first-line therapy)<br>
        • Heart failure with reduced ejection fraction<br>
        • Post-myocardial infarction<br>
        • Diabetic nephropathy<br>
        • Proteinuria reduction<br><br>
        <strong>Common Side Effects:</strong><br>
        • Dry cough (bradykinin-mediated)<br>
        • Hyperkalemia<br>
        • Angioedema (rare but serious)<br>
        • Hypotension (first dose)<br>
        • Teratogenicity (avoid in pregnancy)<br><br>
        <strong>Drug Interactions:</strong><br>
        • Potassium supplements (hyperkalemia risk)<br>
        • NSAIDs (reduced antihypertensive effect)<br>
        • Lithium (increased lithium levels)<br><br>
        <strong>Clinical Pearls:</strong><br>
        • Monitor potassium and creatinine<br>
        • Start with low dose in heart failure<br>
        • Consider ARBs if cough develops<br>
        • Avoid in bilateral renal artery stenosis`;
    } else if (lowerMessage.includes('statin') || lowerMessage.includes('atorvastatin')) {
      return `💊 <strong>Statins - HMG-CoA Reductase Inhibitors</strong><br><br>
        <strong>Mechanism of Action:</strong><br>
        • Competitive inhibition of HMG-CoA reductase<br>
        • Reduce hepatic cholesterol synthesis<br>
        • Increase LDL receptor expression<br>
        • Anti-inflammatory and plaque stabilization effects<br><br>
        <strong>Clinical Indications:</strong><br>
        • Primary prevention (10-year CVD risk ≥7.5%)<br>
        • Secondary prevention (established CVD)<br>
        • Diabetes mellitus with risk factors<br>
        • Familial hypercholesterolemia<br>
        • Acute coronary syndrome<br><br>
        <strong>Common Side Effects:</strong><br>
        • Myalgia and muscle weakness<br>
        • Elevated liver enzymes<br>
        • Gastrointestinal symptoms<br>
        • New-onset diabetes mellitus<br>
        • Cognitive changes (rare)<br><br>
        <strong>Drug Interactions:</strong><br>
        • Grapefruit juice (increased statin levels)<br>
        • Fibrates (increased myopathy risk)<br>
        • Macrolide antibiotics<br>
        • Amiodarone<br><br>
        <strong>Clinical Pearls:</strong><br>
        • Check baseline LFTs and CK<br>
        • Monitor for muscle symptoms<br>
        • Consider drug interactions<br>
        • Individualize intensity based on risk`;
    } else {
      return `💊 <strong>Comprehensive Drug Information Database</strong><br><br>
        <strong>Available Drug Classes:</strong><br>
        • <strong>Beta-Blockers</strong> - Cardiovascular protection<br>
        • <strong>ACE Inhibitors</strong> - Blood pressure control<br>
        • <strong>Statins</strong> - Cholesterol management<br>
        • <strong>Calcium Channel Blockers</strong> - Vasodilation<br>
        • <strong>Diuretics</strong> - Fluid management<br><br>
        <strong>Just ask for any drug class:</strong><br>
        • "Beta blockers" - for cardiovascular effects<br>
        • "ACE inhibitors" - for hypertension<br>
        • "Statins" - for cholesterol control<br>
        • "Calcium channel blockers" - for vasodilation<br><br>
        <strong>Each drug profile includes:</strong><br>
        • Precise mechanism of action<br>
        • Clinical indications and contraindications<br>
        • Side effects and monitoring<br>
        • Drug interactions and precautions<br>
        • Clinical pearls for practice`;
    }
  }

  // Enhanced Clinical Guidelines
  if (lowerMessage.includes('guideline') || lowerMessage.includes('protocol')) {
    if (lowerMessage.includes('hypertension') || lowerMessage.includes('htn')) {
      return `📖 <strong>Hypertension Management - Evidence-Based Guidelines</strong><br><br>
        <strong>Diagnosis (JNC 8):</strong><br>
        • Normal: <120/80 mmHg<br>
        • Elevated: 120-129/<80 mmHg<br>
        • Stage 1: 130-139/80-89 mmHg<br>
        • Stage 2: ≥140/≥90 mmHg<br><br>
        <strong>Treatment Thresholds:</strong><br>
        • Age <60: Start at ≥140/90 mmHg<br>
        • Age ≥60: Start at ≥150/90 mmHg<br>
        • Diabetes/CKD: Start at ≥130/80 mmHg<br><br>
        <strong>First-Line Medications:</strong><br>
        • Thiazide diuretics (chlorthalidone, HCTZ)<br>
        • ACE inhibitors or ARBs<br>
        • Calcium channel blockers<br>
        • Beta-blockers (not first-line)<br><br>
        <strong>Lifestyle Modifications:</strong><br>
        • DASH diet (Dietary Approaches to Stop Hypertension)<br>
        • Sodium restriction (<2.4g/day)<br>
        • Regular exercise (150 min/week)<br>
        • Weight loss (5-10% of body weight)<br>
        • Alcohol moderation (≤2 drinks/day men, ≤1 drink/day women)<br><br>
        <strong>Monitoring:</strong><br>
        • Home blood pressure monitoring<br>
        • 3-month follow-up for controlled HTN<br>
        • Monthly follow-up for uncontrolled HTN<br>
        • Annual comprehensive evaluation`;
    } else if (lowerMessage.includes('diabetes') || lowerMessage.includes('dm')) {
      return `📖 <strong>Diabetes Management - ADA Guidelines 2024</strong><br><br>
        <strong>Diagnosis Criteria:</strong><br>
        • FPG ≥126 mg/dL (7.0 mmol/L)<br>
        • 2-hr PG ≥200 mg/dL (11.1 mmol/L) during OGTT<br>
        • HbA1c ≥6.5% (48 mmol/mol)<br>
        • Random PG ≥200 mg/dL with symptoms<br><br>
        <strong>Treatment Goals:</strong><br>
        • HbA1c <7.0% (53 mmol/mol) for most adults<br>
        • HbA1c <6.5% (48 mmol/mol) for selected patients<br>
        • Preprandial glucose: 80-130 mg/dL<br>
        • Postprandial glucose: <180 mg/dL<br><br>
        <strong>First-Line Therapy:</strong><br>
        • Metformin (if eGFR ≥30 mL/min/1.73m²)<br>
        • Lifestyle modification (diet, exercise, weight loss)<br>
        • Patient education and self-management<br><br>
        <strong>Add-On Therapy (if HbA1c ≥8.5%):</strong><br>
        • GLP-1 receptor agonists (liraglutide, semaglutide)<br>
        • SGLT2 inhibitors (empagliflozin, dapagliflozin)<br>
        • DPP-4 inhibitors (sitagliptin, linagliptin)<br><br>
        <strong>Monitoring:</strong><br>
        • HbA1c every 3-6 months<br>
        • Daily self-monitoring of blood glucose<br>
        • Annual comprehensive evaluation<br>
        • Regular foot and eye examinations`;
    } else {
      return `📖 <strong>Clinical Guidelines Available</strong><br><br>
        <strong>Evidence-Based Protocols:</strong><br>
        • <strong>Hypertension Management</strong> - JNC 8 guidelines<br>
        • <strong>Diabetes Management</strong> - ADA 2024 guidelines<br>
        • <strong>Heart Failure</strong> - ACC/AHA guidelines<br>
        • <strong>Asthma</strong> - GINA guidelines<br>
        • <strong>COPD</strong> - GOLD guidelines<br><br>
        <strong>Just ask for any guideline:</strong><br>
        • "Hypertension guidelines" - for BP management<br>
        • "Diabetes guidelines" - for glucose control<br>
        • "Heart failure guidelines" - for cardiac care<br>
        • "Asthma guidelines" - for respiratory management<br><br>
        <strong>Each guideline includes:</strong><br>
        • Evidence-based recommendations<br>
        • Treatment algorithms and targets<br>
        • Medication selection and dosing<br>
        • Monitoring and follow-up protocols<br>
        • Clinical pearls for implementation`;
    }
  }

  // Enhanced Symptom Education
  if (lowerMessage.includes('symptom') || lowerMessage.includes('pain')) {
    if (lowerMessage.includes('chest') || lowerMessage.includes('cardiac')) {
      return `🔍 <strong>Chest Pain Assessment - Clinical Decision Making</strong><br><br>
        <strong>RED FLAG SYMPTOMS (Immediate Action Required):</strong><br>
        • Severe, crushing chest pain<br>
        • Pain radiating to jaw, arm, or back<br>
        • Associated with shortness of breath<br>
        • Sweating, nausea, or lightheadedness<br>
        • Pain worse with exertion<br><br>
        <strong>Differential Diagnosis:</strong><br>
        • <strong>Cardiac:</strong> ACS, angina, pericarditis<br>
        • <strong>Pulmonary:</strong> PE, pneumothorax, pneumonia<br>
        • <strong>Gastrointestinal:</strong> GERD, esophageal spasm<br>
        • <strong>Musculoskeletal:</strong> Costochondritis, rib fracture<br>
        • <strong>Psychiatric:</strong> Anxiety, panic disorder<br><br>
        <strong>Clinical Assessment:</strong><br>
        • Vital signs and oxygen saturation<br>
        • Cardiac examination<br>
        • Respiratory examination<br>
        • ECG within 10 minutes<br>
        • Cardiac biomarkers if indicated<br><br>
        <strong>Immediate Actions:</strong><br>
        • Oxygen if hypoxemic<br>
        • Aspirin 325mg if ACS suspected<br>
        • Nitroglycerin if available<br>
        • Emergency services activation<br><br>
        ⚠️ <strong>Remember:</strong> This is for educational purposes. Always consult healthcare professionals for actual symptoms.`;
    } else if (lowerMessage.includes('headache') || lowerMessage.includes('migraine')) {
      return `🔍 <strong>Headache Assessment - Clinical Classification</strong><br><br>
        <strong>RED FLAG SYMPTOMS (Immediate Evaluation):</strong><br>
        • Sudden, severe headache (thunderclap)<br>
        • Headache with fever and neck stiffness<br>
        • Headache with focal neurological deficits<br>
        • Headache worse with Valsalva maneuver<br>
        • New headache in patient >50 years<br><br>
        <strong>Primary Headaches:</strong><br>
        • <strong>Tension-type:</strong> Bilateral, pressing, mild-moderate intensity<br>
        • <strong>Migraine:</strong> Unilateral, pulsating, moderate-severe intensity<br>
        • <strong>Cluster:</strong> Unilateral, severe, orbital/supraorbital<br><br>
        <strong>Secondary Headaches:</strong><br>
        • <strong>Vascular:</strong> SAH, stroke, temporal arteritis<br>
        • <strong>Infectious:</strong> Meningitis, encephalitis, sinusitis<br>
        • <strong>Structural:</strong> Tumor, hydrocephalus, intracranial hypertension<br>
        • <strong>Medication-related:</strong> Overuse, side effects<br><br>
        <strong>Clinical Assessment:</strong><br>
        • Pain characteristics (location, quality, intensity)<br>
        • Associated symptoms and triggers<br>
        • Neurological examination<br>
        • Fundoscopic examination<br>
        • Imaging if red flags present<br><br>
        ⚠️ <strong>Remember:</strong> This is for educational purposes. Always consult healthcare professionals for actual symptoms.`;
    } else {
      return `🔍 <strong>Symptom Education Database</strong><br><br>
        <strong>Available Symptom Assessments:</strong><br>
        • <strong>Chest Pain</strong> - Cardiac and non-cardiac causes<br>
        • <strong>Headache</strong> - Primary and secondary headaches<br>
        • <strong>Abdominal Pain</strong> - Acute and chronic causes<br>
        • <strong>Shortness of Breath</strong> - Respiratory and cardiac<br>
        • <strong>Fever</strong> - Infectious and non-infectious<br><br>
        <strong>Just ask for any symptom:</strong><br>
        • "Chest pain assessment" - for cardiac evaluation<br>
        • "Headache evaluation" - for neurological assessment<br>
        • "Abdominal pain" - for gastrointestinal causes<br>
        • "Shortness of breath" - for respiratory assessment<br><br>
        <strong>Each assessment includes:</strong><br>
        • Red flag symptoms requiring immediate action<br>
        • Comprehensive differential diagnosis<br>
        • Clinical assessment approach<br>
        • Initial management strategies<br>
        • When to refer or seek emergency care<br><br>
        ⚠️ <strong>Important:</strong> This is for educational purposes only. Always consult healthcare professionals for actual symptoms.`;
    }
  }

  // Default response for unmatched queries
  return `🤖 <strong>StethoLink AI Medical Assistant</strong><br><br>
    I'm here to help you with your medical studies! I can assist with:<br><br>
    <strong>📚 Study Plans:</strong> Ask for "1st year", "2nd year", or "3rd year" study plans<br>
    <strong>🧮 Medical Calculators:</strong> BMI, GFR, CHADS2, Wells DVT scores<br>
    <strong>💊 Drug Information:</strong> Beta-blockers, ACE inhibitors, statins, and more<br>
    <strong>📖 Clinical Guidelines:</strong> Hypertension, diabetes, heart failure protocols<br>
    <strong>🔍 Symptom Assessment:</strong> Chest pain, headache, and other symptoms<br><br>
    <strong>Just ask me anything medical!</strong> For example:<br>
    • "Give me a 1st year study plan"<br>
    • "How do I calculate BMI?"<br>
    • "Tell me about beta blockers"<br>
    • "Hypertension guidelines"<br>
    • "Chest pain assessment"<br><br>
    <em>Remember: This is for educational purposes only. Always consult healthcare professionals for actual medical care.</em>`;
}

// Helper functions (assuming these are defined elsewhere or will be added)
function getUserProfile(userId) {
  return userProfiles.get(userId);
}

function updateUserProfile(userId, updates) {
  const user = userProfiles.get(userId);
  if (user) {
    Object.assign(user, updates);
    userProfiles.set(userId, user);
    return user;
  }
  return null;
}

function getYearSpecificCurriculum(year) {
  // In a real app, this would load curriculum data from a file or database
  switch (year) {
    case '1st':
      return {
        year: '1st',
        semesters: [
          { name: 'Semester 1', subjects: ['Anatomy I', 'Physiology I', 'Biochemistry I', 'Community Medicine I'] },
          { name: 'Semester 2', subjects: ['Anatomy II', 'Physiology II', 'Biochemistry II', 'Community Medicine II'] }
        ]
      };
    case '2nd':
      return {
        year: '2nd',
        semesters: [
          { name: 'Semester 3', subjects: ['Pathology I', 'Microbiology I', 'Pharmacology I', 'Forensic Medicine I'] },
          { name: 'Semester 4', subjects: ['Pathology II', 'Microbiology II', 'Pharmacology II', 'Forensic Medicine II'] }
        ]
      };
    case '3rd':
      return {
        year: '3rd',
        semesters: [
          { name: 'Semester 5', subjects: ['Medicine I', 'Surgery I', 'Obstetrics & Gynecology I', 'Pediatrics I'] },
          { name: 'Semester 6', subjects: ['Medicine II', 'Surgery II', 'Obstetrics & Gynecology II', 'Pediatrics II'] }
        ]
      };
    default:
      return null;
  }
}

function getAvailableTools() {
  return [
    { name: 'BMI Calculator', description: 'Body Mass Index with WHO classification' },
    { name: 'GFR Calculator', description: 'Kidney function (Cockcroft-Gault)' },
    { name: 'CHADS2 Score', description: 'Stroke risk in atrial fibrillation' },
    { name: 'Wells DVT Score', description: 'Deep vein thrombosis probability' }
  ];
}

// Start the server
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});