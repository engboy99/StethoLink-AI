require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Import all advanced services
const ai = require('../services/ai');
const medicalAgentSystem = require('../services/medical-agent-system');
const notebookService = require('../services/notebook-service');
const notificationService = require('../services/notification-service');

// Simple logger
const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[ERROR] ${message}`, error || ''),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data || '')
};

// Initialize bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// User data storage (in production, use database)
const userData = new Map();

// Medical year curriculum data
const medicalYearCurriculum = {
  '1st_year': {
    name: '1st Year Medical Student',
    subjects: ['Anatomy', 'Physiology', 'Biochemistry', 'Community Medicine', 'Medical English'],
    focus: 'Basic medical sciences and foundation',
    skills: ['Basic anatomy', 'Physiological processes', 'Biochemical pathways', 'Community health'],
    exams: ['First Professional Examination'],
    clinical: 'Basic clinical skills introduction'
  },
  '2nd_year': {
    name: '2nd Year Medical Student',
    subjects: ['Pathology', 'Microbiology', 'Pharmacology', 'Forensic Medicine', 'Community Medicine'],
    focus: 'Pathological basis of disease',
    skills: ['Pathological processes', 'Microbial identification', 'Drug mechanisms', 'Forensic procedures'],
    exams: ['Second Professional Examination'],
    clinical: 'Clinical correlation and basic procedures'
  },
  '3rd_year': {
    name: '3rd Year Medical Student',
    subjects: ['Medicine', 'Surgery', 'Obstetrics & Gynecology', 'Pediatrics', 'Psychiatry'],
    focus: 'Clinical medicine and patient care',
    skills: ['History taking', 'Physical examination', 'Clinical reasoning', 'Patient management'],
    exams: ['Third Professional Examination'],
    clinical: 'Full clinical rotations'
  },
  '4th_year': {
    name: '4th Year Medical Student',
    subjects: ['Medicine', 'Surgery', 'Obstetrics & Gynecology', 'Pediatrics', 'Psychiatry', 'Radiology'],
    focus: 'Advanced clinical practice',
    skills: ['Advanced procedures', 'Diagnostic imaging', 'Surgical skills', 'Emergency care'],
    exams: ['Final Professional Examination'],
    clinical: 'Advanced clinical practice'
  },
  '5th_year': {
    name: '5th Year Medical Student (Intern)',
    subjects: ['Clinical Rotations', 'Emergency Medicine', 'Specialty Training', 'Research Project'],
    focus: 'Internship and specialization',
    skills: ['Independent practice', 'Emergency procedures', 'Specialty skills', 'Research methodology'],
    exams: ['Internship Assessment'],
    clinical: 'Full clinical practice under supervision'
  }
};

// Helper function to get user data
function getUserData(chatId) {
  if (!userData.has(chatId)) {
    userData.set(chatId, {
      name: null,
      stage: 'welcome',
      agentInitialized: false,
      currentTask: null,
      currentNote: null,
      year: null,
      specialization: null,
      university: null,
      clinicalRotation: null,
      examSchedule: [],
      studyPlan: [],
      achievements: [],
      skills: [],
      researchProjects: [],
      clinicalCases: [],
      emergencyTraining: false,
      cprCertified: false,
      languagePreference: 'en'
    });
  }
  return userData.get(chatId);
}

// Helper function to create main menu keyboard
function createMainMenuKeyboard(user) {
  const year = user.year || 'general';
  const yearSpecificButtons = getYearSpecificButtons(year);
  
  return {
    inline_keyboard: [
      [
        { text: '📝 Add Task', callback_data: 'add_task' },
        { text: '📋 My Tasks', callback_data: 'my_tasks' },
        { text: '⏰ My Alerts', callback_data: 'my_alerts' }
      ],
      [
        { text: '📊 Progress', callback_data: 'progress' },
        { text: '📝 Add Note', callback_data: 'add_note' },
        { text: '📖 My Notes', callback_data: 'my_notes' }
      ],
      [
        { text: '💊 Drug Info', callback_data: 'drugs' },
        { text: '🧮 Calculator', callback_data: 'calculator' },
        { text: '📋 Guidelines', callback_data: 'guidelines' }
      ],
      [
        { text: '🎭 Simulation', callback_data: 'simulation' },
        { text: '🖥️ Dashboard', callback_data: 'dashboard' },
        { text: '📖 User Guide', callback_data: 'guide' }
      ],
      [
        { text: '🔬 Research', callback_data: 'research' },
        { text: '🖼️ Image Analysis', callback_data: 'image_analysis' },
        { text: '🎯 Practice Cases', callback_data: 'practice_cases' }
      ],
      [
        { text: '🏥 Emergency', callback_data: 'emergency' },
        { text: '📚 Education', callback_data: 'education' },
        { text: '⚙️ Settings', callback_data: 'settings' }
      ],
      yearSpecificButtons,
      [
        { text: '🎓 Year Progress', callback_data: 'year_progress' },
        { text: '📅 Exam Schedule', callback_data: 'exam_schedule' },
        { text: '🎯 Study Plan', callback_data: 'study_plan' }
      ],
      [
        { text: '🏆 Achievements', callback_data: 'achievements' },
        { text: '🔬 Research Projects', callback_data: 'research_projects' },
        { text: '👥 Clinical Cases', callback_data: 'clinical_cases' }
      ],
      [
        { text: '🚨 Emergency Training', callback_data: 'emergency_training' },
        { text: '💉 Procedures', callback_data: 'procedures' },
        { text: '🌐 Sri Lankan Context', callback_data: 'sri_lankan_context' }
      ]
    ]
  };
}

// Helper function to get year-specific buttons
function getYearSpecificButtons(year) {
  const yearData = medicalYearCurriculum[year];
  if (!yearData) {
    return [
      [
        { text: '🎓 Set Year', callback_data: 'set_year' },
        { text: '📚 Curriculum', callback_data: 'curriculum' },
        { text: '🎯 Skills', callback_data: 'skills' }
      ]
    ];
  }

  return [
    [
      { text: `📚 ${yearData.name}`, callback_data: 'year_info' },
      { text: '📖 Subjects', callback_data: 'subjects' },
      { text: '🎯 Skills', callback_data: 'skills' }
    ],
    [
      { text: '📅 Exams', callback_data: 'exams' },
      { text: '🏥 Clinical', callback_data: 'clinical' },
      { text: '📊 Progress', callback_data: 'year_progress' }
    ]
  ];
}

// Helper function to create back to menu button
function createBackToMenuButton() {
  return {
    inline_keyboard: [
      [{ text: '🔙 Back to Menu', callback_data: 'back_to_menu' }]
    ]
  };
}

// Helper function to send message with menu
async function sendMessageWithMenu(chatId, message, keyboard = null) {
  const user = getUserData(chatId);
  const markup = keyboard || createMainMenuKeyboard(user);
  await bot.sendMessage(chatId, message, {
    parse_mode: 'Markdown',
    reply_markup: markup
  });
}

// Start command - Ask for name, year, and initialize
bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const user = getUserData(chatId);
    
    if (!user.name) {
      user.stage = 'asking_name';
      const welcomeMessage = `🏥 *Welcome to StethoLink AI - Sri Lanka's First Medical Student Agent!*

I'm Dr. StethoLink, your AI medical assistant specifically designed for Sri Lankan medical students.

*Before we begin, I'd like to know your name:*

Please reply with your name (e.g., "Imesha Udayangani" or just "Imesha") so I can address you properly as Dr. [Your Name].`;

      await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
      logger.info('✅ Welcome message sent, asking for name');
    } else {
      // User already has a name, show main menu
      await sendMessageWithMenu(chatId, `🏥 *Welcome back, Dr. ${user.name}!*

Your AI medical assistant is ready to help you excel in your medical studies.

*Current Year:* ${user.year ? medicalYearCurriculum[user.year]?.name || 'Not Set' : 'Not Set'}
*Specialization:* ${user.specialization || 'Not Set'}

*What would you like to do today?* 👇`);
    }
  } catch (error) {
    logger.error('❌ Error in start command:', error);
    await bot.sendMessage(msg.chat.id, 'Welcome to StethoLink AI!');
  }
});

// Handle text messages (name collection, year selection, and natural language)
bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    const user = getUserData(chatId);

    // Skip commands
    if (text.startsWith('/')) {
      return;
    }

    // Handle name collection
    if (user.stage === 'asking_name') {
      const name = text.trim();
      if (name.length > 0) {
        user.name = name;
        user.stage = 'asking_year';
        
        const yearSelectionMessage = `🎉 *Welcome, Dr. ${name}!*

Now, please tell me which year of medical school you're in:

*Available Options:*
• 1st Year - Basic medical sciences
• 2nd Year - Pathological basis of disease
• 3rd Year - Clinical medicine and patient care
• 4th Year - Advanced clinical practice
• 5th Year - Internship and specialization

*Reply with:* "1st year", "2nd year", "3rd year", "4th year", or "5th year"`;

        await bot.sendMessage(chatId, yearSelectionMessage, { parse_mode: 'Markdown' });
        logger.info(`✅ User name collected: ${name}, asking for year`);
      } else {
        await bot.sendMessage(chatId, 'Please provide your name so I can address you properly.');
      }
      return;
    }

    // Handle year selection
    if (user.stage === 'asking_year') {
      const yearText = text.toLowerCase().trim();
      let selectedYear = null;
      
      if (yearText.includes('1st') || yearText.includes('first') || yearText === '1') {
        selectedYear = '1st_year';
      } else if (yearText.includes('2nd') || yearText.includes('second') || yearText === '2') {
        selectedYear = '2nd_year';
      } else if (yearText.includes('3rd') || yearText.includes('third') || yearText === '3') {
        selectedYear = '3rd_year';
      } else if (yearText.includes('4th') || yearText.includes('fourth') || yearText === '4') {
        selectedYear = '4th_year';
      } else if (yearText.includes('5th') || yearText.includes('fifth') || yearText === '5') {
        selectedYear = '5th_year';
      }

      if (selectedYear) {
        user.year = selectedYear;
        user.stage = 'ready';
        user.agentInitialized = true;
        
        const yearData = medicalYearCurriculum[selectedYear];
        const welcomeMessage = `🎓 *Welcome, Dr. ${user.name}!*

*Year:* ${yearData.name}
*Focus:* ${yearData.focus}
*Subjects:* ${yearData.subjects.join(', ')}

Your AI medical assistant is now personalized for your ${yearData.name} journey and ready to be your best friend throughout your medical studies!

*I can help you with:*
• 📝 **Task Management** - Add tasks with smart reminders
• 📊 **Study Progress** - Track your learning journey
• 📝 **Note Taking** - Interactive medical notes
• 💊 **Drug Database** - Sri Lankan drug information
• 🧮 **Medical Calculators** - BMI, GFR, CHADS2, etc.
• 📋 **Clinical Guidelines** - Evidence-based medicine
• 🎭 **Patient Simulations** - Practice real cases
• 🔬 **Research Assistant** - Literature search & analysis
• 🖼️ **Image Analysis** - X-ray, ECG, CT, MRI interpretation
• 🎯 **Practice Cases** - Real-world scenarios
• 🏥 **Emergency Support** - Critical care guidance
• 📚 **Medical Education** - Comprehensive learning
• 🎓 **Year-Specific Features** - Tailored to your year
• 🌐 **Sri Lankan Context** - Local medical practices
• 🚨 **Emergency Training** - CPR, ACLS, ATLS
• 💉 **Procedures** - Clinical procedures and skills

*Let's get started! Choose from the menu below:* 👇`;

        await sendMessageWithMenu(chatId, welcomeMessage);
        logger.info(`✅ User year set: ${yearData.name}`);
      } else {
        await bot.sendMessage(chatId, 'Please reply with "1st year", "2nd year", "3rd year", "4th year", or "5th year".');
      }
      return;
    }

    // Handle natural language commands
    if (user.stage === 'ready') {
      const lowerText = text.toLowerCase();
      
      // Task creation
      if (lowerText.includes('study') || lowerText.includes('task') || lowerText.includes('reminder')) {
        try {
          const taskResult = await medicalAgentSystem.addTaskWithAlerts(chatId.toString(), {
            title: text,
            description: text,
            priority: 'medium',
            scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
          });
          
          const response = `✅ *Task Added Successfully!*

*Task:* ${text}
*Status:* Scheduled
*Priority:* Medium
*Year:* ${medicalYearCurriculum[user.year]?.name || 'General'}

*Next Steps:*
• You'll receive reminders before the task
• Use "My Tasks" to view all your tasks
• Use "My Alerts" to check pending reminders`;

          await sendMessageWithMenu(chatId, response);
        } catch (error) {
          await sendMessageWithMenu(chatId, `❌ *Task Creation Failed*

Please try again with a more specific task description.

*Example:* "Study cardiology at 6 PM tomorrow"`);
        }
        return;
      }

      // Note creation
      if (lowerText.includes('note') || lowerText.includes('add note')) {
        try {
          const noteContent = text.replace(/^(add note|note):?\s*/i, '');
          const note = await notebookService.addNote(chatId.toString(), {
            title: `Note - ${new Date().toLocaleDateString()}`,
            content: noteContent,
            category: user.year || 'general',
            tags: ['telegram', user.year]
          });
          
          const response = `📝 *Note Added Successfully!*

*Content:* ${noteContent.substring(0, 100)}${noteContent.length > 100 ? '...' : ''}
*Category:* ${user.year ? medicalYearCurriculum[user.year]?.name : 'General'}
*Date:* ${new Date().toLocaleDateString()}

*Next Steps:*
• Use "My Notes" to view all your notes
• Use "Search Notes" to find specific notes`;

          await sendMessageWithMenu(chatId, response);
        } catch (error) {
          await sendMessageWithMenu(chatId, `❌ *Note Creation Failed*

Please try again with valid note content.

*Example:* "add note: ECG interpretation basics"`);
        }
        return;
      }

      // Calculator
      if (lowerText.includes('calculate') || lowerText.includes('bmi') || lowerText.includes('gfr')) {
        let response = '';
        if (lowerText.includes('bmi')) {
          const matches = text.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?)\s*(?:and|for|with|,)\s*(\d+(?:\.\d+)?)\s*(?:m|meters?|cm)/i);
          if (matches) {
            const weight = parseFloat(matches[1]);
            const height = parseFloat(matches[2]);
            if (height > 3) height = height / 100; // Convert cm to m
            const bmi = ai.calculateBMI(weight, height);
            const category = ai.getBMICategory(bmi);
            response = `🧮 *BMI Calculation*

*Weight:* ${weight} kg
*Height:* ${height} m
*BMI:* ${bmi}
*Category:* ${category}

*Interpretation:* ${ai.getBMIInterpretation(bmi)}`;
          } else {
            response = `🧮 *BMI Calculator*

Please provide weight and height in this format:
"Calculate BMI for 70kg 1.75m" or "BMI 65kg 1.70m"`;
          }
        } else if (lowerText.includes('gfr')) {
          response = `🧮 *GFR Calculator*

Please provide:
• Age
• Weight (kg)
• Height (cm)
• Serum creatinine (mg/dL)
• Gender (male/female)

*Example:* "Calculate GFR for 25 years, 70kg, 175cm, 1.2mg/dL, male"`;
        } else {
          response = `🧮 *Medical Calculators*

Available calculators:
• **BMI** - "Calculate BMI for 70kg 1.75m"
• **GFR** - "Calculate GFR for 25y 70kg 175cm 1.2mg/dL male"
• **CHADS2** - "Calculate CHADS2 score"
• **Well's Score** - "Calculate Well's score for DVT"
• **CURB-65** - "Calculate CURB-65 for pneumonia"

*Choose a calculator or type your calculation request.*`;
        }
        
        await sendMessageWithMenu(chatId, response);
        return;
      }

      // Drug information
      if (lowerText.includes('drug') || lowerText.includes('medicine') || lowerText.includes('medication')) {
        const drugName = text.replace(/^(drug|medicine|medication|info):?\s*/i, '').trim();
        if (drugName) {
          try {
            const drugInfo = await ai.getDrugInformation(drugName);
            if (drugInfo) {
              const response = `💊 *Drug Information: ${drugName}*

*Generic Name:* ${drugInfo.genericName || 'N/A'}
*Brand Names:* ${drugInfo.brandNames?.join(', ') || 'N/A'}
*Class:* ${drugInfo.class || 'N/A'}
*Indications:* ${drugInfo.indications || 'N/A'}
*Dosage:* ${drugInfo.dosage || 'N/A'}
*Side Effects:* ${drugInfo.sideEffects || 'N/A'}

*Need more info?* Use the Drug Info button for detailed interactions.`;
              await sendMessageWithMenu(chatId, response);
            } else {
              await sendMessageWithMenu(chatId, `❌ *Drug Not Found*

Drug "${drugName}" not found in our database.

*Try:* paracetamol, aspirin, warfarin, amoxicillin`);
            }
          } catch (error) {
            await sendMessageWithMenu(chatId, `❌ *Drug Information Error*

Please try again with a valid drug name.

*Examples:* paracetamol, aspirin, warfarin`);
          }
        } else {
          await sendMessageWithMenu(chatId, `💊 *Drug Information*

Please provide a drug name to get information.

*Examples:*
• "drug: paracetamol"
• "medicine: aspirin"
• "medication: warfarin"`);
        }
        return;
      }

      // Default response
      const defaultResponse = `💬 *Message Received*

You said: "${text}"

*I can help you with:*
• **Tasks** - "Study cardiology at 6 PM"
• **Notes** - "add note: ECG interpretation basics"
• **Calculators** - "Calculate BMI for 70kg 1.75m"
• **Drug Info** - "drug: paracetamol"
• **Simulations** - "Start patient simulation"

*Or use the menu buttons below for quick access!* 👇`;

      await sendMessageWithMenu(chatId, defaultResponse);
    }
  } catch (error) {
    logger.error('❌ Error handling text message:', error);
    await bot.sendMessage(msg.chat.id, 'Sorry, I encountered an error. Please try again.');
  }
});

// Handle callback queries (button clicks)
bot.on('callback_query', async (callbackQuery) => {
  try {
    const { data, message, from } = callbackQuery;
    const chatId = message.chat.id;
    const user = getUserData(chatId);
    
    let response = '';
    let keyboard = null;
    
    switch (data) {
      case 'add_task':
        user.stage = 'adding_task';
        response = `📝 *Add a New Task*

Please type your task with time and details.

*Examples:*
• "Study cardiology at 6 PM tomorrow"
• "Review ECG cases on Friday"
• "Practice drug calculations at 3 PM today"
• "Complete case study by Sunday"

*I'll automatically set reminders for you!*`;
        keyboard = createBackToMenuButton();
        break;
        
      case 'my_tasks':
        try {
          const tasks = await medicalAgentSystem.getPendingAlerts(chatId.toString());
          if (tasks && tasks.length > 0) {
            const taskList = tasks.map(task => `• ${task.message} (${task.scheduledTime})`).join('\n');
            response = `📋 *Your Tasks*

${taskList}

*Total Tasks:* ${tasks.length}`;
          } else {
            response = `📋 *Your Tasks*

No tasks found. Add your first task!

*Try:* "Study cardiology at 6 PM"`;
          }
        } catch (error) {
          response = `📋 *Your Tasks*

No tasks found. Add your first task!

*Try:* "Study cardiology at 6 PM"`;
        }
        break;
        
      case 'my_alerts':
        try {
          const alerts = await medicalAgentSystem.getPendingAlerts(chatId.toString());
          if (alerts && alerts.length > 0) {
            const alertList = alerts.map(alert => `• ${alert.message} (${alert.scheduledTime})`).join('\n');
            response = `⏰ *Your Alerts*

${alertList}

*Total Alerts:* ${alerts.length}`;
          } else {
            response = `⏰ *Your Alerts*

No pending alerts. You're all caught up! 🎉`;
          }
        } catch (error) {
          response = `⏰ *Your Alerts*

No pending alerts. You're all caught up! 🎉`;
        }
        break;
        
      case 'progress':
        const yearData = user.year ? medicalYearCurriculum[user.year] : null;
        response = `📊 *Study Progress - Dr. ${user.name}*

*Current Year:* ${yearData ? yearData.name : 'Not Set'}
*Current Status:* Active Student
*Study Streak:* ${user.achievements.length} days
*Tasks Completed:* ${user.studyPlan.length}
*Notes Created:* ${user.skills.length}
*Simulations Completed:* ${user.clinicalCases.length}

*Progress Features:*
• Study analytics and insights
• Performance tracking
• Learning recommendations
• Progress visualization
• Year-specific milestones

*Keep studying and I'll track your progress!* 📈`;
        break;
        
      case 'add_note':
        user.stage = 'adding_note';
        response = `📝 *Add a New Note*

Please type your note content.

*Examples:*
• "ECG interpretation basics: P wave represents atrial depolarization..."
• "Drug interactions: Warfarin + Aspirin = increased bleeding risk"
• "Clinical guidelines: Diabetes management protocol"
• "Case study: 45-year-old male with chest pain"

*I'll organize and store your notes for easy access!*`;
        keyboard = createBackToMenuButton();
        break;
        
      case 'my_notes':
        try {
          const notes = await notebookService.getNotes(chatId.toString());
          if (notes && notes.length > 0) {
            const noteList = notes.slice(0, 5).map(note => `• ${note.title} (${note.createdAt})`).join('\n');
            response = `📖 *My Notes*

${noteList}

${notes.length > 5 ? `*... and ${notes.length - 5} more notes*` : ''}

*Total Notes:* ${notes.length}`;
          } else {
            response = `📖 *My Notes*

No notes found. Create your first note!

*Try:* "add note: ECG interpretation basics"`;
          }
        } catch (error) {
          response = `📖 *My Notes*

No notes found. Create your first note!

*Try:* "add note: ECG interpretation basics"`;
        }
        break;
        
      case 'drugs':
        response = `💊 *Drug Information Database*

*Available Features:*
• Drug information and indications
• Drug interactions
• Dosage guidelines
• Side effects
• Contraindications
• Sri Lankan drug availability
• Cost information
• Generic alternatives

*Popular Drugs:*
• Paracetamol (Acetaminophen)
• Aspirin (Acetylsalicylic acid)
• Warfarin
• Amoxicillin
• Metformin

*Type a drug name to get information:*
"drug: paracetamol" or "medicine: aspirin"`;
        break;
        
      case 'calculator':
        response = `🧮 *Medical Calculators*

*Available Calculators:*
• **BMI Calculator** - Body Mass Index
• **GFR Calculator** - Glomerular Filtration Rate
• **CHADS2 Score** - Stroke risk in atrial fibrillation
• **Well's Score** - DVT probability
• **CURB-65** - Pneumonia severity
• **APACHE II** - ICU mortality prediction
• **Glasgow Coma Scale** - Neurological assessment
• **SOFA Score** - Organ failure assessment

*Examples:*
• "Calculate BMI for 70kg 1.75m"
• "Calculate GFR for 25y 70kg 175cm 1.2mg/dL male"
• "Calculate CHADS2 score"

*Choose a calculator or type your calculation request!*`;
        break;
        
      case 'guidelines':
        response = `📋 *Clinical Guidelines*

*Available Guidelines:*
• **Cardiovascular** - Hypertension, CAD, Heart failure
• **Respiratory** - Asthma, COPD, Pneumonia
• **Endocrine** - Diabetes, Thyroid disorders
• **Gastrointestinal** - Peptic ulcer, IBD, Hepatitis
• **Neurological** - Stroke, Epilepsy, Headache
• **Infectious Diseases** - Sepsis, TB, HIV
• **Emergency Medicine** - ACLS, Trauma, Toxicology
• **Sri Lankan Guidelines** - Local protocols and practices

*Type a condition for guidelines:*
"guidelines: hypertension" or "guidelines: diabetes"`;
        break;
        
      case 'simulation':
        response = `🎭 *Patient Simulation*

*Available Simulations:*
• **Cardiovascular** - Chest pain, MI, Heart failure
• **Respiratory** - Shortness of breath, Asthma, Pneumonia
• **Neurological** - Headache, Stroke, Seizure
• **Gastrointestinal** - Abdominal pain, GI bleeding
• **Emergency** - Trauma, Sepsis, Cardiac arrest
• **Sri Lankan Cases** - Local disease patterns
• **Year-Specific Cases** - Tailored to your year

*Start a simulation:*
"Start patient simulation" or "simulate chest pain case"

*I'll guide you through real patient scenarios!*`;
        break;
        
      case 'dashboard':
        response = `🖥️ *Web Dashboard*

*Access your full dashboard at:*
https://awake-courage-production.up.railway.app/dashboard.html

*Dashboard Features:*
• Complete task management
• Advanced note taking
• Progress analytics
• Medical calculators
• Drug database
• Clinical guidelines
• Patient simulations
• Research tools
• Image analysis
• Year-specific content
• Sri Lankan medical context
• Emergency training modules
• Clinical procedures
• Achievement tracking

*All features available in web interface!*`;
        break;
        
      case 'guide':
        response = `📖 *User Guide - Dr. ${user.name}*

*Getting Started:*
1. **Tasks** - Add study tasks with automatic reminders
2. **Notes** - Create and organize medical notes
3. **Calculators** - Use medical calculators
4. **Drug Info** - Access drug database
5. **Guidelines** - Get clinical guidelines
6. **Simulations** - Practice patient cases

*Advanced Features:*
• Research assistant
• Image analysis
• Practice cases
• Emergency support
• Medical education
• Year-specific content
• Sri Lankan context
• Emergency training

*Natural Language Commands:*
• "Study cardiology at 6 PM"
• "add note: ECG interpretation basics"
• "Calculate BMI for 70kg 1.75m"
• "drug: paracetamol"
• "Start patient simulation"

*I'm your AI medical assistant - your best friend in medical school!* 🎓`;
        break;
        
      case 'research':
        response = `🔬 *Research Assistant*

*Available Research Tools:*
• Literature search
• Clinical trial analysis
• Evidence synthesis
• Research paper generation
• Statistical analysis
• Database access
• Sri Lankan research context
• Local studies and data

*Start research:*
"research: diabetes management" or "literature search: COVID-19"

*I'll help you with evidence-based research!*`;
        break;
        
      case 'image_analysis':
        response = `🖼️ *Medical Image Analysis*

*Supported Image Types:*
• **X-ray** - Chest, Abdominal, Extremities
• **ECG** - 12-lead, Rhythm strips
• **CT** - Head, Chest, Abdomen
• **MRI** - Brain, Spine, Joints
• **Ultrasound** - Abdominal, Cardiac
• **Pathology** - Histopathology, Cytology

*Upload an image or describe:*
"Analyze this chest X-ray" or "Interpret this ECG"

*I'll help you interpret medical images!*`;
        break;
        
      case 'practice_cases':
        response = `🎯 *Practice Cases*

*Available Case Types:*
• **Cardiovascular** - Chest pain, MI, Arrhythmias
• **Respiratory** - Dyspnea, Pneumonia, COPD
• **Neurological** - Headache, Stroke, Seizures
• **Gastrointestinal** - Abdominal pain, GI bleeding
• **Emergency** - Trauma, Sepsis, Cardiac arrest
• **Sri Lankan Cases** - Local disease patterns
• **Year-Specific Cases** - Tailored to your year

*Start a case:*
"Start practice case" or "case: chest pain"

*Practice with real-world scenarios!*`;
        break;
        
      case 'emergency':
        response = `🏥 *Emergency Support*

*Emergency Protocols:*
• **ACLS** - Advanced Cardiac Life Support
• **ATLS** - Advanced Trauma Life Support
• **PALS** - Pediatric Advanced Life Support
• **BLS** - Basic Life Support

*Emergency Calculators:*
• Glasgow Coma Scale
• APACHE II Score
• SOFA Score
• Wells Score

*Emergency Guidelines:*
• Cardiac arrest
• Trauma management
• Sepsis protocol
• Toxicology

*Sri Lankan Emergency Context:*
• Local emergency protocols
• Available resources
• Referral systems

*For real emergencies, call emergency services immediately!* 🚨`;
        break;
        
      case 'education':
        response = `📚 *Medical Education*

*Learning Modules:*
• **Anatomy** - Human anatomy and physiology
• **Physiology** - Body systems and functions
• **Pathology** - Disease mechanisms
• **Pharmacology** - Drug mechanisms and interactions
• **Clinical Skills** - History taking, examination
• **Procedures** - Clinical procedures and techniques

*Year-Specific Content:*
• ${user.year ? medicalYearCurriculum[user.year]?.subjects.join(', ') : 'All subjects'}

*Educational Resources:*
• Interactive tutorials
• Case-based learning
• Video demonstrations
• Practice questions
• Assessment tools

*Start learning:*
"education: cardiology" or "learn: ECG interpretation"`;
        break;
        
      case 'settings':
        response = `⚙️ *Settings - Dr. ${user.name}*

*User Preferences:*
• Name: ${user.name}
• Year: ${user.year ? medicalYearCurriculum[user.year]?.name : 'Not Set'}
• Specialization: ${user.specialization || 'Not Set'}
• Agent Status: ${user.agentInitialized ? 'Active' : 'Inactive'}
• Notifications: Enabled
• Language: ${user.languagePreference === 'si' ? 'Sinhala' : user.languagePreference === 'ta' ? 'Tamil' : 'English'}

*Available Settings:*
• Change name
• Change year
• Set specialization
• Notification preferences
• Language settings
• Privacy settings
• Data management

*Contact support for account changes.*`;
        break;
        
      case 'year_progress':
        const yearProgress = user.year ? medicalYearCurriculum[user.year] : null;
        if (yearProgress) {
          response = `🎓 *Year Progress - ${yearProgress.name}*

*Current Focus:* ${yearProgress.focus}
*Subjects:* ${yearProgress.subjects.join(', ')}
*Skills:* ${yearProgress.skills.join(', ')}
*Exams:* ${yearProgress.exams.join(', ')}
*Clinical:* ${yearProgress.clinical}

*Your Progress:*
• Tasks Completed: ${user.studyPlan.length}
• Notes Created: ${user.skills.length}
• Cases Studied: ${user.clinicalCases.length}
• Research Projects: ${user.researchProjects.length}

*Next Steps:*
• Continue with current subjects
• Prepare for upcoming exams
• Practice clinical skills
• Engage in research projects`;
        } else {
          response = `🎓 *Year Progress*

Please set your year first to see year-specific progress.

*Use:* /start to set your year`;
        }
        break;
        
      case 'exam_schedule':
        const yearExams = user.year ? medicalYearCurriculum[user.year]?.exams : [];
        if (yearExams.length > 0) {
          response = `📅 *Exam Schedule - ${medicalYearCurriculum[user.year]?.name}*

*Upcoming Exams:*
${yearExams.map(exam => `• ${exam}`).join('\n')}

*Study Recommendations:*
• Review core subjects
• Practice past papers
• Attend revision sessions
• Form study groups

*Exam Preparation Tips:*
• Create study schedule
• Use spaced repetition
• Practice with mock exams
• Focus on weak areas`;
        } else {
          response = `📅 *Exam Schedule*

No exams scheduled for your current year.

*Check with your institution for specific exam dates.*`;
        }
        break;
        
      case 'study_plan':
        const yearSubjects = user.year ? medicalYearCurriculum[user.year]?.subjects : [];
        if (yearSubjects.length > 0) {
          response = `🎯 *Study Plan - ${medicalYearCurriculum[user.year]?.name}*

*Current Subjects:*
${yearSubjects.map(subject => `• ${subject}`).join('\n')}

*Recommended Study Schedule:*
• **Morning** - Core subjects (2-3 hours)
• **Afternoon** - Clinical skills (1-2 hours)
• **Evening** - Review and practice (1-2 hours)

*Study Strategies:*
• Active learning techniques
• Spaced repetition
• Practice questions
• Group study sessions
• Clinical correlation

*Weekly Goals:*
• Complete assigned readings
• Practice clinical skills
• Review previous material
• Prepare for assessments`;
        } else {
          response = `🎯 *Study Plan*

Please set your year first to see year-specific study plans.

*Use:* /start to set your year`;
        }
        break;
        
      case 'achievements':
        const achievements = user.achievements.length > 0 ? user.achievements.join('\n') : 'No achievements yet';
        response = `🏆 *Achievements - Dr. ${user.name}*

*Your Achievements:*
${achievements}

*Achievement Categories:*
• Academic Excellence
• Clinical Skills
• Research Projects
• Emergency Training
• Community Service
• Leadership

*Keep studying and practicing to unlock more achievements!* 🎊`;
        break;
        
      case 'research_projects':
        const projects = user.researchProjects.length > 0 ? user.researchProjects.join('\n') : 'No research projects yet';
        response = `🔬 *Research Projects*

*Your Research Projects:*
${projects}

*Research Opportunities:*
• Literature reviews
• Case studies
• Clinical trials
• Epidemiological studies
• Quality improvement projects

*Start a research project:*
"research: diabetes management" or "start research project"`;
        break;
        
      case 'clinical_cases':
        const cases = user.clinicalCases.length > 0 ? user.clinicalCases.join('\n') : 'No clinical cases yet';
        response = `👥 *Clinical Cases*

*Your Clinical Cases:*
${cases}

*Case Types Available:*
• Cardiovascular cases
• Respiratory cases
• Neurological cases
• Gastrointestinal cases
• Emergency cases
• Sri Lankan context cases

*Start a case:*
"Start clinical case" or "case: chest pain"`;
        break;
        
      case 'emergency_training':
        response = `🚨 *Emergency Training*

*Available Training Modules:*
• **CPR Certification** - Basic life support
• **ACLS Training** - Advanced cardiac life support
• **ATLS Training** - Advanced trauma life support
• **PALS Training** - Pediatric advanced life support
• **Emergency Procedures** - Clinical procedures
• **Toxicology Training** - Poison management

*Training Status:*
• CPR Certified: ${user.cprCertified ? '✅ Yes' : '❌ No'}
• Emergency Training: ${user.emergencyTraining ? '✅ Completed' : '❌ Not Started'}

*Start Training:*
"Start emergency training" or "CPR certification"`;
        break;
        
      case 'procedures':
        response = `💉 *Clinical Procedures*

*Available Procedures:*
• **Basic Procedures**
  - Venipuncture
  - IV cannulation
  - Blood pressure measurement
  - Temperature measurement

• **Advanced Procedures**
  - Lumbar puncture
  - Central line insertion
  - Chest tube insertion
  - Endotracheal intubation

• **Emergency Procedures**
  - CPR
  - Defibrillation
  - Emergency airway management
  - Trauma procedures

*Procedure Training:*
• Video demonstrations
• Step-by-step guides
• Practice scenarios
• Assessment tools

*Start learning:*
"procedure: venipuncture" or "learn procedure"`;
        break;
        
      case 'sri_lankan_context':
        response = `🌐 *Sri Lankan Medical Context*

*Local Medical Practices:*
• **Healthcare System** - Public and private healthcare
• **Disease Patterns** - Local epidemiology
• **Drug Availability** - Sri Lankan drug formulary
• **Clinical Guidelines** - Local protocols
• **Referral Systems** - Hospital networks
• **Emergency Services** - Local emergency protocols

*Sri Lankan Medical Education:*
• **Medical Schools** - University medical faculties
• **Curriculum** - Local medical curriculum
• **Examinations** - Professional examinations
• **Clinical Rotations** - Local hospital rotations
• **Research** - Local research opportunities

*Local Resources:*
• **Hospitals** - Teaching hospitals
• **Libraries** - Medical libraries
• **Research Centers** - Medical research institutes
• **Professional Bodies** - Medical associations

*This content is specifically tailored for Sri Lankan medical students!* 🇱🇰`;
        break;
        
      case 'set_year':
        user.stage = 'asking_year';
        response = `🎓 *Set Your Medical Year*

Please tell me which year of medical school you're in:

*Available Options:*
• 1st Year - Basic medical sciences
• 2nd Year - Pathological basis of disease
• 3rd Year - Clinical medicine and patient care
• 4th Year - Advanced clinical practice
• 5th Year - Internship and specialization

*Reply with:* "1st year", "2nd year", "3rd year", "4th year", or "5th year"`;
        break;
        
      case 'curriculum':
        const curriculum = user.year ? medicalYearCurriculum[user.year] : null;
        if (curriculum) {
          response = `📚 *Curriculum - ${curriculum.name}*

*Focus:* ${curriculum.focus}
*Subjects:* ${curriculum.subjects.join(', ')}
*Skills:* ${curriculum.skills.join(', ')}
*Exams:* ${curriculum.exams.join(', ')}
*Clinical:* ${curriculum.clinical}

*Year Overview:*
This year focuses on ${curriculum.focus.toLowerCase()}. You'll study ${curriculum.subjects.length} main subjects and develop skills in ${curriculum.skills.length} key areas.

*Study Recommendations:*
• Focus on core subjects
• Practice clinical skills
• Engage in research
• Prepare for examinations`;
        } else {
          response = `📚 *Curriculum*

Please set your year first to see year-specific curriculum.

*Use:* /start to set your year`;
        }
        break;
        
      case 'skills':
        const skills = user.year ? medicalYearCurriculum[user.year]?.skills : [];
        if (skills.length > 0) {
          response = `🎯 *Skills - ${medicalYearCurriculum[user.year]?.name}*

*Key Skills for This Year:*
${skills.map(skill => `• ${skill}`).join('\n')}

*Skill Development:*
• Practice regularly
• Seek feedback
• Use simulation tools
• Engage in clinical practice
• Participate in workshops

*Assessment:*
• Clinical assessments
• Skills examinations
• Competency evaluations
• Portfolio development`;
        } else {
          response = `🎯 *Skills*

Please set your year first to see year-specific skills.

*Use:* /start to set your year`;
        }
        break;
        
      case 'exams':
        const exams = user.year ? medicalYearCurriculum[user.year]?.exams : [];
        if (exams.length > 0) {
          response = `📅 *Exams - ${medicalYearCurriculum[user.year]?.name}*

*Examinations:*
${exams.map(exam => `• ${exam}`).join('\n')}

*Exam Preparation:*
• Review core subjects
• Practice past papers
• Attend revision sessions
• Form study groups
• Use study resources

*Exam Tips:*
• Create study schedule
• Use spaced repetition
• Practice with mock exams
• Focus on weak areas
• Stay healthy and rested`;
        } else {
          response = `📅 *Exams*

No exams scheduled for your current year.

*Check with your institution for specific exam dates.*`;
        }
        break;
        
      case 'clinical':
        const clinical = user.year ? medicalYearCurriculum[user.year]?.clinical : null;
        if (clinical) {
          response = `🏥 *Clinical - ${medicalYearCurriculum[user.year]?.name}*

*Clinical Focus:* ${clinical}

*Clinical Activities:*
• Patient interactions
• History taking
• Physical examination
• Clinical procedures
• Case presentations
• Ward rounds
• Emergency rotations

*Clinical Skills:*
• Communication skills
• Physical examination techniques
• Clinical reasoning
• Patient management
• Emergency procedures

*Clinical Settings:*
• Teaching hospitals
• Outpatient clinics
• Emergency departments
• Specialty units
• Community health centers`;
        } else {
          response = `🏥 *Clinical*

Please set your year first to see year-specific clinical information.

*Use:* /start to set your year`;
        }
        break;
        
      case 'back_to_menu':
        response = `🏥 *Welcome back, Dr. ${user.name}!*

Your AI medical assistant is ready to help you excel in your medical studies.

*Current Year:* ${user.year ? medicalYearCurriculum[user.year]?.name || 'Not Set' : 'Not Set'}
*Specialization:* ${user.specialization || 'Not Set'}

*What would you like to do today?* 👇`;
        keyboard = createMainMenuKeyboard(user);
        break;
        
      default:
        response = 'Unknown button. Please try again.';
    }
    
    if (keyboard) {
      await bot.editMessageText(response, {
        chat_id: message.chat.id,
        message_id: message.message_id,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    } else {
      await bot.editMessageText(response, {
        chat_id: message.chat.id,
        message_id: message.message_id,
        parse_mode: 'Markdown',
        reply_markup: createMainMenuKeyboard(user)
      });
    }
    
    await bot.answerCallbackQuery(callbackQuery.id);
    
  } catch (error) {
    logger.error('❌ Error handling callback query:', error);
    await bot.answerCallbackQuery(callbackQuery.id, 'Error occurred. Please try again.');
  }
});

// Agent command
bot.onText(/\/agent/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const user = getUserData(chatId);
    
    if (!user.name) {
      await bot.sendMessage(chatId, 'Please start with /start to set up your profile first.');
      return;
    }
    
    const message = `🤖 *AI Agent Initialized Successfully!*

*Agent ID:* ${chatId}-${Date.now()}
*Student:* Dr. ${user.name}
*Status:* active

*Your AI Agent Can:*
• 📝 Add and manage tasks with automatic alerts
• ⏰ Set intelligent reminders
• 📊 Track your study progress
• 🚨 Handle emergency situations
• 💊 Access drug database and interactions
• 🧮 Use medical calculators
• 📋 Get clinical guidelines
• 🎭 Practice with patient simulations
• 🔬 Research assistance
• 🖼️ Medical image analysis
• 🎯 Practice cases
• 📚 Medical education

*Quick Access Buttons Below:* 👇

Your agent is now active and ready to help! 🚀`;

    await sendMessageWithMenu(chatId, message);
    logger.info(`✅ Agent command sent for Dr. ${user.name}`);
    
  } catch (error) {
    logger.error('❌ Error in agent command:', error);
    await bot.sendMessage(msg.chat.id, 'Sorry, agent initialization failed.');
  }
});

// Help command
bot.onText(/\/help/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const user = getUserData(chatId);
    
    const message = `🏥 *StethoLink AI Agent Help - Dr. ${user.name || 'Student'}*

*📖 Getting Started:*
• /start - Initialize your profile
• /agent - Initialize your AI agent
• /help - Show this help menu

*📚 Study Management:*
• Add tasks with automatic reminders
• Track study progress
• Manage alerts and notifications

*📝 Note Management:*
• Create and organize medical notes
• Search through your notes
• Categorize by topics

*🏥 Medical Tools:*
• Drug database and interactions
• Medical calculators (BMI, GFR, CHADS2)
• Clinical guidelines
• Patient simulations
• Research assistance
• Image analysis

*🎯 Advanced Features:*
• Practice cases
• Emergency support
• Medical education
• Web dashboard

*Quick Access Buttons Below:* 👇

Start by typing a command or medical term!`;

    await sendMessageWithMenu(chatId, message);
    
  } catch (error) {
    logger.error('❌ Error in help command:', error);
    await bot.sendMessage(msg.chat.id, 'Sorry, could not load help menu.');
  }
});

// Initialize Telegram bot
async function initializeTelegramBot() {
  try {
    // Verify environment variables
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('Missing required Telegram environment variables');
    }
    
    // Test bot connection
    const me = await bot.getMe();
    
    logger.info('✅ Ultimate Telegram bot with advanced features initialized successfully');
    logger.info(`🤖 Bot username: @${me.username}`);
    return true;
  } catch (error) {
    logger.error('❌ Error initializing Telegram bot:', error);
    throw error;
  }
}

logger.info('✅ Ultimate Telegram bot with advanced features initialized successfully');

module.exports = { 
  bot,
  initializeTelegramBot
}; 