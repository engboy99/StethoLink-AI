require('dotenv').config();
const twilio = require('twilio');

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

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// User data storage (in production, use database)
const userData = new Map();

// Helper function to get user data
function getUserData(phoneNumber) {
  if (!userData.has(phoneNumber)) {
    userData.set(phoneNumber, {
      name: null,
      stage: 'welcome',
      agentInitialized: false,
      currentTask: null,
      currentNote: null
    });
  }
  return userData.get(phoneNumber);
}

// Helper function to send WhatsApp message
async function sendWhatsAppMessage(to, message) {
  try {
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`
    });
    logger.info(`✅ WhatsApp message sent to ${to}`);
  } catch (error) {
    logger.error(`❌ Error sending WhatsApp message to ${to}:`, error);
  }
}

// Helper function to create menu message
function createMenuMessage(userName = 'Student') {
  return `🏥 *StethoLink AI - Dr. ${userName}*

*Main Menu - Choose an option:*

📝 *Task Management*
1. Add Task - "Study cardiology at 6 PM"
2. My Tasks - View all tasks
3. My Alerts - Check reminders

📊 *Study Tools*
4. Progress - Track study progress
5. Add Note - "add note: ECG basics"
6. My Notes - View all notes

💊 *Medical Tools*
7. Drug Info - "drug: paracetamol"
8. Calculator - "Calculate BMI for 70kg 1.75m"
9. Guidelines - "guidelines: hypertension"

🎭 *Advanced Features*
10. Simulation - "Start patient simulation"
11. Research - "research: diabetes"
12. Image Analysis - "Analyze chest X-ray"

🏥 *Support*
13. Emergency - Emergency protocols
14. Education - Medical education
15. Dashboard - Web dashboard
16. Help - Show this menu

*Type the number or use natural language commands!*`;
}

// Handle incoming WhatsApp messages
async function handleWhatsAppMessage(req, res) {
  try {
    const { Body, From } = req.body;
    const phoneNumber = From.replace('whatsapp:', '');
    const message = Body.trim();
    const user = getUserData(phoneNumber);

    logger.info(`📱 WhatsApp message from ${phoneNumber}: ${message}`);

    // Handle /start command
    if (message.toLowerCase() === '/start' || message.toLowerCase() === 'start') {
      if (!user.name) {
        user.stage = 'asking_name';
        const welcomeMessage = `🏥 *Welcome to StethoLink AI!*

I'm Dr. StethoLink, your AI medical assistant for Sri Lankan medical students.

*Before we begin, I'd like to know your name:*

Please reply with your name (e.g., "Imesha Udayangani" or just "Imesha") so I can address you properly as Dr. [Your Name].`;

        await sendWhatsAppMessage(phoneNumber, welcomeMessage);
        return res.status(200).send('OK');
      } else {
        // User already has a name, show main menu
        const menuMessage = createMenuMessage(user.name);
        await sendWhatsAppMessage(phoneNumber, menuMessage);
        return res.status(200).send('OK');
      }
    }

    // Handle name collection
    if (user.stage === 'asking_name') {
      const name = message.trim();
      if (name.length > 0) {
        user.name = name;
        user.stage = 'ready';
        user.agentInitialized = true;
        
        const welcomeMessage = `🎉 *Welcome, Dr. ${name}!*

Your AI medical assistant is now personalized and ready to be your best friend throughout your medical journey!

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

*Let's get started! Type a number or use natural language commands!*`;

        await sendWhatsAppMessage(phoneNumber, welcomeMessage);
        setTimeout(async () => {
          const menuMessage = createMenuMessage(name);
          await sendWhatsAppMessage(phoneNumber, menuMessage);
        }, 1000);
        
        logger.info(`✅ User name collected: ${name}`);
        return res.status(200).send('OK');
      } else {
        await sendWhatsAppMessage(phoneNumber, 'Please provide your name so I can address you properly.');
        return res.status(200).send('OK');
      }
    }

    // Handle natural language commands
    if (user.stage === 'ready') {
      const lowerMessage = message.toLowerCase();
      
      // Task creation
      if (lowerMessage.includes('study') || lowerMessage.includes('task') || lowerMessage.includes('reminder')) {
        try {
          const taskResult = await medicalAgentSystem.addTaskWithAlerts(phoneNumber, {
            title: message,
            description: message,
            priority: 'medium',
            scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
          });
          
          const response = `✅ *Task Added Successfully!*

*Task:* ${message}
*Status:* Scheduled
*Priority:* Medium

*Next Steps:*
• You'll receive reminders before the task
• Use "My Tasks" to view all your tasks
• Use "My Alerts" to check pending reminders`;

          await sendWhatsAppMessage(phoneNumber, response);
        } catch (error) {
          await sendWhatsAppMessage(phoneNumber, `❌ *Task Creation Failed*

Please try again with a more specific task description.

*Example:* "Study cardiology at 6 PM tomorrow"`);
        }
        return res.status(200).send('OK');
      }

      // Note creation
      if (lowerMessage.includes('note') || lowerMessage.includes('add note')) {
        try {
          const noteContent = message.replace(/^(add note|note):?\s*/i, '');
          const note = await notebookService.addNote(phoneNumber, {
            title: `Note - ${new Date().toLocaleDateString()}`,
            content: noteContent,
            category: 'general',
            tags: ['whatsapp']
          });
          
          const response = `📝 *Note Added Successfully!*

*Content:* ${noteContent.substring(0, 100)}${noteContent.length > 100 ? '...' : ''}
*Category:* General
*Date:* ${new Date().toLocaleDateString()}

*Next Steps:*
• Use "My Notes" to view all your notes
• Use "Search Notes" to find specific notes`;

          await sendWhatsAppMessage(phoneNumber, response);
        } catch (error) {
          await sendWhatsAppMessage(phoneNumber, `❌ *Note Creation Failed*

Please try again with valid note content.

*Example:* "add note: ECG interpretation basics"`);
        }
        return res.status(200).send('OK');
      }

      // Calculator
      if (lowerMessage.includes('calculate') || lowerMessage.includes('bmi') || lowerMessage.includes('gfr')) {
        let response = '';
        if (lowerMessage.includes('bmi')) {
          const matches = message.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?)\s*(?:and|for|with|,)\s*(\d+(?:\.\d+)?)\s*(?:m|meters?|cm)/i);
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
        } else if (lowerMessage.includes('gfr')) {
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

*Choose a calculator or type your calculation request.*`;
        }
        
        await sendWhatsAppMessage(phoneNumber, response);
        return res.status(200).send('OK');
      }

      // Drug information
      if (lowerMessage.includes('drug') || lowerMessage.includes('medicine') || lowerMessage.includes('medication')) {
        const drugName = message.replace(/^(drug|medicine|medication|info):?\s*/i, '').trim();
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

*Need more info?* Type "drug: [drug name]" for detailed interactions.`;
              await sendWhatsAppMessage(phoneNumber, response);
            } else {
              await sendWhatsAppMessage(phoneNumber, `❌ *Drug Not Found*

Drug "${drugName}" not found in our database.

*Try:* paracetamol, aspirin, warfarin, amoxicillin`);
            }
          } catch (error) {
            await sendWhatsAppMessage(phoneNumber, `❌ *Drug Information Error*

Please try again with a valid drug name.

*Examples:* paracetamol, aspirin, warfarin`);
          }
        } else {
          await sendWhatsAppMessage(phoneNumber, `💊 *Drug Information*

Please provide a drug name to get information.

*Examples:*
• "drug: paracetamol"
• "medicine: aspirin"
• "medication: warfarin"`);
        }
        return res.status(200).send('OK');
      }

      // Menu navigation
      if (message === '1' || message === '2' || message === '3' || message === '4' || message === '5' || message === '6' || 
          message === '7' || message === '8' || message === '9' || message === '10' || message === '11' || message === '12' ||
          message === '13' || message === '14' || message === '15' || message === '16') {
        
        const menuResponses = {
          '1': '📝 *Add Task*\n\nPlease type your task with time and details.\n\n*Examples:*\n• "Study cardiology at 6 PM tomorrow"\n• "Review ECG cases on Friday"\n• "Practice drug calculations at 3 PM today"',
          '2': '📋 *My Tasks*\n\nChecking your tasks...',
          '3': '⏰ *My Alerts*\n\nChecking your alerts...',
          '4': '📊 *Study Progress*\n\n*Current Status:* Active Student\n*Study Streak:* 0 days\n*Tasks Completed:* 0\n*Notes Created:* 0\n\n*Progress Features Coming Soon!*',
          '5': '📝 *Add Note*\n\nPlease type your note content.\n\n*Examples:*\n• "ECG interpretation basics: P wave represents atrial depolarization..."\n• "Drug interactions: Warfarin + Aspirin = increased bleeding risk"',
          '6': '📖 *My Notes*\n\nChecking your notes...',
          '7': '💊 *Drug Information*\n\nType a drug name to get information:\n\n*Examples:*\n• "paracetamol"\n• "aspirin"\n• "warfarin"',
          '8': '🧮 *Medical Calculators*\n\n*Available Calculators:*\n• BMI Calculator\n• GFR Calculator\n• CHADS2 Score\n\n*Examples:*\n• "Calculate BMI for 70kg 1.75m"\n• "Calculate GFR for 25y 70kg 175cm 1.2mg/dL male"',
          '9': '📋 *Clinical Guidelines*\n\n*Available Guidelines:*\n• Cardiovascular - Hypertension, CAD, Heart failure\n• Respiratory - Asthma, COPD, Pneumonia\n• Endocrine - Diabetes, Thyroid disorders\n\n*Type:* "guidelines: hypertension"',
          '10': '🎭 *Patient Simulation*\n\n*Available Simulations:*\n• Cardiovascular - Chest pain, MI, Heart failure\n• Respiratory - Shortness of breath, Asthma\n• Neurological - Headache, Stroke, Seizure\n\n*Start:* "Start patient simulation"',
          '11': '🔬 *Research Assistant*\n\n*Available Research Tools:*\n• Literature search\n• Clinical trial analysis\n• Evidence synthesis\n\n*Start:* "research: diabetes management"',
          '12': '🖼️ *Image Analysis*\n\n*Supported Image Types:*\n• X-ray - Chest, Abdominal, Extremities\n• ECG - 12-lead, Rhythm strips\n• CT - Head, Chest, Abdomen\n• MRI - Brain, Spine, Joints\n\n*Upload an image or describe:* "Analyze this chest X-ray"',
          '13': '🏥 *Emergency Support*\n\n*Emergency Protocols:*\n• ACLS - Advanced Cardiac Life Support\n• ATLS - Advanced Trauma Life Support\n• BLS - Basic Life Support\n\n*For real emergencies, call emergency services immediately!* 🚨',
          '14': '📚 *Medical Education*\n\n*Learning Modules:*\n• Anatomy - Human anatomy and physiology\n• Physiology - Body systems and functions\n• Pathology - Disease mechanisms\n• Pharmacology - Drug mechanisms\n\n*Start:* "education: cardiology"',
          '15': '🖥️ *Web Dashboard*\n\n*Access your full dashboard at:*\nhttp://localhost:3000/dashboard.html\n\n*All features available in web interface!*',
          '16': `📖 *User Guide - Dr. ${user.name}*\n\n*Getting Started:*\n1. Tasks - Add study tasks with automatic reminders\n2. Notes - Create and organize medical notes\n3. Calculators - Use medical calculators\n4. Drug Info - Access drug database\n5. Guidelines - Get clinical guidelines\n6. Simulations - Practice patient cases\n\n*I'm your AI medical assistant - your best friend in medical school!* 🎓`
        };

        const response = menuResponses[message] || 'Invalid option. Please try again.';
        await sendWhatsAppMessage(phoneNumber, response);
        return res.status(200).send('OK');
      }

      // Default response
      const defaultResponse = `💬 *Message Received*

You said: "${message}"

*I can help you with:*
• **Tasks** - "Study cardiology at 6 PM"
• **Notes** - "add note: ECG interpretation basics"
• **Calculators** - "Calculate BMI for 70kg 1.75m"
• **Drug Info** - "drug: paracetamol"
• **Simulations** - "Start patient simulation"

*Or type a number (1-16) for quick access!*`;

      await sendWhatsAppMessage(phoneNumber, defaultResponse);
    }

    return res.status(200).send('OK');
  } catch (error) {
    logger.error('❌ Error handling WhatsApp message:', error);
    return res.status(500).send('Error');
  }
}

// Initialize WhatsApp bot
async function initializeWhatsAppBot() {
  try {
    // Verify environment variables
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Missing required Twilio environment variables');
    }
    
    // Test Twilio client
    await client.messages.list({ limit: 1 });
    
    logger.info('✅ Ultimate WhatsApp bot with advanced features initialized successfully');
    return true;
  } catch (error) {
    logger.error('❌ Error initializing WhatsApp bot:', error);
    throw error;
  }
}

logger.info('✅ Ultimate WhatsApp bot with advanced features initialized successfully');

module.exports = { 
  handleWhatsAppMessage,
  initializeWhatsAppBot
}; 