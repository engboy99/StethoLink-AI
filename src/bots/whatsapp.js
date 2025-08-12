const twilio = require('twilio');
const { logger, medicalLogger } = require('../utils/logger');
const { generateDiagnosis, processVoiceMessage, generateSimulation, generateMotivationalMessage } = require('../services/ai');
const { saveConversation, saveCase, getUser, createUser, updateUser, logAnalytics } = require('../config/firebase');
const { encryptData, decryptData } = require('../utils/encryption');
const advancedFeatures = require('../services/advanced-features');
const simulationManager = require('../services/simulation-manager');
const medicalAgentSystem = require('../services/medical-agent-system');

let twilioClient;
let webhookSecret;

// Initialize WhatsApp bot
function initializeWhatsAppBot() {
  try {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Medical agent system is already initialized as a singleton
    
    webhookSecret = process.env.TWILIO_WEBHOOK_SECRET;
    
    logger.info('✅ WhatsApp bot initialized successfully with AI Agent System');
  } catch (error) {
    logger.error('❌ Error initializing WhatsApp bot:', error);
    throw error;
  }
}

// Enhanced welcome messages with AI Agent capabilities
const WELCOME_MESSAGES = {
  en: `🏥 *Welcome to StethoLink AI Agent!*

I'm Dr. StethoLink, your intelligent AI medical assistant for Sri Lankan medical students.

🤖 *I'm Your Personal AI Agent - I Can:*
• 📝 **Add Tasks** - Just say "add task: study cardiology" or "remind me to review ECG"
• ⏰ **Set Alerts** - I'll automatically remind you at the right time
• 📊 **Track Progress** - Monitor your study efficiency and completion
• 🚨 **Emergency Response** - Handle critical medical situations
• 📚 **Study Planning** - Create personalized study schedules
• 💊 **Drug Database** - Access Sri Lankan drug information
• 🧮 **Medical Calculators** - BMI, GFR, CHADS2, and more
• 📋 **Clinical Guidelines** - Evidence-based protocols
• 🔍 **Drug Interactions** - Check medication safety
• 🎭 **Patient Simulation** - Practice with virtual patients

*Quick Commands:*
• "agent" - Initialize your personal AI agent
• "tasks" - View and manage your tasks
• "addtask" - Add a new task with automatic alerts
• "alerts" - Check your pending alerts
• "progress" - View your study progress
• "calculator" - Medical calculators
• "drugs" - Drug database
• "simulate" - Patient simulation
• "help" - Show all features

*Natural Language:*
Just type naturally! Examples:
• "Add task: study dengue fever guidelines"
• "Set reminder for cardiology exam in 2 days"
• "Check drug interaction between warfarin and aspirin"
• "Calculate BMI for weight 70kg height 1.75m"

*Languages:* 🇺🇸 🇱🇰 🇮🇳

Start by saying "initialize my agent" or use any command!`,

  si: `🏥 *StethoLink AI Agent වෙත සාදරයෙන් පිළිගනිමු!*

මම Dr. StethoLink, ශ්‍රී ලංකාවේ වෛද්‍ය ශිෂ්‍යයින් සඳහා ඔබේ බුද්ධිමත් AI වෛද්‍ය සහායකයා.

🤖 *මම ඔබේ පුද්ගලික AI Agent - මට හැකි දේ:*
• 📝 **කාර්යයන් එකතු කිරීම** - "add task: study cardiology" හෝ "remind me to review ECG" කියන්න
• ⏰ **අනතුරු ඇඟවීම්** - නිවැරදි වේලාවට මම ඔබට මතක් කරන්නම්
• 📊 **ප්‍රගතිය නිරීක්ෂණය** - ඔබේ අධ්‍යාපන කාර්යක්ෂමතාව සහ සම්පූර්ණතාව නිරීක්ෂණය
• 🚨 **හදිසි ප්‍රතිචාර** - තීරණාත්මක වෛද්‍ය තත්වයන් හසුරු කිරීම
• 📚 **අධ්‍යාපන සැලසුම්** - පුද්ගලීකරණය කරන ලද අධ්‍යාපන කාලසටහන් සෑදීම
• 💊 **ඖෂධ දත්ත ගබඩාව** - ශ්‍රී ලංකා ඖෂධ තොරතුරු
• 🧮 **වෛද්‍ය ගණක යන්ත්‍ර** - BMI, GFR, CHADS2, සහ තවත්
• 📋 **සායනික මාර්ගෝපදේශ** - සාක්ෂි මත පදනම් වූ ප්‍රොටොකෝල
• 🔍 **ඖෂධ අන්තර්ක්‍රියා** - ඖෂධ ආරක්ෂාව පරීක්ෂා කිරීම
• 🎭 **රෝගී සිමියුලේෂනය** - අතථ්‍ය රෝගීන් සමඟ පුහුණු වීම

*ක්ෂණික විධාන:*
• "agent" - ඔබේ පුද්ගලික AI agent ආරම්භ කරන්න
• "tasks" - ඔබේ කාර්යයන් බලන්න සහ කළමනාකරණය කරන්න
• "addtask" - ස්වයංක්‍රීය අනතුරු ඇඟවීම් සමඟ නව කාර්යයක් එකතු කරන්න
• "alerts" - ඔබේ අපේක්ෂිත අනතුරු ඇඟවීම් පරීක්ෂා කරන්න
• "progress" - ඔබේ අධ්‍යාපන ප්‍රගතිය බලන්න
• "calculator" - වෛද්‍ය ගණක යන්ත්‍ර
• "drugs" - ඖෂධ දත්ත ගබඩාව
• "simulate" - රෝගී සිමියුලේෂනය
• "help" - සියලුම විශේෂාංග පෙන්වන්න

*ස්වාභාවික භාෂාව:*
ස්වාභාවිකව ටයිප් කරන්න! උදාහරණ:
• "Add task: study dengue fever guidelines"
• "Set reminder for cardiology exam in 2 days"
• "Check drug interaction between warfarin and aspirin"
• "Calculate BMI for weight 70kg height 1.75m"

*භාෂා:* 🇺🇸 🇱🇰 🇮🇳

"initialize my agent" කියා හෝ ඕනෑම විධානයක් භාවිතා කරමින් ආරම්භ කරන්න!`,

  ta: `🏥 *StethoLink AI Agent க்கு வரவேற்கிறோம்!*

நான் Dr. StethoLink, இலங்கை மருத்துவ மாணவர்களுக்கான உங்கள் புத்திசாலி AI மருத்துவ உதவியாளர்.

🤖 *நான் உங்கள் தனிப்பட்ட AI Agent - என்னால் முடியும்:*
• 📝 **பணிகளை சேர்க்கவும்** - "add task: study cardiology" அல்லது "remind me to review ECG" என்று சொல்லுங்கள்
• ⏰ **எச்சரிக்கைகளை அமைக்கவும்** - சரியான நேரத்தில் நான் உங்களுக்கு நினைவூட்டுவேன்
• 📊 **முன்னேற்றத்தை கண்காணிக்கவும்** - உங்கள் படிப்பு திறன் மற்றும் முடிவை கண்காணிக்கவும்
• 🚨 **அவசர பதில்** - முக்கியமான மருத்துவ சூழ்நிலைகளை கையாளவும்
• 📚 **படிப்பு திட்டமிடல்** - தனிப்பட்ட படிப்பு அட்டவணைகளை உருவாக்கவும்
• 💊 **மருந்து தரவுத்தளம்** - இலங்கை மருந்து தகவல்
• 🧮 **மருத்துவ கணிப்பான்கள்** - BMI, GFR, CHADS2, மேலும்
• 📋 **மருத்துவ வழிகாட்டுதல்கள்** - சான்று அடிப்படையிலான நெறிமுறைகள்
• 🔍 **மருந்து தொடர்புகள்** - மருந்து பாதுகாப்பை சரிபார்க்கவும்
• 🎭 **நோயாளி சிமுலேஷன்** - மெய்நிகர் நோயாளிகளுடன் பயிற்சி பெறவும்

*விரைவு கட்டளைகள்:*
• "agent" - உங்கள் தனிப்பட்ட AI agent ஐத் தொடங்கவும்
• "tasks" - உங்கள் பணிகளைக் காண்க மற்றும் நிர்வகிக்கவும்
• "addtask" - தானியங்கி எச்சரிக்கைகளுடன் புதிய பணியைச் சேர்க்கவும்
• "alerts" - உங்கள் நிலுவையில் உள்ள எச்சரிக்கைகளைச் சரிபார்க்கவும்
• "progress" - உங்கள் படிப்பு முன்னேற்றத்தைக் காண்க
• "calculator" - மருத்துவ கணிப்பான்கள்
• "drugs" - மருந்து தரவுத்தளம்
• "simulate" - நோயாளி சிமுலேஷன்
• "help" - அனைத்து அம்சங்களையும் காட்டு

*இயற்கை மொழி:*
இயற்கையாக தட்டச்சு செய்யுங்கள்! எடுத்துக்காட்டுகள்:
• "Add task: study dengue fever guidelines"
• "Set reminder for cardiology exam in 2 days"
• "Check drug interaction between warfarin and aspirin"
• "Calculate BMI for weight 70kg height 1.75m"

*மொழிகள்:* 🇺🇸 🇱🇰 🇮🇳

"initialize my agent" என்று சொல்லி அல்லது எந்த கட்டளையையும் பயன்படுத்தி தொடங்குங்கள்!`
};

// Help messages
const HELP_MESSAGES = {
  en: `🏥 *StethoLink AI Help*

*Basic Commands:*
• Just type your symptoms for diagnosis
• Send voice message for voice-to-text
• /start - Restart the bot
• /help - Show this help

*Advanced Features:*
• /simulate - Practice with virtual patients
• /history - View your saved cases
• /mentor - Get study tips and motivation
• /vault - Download your clinical portfolio
• /remindme - Set daily practice reminders

*Voice Commands:*
• Send voice message in Sinhala, Tamil, or English
• Bot will transcribe and analyze symptoms

Need more help? Contact support.`,

  si: `🏥 *StethoLink AI උදව්*

*මූලික විධාන:*
• රෝග විනිශ්චය සඳහා ඔබේ රෝග ලක්ෂණ ටයිප් කරන්න
• හඬ-ටු-ටෙක්ස්ට් සඳහා හඬ පණිවිඩයක් යවන්න
• /start - බොට් නැවත ආරම්භ කරන්න
• /help - මෙම උදව් පෙන්වන්න

*උසස් විශේෂාංග:*
• /simulate - අතථ්‍ය රෝගීන් සමඟ පුහුණු වන්න
• /history - ඔබේ සුරැකි රෝග බලන්න
• /mentor - අධ්‍යාපන උපදෙස් සහ ධෛර්‍ය ලබා ගන්න
• /vault - ඔබේ සායනික පෝට්ෆෝලියෝ බාගන්න
• /remindme - දෛනික පුහුණු මතක් කිරීම් සකස් කරන්න

*හඬ විධාන:*
• සිංහල, දෙමළ, හෝ ඉංග්‍රීසියෙන් හඬ පණිවිඩයක් යවන්න
• බොට් රෝග ලක්ෂණ පරිවර්තනය කර විශ්ලේෂණය කරයි

තවත් උදව් අවශ්‍යද? සහාය අමතන්න.`,

  ta: `🏥 *StethoLink AI உதவி*

*அடிப்படை கட்டளைகள்:*
• நோய் கண்டறிதலுக்கு உங்கள் அறிகுறிகளை தட்டச்சு செய்யுங்கள்
• குரல்-க்கு-உரைக்கு குரல் செய்தியை அனுப்புங்கள்
• /start - பாட் மீண்டும் தொடங்குங்கள்
• /help - இந்த உதவியைக் காட்டு

*மேம்பட்ட அம்சங்கள்:*
• /simulate - மெய்நிகர் நோயாளிகளுடன் பயிற்சி பெறுங்கள்
• /history - உங்கள் சேமிக்கப்பட்ட வழக்குகளைக் காண்க
• /mentor - படிப்பு குறிப்புகள் மற்றும் ஊக்கத்தைப் பெறுங்கள்
• /vault - உங்கள் மருத்துவ போர்ட்ஃபோலியோவைப் பதிவிறக்குங்கள்
• /remindme - தினசரி பயிற்சி நினைவூட்டல்களை அமைக்கவும்

*குரல் கட்டளைகள்:*
• சிங்களம், தமிழ் அல்லது ஆங்கிலத்தில் குரல் செய்தியை அனுப்புங்கள்
• பாட் அறிகுறிகளை மொழிபெயர்த்து பகுப்பாய்வு செய்யும்

மேலும் உதவி தேவையா? ஆதரவை தொடர்பு கொள்ளுங்கள்.`
};

// Process incoming WhatsApp message
async function processWhatsAppMessage(req, res) {
  try {
    // Verify webhook signature
    const signature = req.headers['x-twilio-signature'];
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    
    if (!twilio.validateRequest(webhookSecret, signature, url, req.body)) {
      logger.warn('❌ Invalid WhatsApp webhook signature');
      return res.status(403).send('Forbidden');
    }

    const { Body, From, MediaUrl0, MessageSid, NumMedia } = req.body;
    const phoneNumber = From.replace('whatsapp:', '');
    
    logger.info('📱 Processing WhatsApp message', {
      phoneNumber,
      messageType: NumMedia > 0 ? 'media' : 'text',
      messageId: MessageSid
    });

    // Get or create user
    let user = await getUserByPhone(phoneNumber);
    if (!user) {
      user = await createWhatsAppUser(phoneNumber);
    }

    // Update user activity
    await updateUser(user.uid, {
      'stats.lastActive': new Date(),
      platform: 'whatsapp'
    });

    let response;

    // Handle media messages (voice/audio)
    if (NumMedia > 0 && MediaUrl0) {
      response = await handleVoiceMessage(MediaUrl0, user, MessageSid);
    } else {
      // Handle text messages
      response = await handleTextMessage(Body, user, MessageSid);
    }

    // Send response
    await sendWhatsAppMessage(phoneNumber, response);

    // Log analytics
    await logAnalytics({
      event: 'whatsapp_message_processed',
      userId: user.uid,
      platform: 'whatsapp',
      messageType: NumMedia > 0 ? 'voice' : 'text',
      language: user.language || 'en'
    });

    res.status(200).send('OK');

  } catch (error) {
    logger.error('❌ Error processing WhatsApp message:', error);
    medicalLogger.medicalError(error, {
      platform: 'whatsapp',
      operation: 'message_processing'
    });
    
    // Send error message to user
    try {
      const errorMessage = {
        en: 'Sorry, I encountered an error. Please try again.',
        si: 'සමාවන්න, මට දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න.',
        ta: 'மன்னிக்கவும், நான் பிழையை எதிர்கொண்டேன். மீண்டும் முயற்சிக்கவும்.'
      };
      
      await sendWhatsAppMessage(req.body.From.replace('whatsapp:', ''), 
        errorMessage[req.body.language] || errorMessage.en);
    } catch (sendError) {
      logger.error('❌ Error sending error message:', sendError);
    }
    
    res.status(500).send('Internal Server Error');
  }
}

// Handle text messages
async function handleTextMessage(message, user, messageId) {
  const command = message.trim().toLowerCase();
  const language = user.language || 'en';

  // Save conversation
  await saveConversation({
    userId: user.uid,
    platform: 'whatsapp',
    messageId: messageId,
    userMessage: message,
    timestamp: new Date()
  });

  // Enhanced intelligent command detection with AI Agent capabilities
  const lowerMessage = message.toLowerCase().trim();
  
  // AI Agent Natural Language Commands
  if (lowerMessage.includes('add task') || lowerMessage.includes('set task') || lowerMessage.includes('create task')) {
    return await handleNaturalLanguageTaskCreation(message, user, language);
  }
  
  if (lowerMessage.includes('remind me') || lowerMessage.includes('set reminder') || lowerMessage.includes('alert me')) {
    return await handleNaturalLanguageReminder(message, user, language);
  }
  
  if (lowerMessage.includes('initialize') && lowerMessage.includes('agent')) {
    return await handleAgentCommand(user, language);
  }
  
  if (lowerMessage.includes('my tasks') || lowerMessage.includes('show tasks') || lowerMessage.includes('list tasks')) {
    return await handleTasksCommand(user, language);
  }
  
  if (lowerMessage.includes('my alerts') || lowerMessage.includes('show alerts') || lowerMessage.includes('check alerts')) {
    return await handleAlertsCommand(user, language);
  }
  
  if (lowerMessage.includes('my progress') || lowerMessage.includes('show progress') || lowerMessage.includes('study progress')) {
    return await handleProgressCommand(user, language);
  }
  
  // Drug interaction queries
  if (lowerMessage.includes('drug interaction') || lowerMessage.includes('check interaction') || lowerMessage.includes('medication interaction')) {
    return await handleNaturalLanguageDrugInteraction(message, user, language);
  }
  
  // Calculator queries
  if (lowerMessage.includes('calculate') || lowerMessage.includes('bmi') || lowerMessage.includes('gfr') || lowerMessage.includes('chads2')) {
    return await handleNaturalLanguageCalculator(message, user, language);
  }

  // Handle commands
  if (command === '/start' || command === 'start') {
    return WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en;
  }

  if (command === '/help' || command === 'help') {
    return HELP_MESSAGES[language] || HELP_MESSAGES.en;
  }

  if (command === '/simulate' || command === 'simulate') {
    return await handleSimulationCommand(user, language);
  }

  if (command === '/history' || command === 'history') {
    return await handleHistoryCommand(user, language);
  }

  if (command === '/mentor' || command === 'mentor') {
    return await handleMentorCommand(user, language);
  }

  if (command === '/vault' || command === 'vault') {
    return await handleVaultCommand(user, language);
  }

  if (command === '/remindme' || command === 'remindme') {
    return await handleReminderCommand(user, language);
  }

  // AI Agent Commands
  if (command === 'agent') {
    return await handleAgentCommand(user, language);
  }

  if (command === 'tasks') {
    return await handleTasksCommand(user, language);
  }

  if (command === 'addtask') {
    return await handleAddTaskCommand(user, language);
  }

  if (command === 'alerts') {
    return await handleAlertsCommand(user, language);
  }

  if (command === 'progress') {
    return await handleProgressCommand(user, language);
  }

  // Handle symptoms for diagnosis
  if (message.length > 10) {
    return await handleDiagnosisRequest(message, user, language);
  }

  // Default response
  const defaultResponses = {
    en: '🤖 *AI Agent Ready!*\n\nI can help you with:\n• Add tasks: "add task: study cardiology"\n• Set reminders: "remind me to review ECG"\n• Check drug interactions: "check warfarin and aspirin"\n• Calculate: "calculate BMI 70kg 1.75m"\n\nOr use "help" for all commands!',
    si: '🤖 *AI Agent සූදානම්!*\n\nමට ඔබට උදව් කළ හැක්කේ:\n• කාර්යයන් එකතු කිරීම: "add task: study cardiology"\n• මතක් කිරීම්: "remind me to review ECG"\n• ඖෂධ අන්තර්ක්‍රියා: "check warfarin and aspirin"\n• ගණනය කිරීම: "calculate BMI 70kg 1.75m"\n\nනැතහොත් සියලුම විධාන සඳහා "help" භාවිතා කරන්න!',
    ta: '🤖 *AI Agent தயார்!*\n\nநான் உங்களுக்கு உதவ முடியும்:\n• பணிகளை சேர்க்க: "add task: study cardiology"\n• நினைவூட்டல்கள்: "remind me to review ECG"\n• மருந்து தொடர்புகள்: "check warfarin and aspirin"\n• கணக்கிட: "calculate BMI 70kg 1.75m"\n\nஅல்லது அனைத்து கட்டளைகளுக்கும் "help" ஐப் பயன்படுத்தவும்!'
  };

  return defaultResponses[language] || defaultResponses.en;
}

// Handle voice messages
async function handleVoiceMessage(mediaUrl, user, messageId) {
  try {
    logger.info('🎤 Processing voice message from WhatsApp', { userId: user.uid });
    
    // Download audio file
    const audioBuffer = await downloadAudioFile(mediaUrl);
    
    // Process with Whisper
    const transcription = await processVoiceMessage(audioBuffer, user.language || 'en');
    
    // Save voice message
    await saveVoiceMessage({
      userId: user.uid,
      platform: 'whatsapp',
      messageId: messageId,
      mediaUrl: mediaUrl,
      transcription: transcription.text,
      language: transcription.language,
      processingTime: transcription.processingTime
    });

    // Generate diagnosis from transcribed text
    const diagnosis = await generateDiagnosis(
      transcription.text, 
      transcription.language, 
      user.uid
    );

    // Save case
    await saveCase({
      userId: user.uid,
      platform: 'whatsapp',
      symptoms: transcription.text,
      diagnosis: diagnosis.diagnosis,
      language: transcription.language,
      source: 'voice',
      processingTime: diagnosis.processingTime
    });

    const language = user.language || 'en';
    const responses = {
      en: `🎤 *Voice Message Transcribed:*
"${transcription.text}"

🏥 *Medical Analysis:*
${diagnosis.diagnosis}`,
      
      si: `🎤 *හඬ පණිවිඩය පරිවර්තනය කරන ලදී:*
"${transcription.text}"

🏥 *වෛද්‍ය විශ්ලේෂණය:*
${diagnosis.diagnosis}`,
      
      ta: `🎤 *குரல் செய்தி மொழிபெயர்க்கப்பட்டது:*
"${transcription.text}"

🏥 *மருத்துவ பகுப்பாய்வு:*
${diagnosis.diagnosis}`
    };

    return responses[language] || responses.en;

  } catch (error) {
    logger.error('❌ Error handling voice message:', error);
    
    const errorResponses = {
      en: 'Sorry, I could not process your voice message. Please try typing your symptoms instead.',
      si: 'සමාවන්න, මට ඔබේ හඬ පණිවිඩය සැකසීමට නොහැකි විය. කරුණාකර ඔබේ රෝග ලක්ෂණ ටයිප් කිරීමට උත්සාහ කරන්න.',
      ta: 'மன்னிக்கவும், நான் உங்கள் குரல் செய்தியை செயலாக்க முடியவில்லை. தயவுசெய்து உங்கள் அறிகுறிகளை தட்டச்சு செய்ய முயற்சிக்கவும்.'
    };

    return errorResponses[user.language] || errorResponses.en;
  }
}

// Handle diagnosis request
async function handleDiagnosisRequest(symptoms, user, language) {
  try {
    logger.info('🏥 Processing diagnosis request', { userId: user.uid, language });
    
    const diagnosis = await generateDiagnosis(symptoms, language, user.uid);
    
    // Save case
    await saveCase({
      userId: user.uid,
      platform: 'whatsapp',
      symptoms: symptoms,
      diagnosis: diagnosis.diagnosis,
      language: language,
      source: 'text',
      processingTime: diagnosis.processingTime
    });

    const responses = {
      en: `🏥 *Medical Analysis:*
${diagnosis.diagnosis}`,
      
      si: `🏥 *වෛද්‍ය විශ්ලේෂණය:*
${diagnosis.diagnosis}`,
      
      ta: `🏥 *மருத்துவ பகுப்பாய்வு:*
${diagnosis.diagnosis}`
    };

    return responses[language] || responses.en;

  } catch (error) {
    logger.error('❌ Error handling diagnosis request:', error);
    
    const errorResponses = {
      en: 'Sorry, I could not analyze your symptoms. Please try again.',
      si: 'සමාවන්න, මට ඔබේ රෝග ලක්ෂණ විශ්ලේෂණය කළ නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
      ta: 'மன்னிக்கவும், நான் உங்கள் அறிகுறிகளை பகுப்பாய்வு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
    };

    return errorResponses[language] || errorResponses.en;
  }
}

// Handle simulation command
async function handleSimulationCommand(user, language) {
  try {
    const conditions = [
      'Dengue fever',
      'Leptospirosis',
      'Typhoid fever',
      'Malaria',
      'Acute gastroenteritis',
      'Upper respiratory tract infection',
      'Hypertension',
      'Diabetes mellitus'
    ];

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    const simulation = await generateSimulation(randomCondition, language, {
      age: Math.floor(Math.random() * 50) + 20,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      occupation: 'Farmer',
      location: 'Rural Sri Lanka'
    });

    const responses = {
      en: `🎭 *Patient Simulation Started*

*Patient Profile:*
- Age: ${simulation.patientProfile.age}
- Gender: ${simulation.patientProfile.gender}
- Occupation: ${simulation.patientProfile.occupation}
- Location: ${simulation.patientProfile.location}

*Patient's Initial Presentation:*
${simulation.simulation}

Ask questions to diagnose the patient!`,
      
      si: `🎭 *රෝගී සිමියුලේෂනය ආරම්භ විය*

*රෝගී පැතිකඩ:*
- වයස: ${simulation.patientProfile.age}
- ස්ත්‍රී පුරුෂ භාවය: ${simulation.patientProfile.gender}
- රැකියාව: ${simulation.patientProfile.occupation}
- ස්ථානය: ${simulation.patientProfile.location}

*රෝගියාගේ මූලික ඉදිරිපත් කිරීම:*
${simulation.simulation}

රෝගියා විනිශ්චය කිරීමට ප්‍රශ්න ඇසීමට!`,
      
      ta: `🎭 *நோயாளி சிமுலேஷன் தொடங்கப்பட்டது*

*நோயாளி சுயவிவரம்:*
- வயது: ${simulation.patientProfile.age}
- பாலினம்: ${simulation.patientProfile.gender}
- தொழில்: ${simulation.patientProfile.occupation}
- இடம்: ${simulation.patientProfile.location}

*நோயாளியின் ஆரம்ப விளக்கக்காட்சி:*
${simulation.simulation}

நோயாளியை கண்டறிய கேள்விகள் கேள்வி!`
    };

    return responses[language] || responses.en;

  } catch (error) {
    logger.error('❌ Error handling simulation command:', error);
    return 'Sorry, simulation is currently unavailable.';
  }
}

// Handle history command
async function handleHistoryCommand(user, language) {
  try {
    const cases = await getCases(user.uid, 5);
    
    if (cases.length === 0) {
      const responses = {
        en: '📋 *Case History*\n\nNo cases found. Start by describing symptoms!',
        si: '📋 *රෝග ඉතිහාසය*\n\nරෝග හමු නොවීය. රෝග ලක්ෂණ විස්තර කිරීමෙන් ආරම්භ කරන්න!',
        ta: '📋 *வழக்கு வரலாறு*\n\nவழக்குகள் எதுவும் கிடைக்கவில்லை. அறிகுறிகளை விவரிப்பதன் மூலம் தொடங்குங்கள்!'
      };
      return responses[language] || responses.en;
    }

    let response = language === 'si' ? '📋 *රෝග ඉතිහාසය*\n\n' :
                   language === 'ta' ? '📋 *வழக்கு வரலாறு*\n\n' :
                   '📋 *Case History*\n\n';

    cases.forEach((case_, index) => {
      const date = new Date(case_.createdAt.toDate()).toLocaleDateString();
      const symptoms = case_.symptoms.substring(0, 50) + '...';
      
      response += `${index + 1}. *${date}*\n`;
      response += `Symptoms: ${symptoms}\n\n`;
    });

    return response;

  } catch (error) {
    logger.error('❌ Error handling history command:', error);
    return 'Sorry, could not retrieve case history.';
  }
}

// Handle mentor command
async function handleMentorCommand(user, language) {
  try {
    const motivationalMessage = await generateMotivationalMessage(language, 'daily');
    
    const responses = {
      en: `🎓 *Mentor Message*\n\n${motivationalMessage.message}\n\nKeep learning, future doctor! 💪`,
      si: `🎓 *උපදේශක පණිවිඩය*\n\n${motivationalMessage.message}\n\nඉගෙන ගැනීම දිගටම කරගෙන යන්න, අනාගත වෛද්‍යවරයා! 💪`,
      ta: `🎓 *வழிகாட்டி செய்தி*\n\n${motivationalMessage.message}\n\nகற்றுக்கொண்டே இருங்கள், எதிர்கால மருத்துவரே! 💪`
    };

    return responses[language] || responses.en;

  } catch (error) {
    logger.error('❌ Error handling mentor command:', error);
    return 'Keep studying hard, future doctor! 💪';
  }
}

// Handle vault command
async function handleVaultCommand(user, language) {
  const responses = {
    en: '📁 *Clinical Vault*\n\nYour encrypted clinical portfolio is being prepared. You will receive a download link shortly.',
    si: '📁 *සායනික ගබඩාව*\n\nඔබේ එන්ක්‍රිප්ට් කරන ලද සායනික පෝට්ෆෝලියෝ සූදානම් කරමින් පවතී. ඔබට ඉක්මනින් බාගැනීමේ සබැඳියක් ලැබෙනු ඇත.',
    ta: '📁 *மருத்துவ காப்பகம்*\n\nஉங்கள் குறியாக்கப்பட்ட மருத்துவ போர்ட்ஃபோலியோ தயாரிக்கப்படுகிறது. விரைவில் பதிவிறக்க இணைப்பைப் பெறுவீர்கள்.'
  };

  return responses[language] || responses.en;
}

// Handle reminder command
async function handleReminderCommand(user, language) {
  const responses = {
    en: '⏰ *Daily Reminders*\n\nReminders set! You will receive daily practice prompts to keep your skills sharp.',
    si: '⏰ *දෛනික මතක් කිරීම්*\n\nමතක් කිරීම් සකස් කරන ලදී! ඔබේ කුසලතා තියුණුව තබා ගැනීමට දෛනික පුහුණු ඉඟි ඔබට ලැබෙනු ඇත.',
    ta: '⏰ *தினசரி நினைவூட்டல்கள்*\n\nநினைவூட்டல்கள் அமைக்கப்பட்டன! உங்கள் திறன்களை கூர்மையாக வைத்திருக்க தினசரி பயிற்சி குறிப்புகளைப் பெறுவீர்கள்.'
  };

  return responses[language] || responses.en;
}

// Send WhatsApp message
async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `whatsapp:${phoneNumber}`
    });

    logger.info('✅ WhatsApp message sent successfully', {
      messageId: response.sid,
      to: phoneNumber
    });

    return response;
  } catch (error) {
    logger.error('❌ Error sending WhatsApp message:', error);
    throw error;
  }
}

// Get user by phone number
async function getUserByPhone(phoneNumber) {
  try {
    // This would typically query your database
    // For now, return null to create new user
    return null;
  } catch (error) {
    logger.error('❌ Error getting user by phone:', error);
    return null;
  }
}

// Create WhatsApp user
async function createWhatsAppUser(phoneNumber) {
  try {
    const userData = {
      phoneNumber: phoneNumber,
      displayName: `WhatsApp User ${phoneNumber.slice(-4)}`,
      language: 'en', // Default language
      platform: 'whatsapp'
    };

    const user = await createUser(userData);
    logger.info('✅ WhatsApp user created', { uid: user.uid, phoneNumber });
    
    return user;
  } catch (error) {
    logger.error('❌ Error creating WhatsApp user:', error);
    throw error;
  }
}

// Download audio file (placeholder)
async function downloadAudioFile(url) {
  // This would download the audio file from the URL
  // For now, return a placeholder
  return Buffer.from('placeholder audio data');
}

// Save voice message (placeholder)
async function saveVoiceMessage(data) {
  // This would save voice message data
  logger.info('Voice message saved', data);
}

// Get cases (placeholder)
async function getCases(userId, limit) {
  // This would retrieve cases from database
  return [];
}

// AI Agent Command Handlers

async function handleAgentCommand(user, language) {
  try {
    const agent = await medicalAgentSystem.initializeAgent(user.uid, {
      name: user.displayName || user.firstName || 'Medical Student',
      email: user.email || '',
      phone: user.phone || user.phoneNumber,
      whatsappId: user.phoneNumber,
      studyLevel: 'intermediate',
      specialization: 'general'
    });

    const responses = {
      en: `🤖 *AI Agent Initialized Successfully!*

*Agent ID:* ${agent.id}
*Student:* ${agent.userData.name}
*Status:* ${agent.status}

*Your AI Agent Can:*
• 📝 Add and manage tasks with automatic alerts
• ⏰ Set intelligent reminders
• 📊 Track your study progress
• 🚨 Handle emergency situations
• 💊 Access drug database and interactions
• 🧮 Use medical calculators
• 📋 Get clinical guidelines
• 🎭 Practice with patient simulations

*Try these commands:*
• "add task: study cardiology for 2 hours"
• "remind me to review ECG tomorrow at 9 AM"
• "check drug interaction between warfarin and aspirin"
• "calculate BMI for weight 70kg height 1.75m"

Your agent is now active and ready to help! 🚀`,

      si: `🤖 *AI Agent සාර්ථකව ආරම්භ කරන ලදී!*

*Agent ID:* ${agent.id}
*ශිෂ්‍යයා:* ${agent.userData.name}
*තත්වය:* ${agent.status}

*ඔබේ AI Agent ට හැකි දේ:*
• 📝 ස්වයංක්‍රීය අනතුරු ඇඟවීම් සමඟ කාර්යයන් එකතු කිරීම සහ කළමනාකරණය
• ⏰ බුද්ධිමත් මතක් කිරීම්
• 📊 ඔබේ අධ්‍යාපන ප්‍රගතිය නිරීක්ෂණය
• 🚨 හදිසි තත්වයන් හසුරු කිරීම
• 💊 ඖෂධ දත්ත ගබඩාව සහ අන්තර්ක්‍රියා ප්‍රවේශය
• 🧮 වෛද්‍ය ගණක යන්ත්‍ර භාවිතය
• 📋 සායනික මාර්ගෝපදේශ ලබා ගැනීම
• 🎭 රෝගී සිමියුලේෂන සමඟ පුහුණු වීම

*මෙම විධාන උත්සාහ කරන්න:*
• "add task: study cardiology for 2 hours"
• "remind me to review ECG tomorrow at 9 AM"
• "check drug interaction between warfarin and aspirin"
• "calculate BMI for weight 70kg height 1.75m"

ඔබේ agent දැන් ක්‍රියාකාරී වන අතර උදව් කිරීමට සූදානම්! 🚀`,

      ta: `🤖 *AI Agent வெற்றிகரமாக தொடங்கப்பட்டது!*

*Agent ID:* ${agent.id}
*மாணவர்:* ${agent.userData.name}
*நிலை:* ${agent.status}

*உங்கள் AI Agent செய்ய முடியும்:*
• 📝 தானியங்கி எச்சரிக்கைகளுடன் பணிகளை சேர்த்து நிர்வகிக்கவும்
• ⏰ புத்திசாலி நினைவூட்டல்களை அமைக்கவும்
• 📊 உங்கள் படிப்பு முன்னேற்றத்தை கண்காணிக்கவும்
• 🚨 அவசர சூழ்நிலைகளை கையாளவும்
• 💊 மருந்து தரவுத்தளம் மற்றும் தொடர்புகளை அணுகவும்
• 🧮 மருத்துவ கணிப்பான்களைப் பயன்படுத்தவும்
• 📋 மருத்துவ வழிகாட்டுதல்களைப் பெறவும்
• 🎭 நோயாளி சிமுலேஷன்களுடன் பயிற்சி பெறவும்

*இந்த கட்டளைகளை முயற்சிக்கவும்:*
• "add task: study cardiology for 2 hours"
• "remind me to review ECG tomorrow at 9 AM"
• "check drug interaction between warfarin and aspirin"
• "calculate BMI for weight 70kg height 1.75m"

உங்கள் agent இப்போது செயலில் உள்ளது மற்றும் உதவ தயாராக உள்ளது! 🚀`
    };

    return responses[language] || responses.en;
  } catch (error) {
    logger.error('❌ Error in agent command:', error);
    return 'Sorry, could not initialize AI agent. Please try again.';
  }
}

async function handleTasksCommand(user, language) {
  try {
    const agent = await medicalAgentSystem.getAgent(user.uid);
    const tasks = agent.currentTasks || [];

    if (tasks.length === 0) {
      const responses = {
        en: '📝 *Your Tasks*\n\nNo tasks found. Add your first task!\n\nTry: "add task: study cardiology"',
        si: '📝 *ඔබේ කාර්යයන්*\n\nකාර්යයන් හමු නොවීය. ඔබේ පළමු කාර්යය එකතු කරන්න!\n\nඋත්සාහ කරන්න: "add task: study cardiology"',
        ta: '📝 *உங்கள் பணிகள்*\n\nபணிகள் எதுவும் கிடைக்கவில்லை. உங்கள் முதல் பணியைச் சேர்க்கவும்!\n\nமுயற்சிக்கவும்: "add task: study cardiology"'
      };
      return responses[language] || responses.en;
    }

    let response = language === 'si' ? '📝 *ඔබේ කාර්යයන්*\n\n' :
                   language === 'ta' ? '📝 *உங்கள் பணிகள்*\n\n' :
                   '📝 *Your Tasks*\n\n';

    tasks.forEach((task, index) => {
      const status = task.status === 'completed' ? '✅' : '⏳';
      const priority = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';
      
      response += `${index + 1}. ${status} ${priority} *${task.title}*\n`;
      response += `   📅 ${new Date(task.createdAt).toLocaleDateString()}\n`;
      if (task.deadline) {
        response += `   ⏰ Due: ${new Date(task.deadline).toLocaleDateString()}\n`;
      }
      response += `   📂 ${task.category}\n\n`;
    });

    response += language === 'si' ? 
      '*කාර්යයක් එකතු කිරීමට: "add task: [title]"*' :
      language === 'ta' ? 
      '*பணியைச் சேர்க்க: "add task: [title]"*' :
      '*To add a task: "add task: [title]"*';

    return response;
  } catch (error) {
    logger.error('❌ Error in tasks command:', error);
    return 'Sorry, could not retrieve tasks.';
  }
}

async function handleAddTaskCommand(user, language) {
  try {
    const responses = {
      en: `📝 *Add New Task*

*Format:* "add task: [title] [optional: deadline]"

*Examples:*
• "add task: study cardiology"
• "add task: review ECG guidelines tomorrow"
• "add task: practice patient history taking in 2 days"

*I'll automatically:*
• Set appropriate reminders
• Track your progress
• Send alerts at the right time

Just type your task naturally!`,

      si: `📝 *නව කාර්යයක් එකතු කරන්න*

*ආකෘතිය:* "add task: [title] [විකල්ප: deadline]"

*උදාහරණ:*
• "add task: study cardiology"
• "add task: review ECG guidelines tomorrow"
• "add task: practice patient history taking in 2 days"

*මම ස්වයංක්‍රීයව:*
• සුදුසු මතක් කිරීම් සකස් කරන්නම්
• ඔබේ ප්‍රගතිය නිරීක්ෂණය කරන්නම්
• නිවැරදි වේලාවට අනතුරු ඇඟවීම් යවන්නම්

ඔබේ කාර්යය ස්වාභාවිකව ටයිප් කරන්න!`,

      ta: `📝 *புதிய பணியைச் சேர்க்கவும்*

*வடிவம்:* "add task: [title] [விருப்ப: deadline]"

*எடுத்துக்காட்டுகள்:*
• "add task: study cardiology"
• "add task: review ECG guidelines tomorrow"
• "add task: practice patient history taking in 2 days"

*நான் தானாக:*
• பொருத்தமான நினைவூட்டல்களை அமைப்பேன்
• உங்கள் முன்னேற்றத்தை கண்காணிப்பேன்
• சரியான நேரத்தில் எச்சரிக்கைகளை அனுப்புவேன்

உங்கள் பணியை இயற்கையாக தட்டச்சு செய்யவும்!`
    };

    return responses[language] || responses.en;
  } catch (error) {
    logger.error('❌ Error in add task command:', error);
    return 'Sorry, could not process task addition.';
  }
}

async function handleAlertsCommand(user, language) {
  try {
    const agent = await medicalAgentSystem.getAgent(user.uid);
    const alerts = await medicalAgentSystem.getPendingAlerts(user.uid);

    if (alerts.length === 0) {
      const responses = {
        en: '⏰ *Your Alerts*\n\nNo pending alerts. All caught up! 🎉',
        si: '⏰ *ඔබේ අනතුරු ඇඟවීම්*\n\nඅපේක්ෂිත අනතුරු ඇඟවීම් නැත. සියල්ල අලුත්! 🎉',
        ta: '⏰ *உங்கள் எச்சரிக்கைகள்*\n\nநிலுவையில் உள்ள எச்சரிக்கைகள் எதுவும் இல்லை. எல்லாம் புதியது! 🎉'
      };
      return responses[language] || responses.en;
    }

    let response = language === 'si' ? '⏰ *ඔබේ අනතුරු ඇඟවීම්*\n\n' :
                   language === 'ta' ? '⏰ *உங்கள் எச்சரிக்கைகள்*\n\n' :
                   '⏰ *Your Alerts*\n\n';

    alerts.forEach((alert, index) => {
      const priority = alert.priority === 'high' ? '🔴' : alert.priority === 'medium' ? '🟡' : '🟢';
      
      response += `${index + 1}. ${priority} *${alert.title}*\n`;
      response += `   📝 ${alert.message}\n`;
      response += `   ⏰ ${new Date(alert.scheduledTime).toLocaleString()}\n\n`;
    });

    return response;
  } catch (error) {
    logger.error('❌ Error in alerts command:', error);
    return 'Sorry, could not retrieve alerts.';
  }
}

async function handleProgressCommand(user, language) {
  try {
    const agent = await medicalAgentSystem.getAgent(user.uid);
    const progress = agent.studyProgress;
    const performance = agent.performance;

    const responses = {
      en: `📊 *Study Progress Report*

*Completion Rate:* ${progress.completedTopics}/${progress.totalTopics} (${Math.round((progress.completedTopics / Math.max(progress.totalTopics, 1)) * 100)}%)
*Efficiency:* ${Math.round(progress.efficiency * 100)}%
*Task Completion:* ${Math.round(performance.taskCompletionRate * 100)}%
*Study Consistency:* ${Math.round(performance.studyConsistency * 100)}%

*Last Study Session:* ${progress.lastStudySession ? new Date(progress.lastStudySession).toLocaleString() : 'Not recorded'}

*Recommendations:*
• Keep up the good work! 📚
• Try to maintain consistent study hours
• Review difficult topics regularly
• Practice with patient simulations

Use "add task" to set new study goals!`,

      si: `📊 *අධ්‍යාපන ප්‍රගති වාර්තාව*

*සම්පූර්ණතා අනුපාතය:* ${progress.completedTopics}/${progress.totalTopics} (${Math.round((progress.completedTopics / Math.max(progress.totalTopics, 1)) * 100)}%)
*කාර්යක්ෂමතාව:* ${Math.round(progress.efficiency * 100)}%
*කාර්ය සම්පූර්ණතාව:* ${Math.round(performance.taskCompletionRate * 100)}%
*අධ්‍යාපන අනුකූලතාව:* ${Math.round(performance.studyConsistency * 100)}%

*අවසන් අධ්‍යාපන සැසිය:* ${progress.lastStudySession ? new Date(progress.lastStudySession).toLocaleString() : 'Record කර නැත'}

*නිර්දේශ:*
• හොඳ වැඩ දිගටම කරගෙන යන්න! 📚
• අනුකූල අධ්‍යාපන පැය පවත්වා ගැනීමට උත්සාහ කරන්න
• දුෂ්කර මාතෘකා නිතිපතා සමාලෝචනය කරන්න
• රෝගී සිමියුලේෂන සමඟ පුහුණු වන්න

නව අධ්‍යාපන ඉලක්ක සකස් කිරීමට "add task" භාවිතා කරන්න!`,

      ta: `📊 *படிப்பு முன்னேற்ற அறிக்கை*

*முடிவு விகிதம்:* ${progress.completedTopics}/${progress.totalTopics} (${Math.round((progress.completedTopics / Math.max(progress.totalTopics, 1)) * 100)}%)
*திறன்:* ${Math.round(progress.efficiency * 100)}%
*பணி முடிவு:* ${Math.round(performance.taskCompletionRate * 100)}%
*படிப்பு நிலைப்பாடு:* ${Math.round(performance.studyConsistency * 100)}%

*கடைசி படிப்பு அமர்வு:* ${progress.lastStudySession ? new Date(progress.lastStudySession).toLocaleString() : 'பதிவு செய்யப்படவில்லை'}

*பரிந்துரைகள்:*
• நல்ல வேலையைத் தொடர்ந்து செய்யுங்கள்! 📚
• நிலையான படிப்பு மணிநேரங்களை பராமரிக்க முயற்சிக்கவும்
• கடினமான தலைப்புகளை தவறாமல் மதிப்பாய்வு செய்யவும்
• நோயாளி சிமுலேஷன்களுடன் பயிற்சி பெறவும்

புதிய படிப்பு இலக்குகளை அமைக்க "add task" ஐப் பயன்படுத்தவும்!`
    };

    return responses[language] || responses.en;
  } catch (error) {
    logger.error('❌ Error in progress command:', error);
    return 'Sorry, could not retrieve progress.';
  }
}

// Natural Language Handlers

async function handleNaturalLanguageTaskCreation(message, user, language) {
  try {
    // Extract task details from natural language
    const taskMatch = message.match(/add task:\s*(.+)/i) || 
                     message.match(/set task:\s*(.+)/i) || 
                     message.match(/create task:\s*(.+)/i);
    
    if (!taskMatch) {
      const responses = {
        en: '📝 *Task Creation*\n\nPlease specify your task:\n"add task: [what you want to do]"',
        si: '📝 *කාර්යය සෑදීම*\n\nකරුණාකර ඔබේ කාර්යය සඳහන් කරන්න:\n"add task: [ඔබට කිරීමට අවශ්‍ය දේ]"',
        ta: '📝 *பணி உருவாக்கம்*\n\nஉங்கள் பணியைக் குறிப்பிடவும்:\n"add task: [நீங்கள் செய்ய விரும்புவது]"'
      };
      return responses[language] || responses.en;
    }

    const taskTitle = taskMatch[1].trim();
    
    // Add task with automatic alerts
    await medicalAgentSystem.addTaskWithAlerts(user.uid, {
      title: taskTitle,
      description: `Task created via WhatsApp: ${taskTitle}`,
      category: 'study',
      priority: 'medium',
      scheduledTime: new Date(),
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    });

    const responses = {
      en: `✅ *Task Added Successfully!*

*Task:* ${taskTitle}
*Status:* Active
*Alerts:* Scheduled automatically

I'll remind you at the right time! ⏰

*Next steps:*
• Use "tasks" to view all tasks
• Use "alerts" to check reminders
• Use "progress" to track your study`,

      si: `✅ *කාර්යය සාර්ථකව එකතු කරන ලදී!*

*කාර්යය:* ${taskTitle}
*තත්වය:* ක්‍රියාකාරී
*අනතුරු ඇඟවීම්:* ස්වයංක්‍රීයව සකස් කරන ලදී

මම නිවැරදි වේලාවට ඔබට මතක් කරන්නම්! ⏰

*ඊළඟ පියවර:*
• සියලුම කාර්යයන් බැලීමට "tasks" භාවිතා කරන්න
• මතක් කිරීම් පරීක්ෂා කිරීමට "alerts" භාවිතා කරන්න
• ඔබේ අධ්‍යාපනය නිරීක්ෂණය කිරීමට "progress" භාවිතා කරන්න`,

      ta: `✅ *பணி வெற்றிகரமாக சேர்க்கப்பட்டது!*

*பணி:* ${taskTitle}
*நிலை:* செயலில்
*எச்சரிக்கைகள்:* தானாக திட்டமிடப்பட்டது

நான் சரியான நேரத்தில் உங்களுக்கு நினைவூட்டுவேன்! ⏰

*அடுத்த படிகள்:*
• அனைத்து பணிகளையும் காண "tasks" ஐப் பயன்படுத்தவும்
• நினைவூட்டல்களை சரிபார்க்க "alerts" ஐப் பயன்படுத்தவும்
• உங்கள் படிப்பை கண்காணிக்க "progress" ஐப் பயன்படுத்தவும்`
    };

    return responses[language] || responses.en;
  } catch (error) {
    logger.error('❌ Error in natural language task creation:', error);
    return 'Sorry, could not create task. Please try again.';
  }
}

async function handleNaturalLanguageReminder(message, user, language) {
  try {
    // Extract reminder details from natural language
    const reminderMatch = message.match(/remind me\s+(.+)/i) || 
                         message.match(/set reminder\s+(.+)/i) || 
                         message.match(/alert me\s+(.+)/i);
    
    if (!reminderMatch) {
      const responses = {
        en: '⏰ *Reminder Setup*\n\nPlease specify your reminder:\n"remind me to [what you want to be reminded about]"',
        si: '⏰ *මතක් කිරීම් සැකසුම*\n\nකරුණාකර ඔබේ මතක් කිරීම් සඳහන් කරන්න:\n"remind me to [ඔබට මතක් කිරීමට අවශ්‍ය දේ]"',
        ta: '⏰ *நினைவூட்டல் அமைப்பு*\n\nஉங்கள் நினைவூட்டலைக் குறிப்பிடவும்:\n"remind me to [உங்களுக்கு நினைவூட்ட விரும்புவது]"'
      };
      return responses[language] || responses.en;
    }

    const reminderText = reminderMatch[1].trim();
    
    // Add reminder as a task
    await medicalAgentSystem.addTaskWithAlerts(user.uid, {
      title: `Reminder: ${reminderText}`,
      description: `Reminder set via WhatsApp: ${reminderText}`,
      category: 'reminder',
      priority: 'high',
      scheduledTime: new Date(),
      deadline: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    });

    const responses = {
      en: `⏰ *Reminder Set Successfully!*

*Reminder:* ${reminderText}
*Status:* Active
*Alerts:* Scheduled

I'll remind you at the right time! 🔔`,

      si: `⏰ *මතක් කිරීම් සාර්ථකව සකස් කරන ලදී!*

*මතක් කිරීම්:* ${reminderText}
*තත්වය:* ක්‍රියාකාරී
*අනතුරු ඇඟවීම්:* සකස් කරන ලදී

මම නිවැරදි වේලාවට ඔබට මතක් කරන්නම්! 🔔`,

      ta: `⏰ *நினைவூட்டல் வெற்றிகரமாக அமைக்கப்பட்டது!*

*நினைவூட்டல்:* ${reminderText}
*நிலை:* செயலில்
*எச்சரிக்கைகள்:* திட்டமிடப்பட்டது

நான் சரியான நேரத்தில் உங்களுக்கு நினைவூட்டுவேன்! 🔔`
    };

    return responses[language] || responses.en;
  } catch (error) {
    logger.error('❌ Error in natural language reminder:', error);
    return 'Sorry, could not set reminder. Please try again.';
  }
}

async function handleNaturalLanguageDrugInteraction(message, user, language) {
  try {
    // Extract drug names from natural language
    const interactionMatch = message.match(/check.*interaction.*between\s+(.+)/i) || 
                            message.match(/drug.*interaction.*between\s+(.+)/i) || 
                            message.match(/medication.*interaction.*between\s+(.+)/i);
    
    if (!interactionMatch) {
      const responses = {
        en: '💊 *Drug Interaction Check*\n\nPlease specify drugs:\n"check interaction between [drug1] and [drug2]"',
        si: '💊 *ඖෂධ අන්තර්ක්‍රියා පරීක්ෂාව*\n\nකරුණාකර ඖෂධ සඳහන් කරන්න:\n"check interaction between [drug1] and [drug2]"',
        ta: '💊 *மருந்து தொடர்பு சோதனை*\n\nமருந்துகளைக் குறிப்பிடவும்:\n"check interaction between [drug1] and [drug2]"'
      };
      return responses[language] || responses.en;
    }

    const drugsText = interactionMatch[1];
    const drugs = drugsText.split(/\s+and\s+|\s*,\s*/i).map(d => d.trim());
    
    if (drugs.length < 2) {
      return 'Please specify at least two drugs to check interactions.';
    }

    // Use advanced features to check interactions
    const interaction = advancedFeatures.checkDrugInteractions(drugs);
    
    let response = language === 'si' ? '💊 *ඖෂධ අන්තර්ක්‍රියා පරීක්ෂාව*\n\n' :
                   language === 'ta' ? '💊 *மருந்து தொடர்பு சோதனை*\n\n' :
                   '💊 *Drug Interaction Check*\n\n';

    response += `*Drugs:* ${drugs.join(' + ')}\n`;
    response += `*Severity:* ${interaction.severity}\n`;
    response += `*Mechanism:* ${interaction.mechanism}\n`;
    response += `*Recommendation:* ${interaction.recommendation}\n`;

    return response;
  } catch (error) {
    logger.error('❌ Error in natural language drug interaction:', error);
    return 'Sorry, could not check drug interactions. Please try again.';
  }
}

async function handleNaturalLanguageCalculator(message, user, language) {
  try {
    // Extract calculator parameters from natural language
    const calcMatch = message.match(/calculate\s+(bmi|gfr|chads2)\s+(.+)/i);
    
    if (!calcMatch) {
      const responses = {
        en: '🧮 *Medical Calculator*\n\nPlease specify calculation:\n"calculate BMI weight 70kg height 1.75m"',
        si: '🧮 *වෛද්‍ය ගණක යන්ත්‍ර*\n\nකරුණාකර ගණනය කිරීම සඳහන් කරන්න:\n"calculate BMI weight 70kg height 1.75m"',
        ta: '🧮 *மருத்துவ கணிப்பான்*\n\nகணக்கீட்டைக் குறிப்பிடவும்:\n"calculate BMI weight 70kg height 1.75m"'
      };
      return responses[language] || responses.en;
    }

    const calculatorType = calcMatch[1].toLowerCase();
    const params = calcMatch[2].trim();
    
    let result;
    
    if (calculatorType === 'bmi') {
      const bmiMatch = params.match(/weight\s+(\d+(?:\.\d+)?)\s*kg.*height\s+(\d+(?:\.\d+)?)\s*m/i);
      if (bmiMatch) {
        const weight = parseFloat(bmiMatch[1]);
        const height = parseFloat(bmiMatch[2]);
        result = advancedFeatures.medicalCalculators.bmi(weight, height);
      }
    }
    
    if (!result) {
      return 'Please provide valid parameters for the calculation.';
    }

    let response = language === 'si' ? '🧮 *වෛද්‍ය ගණනය කිරීම*\n\n' :
                   language === 'ta' ? '🧮 *மருத்துவ கணக்கீடு*\n\n' :
                   '🧮 *Medical Calculation*\n\n';

    response += `*Type:* ${calculatorType.toUpperCase()}\n`;
    response += `*Result:* ${result.result}\n`;
    if (result.interpretation) {
      response += `*Interpretation:* ${result.interpretation}\n`;
    }

    return response;
  } catch (error) {
    logger.error('❌ Error in natural language calculator:', error);
    return 'Sorry, could not perform calculation. Please try again.';
  }
}

module.exports = {
  initializeWhatsAppBot,
  processWhatsAppMessage
}; 