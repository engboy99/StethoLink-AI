const TelegramBot = require('node-telegram-bot-api');
const { logger, medicalLogger } = require('../utils/logger');
const ai = require('../services/ai');
const { saveConversation, saveCase, getUser, createUser, updateUser, logAnalytics, getDb } = require('../config/firebase');
const { encryptData, decryptData } = require('../utils/encryption');
const advancedFeatures = require('../services/advanced-features');
const simulationManager = require('../services/simulation-manager');
const medicalAgentSystem = require('../services/medical-agent-system');
const notebookService = require('../services/notebook-service');

let bot;
let webhookSecret;

// Initialize Telegram bot
function initializeTelegramBot() {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN not found in environment variables');
    }

    // Medical agent system is already initialized as a singleton

    // For webhook mode (production)
    if (process.env.NODE_ENV === 'production') {
      bot = new TelegramBot(token, { webHook: { port: 8443 } });
      bot.setWebHook(`${process.env.BASE_URL}/webhook/telegram/${token}`);
    } else {
      // For polling mode (development) with better error handling
      bot = new TelegramBot(token, { 
        polling: true,
        request: {
          timeout: 30000, // 30 second timeout
          connect_timeout: 30000,
          retry: 3 // Retry failed requests
        }
      });
      
      // Add error handling for polling
      bot.on('polling_error', (error) => {
        logger.error('❌ Telegram polling error:', error);
        
        // Don't crash the server, just log the error
        if (error.code === 'EFATAL') {
          logger.warn('⚠️ Network connectivity issue with Telegram API. Bot will retry automatically.');
        }
      });
      
      // Add connection success handler
      bot.on('polling_start', () => {
        logger.info('✅ Telegram bot polling started successfully');
      });
    }

    webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    
    // Set up message handlers
    setupMessageHandlers();
    
    // Make bot globally available for alert processor
    global.bot = bot;
    
    logger.info('✅ Telegram bot initialized successfully with AI Agent System');
  } catch (error) {
    logger.error('❌ Error initializing Telegram bot:', error);
    // Don't throw error, let the server continue without Telegram
    logger.warn('⚠️ Telegram bot initialization failed, but server will continue running');
  }
}

// Enhanced welcome messages with AI Agent capabilities
const WELCOME_MESSAGES = {
  en: `🏥 *Welcome to StethoLink AI - Professional Medical Assistant*

I'm Dr. StethoLink, your intelligent AI medical assistant for Sri Lankan medical students.

**Before we begin, I need to know your name for personalized assistance.**

*Please provide your full name (e.g., "My name is John Smith" or "I'm Dr. Sarah Perera")*

*I'll address you as Dr. [Your Name] throughout our interactions for a professional experience.*

---

**🔬 What I can do for you:**

**📚 Study Management:**
• "Study cardiology at 5:30 PM"
• "Add task: review ECG cases tomorrow"
• "Remind me to practice drug calculations"

**🧮 Medical Tools:**
• "Calculate BMI for 70kg 1.75m"
• "Check drug interaction between warfarin and aspirin"
• "Find information about paracetamol"

**🎭 Clinical Practice:**
• "Start patient simulation"
• "Show me emergency protocols"
• "Practice cardiology cases"

**📊 Progress Tracking:**
• "Show my study progress"
• "What tasks do I have today?"
• "Check my alerts"

**📖 Quick Access:**
• /guide - View comprehensive user guide
• /help - See all available commands
• /agent - Initialize your personal AI agent

*Type naturally - I understand medical terminology and provide professional assistance.*
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
• /agent - ඔබේ පුද්ගලික AI agent ආරම්භ කරන්න
• /tasks - ඔබේ කාර්යයන් බලන්න සහ කළමනාකරණය කරන්න
• /addtask - ස්වයංක්‍රීය අනතුරු ඇඟවීම් සමඟ නව කාර්යයක් එකතු කරන්න
• /alerts - ඔබේ අපේක්ෂිත අනතුරු ඇඟවීම් පරීක්ෂා කරන්න
• /progress - ඔබේ අධ්‍යාපන ප්‍රගතිය බලන්න
• /calculator - වෛද්‍ය ගණක යන්ත්‍ර
• /drugs - ඖෂධ දත්ත ගබඩාව
• /simulate - රෝගී සිමියුලේෂනය
• /help - සියලුම විශේෂාංග පෙන්වන්න

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
• /agent - உங்கள் தனிப்பட்ட AI agent ஐத் தொடங்கவும்
• /tasks - உங்கள் பணிகளைக் காண்க மற்றும் நிர்வகிக்கவும்
• /addtask - தானியங்கி எச்சரிக்கைகளுடன் புதிய பணியைச் சேர்க்கவும்
• /alerts - உங்கள் நிலுவையில் உள்ள எச்சரிக்கைகளைச் சரிபார்க்கவும்
• /progress - உங்கள் படிப்பு முன்னேற்றத்தைக் காண்க
• /calculator - மருத்துவ கணிப்பான்கள்
• /drugs - மருந்து தரவுத்தளம்
• /simulate - நோயாளி சிமுலேஷன்
• /help - அனைத்து அம்சங்களையும் காட்டு

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

// Set up message handlers
function setupMessageHandlers() {
  // Handle /start command
  bot.onText(/\/start/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      logger.info('📲 Telegram /start command received', { chatId, userId });
      
      // Get or create user
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      // Update user activity
      await updateUser(user.uid, {
        'stats.lastActive': new Date(),
        platform: 'telegram'
      });

      const welcomeMessage = WELCOME_MESSAGES[user.language] || WELCOME_MESSAGES.en;
      await sendTelegramMessage(chatId, welcomeMessage);

      // Log analytics
      await logAnalytics({
        event: 'telegram_start_command',
        userId: user.uid,
        platform: 'telegram',
        language: user.language || 'en'
      });

    } catch (error) {
      logger.error('❌ Error handling /start command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, something went wrong. Please try again.');
    }
  });

  // Handle /help command
  bot.onText(/\/help/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      const user = await getUserByTelegramId(userId);
      const helpMessage = HELP_MESSAGES[user?.language] || HELP_MESSAGES.en;
      
      await sendTelegramMessage(chatId, helpMessage);
    } catch (error) {
      logger.error('❌ Error handling /help command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, could not load help. Please try again.');
    }
  });

  // Handle /simulate command
  bot.onText(/\/simulate/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      // Get or create user automatically
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleSimulationCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /simulate command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, simulation is currently unavailable.');
    }
  });

  // Handle /endsim command
  bot.onText(/\/endsim/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      // Get or create user automatically
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleEndSimulationCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /endsim command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, could not end simulation.');
    }
  });

  // Handle /diagnosis command
  bot.onText(/\/diagnosis/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      // Get or create user automatically
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleDiagnosisSubmissionCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /diagnosis command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, could not process diagnosis submission.');
    }
  });

  // Handle /history command
  bot.onText(/\/history/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      // Get or create user automatically
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleHistoryCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /history command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, could not retrieve case history.');
    }
  });

  // Handle /mentor command
  bot.onText(/\/mentor/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      const user = await getUserByTelegramId(userId);
      if (!user) {
        await sendTelegramMessage(chatId, 'Please start the bot first with /start');
        return;
      }

      const response = await handleMentorCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /mentor command:', error);
      await sendTelegramMessage(msg.chat.id, 'Keep studying hard, future doctor! 💪');
    }
  });

  // Handle /vault command
  bot.onText(/\/vault/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      const user = await getUserByTelegramId(userId);
      if (!user) {
        await sendTelegramMessage(chatId, 'Please start the bot first with /start');
        return;
      }

      const response = await handleVaultCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /vault command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, vault feature is currently unavailable.');
    }
  });

  // Handle /remindme command
  bot.onText(/\/remindme/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      const user = await getUserByTelegramId(userId);
      if (!user) {
        await sendTelegramMessage(chatId, 'Please start the bot first with /start');
        return;
      }

      const response = await handleReminderCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /remindme command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, reminder feature is currently unavailable.');
    }
  });

  // AI Agent Commands
  bot.onText(/\/agent/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleAgentCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /agent command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, agent initialization failed.');
    }
  });

  bot.onText(/\/tasks/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleTasksCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /tasks command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, could not retrieve tasks.');
    }
  });

  bot.onText(/\/addtask/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleAddTaskCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /addtask command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, could not add task.');
    }
  });

  bot.onText(/\/alerts/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleAlertsCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /alerts command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, could not retrieve alerts.');
    }
  });

  bot.onText(/\/progress/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleProgressCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /progress command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, could not retrieve progress.');
    }
  });

  // Handle text messages
  bot.on('message', async (msg) => {
    try {
      // Skip commands
      if (msg.text && msg.text.startsWith('/')) {
        return;
      }

      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const messageText = msg.text;
      
      logger.info('📲 Processing Telegram message', {
        chatId,
        userId,
        messageType: msg.voice ? 'voice' : 'text'
      });

      // Get or create user
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      // Update user activity
      await updateUser(user.uid, {
        'stats.lastActive': new Date(),
        platform: 'telegram'
      });

      let response;

      // Handle voice messages
      if (msg.voice) {
        response = await handleVoiceMessage(msg.voice, user, msg.message_id);
      } else if (messageText) {
        // Handle text messages
        response = await handleTextMessage(messageText, user, msg.message_id);
      }

      if (response) {
        await sendTelegramMessage(chatId, response);
      }

      // Log analytics
      await logAnalytics({
        event: 'telegram_message_processed',
        userId: user.uid,
        platform: 'telegram',
        messageType: msg.voice ? 'voice' : 'text',
        language: user.language || 'en'
      });

    } catch (error) {
      logger.error('❌ Error processing Telegram message:', error);
      medicalLogger.medicalError(error, {
        platform: 'telegram',
        operation: 'message_processing'
      });
      
      try {
        const errorMessage = {
          en: 'Sorry, I encountered an error. Please try again.',
          si: 'සමාවන්න, මට දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න.',
          ta: 'மன்னிக்கவும், நான் பிழையை எதிர்கொண்டேன். மீண்டும் முயற்சிக்கவும்.'
        };
        
        await sendTelegramMessage(msg.chat.id, 
          errorMessage[msg.from.language_code] || errorMessage.en);
      } catch (sendError) {
        logger.error('❌ Error sending error message:', sendError);
      }
    }
  });

  // Handle errors
  bot.on('error', (error) => {
    logger.error('❌ Telegram bot error:', error);
  });

  // Handle polling errors
  bot.on('polling_error', (error) => {
    logger.error('❌ Telegram polling error:', error);
  });

  // Advanced Features Commands
  bot.onText(/\/calculator/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleCalculatorCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /calculator command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, calculator is currently unavailable.');
    }
  });

  bot.onText(/\/drugs/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleDrugsCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /drugs command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, drug database is currently unavailable.');
    }
  });

  bot.onText(/\/guidelines/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleGuidelinesCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /guidelines command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, clinical guidelines are currently unavailable.');
    }
  });

  bot.onText(/\/interactions/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleInteractionsCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /interactions command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, drug interactions are currently unavailable.');
    }
  });

  bot.onText(/\/decision/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleDecisionCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /decision command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, clinical decision support is currently unavailable.');
    }
  });

  bot.onText(/\/education/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleEducationCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /education command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, patient education is currently unavailable.');
    }
  });

  bot.onText(/\/evidence/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      
      let user = await getUserByTelegramId(userId);
      if (!user) {
        user = await createTelegramUser(msg.from);
      }

      const response = await handleEvidenceCommand(user, user.language || 'en');
      await sendTelegramMessage(chatId, response);

    } catch (error) {
      logger.error('❌ Error handling /evidence command:', error);
      await sendTelegramMessage(msg.chat.id, 'Sorry, evidence-based medicine search is currently unavailable.');
    }
  });
}

// Handle text messages
async function handleTextMessage(message, user, messageId) {
  const command = message.trim().toLowerCase();
  const language = user.language || 'en';

  // Save conversation
  await saveConversation({
    userId: user.uid,
    platform: 'telegram',
    messageId: messageId,
    userMessage: message,
    timestamp: new Date()
  });

  // Check if user is in an active simulation
  const simulationStatus = simulationManager.getSimulationStatus(user.uid);
  if (simulationStatus) {
    // User is in simulation - treat message as question to patient
    const simulationResponse = simulationManager.handleQuestion(user.uid, message, language);
    
    if (simulationResponse.isSimulationActive) {
      return `👤 *Patient Response:*
${simulationResponse.response}

*Continue asking questions to gather more information about the patient's condition.*`;
    }
  }

  // Enhanced intelligent command detection with AI Agent capabilities
  const lowerMessage = message.toLowerCase().trim();
  
  // AI Agent Natural Language Commands - PRIORITY 1
  if (lowerMessage.includes('add task') || lowerMessage.includes('set task') || lowerMessage.includes('create task') || 
      lowerMessage.includes('study') && (lowerMessage.includes('at') || lowerMessage.includes('on') || lowerMessage.includes('by'))) {
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
  
  // Notebook commands
  if (lowerMessage.includes('add note') || lowerMessage.includes('new note') || lowerMessage.includes('create note')) {
    return await handleAddNoteCommand(message, user, language);
  }
  
  if (lowerMessage.includes('my notes') || lowerMessage.includes('show notes') || lowerMessage.includes('list notes')) {
    return await handleNotesCommand(user, language);
  }
  
  if (lowerMessage.includes('search notes') || lowerMessage.includes('find note')) {
    return await handleSearchNotesCommand(message, user, language);
  }
  
  // Dashboard access
  if (lowerMessage.includes('dashboard') || lowerMessage.includes('web app') || lowerMessage.includes('open dashboard')) {
    return await handleDashboardCommand(user, language);
  }
  
  // User guide
  if (lowerMessage.includes('guide') || lowerMessage.includes('user guide') || lowerMessage.includes('help guide')) {
    return await handleUserGuideCommand(user, language);
  }
  
  // Name handling
  if (lowerMessage.includes('my name is') || lowerMessage.includes("i'm ") || lowerMessage.includes('i am ') || 
      lowerMessage.includes('call me') || lowerMessage.includes('this is ')) {
    return await handleNameCommand(message, user, language);
  }
  
  // Drug interaction queries
  if (lowerMessage.includes('drug interaction') || lowerMessage.includes('check interaction') || lowerMessage.includes('medication interaction')) {
    return await handleNaturalLanguageDrugInteraction(message, user, language);
  }
  
  // Calculator queries
  if (lowerMessage.includes('calculate') || lowerMessage.includes('bmi') || lowerMessage.includes('gfr') || lowerMessage.includes('chads2')) {
    return await handleNaturalLanguageCalculator(message, user, language);
  }
  
  // Drug categories and medications
  if (['antibiotics', 'analgesics', 'antihypertensives', 'antidiabetics', 'antimalarials', 'doxycycline', 'paracetamol', 'ibuprofen'].includes(lowerMessage)) {
    return await handleDrugCategoryRequest(lowerMessage, user, language);
  }
  
  // Calculator types
  if (['bmi', 'gfr', 'chads2', 'fev1', 'creatinine', 'pediatric', 'gcs', 'apache'].includes(lowerMessage)) {
    return await handleCalculatorTypeRequest(lowerMessage, user, language);
  }
  
  // Medical conditions for guidelines
  if (['dengue', 'leptospirosis', 'tb', 'malaria', 'diabetes', 'hypertension', 'gastroenteritis'].includes(lowerMessage)) {
    return await handleGuidelineRequest(lowerMessage, user, language);
  }
  
  // Common medical terms that should trigger specific responses
  if (['help', 'commands', 'menu', 'start'].includes(lowerMessage)) {
    return await handleHelpRequest(user, language);
  }
  
  // Specific symptom queries that should get detailed responses
  if (['loose motion', 'diarrhea', 'vomiting', 'fever', 'headache', 'cough'].includes(lowerMessage)) {
    return await handleDiagnosisRequest(message, user, language);
  }

  // Handle symptoms for diagnosis (longer messages)
  if (message.length > 10) {
    return await handleDiagnosisRequest(message, user, language);
  }

  // Handle note confirmation and interactive commands
  if (lowerMessage.startsWith('title:') || lowerMessage.startsWith('category:') || 
      lowerMessage.startsWith('tags:') || lowerMessage.startsWith('priority:')) {
    return await handleNoteConfirmation(message, user, language);
  }
  
  // Default response for unrecognized short messages
  const defaultResponses = {
    en: `🤖 *I'm here to help with your medical studies!*

💡 *Try these examples:*

**📚 Study Tasks:**
• "Study cardiology at 6 PM"
• "Add task: review ECG cases tomorrow"
• "Remind me to practice drug calculations"

**🧮 Medical Tools:**
• "Calculate BMI for 70kg 1.75m"
• "Check drug interaction between warfarin and aspirin"
• "Find information about paracetamol"

**🎭 Clinical Practice:**
• "Start patient simulation"
• "Show me emergency protocols"
• "Practice cardiology cases"

**📊 Progress:**
• "Show my study progress"
• "What tasks do I have today?"
• "Check my alerts"

*Just type naturally - I understand medical terminology!* 🚀`,
    si: `🤖 *මම ඔබේ වෛද්‍ය අධ්‍යාපනයට උදව් කිරීමට මෙහි සිටිමි!*

💡 *මෙම උදාහරණ උත්සාහ කරන්න:*

**📚 අධ්‍යාපන කාර්යයන්:**
• "Study cardiology at 6 PM"
• "Add task: review ECG cases tomorrow"
• "Remind me to practice drug calculations"

**🧮 වෛද්‍ය මෙවලම්:**
• "Calculate BMI for 70kg 1.75m"
• "Check drug interaction between warfarin and aspirin"
• "Find information about paracetamol"

*ස්වභාවිකව ටයිප් කරන්න - මම වෛද්‍ය භාෂාව තේරුම් ගනිමි!* 🚀`,
    ta: `🤖 *நான் உங்கள் மருத்துவ படிப்புக்கு உதவ இங்கே இருக்கிறேன்!*

💡 *இந்த எடுத்துக்காட்டுகளை முயற்சிக்கவும்:*

**📚 படிப்பு பணிகள்:**
• "Study cardiology at 6 PM"
• "Add task: review ECG cases tomorrow"
• "Remind me to practice drug calculations"

**🧮 மருத்துவ கருவிகள்:**
• "Calculate BMI for 70kg 1.75m"
• "Check drug interaction between warfarin and aspirin"
• "Find information about paracetamol"

*இயற்கையாக தட்டச்சு செய்யுங்கள் - நான் மருத்துவ சொற்களை புரிந்துகொள்கிறேன்!* 🚀`
  };

  return defaultResponses[language] || defaultResponses.en;
}

// Handle voice messages
async function handleVoiceMessage(voice, user, messageId) {
  try {
    logger.info('🎤 Processing voice message from Telegram', { userId: user.uid });
    
    // Get voice file
    const file = await bot.getFile(voice.file_id);
    const audioBuffer = await downloadAudioFile(file.file_path);
    
    // Process with Whisper
    const transcription = await ai.processVoiceMessage(audioBuffer, user.language || 'en');
    
    // Save voice message
    await saveVoiceMessage({
      userId: user.uid,
      platform: 'telegram',
      messageId: messageId,
      fileId: voice.file_id,
      transcription: transcription.text,
      language: transcription.language,
      processingTime: transcription.processingTime
    });

    // Generate diagnosis from transcribed text
    const diagnosis = await ai.generateDiagnosis(
      transcription.text, 
      transcription.language, 
      user.uid
    );

    // Save case
    await saveCase({
      userId: user.uid,
      platform: 'telegram',
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
    
    const diagnosis = await ai.generateDiagnosis(symptoms, language, user.uid);
    
    // Save case
    await saveCase({
      userId: user.uid,
      platform: 'telegram',
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
    
    // Provide fallback responses when OpenAI is not available
    const fallbackResponses = {
      en: `🏥 *Medical Analysis (Basic)*

Based on your symptoms: "${symptoms}"

*General Advice:*
• Monitor your symptoms closely
• Stay hydrated and rest well
• Contact a healthcare provider if symptoms worsen
• Keep track of your temperature if you have fever

*For Fever:*
• Take paracetamol if needed
• Stay cool and hydrated
• Seek medical attention if fever is high (>39°C) or persistent

*Note:* This is basic guidance. For accurate diagnosis, please consult a healthcare professional.`,
      
      si: `🏥 *වෛද්‍ය විශ්ලේෂණය (මූලික)*

ඔබේ රෝග ලක්ෂණ: "${symptoms}"

*සාමාන්‍ය උපදෙස්:*
• ඔබේ රෝග ලක්ෂණ සමීපව නිරීක්ෂණය කරන්න
• ජලය බොන්න සහ හොඳින් විවේක ගන්න
• රෝග ලක්ෂණ උග්‍ර වුවහොත් සෞඛ්‍ය සේවා සපයන්නා සම්බන්ධ කරගන්න
• උණ තිබේ නම් ඔබේ උෂ්ණත්වය නිරීක්ෂණය කරන්න

*උණ සඳහා:*
• අවශ්‍ය නම් paracetamol ගන්න
• සිසිල්ව සිටින්න සහ ජලය බොන්න
• උණ ඉහළ (>39°C) හෝ තිරසාර නම් වෛද්‍ය උපකාර ලබාගන්න

*සටහන:* මෙය මූලික මඟපෙන්වීමකි. නිවැරදි විනිශ්චය සඳහා කරුණාකර සෞඛ්‍ය සේවා වෘත්තිකයෙකු සම්බන්ධ කරගන්න.`,
      
      ta: `🏥 *மருத்துவ பகுப்பாய்வு (அடிப்படை)*

உங்கள் அறிகுறிகள்: "${symptoms}"

*பொதுவான ஆலோசனை:*
• உங்கள் அறிகுறிகளை கவனமாக கண்காணிக்கவும்
• நீரேற்றம் செய்து நன்றாக ஓய்வெடுக்கவும்
• அறிகுறிகள் மோசமடைந்தால் சுகாதார வழங்குநரை தொடர்பு கொள்ளவும்
• காய்ச்சல் இருந்தால் உங்கள் வெப்பநிலையை கண்காணிக்கவும்

*காய்ச்சலுக்கு:*
• தேவைப்பட்டால் paracetamol எடுக்கவும்
• குளிர்ச்சியாக இருந்து நீரேற்றம் செய்யவும்
• காய்ச்சல் அதிகமாக (>39°C) அல்லது தொடர்ச்சியாக இருந்தால் மருத்துவ உதவி பெறவும்

*குறிப்பு:* இது அடிப்படை வழிகாட்டுதல். துல்லியமான கண்டறிதலுக்கு, தயவுசெய்து சுகாதார வல்லுநரை அணுகவும்.`
    };

    return fallbackResponses[language] || fallbackResponses.en;
  }
}

// Handle simulation command
async function handleSimulationCommand(user, language) {
  try {
    const conditions = [
      'Leptospirosis',
      'Dengue fever',
      'Typhoid fever',
      'Malaria',
      'Acute gastroenteritis',
      'Upper respiratory tract infection',
      'Hypertension',
      'Diabetes mellitus'
    ];

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Start simulation using the simulation manager
    const initialPresentation = simulationManager.startSimulation(user.uid, randomCondition, language, {
      age: Math.floor(Math.random() * 50) + 20,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      occupation: 'Farmer',
      location: 'Rural Sri Lanka'
    });

    const responses = {
      en: `🎭 *Patient Simulation Started*

${initialPresentation}

*Ask questions to the patient to gather more information about their condition!*

*Available commands:*
• /endsim - End current simulation
• /diagnosis - Submit your diagnosis
• /help - Show available commands`,
      
      si: `🎭 *රෝගී සිමියුලේෂනය ආරම්භ විය*

${initialPresentation}

*රෝගියාගේ තත්වය ගැන වැඩිදුර තොරතුරු ලබා ගැනීමට රෝගියාට ප්‍රශ්න ඇසීමට!*

*භාවිතා කළ හැකි විධාන:*
• /endsim - වර්තමාන සිමියුලේෂනය අවසන් කරන්න
• /diagnosis - ඔබේ විනිශ්චය ඉදිරිපත් කරන්න
• /help - භාවිතා කළ හැකි විධාන පෙන්වන්න`,
      
      ta: `🎭 *நோயாளி சிமுலேஷன் தொடங்கப்பட்டது*

${initialPresentation}

*நோயாளியின் நிலை பற்றி மேலும் தகவல்களை சேகரிக்க நோயாளியிடம் கேள்விகள் கேள்வி!*

*கிடைக்கக்கூடிய கட்டளைகள்:*
• /endsim - தற்போதைய சிமுலேஷனை முடிக்கவும்
• /diagnosis - உங்கள் கண்டறிதலை சமர்ப்பிக்கவும்
• /help - கிடைக்கக்கூடிய கட்டளைகளைக் காட்டவும்`
    };

    return responses[language] || responses.en;

  } catch (error) {
    logger.error('❌ Error handling simulation command:', error);
    return 'Sorry, simulation is currently unavailable.';
  }
}

// Handle end simulation command
async function handleEndSimulationCommand(user, language) {
  try {
    const simulationStatus = simulationManager.getSimulationStatus(user.uid);
    
    if (!simulationStatus) {
      const responses = {
        en: 'You don\'t have an active simulation to end.',
        si: 'ඔබට අවසන් කිරීමට ක්‍රියාකාරී සිමියුලේෂනයක් නැත.',
        ta: 'நீங்கள் முடிக்க செயலில் உள்ள சிமுலேஷன் இல்லை.'
      };
      return responses[language] || responses.en;
    }

    // End the simulation
    simulationManager.endSimulation(user.uid);

    const responses = {
      en: `🎭 *Simulation Ended*

*Case Summary:*
- Condition: ${simulationStatus.condition}
- Duration: ${Math.round((new Date() - simulationStatus.startTime) / 1000 / 60)} minutes
- Questions asked: ${simulationStatus.conversationHistory.filter(c => c.type === 'question').length}

*Learning Points:*
- Practice history taking skills
- Develop differential diagnosis
- Consider Sri Lankan context
- Focus on evidence-based approach

Use /simulate to start a new case!`,
      
      si: `🎭 *සිමියුලේෂනය අවසන් විය*

*රෝග සාරාංශය:*
- තත්වය: ${simulationStatus.condition}
- කාලය: ${Math.round((new Date() - simulationStatus.startTime) / 1000 / 60)} මිනිත්තු
- ඇසූ ප්‍රශ්න: ${simulationStatus.conversationHistory.filter(c => c.type === 'question').length}

*ඉගෙනීමේ කරුණු:*
- ඉතිහාසය ගැනීමේ කුසලතා පුහුණු කරන්න
- අවකල විනිශ්චය වර්ධනය කරන්න
- ශ්‍රී ලංකා සන්දර්භය සලකා බලන්න
- සාක්ෂි මත පදනම් වූ ප්‍රවේශය මත අවධානය යොමු කරන්න

නව රෝගයක් ආරම්භ කිරීමට /simulate භාවිතා කරන්න!`,
      
      ta: `🎭 *சிமுலேஷன் முடிவடைந்தது*

*வழக்கு சுருக்கம்:*
- நிலை: ${simulationStatus.condition}
- காலம்: ${Math.round((new Date() - simulationStatus.startTime) / 1000 / 60)} நிமிடங்கள்
- கேட்கப்பட்ட கேள்விகள்: ${simulationStatus.conversationHistory.filter(c => c.type === 'question').length}

*கற்றல் புள்ளிகள்:*
- வரலாறு எடுக்கும் திறன்களை பயிற்சி செய்யுங்கள்
- வேறுபட்ட கண்டறிதலை உருவாக்குங்கள்
- இலங்கை சூழலை கவனியுங்கள்
- சான்று அடிப்படையிலான அணுகுமுறையில் கவனம் செலுத்துங்கள்

புதிய வழக்கைத் தொடங்க /simulate ஐப் பயன்படுத்தவும்!`
    };

    return responses[language] || responses.en;

  } catch (error) {
    logger.error('❌ Error handling end simulation command:', error);
    return 'Sorry, could not end simulation.';
  }
}

// Handle diagnosis submission command
async function handleDiagnosisSubmissionCommand(user, language) {
  try {
    const simulationStatus = simulationManager.getSimulationStatus(user.uid);
    
    if (!simulationStatus) {
      const responses = {
        en: 'You don\'t have an active simulation. Use /simulate to start one.',
        si: 'ඔබට ක්‍රියාකාරී සිමියුලේෂනයක් නැත. එකක් ආරම්භ කිරීමට /simulate භාවිතා කරන්න.',
        ta: 'உங்களுக்கு செயலில் உள்ள சிமுலேஷன் இல்லை. ஒன்றைத் தொடங்க /simulate ஐப் பயன்படுத்தவும்.'
      };
      return responses[language] || responses.en;
    }

    // Get the correct diagnosis based on condition
    const correctDiagnosis = getCorrectDiagnosis(simulationStatus.condition);
    
    const responses = {
      en: `🎯 *Diagnosis Review*

*Your Case:*
- Condition: ${simulationStatus.condition}
- Patient: ${simulationStatus.patientProfile.age} year old ${simulationStatus.patientProfile.gender}
- Occupation: ${simulationStatus.patientProfile.occupation}

*Correct Diagnosis:*
${correctDiagnosis}

*Key Learning Points:*
- History taking is crucial
- Consider occupational exposure
- Look for specific symptoms
- Think about local epidemiology

*Management:*
${getManagementPlan(simulationStatus.condition, language)}

Use /endsim to end this simulation or /simulate for a new case!`,
      
      si: `🎯 *විනිශ්චය සමාලෝචනය*

*ඔබේ රෝගය:*
- තත්වය: ${simulationStatus.condition}
- රෝගියා: ${simulationStatus.patientProfile.age} වයස්කරු ${simulationStatus.patientProfile.gender}
- රැකියාව: ${simulationStatus.patientProfile.occupation}

*නිවැරදි විනිශ්චය:*
${correctDiagnosis}

*ප්‍රධාන ඉගෙනීමේ කරුණු:*
- ඉතිහාසය ගැනීම තීරණාත්මක ය
- වෘත්තීය නිරාවරණය සලකා බලන්න
- විශේෂිත රෝග ලක්ෂණ සොයන්න
- දේශීය වසංගත විද්‍යාව ගැන සිතන්න

*කළමනාකරණය:*
${getManagementPlan(simulationStatus.condition, language)}

මෙම සිමියුලේෂනය අවසන් කිරීමට /endsim හෝ නව රෝගයක් සඳහා /simulate භාවිතා කරන්න!`,
      
      ta: `🎯 *கண்டறிதல் மதிப்பாய்வு*

*உங்கள் வழக்கு:*
- நிலை: ${simulationStatus.condition}
- நோயாளி: ${simulationStatus.patientProfile.age} வயது ${simulationStatus.patientProfile.gender}
- தொழில்: ${simulationStatus.patientProfile.occupation}

*சரியான கண்டறிதல்:*
${correctDiagnosis}

*முக்கிய கற்றல் புள்ளிகள்:*
- வரலாறு எடுப்பது முக்கியமானது
- தொழில் வெளிப்பாட்டை கவனியுங்கள்
- குறிப்பிட்ட அறிகுறிகளைத் தேடுங்கள்
- உள்ளூர் தொற்றுநோயியல் பற்றி சிந்தியுங்கள்

*மேலாண்மை:*
${getManagementPlan(simulationStatus.condition, language)}

இந்த சிமுலேஷனை முடிக்க /endsim அல்லது புதிய வழக்குக்கு /simulate ஐப் பயன்படுத்தவும்!`
    };

    return responses[language] || responses.en;

  } catch (error) {
    logger.error('❌ Error handling diagnosis submission command:', error);
    return 'Sorry, could not process diagnosis submission.';
  }
}

// Helper function to get correct diagnosis
function getCorrectDiagnosis(condition) {
  const diagnoses = {
    'leptospirosis': 'Leptospirosis - A bacterial infection transmitted through contact with contaminated water or soil, common in farmers and agricultural workers.',
    'dengue fever': 'Dengue Fever - A viral infection transmitted by Aedes mosquitoes, endemic in tropical regions including Sri Lanka.',
    'typhoid fever': 'Typhoid Fever - A bacterial infection caused by Salmonella typhi, transmitted through contaminated food and water.',
    'malaria': 'Malaria - A parasitic infection transmitted by Anopheles mosquitoes, common in tropical regions.',
    'acute gastroenteritis': 'Acute Gastroenteritis - Inflammation of the stomach and intestines, usually caused by viral or bacterial infection.',
    'upper respiratory tract infection': 'Upper Respiratory Tract Infection - Viral infection affecting the nose, throat, and upper airways.',
    'hypertension': 'Hypertension - High blood pressure, a common chronic condition requiring long-term management.',
    'diabetes mellitus': 'Diabetes Mellitus - A metabolic disorder characterized by high blood sugar levels.'
  };
  return diagnoses[condition] || 'General medical condition requiring further evaluation.';
}

// Helper function to get management plan
function getManagementPlan(condition, language) {
  const plans = {
    'leptospirosis': {
      en: '- IV fluids and electrolyte management\n- Doxycycline or Penicillin G\n- Monitor renal function\n- Supportive care\n- Prevention: Avoid contaminated water',
      si: '- IV දියර සහ විද්‍යුත් ලවණ කළමනාකරණය\n- Doxycycline හෝ Penicillin G\n- වකුගඩු කාර්යය නිරීක්ෂණය\n- සහායක රැකවරණය\n- වැළැක්වීම: දූෂිත ජලය වළක්වන්න',
      ta: '- IV திரவங்கள் மற்றும் எலக்ட்ரோலைட் மேலாண்மை\n- Doxycycline அல்லது Penicillin G\n- சிறுநீரக செயல்பாட்டை கண்காணிக்கவும்\n- ஆதரவு பராமரிப்பு\n- தடுப்பு: மாசுபட்ட நீரைத் தவிர்க்கவும்'
    },
    'dengue fever': {
      en: '- IV fluids for severe cases\n- Paracetamol for fever\n- Monitor platelet count\n- Avoid NSAIDs\n- Prevention: Mosquito control',
      si: '- තද රෝග සඳහා IV දියර\n- උණ සඳහා පැරසිටමෝල්\n- ප්ලේට්ලට් ගණන නිරීක්ෂණය\n- NSAIDs වළක්වන්න\n- වැළැක්වීම: මදුරු පාලනය',
      ta: '- கடுமையான வழக்குகளுக்கு IV திரவங்கள்\n- காய்ச்சலுக்கு பாராசிட்டமால்\n- பிளேட்லெட் எண்ணிக்கையை கண்காணிக்கவும்\n- NSAIDs ஐத் தவிர்க்கவும்\n- தடுப்பு: கொசு கட்டுப்பாடு'
    }
  };
  
  const plan = plans[condition];
  return plan ? plan[language] || plan.en : 'Standard medical management based on condition severity.';
}

// Handle drug category request
async function handleDrugCategoryRequest(category, user, language) {
  try {
    logger.info('💊 Processing drug category request', { category, userId: user.uid });
    
    // Handle specific medication queries
    const specificMedications = {
      'doxycycline': {
        en: `💊 *Doxycycline Information*

*Generic Name:* Doxycycline
*Class:* Tetracycline antibiotic
*Common Uses:*
• Respiratory infections
• Skin infections
• Malaria prophylaxis
• Acne treatment

*Dosage:* 100mg twice daily (varies by condition)
*Duration:* 7-14 days typically

*Important Notes:*
• Take with food to avoid stomach upset
• Avoid dairy products 2 hours before/after
• Use sunscreen (increases sun sensitivity)
• Not recommended in pregnancy

*Side Effects:*
• Nausea, vomiting
• Diarrhea
• Sun sensitivity
• Yeast infection

*For Medical Students:*
Consider drug interactions with warfarin, antacids, and oral contraceptives.`,

        si: `💊 *Doxycycline තොරතුරු*

*සාමාන්‍ය නම:* Doxycycline
*වර්ගය:* Tetracycline ප්‍රතිජීවක
*සාමාන්‍ය භාවිත:*
• ශ්වසන ආසාදන
• සම ආසාදන
• මැලේරියා වැළැක්වීම
• කුරුලෑ රෝග චිකිත්සාව

*ඖෂධ ප්‍රමාණය:* 100mg දිනකට දෙවරක් (රෝග තත්වය අනුව වෙනස් වේ)
*කාලසීමාව:* සාමාන්‍යයෙන් 7-14 දින

*වැදගත් සටහන්:*
• ආමාශයේ අසහනතාව වැළැක්වීමට ආහාර සමඟ ගන්න
• කිරි භාණ්ඩ 2 පැයකට පෙර/පසු වලකන්න
• සූර්‍ය ආලෝකය භාවිතා කරන්න (සූර්‍ය සංවේදීතාව වැඩි කරයි)
• ගර්භණී භාවයේ නිර්දේශ නොකෙරේ

*පාර්ශව ආබාධ:*
• වමනය, වමනය
• අතුරු ආබාධ
• සූර්‍ය සංවේදීතාව
• යීස්ට් ආසාදන

*වෛද්‍ය ශිෂ්‍යයින් සඳහා:*
Warfarin, antacids, සහ oral contraceptives සමඟ ඖෂධ අන්තර්ක්‍රියා සලකා බලන්න.`,

        ta: `💊 *Doxycycline தகவல்*

*பொதுவான பெயர்:* Doxycycline
*வகுப்பு:* Tetracycline நுண்ணுயிர் எதிர்ப்பி
*பொதுவான பயன்பாடுகள்:*
• சுவாச தொற்றுகள்
• தோல் தொற்றுகள்
• மலேரியா தடுப்பு
• முகப்பரு சிகிச்சை

*மருந்தளவு:* 100mg நாளுக்கு இரண்டு முறை (நிலைமையைப் பொறுத்து மாறுபடும்)
*காலம்:* பொதுவாக 7-14 நாட்கள்

*முக்கிய குறிப்புகள்:*
• வயிற்று உபாதையைத் தவிர்க்க உணவுடன் எடுக்கவும்
• பால் பொருட்களை 2 மணி நேரத்திற்கு முன்/பின்னர் தவிர்க்கவும்
• சூரிய ஒளியைப் பயன்படுத்தவும் (சூரிய உணர்திறனை அதிகரிக்கிறது)
• கர்ப்பத்தில் பரிந்துரைக்கப்படவில்லை

*பக்க விளைவுகள்:*
• குமட்டல், வாந்தி
• வயிற்றுப்போக்கு
• சூரிய உணர்திறன்
• ஈஸ்ட் தொற்று

*மருத்துவ மாணவர்களுக்கு:*
Warfarin, antacids, மற்றும் oral contraceptives உடன் மருந்து தொடர்புகளைக் கவனியுங்கள்.`
      }
    };

    // Check if it's a specific medication query
    if (specificMedications[category]) {
      return specificMedications[category][language] || specificMedications[category].en;
    }
    
    const drugs = advancedFeatures.getDrugsByCategory(category);
    
    if (!drugs || drugs.length === 0) {
      const responses = {
        en: `No drugs found for category: ${category}`,
        si: `${category} කාණ්ඩය සඳහා ඖෂධ හමු නොවීය`,
        ta: `${category} வகைக்கு மருந்துகள் எதுவும் கிடைக்கவில்லை`
      };
      return responses[language] || responses.en;
    }

    let response = language === 'si' ? 
      `💊 *${category} - ශ්‍රී ලංකා ඖෂධ දත්ත ගබඩාව*\n\n` :
      language === 'ta' ? 
      `💊 *${category} - இலங்கை மருந்து தரவுத்தளம்*\n\n` :
      `💊 *${category} - Sri Lankan Drug Database*\n\n`;

    drugs.forEach((drug, index) => {
      response += `${index + 1}. *${drug.name}*\n`;
      response += `   💊 Generic: ${drug.generic}\n`;
      response += `   💰 Cost: ${drug.cost}\n`;
      response += `   📦 Availability: ${drug.availability}\n`;
      response += `   💡 Usage: ${drug.usage}\n\n`;
    });

    response += language === 'si' ? 
      '*වැඩිදුර තොරතුරු සඳහා ඖෂධ නම ටයිප් කරන්න*' :
      language === 'ta' ? 
      '*மேலும் தகவல்களுக்கு மருந்து பெயரை தட்டச்சு செய்யவும்*' :
      '*Type drug name for more details*';

    return response;

  } catch (error) {
    logger.error('❌ Error handling drug category request:', error);
    return 'Sorry, could not retrieve drug information.';
  }
}

// Handle calculator type request
async function handleCalculatorTypeRequest(calculatorType, user, language) {
  try {
    logger.info('🧮 Processing calculator request', { calculatorType, userId: user.uid });
    
    const responses = {
      en: `🧮 *${calculatorType.toUpperCase()} Calculator*\n\nPlease provide the required parameters:\n\n`,
      si: `🧮 *${calculatorType.toUpperCase()} ගණක යන්ත්‍ර*\n\nකරුණාකර අවශ්‍ය පරාමිති සපයන්න:\n\n`,
      ta: `🧮 *${calculatorType.toUpperCase()} கணிப்பான்*\n\nதேவையான அளவுருக்களை வழங்கவும்:\n\n`
    };

    let response = responses[language] || responses.en;

    // Add specific instructions for each calculator
    const instructions = {
      'bmi': {
        en: 'Weight (kg) and Height (m)\nExample: "70 1.75"',
        si: 'බර (kg) සහ උස (m)\nඋදාහරණය: "70 1.75"',
        ta: 'எடை (kg) மற்றும் உயரம் (m)\nஎடுத்துக்காட்டு: "70 1.75"'
      },
      'gfr': {
        en: 'Age, Gender, Weight (kg), Creatinine (mg/dL)\nExample: "45 male 70 1.2"',
        si: 'වයස, ස්ත්‍රී පුරුෂ භාවය, බර (kg), ක්‍රියේටිනින් (mg/dL)\nඋදාහරණය: "45 male 70 1.2"',
        ta: 'வயது, பாலினம், எடை (kg), கிரியேட்டினின் (mg/dL)\nஎடுத்துக்காட்டு: "45 male 70 1.2"'
      },
      'chads2': {
        en: 'Age, CHF, HTN, DM, Stroke/TIA\nExample: "65 yes no yes no"',
        si: 'වයස, CHF, HTN, DM, Stroke/TIA\nඋදාහරණය: "65 yes no yes no"',
        ta: 'வயது, CHF, HTN, DM, Stroke/TIA\nஎடுத்துக்காட்டு: "65 yes no yes no"'
      }
    };

    response += instructions[calculatorType]?.[language] || instructions[calculatorType]?.en || 'Please provide the required parameters.';

    return response;

  } catch (error) {
    logger.error('❌ Error handling calculator request:', error);
    return 'Sorry, could not process calculator request.';
  }
}

// Handle guideline request
async function handleGuidelineRequest(condition, user, language) {
  try {
    logger.info('📋 Processing guideline request', { condition, userId: user.uid });
    
    const guideline = advancedFeatures.getClinicalGuideline(condition);
    
    if (!guideline) {
      const responses = {
        en: `No guidelines found for: ${condition}`,
        si: `${condition} සඳහා මාර්ගෝපදේශ හමු නොවීය`,
        ta: `${condition} க்கான வழிகாட்டுதல்கள் எதுவும் கிடைக்கவில்லை`
      };
      return responses[language] || responses.en;
    }

    let response = language === 'si' ? 
      `📋 *${condition} - සායනික මාර්ගෝපදේශ*\n\n` :
      language === 'ta' ? 
      `📋 *${condition} - மருத்துவ வழிகாட்டுதல்கள்*\n\n` :
      `📋 *${condition} - Clinical Guidelines*\n\n`;

    response += `*Diagnosis:*\n${guideline.diagnosis}\n\n`;
    response += `*Treatment:*\n${guideline.treatment}\n\n`;
    response += `*Monitoring:*\n${guideline.monitoring}\n\n`;
    response += `*Prevention:*\n${guideline.prevention}`;

    return response;

  } catch (error) {
    logger.error('❌ Error handling guideline request:', error);
    return 'Sorry, could not retrieve clinical guidelines.';
  }
}

// Handle help request
async function handleHelpRequest(user, language) {
  try {
    const responses = {
      en: `🏥 *StethoLink AI Agent Help*

*📖 Getting Started:*
• /guide - View comprehensive user guide
• /help - Show this command list
• /agent - Initialize your personal AI agent

*📚 Study Management:*
• /tasks - View and manage your tasks
• /addtask - Add a new task with alerts
• /alerts - Check your pending alerts
• /progress - View your study progress

*📝 Note Management:*
• "add note: [content]" - Add new note
• "my notes" - View all notes
• "search notes: [keyword]" - Find notes

*🏥 Medical Commands:*
• /simulate - Start patient simulation
• /endsim - End current simulation
• /diagnosis - Submit your diagnosis
• /history - View case history
• /mentor - Get motivational tips

*💊 Advanced Features:*
• /drugs - Drug database and interactions
• /calculator - Medical calculators
• /guidelines - Clinical guidelines
• /decision - Clinical decision support
• /education - Medical education content
• /evidence - Evidence-based medicine

*🖥️ Dashboard:*
• "dashboard" - Open web dashboard
• "open dashboard" - Same as above

*Quick Access (type these words):*
• antibiotics, analgesics - Drug database
• bmi, gfr, chads2 - Medical calculators
• dengue, leptospirosis - Clinical guidelines
• help, commands - Show this menu

*Natural Language Examples:*
• "Study cardiology at 6 PM"
• "Add task: review ECG cases tomorrow"
• "add note: ECG interpretation basics"
• "Calculate BMI for 70kg 1.75m"
• "Check drug interaction warfarin aspirin"
• "Start patient simulation"
• "dashboard"

*Languages:* 🇺🇸 🇱🇰 🇮🇳

*For detailed guide, type: /guide*

Start by typing a command or medical term!`,
      
      si: `🏥 *StethoLink AI උදව්*

*භාවිතා කළ හැකි විධාන:*
• /simulate - රෝගී සිමියුලේෂනය ආරම්භ කරන්න
• /endsim - වර්තමාන සිමියුලේෂනය අවසන් කරන්න
• /diagnosis - ඔබේ විනිශ්චය ඉදිරිපත් කරන්න
• /history - රෝග ඉතිහාසය බලන්න
• /mentor - ධෛර්‍යමත් උපදෙස් ලබා ගන්න

*ක්ෂණික ප්‍රවේශය (මෙම වචන ටයිප් කරන්න):*
• antibiotics, analgesics - ඖෂධ දත්ත ගබඩාව
• bmi, gfr, chads2 - වෛද්‍ය ගණක යන්ත්‍ර
• dengue, leptospirosis - සායනික මාර්ගෝපදේශ
• help, commands - මෙම මෙනුව පෙන්වන්න

*භාෂා:* 🇺🇸 🇱🇰 🇮🇳

විධානයක් හෝ වෛද්‍ය පදයක් ටයිප් කිරීමෙන් ආරම්භ කරන්න!`,
      
      ta: `🏥 *StethoLink AI உதவி*

*கிடைக்கக்கூடிய கட்டளைகள்:*
• /simulate - நோயாளி சிமுலேஷனைத் தொடங்கவும்
• /endsim - தற்போதைய சிமுலேஷனை முடிக்கவும்
• /diagnosis - உங்கள் கண்டறிதலை சமர்ப்பிக்கவும்
• /history - வழக்கு வரலாற்றைக் காண்க
• /mentor - ஊக்கமளிக்கும் குறிப்புகளைப் பெறுங்கள்

*விரைவு அணுகல் (இந்த வார்த்தைகளை தட்டச்சு செய்யவும்):*
• antibiotics, analgesics - மருந்து தரவுத்தளம்
• bmi, gfr, chads2 - மருத்துவ கணிப்பான்கள்
• dengue, leptospirosis - மருத்துவ வழிகாட்டுதல்கள்
• help, commands - இந்த மெனுவைக் காட்டு

*மொழிகள்:* 🇺🇸 🇱🇰 🇮🇳

ஒரு கட்டளையை அல்லது மருத்துவ சொல்லை தட்டச்சு செய்வதன் மூலம் தொடங்குங்கள்!`
    };

    // Create inline keyboard with quick access buttons for help
    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '📝 Add Task', callback_data: 'add_task' },
          { text: '📋 My Tasks', callback_data: 'my_tasks' },
          { text: '⏰ My Alerts', callback_data: 'my_alerts' }
        ],
        [
          { text: '📝 Add Note', callback_data: 'add_note' },
          { text: '📖 My Notes', callback_data: 'my_notes' },
          { text: '🔍 Search Notes', callback_data: 'search_notes' }
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
        ]
      ]
    };

    return {
      text: responses[language] || responses.en,
      reply_markup: inlineKeyboard
    };

  } catch (error) {
    logger.error('❌ Error handling help request:', error);
    return 'Sorry, could not load help menu.';
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
    const motivationalMessage = await ai.generateMotivationalMessage(language, 'daily');
    
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

// Send Telegram message
async function sendTelegramMessage(chatId, message) {
  try {
    // Check if message is an object with text and reply_markup (for buttons)
    if (typeof message === 'object' && message.text && message.reply_markup) {
      const response = await bot.sendMessage(chatId, message.text, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: message.reply_markup
      });

      logger.info('✅ Telegram message with buttons sent successfully', {
        messageId: response.message_id,
        chatId: chatId
      });

      return response;
    } else {
      // Regular text message
      const response = await bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });

      logger.info('✅ Telegram message sent successfully', {
        messageId: response.message_id,
        chatId: chatId
      });

      return response;
    }
  } catch (error) {
    logger.error('❌ Error sending Telegram message:', error);
    throw error;
  }
}

// Get user by Telegram ID
async function getUserByTelegramId(telegramId) {
  try {
    if (!telegramId) {
      logger.warn('⚠️ No Telegram ID provided');
      return null;
    }

    // Query Firebase for existing user with this Telegram ID
    const usersSnapshot = await getDb().collection('users')
      .where('telegramId', '==', telegramId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return null;
    }

    const userDoc = usersSnapshot.docs[0];
    return {
      uid: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    logger.error('❌ Error getting user by Telegram ID:', error);
    return null;
  }
}

// Create Telegram user
async function createTelegramUser(telegramUser) {
  try {
    const userData = {
      telegramId: telegramUser.id,
      displayName: telegramUser.first_name + (telegramUser.last_name ? ' ' + telegramUser.last_name : ''),
      username: telegramUser.username,
      language: telegramUser.language_code || 'en',
      platform: 'telegram'
    };

    const user = await createUser(userData);
    logger.info('✅ Telegram user created', { uid: user.uid, telegramId: telegramUser.id });
    
    return user;
  } catch (error) {
    logger.error('❌ Error creating Telegram user:', error);
    throw error;
  }
}

// Download audio file (placeholder)
async function downloadAudioFile(filePath) {
  // This would download the audio file from Telegram
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

// Process webhook (for production)
async function processTelegramWebhook(req, res) {
  try {
    // Verify webhook
    if (req.params.token !== process.env.TELEGRAM_BOT_TOKEN) {
      return res.status(403).send('Forbidden');
    }

    // Process the update directly
    const update = req.body;
    logger.info('📲 Processing Telegram webhook update:', { updateType: update.message ? 'message' : 'other' });

    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      const userId = message.from.id;
      const text = message.text;
      const messageId = message.message_id;

      // Create user object
      const user = {
        uid: userId,
        id: userId,
        telegramId: userId,
        firstName: message.from.first_name,
        lastName: message.from.last_name,
        username: message.from.username,
        language: 'en' // Default to English
      };

      // Process the message
      if (text) {
        const response = await handleTextMessage(text, user, messageId);
        await sendTelegramMessage(chatId, response);
      } else if (message.voice) {
        const response = await handleVoiceMessage(message.voice, user, messageId);
        await sendTelegramMessage(chatId, response);
      } else {
        // Send welcome message for other types
        await sendTelegramMessage(chatId, WELCOME_MESSAGES.en);
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    logger.error('❌ Error processing Telegram webhook:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Advanced Feature Command Handlers

async function handleCalculatorCommand(user, language) {
  try {
    const calculators = Object.keys(advancedFeatures.medicalCalculators);
    
    const response = {
      en: `🧮 *Medical Calculators Available:*

*Cardiovascular:*
• BMI - Body Mass Index
• GFR - Glomerular Filtration Rate
• CHADS2 - Stroke Risk Score

*Respiratory:*
• FEV1 Predicted

*Renal:*
• Creatinine Clearance

*Pediatric:*
• Pediatric Dose Calculator

*Emergency:*
• Glasgow Coma Scale
• APACHE II Score

*Usage:* Send calculator type and parameters
Example: "BMI weight:70 height:170"`,

      si: `🧮 *භාවිතා කළ හැකි වෛද්‍ය ගණක යන්ත්‍ර:*

*හෘද්‍ය සංවහන:*
• BMI - ශරීර ස්කන්ධ දර්ශකය
• GFR - ග්ලෝමරුලර් පෙරහන් අනුපාතය
• CHADS2 - හෘදයාබාධ අවදානම් ලකුණු

*ශ්වසන:*
• FFR1 අපේක්ෂිත

*වකුගඩු:*
• ක්‍රියේටිනින් පිරිසිදු කිරීම

*ළමා:*
• ළමා ඖෂධ මාත්‍රා ගණක යන්ත්‍රය

*හදිසි:*
• ග්ලාස්ගෝ කෝමා පරිමාණය
• APACHE II ලකුණු

*භාවිතය:* ගණක යන්ත්‍ර වර්ගය සහ පරාමිතීන් යවන්න
උදාහරණය: "BMI weight:70 height:170"`,

      ta: `🧮 *கிடைக்கக்கூடிய மருத்துவ கணிப்பான்கள்:*

*இதய நாள:*
• BMI - உடல் நிறை குறியீட்டு எண்
• GFR - குளோமருலர் வடிப்பு விகிதம்
• CHADS2 - பக்கவாத அபாய மதிப்பெண்

*சுவாச:*
• FEV1 எதிர்பார்க்கப்படும்

*சிறுநீரக:*
• கிரியேட்டினின் அழிப்பு

*குழந்தை:*
• குழந்தை மருந்து அளவு கணிப்பான்

*அவசர:*
• கிளாஸ்கோ கோமா அளவுகோல்
• APACHE II மதிப்பெண்

*பயன்பாடு:* கணிப்பான் வகை மற்றும் அளவுருக்களை அனுப்பவும்
எடுத்துக்காட்டு: "BMI weight:70 height:170"`
    };

    return response[language] || response.en;
  } catch (error) {
    logger.error('❌ Error in calculator command:', error);
    return 'Sorry, calculator information is currently unavailable.';
  }
}

async function handleDrugsCommand(user, language) {
  try {
    const categories = Object.keys(advancedFeatures.sriLankanDrugDatabase);
    
    const response = {
      en: `💊 *Sri Lankan Drug Database:*

*Available Categories:*
• Antibiotics
• Analgesics
• Antihypertensives

*Usage:* Send category name to get drug list
Example: "antibiotics" or "analgesics"

*Features:*
• Dosage information
• Availability status
• Cost information
• Sri Lankan context`,

      si: `💊 *ශ්‍රී ලංකා ඖෂධ දත්ත ගබඩාව:*

*භාවිතා කළ හැකි කාණ්ඩ:*
• ප්‍රතිජීවක
• වේදනා නාශක
• රුධිර පීඩන විරෝධී

*භාවිතය:* ඖෂධ ලැයිස්තුව ලබා ගැනීමට කාණ්ඩ නම යවන්න
උදාහරණය: "antibiotics" හෝ "analgesics"

*විශේෂාංග:*
• මාත්‍රා තොරතුරු
• ලබා ගත හැකි තත්වය
• පිරිවැය තොරතුරු
• ශ්‍රී ලංකා සන්දර්භය`,

      ta: `💊 *இலங்கை மருந்து தரவுத்தளம்:*

*கிடைக்கக்கூடிய வகைகள்:*
• நுண்ணுயிர் எதிர்ப்பிகள்
• வலி நிவாரணிகள்
• இரத்த அழுத்த எதிர்ப்பிகள்

*பயன்பாடு:* மருந்து பட்டியலைப் பெற வகை பெயரை அனுப்பவும்
எடுத்துக்காட்டு: "antibiotics" அல்லது "analgesics"

*அம்சங்கள்:*
• மருந்தளவு தகவல்
• கிடைப்பு நிலை
• செலவு தகவல்
• இலங்கை சூழல்`
    };

    return response[language] || response.en;
  } catch (error) {
    logger.error('❌ Error in drugs command:', error);
    return 'Sorry, drug database information is currently unavailable.';
  }
}

async function handleGuidelinesCommand(user, language) {
  try {
    const guidelines = Object.keys(advancedFeatures.clinicalGuidelines);
    
    const response = {
      en: `📋 *Clinical Guidelines (Sri Lankan Context):*

*Available Guidelines:*
• Dengue Fever
• Leptospirosis
• Tuberculosis

*Usage:* Send condition name to get guidelines
Example: "dengue fever" or "tuberculosis"

*Features:*
• Symptoms
• Investigations
• Management
• Sri Lankan context
• Local disease patterns`,

      si: `📋 *සායනික මාර්ගෝපදේශ (ශ්‍රී ලංකා සන්දර්භය):*

*භාවිතා කළ හැකි මාර්ගෝපදේශ:*
• ඩෙංගු උණ
• ලෙප්ටොස්පයිරෝසිස්
• යකෂ්මා

*භාවිතය:* මාර්ගෝපදේශ ලබා ගැනීමට රෝග තත්වයේ නම යවන්න
උදාහරණය: "dengue fever" හෝ "tuberculosis"

*විශේෂාංග:*
• රෝග ලක්ෂණ
• පරීක්ෂණ
• කළමනාකරණය
• ශ්‍රී ලංකා සන්දර්භය
• දේශීය රෝග රටා`,

      ta: `📋 *மருத்துவ வழிகாட்டுதல்கள் (இலங்கை சூழல்):*

*கிடைக்கக்கூடிய வழிகாட்டுதல்கள்:*
• டெங்கு காய்ச்சல்
• லெப்டோஸ்பைரோசிஸ்
• காசநோய்

*பயன்பாடு:* வழிகாட்டுதல்களைப் பெற நிலை பெயரை அனுப்பவும்
எடுத்துக்காட்டு: "dengue fever" அல்லது "tuberculosis"

*அம்சங்கள்:*
• அறிகுறிகள்
• விசாரணைகள்
• மேலாண்மை
• இலங்கை சூழல்
• உள்ளூர் நோய் வடிவங்கள்`
    };

    return response[language] || response.en;
  } catch (error) {
    logger.error('❌ Error in guidelines command:', error);
    return 'Sorry, clinical guidelines information is currently unavailable.';
  }
}

async function handleInteractionsCommand(user, language) {
  try {
    const response = {
      en: `🔍 *Drug Interaction Checker:*

*Usage:* Send drug names separated by commas
Example: "Warfarin, Aspirin, Metformin"

*Features:*
• Drug-drug interactions
• Severity assessment
• Recommendations
• Alternative suggestions

*Common Interactions:*
• Warfarin + NSAIDs
• ACE inhibitors + NSAIDs
• Statins + Grapefruit
• Digoxin + Diuretics`,

      si: `🔍 *ඖෂධ අන්තර්ක්‍රියා පරීක්ෂක:*

*භාවිතය:* කොමා වලින් වෙන් කර ඖෂධ නම් යවන්න
උදාහරණය: "Warfarin, Aspirin, Metformin"

*විශේෂාංග:*
• ඖෂධ-ඖෂධ අන්තර්ක්‍රියා
• තදබද ඇගයීම
• නිර්දේශ
• විකල්ප යෝජනා

*පොදු අන්තර්ක්‍රියා:*
• Warfarin + NSAIDs
• ACE inhibitors + NSAIDs
• Statins + Grapefruit
• Digoxin + Diuretics`,

      ta: `🔍 *மருந்து தொடர்பு சோதனையாளர்:*

*பயன்பாடு:* கமாவால் பிரிக்கப்பட்ட மருந்து பெயர்களை அனுப்பவும்
எடுத்துக்காட்டு: "Warfarin, Aspirin, Metformin"

*அம்சங்கள்:*
• மருந்து-மருந்து தொடர்புகள்
• தீவிரம் மதிப்பீடு
• பரிந்துரைகள்
• மாற்று பரிந்துரைகள்

*பொதுவான தொடர்புகள்:*
• Warfarin + NSAIDs
• ACE inhibitors + NSAIDs
• Statins + Grapefruit
• Digoxin + Diuretics`
    };

    return response[language] || response.en;
  } catch (error) {
    logger.error('❌ Error in interactions command:', error);
    return 'Sorry, drug interaction information is currently unavailable.';
  }
}

async function handleDecisionCommand(user, language) {
  try {
    const response = {
      en: `🧠 *Clinical Decision Support:*

*Usage:* Send symptoms, age, gender
Example: "fever headache, 25, male"

*Features:*
• Differential diagnosis
• Recommended investigations
• Management strategies
• Age-specific considerations
• Gender-specific considerations
• Sri Lankan context

*Supported Symptoms:*
• Fever + Headache
• Chest Pain
• Shortness of Breath
• And more...`,

      si: `🧠 *සායනික තීරණ සහාය:*

*භාවිතය:* රෝග ලක්ෂණ, වයස, ස්ත්‍රී පුරුෂ භාවය යවන්න
උදාහරණය: "fever headache, 25, male"

*විශේෂාංග:*
• අවකල රෝග විනිශ්චය
• නිර්දේශිත පරීක්ෂණ
• කළමනාකරණ උපාය
• වයස් ගත විශේෂඥතා
• ස්ත්‍රී පුරුෂ භාවය ගත විශේෂඥතා
• ශ්‍රී ලංකා සන්දර්භය

*සහාය වන රෝග ලක්ෂණ:*
• උණ + හිසරදය
• පපුවේ වේදනාව
• හුස්ම ගැනීමේ අපහසුතාව
• තවත්...`,

      ta: `🧠 *மருத்துவ முடிவு ஆதரவு:*

*பயன்பாடு:* அறிகுறிகள், வயது, பாலினத்தை அனுப்பவும்
எடுத்துக்காட்டு: "fever headache, 25, male"

*அம்சங்கள்:*
• வேறுபட்ட நோய் கண்டறிதல்
• பரிந்துரைக்கப்பட்ட விசாரணைகள்
• மேலாண்மை உத்திகள்
• வயது குறிப்பிட்ட பரிசீலனைகள்
• பாலின குறிப்பிட்ட பரிசீலனைகள்
• இலங்கை சூழல்

*ஆதரிக்கப்படும் அறிகுறிகள்:*
• காய்ச்சல் + தலைவலி
• மார்பு வலி
• மூச்சு திணறல்
• மேலும்...`
    };

    return response[language] || response.en;
  } catch (error) {
    logger.error('❌ Error in decision command:', error);
    return 'Sorry, clinical decision support information is currently unavailable.';
  }
}

async function handleEducationCommand(user, language) {
  try {
    const response = {
      en: `📚 *Patient Education Generator:*

*Usage:* Send diagnosis and language
Example: "diabetes, en" or "hypertension, si"

*Features:*
• Disease-specific education
• Lifestyle recommendations
• Complication prevention
• Multi-language support
• Sri Lankan context

*Supported Diagnoses:*
• Diabetes
• Hypertension
• And more...

*Languages:*
• English (en)
• Sinhala (si)
• Tamil (ta)`,

      si: `📚 *රෝගී අධ්‍යාපන උත්පාදක:*

*භාවිතය:* රෝග විනිශ්චය සහ භාෂාව යවන්න
උදාහරණය: "diabetes, en" හෝ "hypertension, si"

*විශේෂාංග:*
• රෝග විශේෂිත අධ්‍යාපනය
• ජීවන රටා නිර්දේශ
• අවතීර්ණතා වැළැක්වීම
• බහු භාෂා සහාය
• ශ්‍රී ලංකා සන්දර්භය

*සහාය වන රෝග විනිශ්ච:*
• මධුමේහය
• රුධිර පීඩනය
• තවත්...

*භාෂා:*
• ඉංග්‍රීසි (en)
• සිංහල (si)
• දෙමළ (ta)`,

      ta: `📚 *நோயாளி கல்வி உருவாக்கி:*

*பயன்பாடு:* நோய் கண்டறிதல் மற்றும் மொழியை அனுப்பவும்
எடுத்துக்காட்டு: "diabetes, en" அல்லது "hypertension, ta"

*அம்சங்கள்:*
• நோய் குறிப்பிட்ட கல்வி
• வாழ்க்கை முறை பரிந்துரைகள்
• சிக்கல்களைத் தடுத்தல்
• பல மொழி ஆதரவு
• இலங்கை சூழல்

*ஆதரிக்கப்படும் நோய் கண்டறிதல்கள்:*
• நீரிழிவு
• உயர் இரத்த அழுத்தம்
• மேலும்...

*மொழிகள்:*
• ஆங்கிலம் (en)
• சிங்களம் (si)
• தமிழ் (ta)`
    };

    return response[language] || response.en;
  } catch (error) {
    logger.error('❌ Error in education command:', error);
    return 'Sorry, patient education information is currently unavailable.';
  }
}

async function handleEvidenceCommand(user, language) {
  try {
    const response = {
      en: `🔬 *Evidence-Based Medicine Search:*

*Usage:* Send medical query
Example: "diabetes treatment" or "hypertension guidelines"

*Features:*
• Systematic reviews
• Clinical trials
• Clinical guidelines
• Treatment recommendations
• Latest evidence

*Supported Topics:*
• Diabetes management
• Hypertension treatment
• Cardiovascular disease
• And more...

*Sources:*
• PubMed
• Cochrane Reviews
• Clinical Guidelines
• Recent Trials`,

      si: `🔬 *සාක්ෂි මත පදනම් වූ වෛද්‍ය විද්‍යා සොයා ගැනීම:*

*භාවිතය:* වෛද්‍ය විමසුම යවන්න
උදාහරණය: "diabetes treatment" හෝ "hypertension guidelines"

*විශේෂාංග:*
• ක්‍රමානුකූල සමාලෝචන
• සායනික අත්හදා බැලීම්
• සායනික මාර්ගෝපදේශ
• ප්‍රතිකාර නිර්දේශ
• නවතම සාක්ෂි

*සහාය වන මාතෘකා:*
• මධුමේහ කළමනාකරණය
• රුධිර පීඩන ප්‍රතිකාර
• හෘද්‍ය සංවහන රෝග
• තවත්...

*මූලාශ්‍ර:*
• PubMed
• Cochrane Reviews
• Clinical Guidelines
• Recent Trials`,

      ta: `🔬 *சான்று அடிப்படையிலான மருத்துவத் தேடல்:*

*பயன்பாடு:* மருத்துவ வினாவை அனுப்பவும்
எடுத்துக்காட்டு: "diabetes treatment" அல்லது "hypertension guidelines"

*அம்சங்கள்:*
• முறையான மதிப்பாய்வுகள்
• மருத்துவ சோதனைகள்
• மருத்துவ வழிகாட்டுதல்கள்
• சிகிச்சை பரிந்துரைகள்
• சமீபத்திய சான்றுகள்

*ஆதரிக்கப்படும் தலைப்புகள்:*
• நீரிழிவு மேலாண்மை
• உயர் இரத்த அழுத்த சிகிச்சை
• இதய நாள நோய்
• மேலும்...

*மூலங்கள்:*
• PubMed
• Cochrane Reviews
• Clinical Guidelines
• Recent Trials`
    };

    return response[language] || response.en;
  } catch (error) {
    logger.error('❌ Error in evidence command:', error);
    return 'Sorry, evidence-based medicine information is currently unavailable.';
  }
}

// AI Agent Command Handlers

async function handleAgentCommand(user, language) {
  try {
    const agent = await medicalAgentSystem.initializeAgent(user.uid || user.id, {
      name: user.displayName || user.firstName || 'Medical Student',
      email: user.email || '',
      phone: user.phone || '',
      telegramId: user.telegramId || user.id,
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

*Quick Access Buttons Below:* 👇

Your agent is now active and ready to help! 🚀`,

      si: `🤖 *AI Agent Successfully Initialized!*

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

*Quick Access with Buttons Below:* 👇

Your agent is now active and ready to help! 🚀`,

      ta: `🤖 *AI Agent Successfully Initialized!*

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

*Quick Access with Buttons Below:* 👇

Your agent is now active and ready to help! 🚀`
    };

    // Create inline keyboard with quick access buttons
    const inlineKeyboard = {
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
        ]
      ]
    };

    return {
      text: responses[language] || responses.en,
      reply_markup: inlineKeyboard
    };
  } catch (error) {
    logger.error('❌ Error in agent command:', error);
    return 'Sorry, could not initialize AI agent. Please try again.';
  }
}

async function handleTasksCommand(user, language) {
  try {
    const agent = await medicalAgentSystem.getAgent(user.uid || user.id);
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
    const agent = await medicalAgentSystem.getAgent(user.uid || user.id);
    const alerts = await medicalAgentSystem.getPendingAlerts(user.uid || user.id);

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
    const agent = await medicalAgentSystem.getAgent(user.uid || user.id);
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
    // Extract task details from natural language - multiple patterns
    let taskTitle = '';
    let scheduledTime = null;
    
    // Pattern 1: "add task: study cardiology"
    const taskMatch1 = message.match(/add task:\s*(.+)/i) || 
                      message.match(/set task:\s*(.+)/i) || 
                      message.match(/create task:\s*(.+)/i);
    
    // Pattern 2: "study cardiology at 5.29 PM"
    const taskMatch2 = message.match(/study\s+(.+?)\s+at\s+(.+)/i) ||
                      message.match(/study\s+(.+?)\s+on\s+(.+)/i) ||
                      message.match(/study\s+(.+?)\s+by\s+(.+)/i);
    
    // Pattern 3: "review ECG tomorrow"
    const taskMatch3 = message.match(/review\s+(.+?)\s+(.+)/i) ||
                      message.match(/practice\s+(.+?)\s+(.+)/i) ||
                      message.match(/read\s+(.+?)\s+(.+)/i);
    
    if (taskMatch1) {
      taskTitle = taskMatch1[1].trim();
    } else if (taskMatch2) {
      taskTitle = `Study ${taskMatch2[1].trim()}`;
      scheduledTime = this.parseTime(taskMatch2[2].trim());
    } else if (taskMatch3) {
      taskTitle = `${taskMatch3[1].trim()} - ${taskMatch3[2].trim()}`;
      scheduledTime = this.parseTime(taskMatch3[2].trim());
    } else {
      // If no pattern matches, treat the whole message as task title
      taskTitle = message.trim();
    }
    
    // Parse time if provided
    const parseTime = (timeStr) => {
      try {
        // Handle "5.29 PM" format
        if (timeStr.match(/\d+\.\d+\s*(AM|PM)/i)) {
          const [time, period] = timeStr.split(/\s*(AM|PM)/i);
          const [hours, minutes] = time.split('.');
          let hour = parseInt(hours);
          if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
          if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
          
          const date = new Date();
          date.setHours(hour, parseInt(minutes), 0, 0);
          return date;
        }
        
        // Handle "tomorrow" format
        if (timeStr.toLowerCase().includes('tomorrow')) {
          const date = new Date();
          date.setDate(date.getDate() + 1);
          return date;
        }
        
        // Handle "next week" format
        if (timeStr.toLowerCase().includes('next week')) {
          const date = new Date();
          date.setDate(date.getDate() + 7);
          return date;
        }
        
        return null;
      } catch (error) {
        return null;
      }
    };
    
    // Set scheduled time
    const taskScheduledTime = scheduledTime || parseTime(message) || new Date();
    
    // Add task with automatic alerts
    await medicalAgentSystem.addTaskWithAlerts(user.uid, {
      title: taskTitle,
      description: `Task created via Telegram: ${taskTitle}`,
      category: 'study',
      priority: 'medium',
      scheduledTime: taskScheduledTime,
      deadline: new Date(taskScheduledTime.getTime() + 24 * 60 * 60 * 1000) // 24 hours from scheduled time
    });

    const responses = {
      en: `✅ *Task Added Successfully!*

*Task:* ${taskTitle}
*Status:* Active
*Alerts:* Scheduled automatically

I'll remind you at the right time! ⏰

*Next steps:*
• Use /tasks to view all tasks
• Use /alerts to check reminders
• Use /progress to track your study`,

      si: `✅ *කාර්යය සාර්ථකව එකතු කරන ලදී!*

*කාර්යය:* ${taskTitle}
*තත්වය:* ක්‍රියාකාරී
*අනතුරු ඇඟවීම්:* ස්වයංක්‍රීයව සකස් කරන ලදී

මම නිවැරදි වේලාවට ඔබට මතක් කරන්නම්! ⏰

*ඊළඟ පියවර:*
• සියලුම කාර්යයන් බැලීමට /tasks භාවිතා කරන්න
• මතක් කිරීම් පරීක්ෂා කිරීමට /alerts භාවිතා කරන්න
• ඔබේ අධ්‍යාපනය නිරීක්ෂණය කිරීමට /progress භාවිතා කරන්න`,

      ta: `✅ *பணி வெற்றிகரமாக சேர்க்கப்பட்டது!*

*பணி:* ${taskTitle}
*நிலை:* செயலில்
*எச்சரிக்கைகள்:* தானாக திட்டமிடப்பட்டது

நான் சரியான நேரத்தில் உங்களுக்கு நினைவூட்டுவேன்! ⏰

*அடுத்த படிகள்:*
• அனைத்து பணிகளையும் காண /tasks ஐப் பயன்படுத்தவும்
• நினைவூட்டல்களை சரிபார்க்க /alerts ஐப் பயன்படுத்தவும்
• உங்கள் படிப்பை கண்காணிக்க /progress ஐப் பயன்படுத்தவும்`
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
      description: `Reminder set via Telegram: ${reminderText}`,
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

// User guide command handler
async function handleUserGuideCommand(user, language) {
  try {
    const studentName = user.userData?.name ? `Dr. ${user.userData.name}` : 'Student';
    
    const responses = {
      en: `📖 *StethoLink AI - Comprehensive User Guide*

*Welcome, ${studentName}!*

**🎯 How to Use StethoLink AI:**

**1️⃣ Getting Started:**
• Send /start to begin
• Provide your name for personalized experience
• Send /agent to initialize your personal AI agent
• Use /guide anytime to see this guide

**2️⃣ Study Management Commands:**
```
✅ "Study cardiology at 6 PM"
✅ "Add task: review ECG cases tomorrow"
✅ "Remind me to practice drug calculations"
✅ "Set reminder for cardiology exam in 2 days"
```

**3️⃣ Note Management Commands:**
```
✅ "add note: ECG interpretation basics"
✅ "my notes" - View all notes
✅ "search notes: cardiology" - Find specific notes
```

**4️⃣ Medical Tool Commands:**
```
✅ "Calculate BMI for 70kg 1.75m"
✅ "Check drug interaction between warfarin and aspirin"
✅ "Find information about paracetamol"
✅ "Show me antibiotics for UTI"
```

**5️⃣ Clinical Practice Commands:**
```
✅ "Start patient simulation"
✅ "Show me emergency protocols"
✅ "Practice cardiology cases"
✅ "I want to practice ECG interpretation"
```

**6️⃣ Progress & Dashboard Commands:**
```
✅ "Show my study progress"
✅ "What tasks do I have today?"
✅ "Check my alerts"
✅ "dashboard" - Open web dashboard
```

**7️⃣ Natural Language Examples:**
```
✅ "I need to study pharmacology tonight"
✅ "Calculate my GFR if creatinine 1.2, weight 65kg, age 25, male"
✅ "Check warfarin and aspirin interaction"
✅ "Start a patient simulation"
```

**🔔 Enhanced Alert System:**
• Automatic scheduling when you set tasks
• Sound notifications (different for each priority)
• Voice reminders
• Telegram alerts with action buttons
• Dashboard notifications

**📝 Interactive Note System:**
• Step-by-step guided note creation
• Categories: anatomy, physiology, pathology, etc.
• Tags for easy searching
• Priority levels
• Full-text search

**🖥️ Dashboard Features:**
• Full note management
• Task tracking
• Medical calculators
• Drug database
• Clinical guidelines
• Patient simulations
• Progress analytics

**🎓 Professional Features:**
• Sri Lankan drug database
• National guidelines
• Multi-language support (English, Sinhala, Tamil)
• Evidence-based protocols
• Clinical decision support

**💡 Tips for Best Experience:**
• Type naturally like ChatGPT
• Use medical terminology
• Be specific with times and dates
• Use categories for notes
• Check dashboard for full features

**📞 Need Help?**
• Type "help" for quick commands
• Type "dashboard" for full web interface
• Type "my progress" to see your study analytics

*This is a professional medical assistant designed for Sri Lankan medical students.*`,
      si: `📖 *StethoLink AI - සවිස්තරාත්මක පරිශීලක මාර්ගෝපදේශය*

*සාදරයෙන් පිළිගනිමු, ${studentName}!*

**🎯 StethoLink AI භාවිතා කරන්නේ කෙසේද:**

**1️⃣ ආරම්භ කිරීම:**
• ආරම්භ කිරීමට /start යවන්න
• පුද්ගලික අත්දැකීමක් සඳහා ඔබේ නම සපයන්න
• ඔබේ පුද්ගලික AI agent ආරම්භ කිරීමට /agent යවන්න
• මෙම මාර්ගෝපදේශය බැලීමට /guide භාවිතා කරන්න`,
      ta: `📖 *StethoLink AI - விரிவான பயனர் வழிகாட்டி*

*வரவேற்கிறோம், ${studentName}!*

**🎯 StethoLink AI ஐ எவ்வாறு பயன்படுத்துவது:**

**1️⃣ தொடங்குதல்:**
• தொடங்க /start அனுப்பவும்
• தனிப்பட்ட அனுபவத்திற்கு உங்கள் பெயரை வழங்கவும்
• உங்கள் தனிப்பட்ட AI agent ஐத் தொடங்க /agent அனுப்பவும்
• இந்த வழிகாட்டியைப் பார்க்க /guide ஐப் பயன்படுத்தவும்`
    };

    return responses[language] || responses.en;
  } catch (error) {
    logger.error('❌ Error in user guide command:', error);
    return 'Sorry, could not load user guide. Please try again.';
  }
}

// Name handling command
async function handleNameCommand(message, user, language) {
  try {
    let name = '';
    
    // Extract name from various patterns
    if (message.toLowerCase().includes('my name is')) {
      name = message.substring(message.toLowerCase().indexOf('my name is') + 11).trim();
    } else if (message.toLowerCase().includes("i'm ")) {
      name = message.substring(message.toLowerCase().indexOf("i'm ") + 4).trim();
    } else if (message.toLowerCase().includes('i am ')) {
      name = message.substring(message.toLowerCase().indexOf('i am ') + 5).trim();
    } else if (message.toLowerCase().includes('call me')) {
      name = message.substring(message.toLowerCase().indexOf('call me') + 7).trim();
    } else if (message.toLowerCase().includes('this is ')) {
      name = message.substring(message.toLowerCase().indexOf('this is ') + 8).trim();
    }
    
    // Clean up the name
    name = name.replace(/^dr\.?\s*/i, '').replace(/^professor\s*/i, '').trim();
    
    if (!name || name.length < 2) {
      const responses = {
        en: `❌ *Name Not Recognized*

Please provide your full name clearly. Examples:
• "My name is John Smith"
• "I'm Dr. Sarah Perera"
• "Call me Dr. Rajapaksa"
• "This is Dr. Fernando"`,
              si: `❌ *Name Not Recognized*

Please provide your full name clearly. Examples:
• "My name is John Smith"
• "I'm Dr. Sarah Perera"`,
      ta: `❌ *Name Not Recognized*

Please provide your full name clearly. Examples:
• "My name is John Smith"
• "I'm Dr. Sarah Perera"`
      };
      return responses[language] || responses.en;
    }
    
    // Update user data with name
    user.userData = user.userData || {};
    user.userData.name = name;
    user.userData.updatedAt = new Date();
    
    // Save to database
    try {
      await updateUser(user.uid, { 
        name: name,
        updatedAt: new Date()
      });
    } catch (error) {
      logger.warn('Could not save name to database:', error.message);
    }
    
    const responses = {
      en: `✅ *Welcome, Dr. ${name}!*

*Your name has been saved for personalized assistance.*

**🎯 What would you like to do today?**

**📚 Study Management:**
• "Study cardiology at 6 PM"
• "Add task: review ECG cases tomorrow"
• "Remind me to practice drug calculations"

**📝 Note Management:**
• "add note: ECG interpretation basics"
• "my notes" - View all notes

**🧮 Medical Tools:**
• "Calculate BMI for 70kg 1.75m"
• "Check drug interaction warfarin aspirin"

**🎭 Clinical Practice:**
• "Start patient simulation"
• "Show me emergency protocols"

**📊 Quick Access:**
• /guide - View comprehensive user guide
• /help - See all commands
• /agent - Initialize your AI agent
• "dashboard" - Open web interface

*Type naturally - I understand medical terminology and will address you as Dr. ${name}.*`,
      si: `✅ *සාදරයෙන් පිළිගනිමු, Dr. ${name}!*

*පුද්ගලික උපකාර සඳහා ඔබේ නම සුරැකී ඇත.*

**🎯 අද ඔබට කළ යුත්තේ කුමක්ද?**

**📚 අධ්‍යාපන කළමනාකරණය:**
• "Study cardiology at 6 PM"
• "Add task: review ECG cases tomorrow"`,
      ta: `✅ *வரவேற்கிறோம், Dr. ${name}!*

*தனிப்பட்ட உதவிக்காக உங்கள் பெயர் சேமிக்கப்பட்டுள்ளது.*

**🎯 இன்று நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?**

**📚 படிப்பு மேலாண்மை:**
• "Study cardiology at 6 PM"
• "Add task: review ECG cases tomorrow"`
    };

    return responses[language] || responses.en;
  } catch (error) {
    logger.error('❌ Error in name command:', error);
    return 'Sorry, could not process your name. Please try again.';
  }
}

// Note confirmation handler
async function handleNoteConfirmation(message, user, language) {
  try {
    const lowerMessage = message.toLowerCase().trim();
    
    // Find user's temp note
    let tempNote = null;
    for (const [id, note] of global.tempNotes || []) {
      if (note.studentId === user.uid) {
        tempNote = { id, ...note };
        break;
      }
    }
    
    if (!tempNote) {
      return 'No pending note found. Please start with "add note: [content]"';
    }
    
    let response = '';
    
    if (lowerMessage.startsWith('title:')) {
      const title = message.substring(6).trim();
      tempNote.title = title;
      global.tempNotes.set(tempNote.id, tempNote);
      
      response = `✅ *Title set:* ${title}\n\n*Next:* Set category with "category: [category]"`;
      
    } else if (lowerMessage.startsWith('category:')) {
      const category = message.substring(9).trim();
      const validCategories = ['anatomy', 'physiology', 'pathology', 'pharmacology', 'clinical', 'surgery', 'medicine', 'pediatrics', 'emergency', 'radiology', 'research', 'exam_notes', 'case_studies', 'procedures', 'drugs', 'calculations', 'guidelines', 'personal', 'other'];
      
      if (!validCategories.includes(category)) {
        return `❌ Invalid category. Please choose from: ${validCategories.join(', ')}`;
      }
      
      tempNote.category = category;
      global.tempNotes.set(tempNote.id, tempNote);
      
      response = `✅ *Category set:* ${category}\n\n*Next:* Set tags with "tags: [tag1, tag2, tag3]" (optional)`;
      
    } else if (lowerMessage.startsWith('tags:')) {
      const tagsText = message.substring(5).trim();
      const tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      tempNote.tags = tags;
      global.tempNotes.set(tempNote.id, tempNote);
      
      response = `✅ *Tags set:* ${tags.join(', ')}\n\n*Next:* Set priority with "priority: [low/medium/high]"`;
      
    } else if (lowerMessage.startsWith('priority:')) {
      const priority = message.substring(9).trim();
      const validPriorities = ['low', 'medium', 'high'];
      
      if (!validPriorities.includes(priority)) {
        return `❌ Invalid priority. Please choose: low, medium, or high`;
      }
      
      tempNote.priority = priority;
      global.tempNotes.set(tempNote.id, tempNote);
      
      // Now save the complete note
      const noteData = {
        title: tempNote.title || 'Untitled Note',
        content: tempNote.content,
        category: tempNote.category || 'other',
        tags: tempNote.tags || [],
        priority: tempNote.priority || 'medium'
      };
      
      const result = await notebookService.addNote(user.uid, noteData);
      
      // Remove temp note
      global.tempNotes.delete(tempNote.id);
      
      if (result.success) {
        response = `📝 *Note Saved Successfully!*

*Title:* ${result.note.title}
*Category:* ${result.note.category}
*Tags:* ${result.note.tags.join(', ') || 'None'}
*Priority:* ${result.note.priority}
*Word Count:* ${result.note.wordCount}

*Commands:*
• "my notes" - View all notes
• "search notes: [keyword]" - Find notes
• "add note: [content]" - Add another note
• "dashboard" - Full note management`;
      } else {
        response = '❌ Error saving note. Please try again.';
      }
    }
    
    return response;
  } catch (error) {
    logger.error('❌ Error in note confirmation:', error);
    return 'Sorry, could not process note confirmation. Please try again.';
  }
}

// Notebook command handlers
async function handleAddNoteCommand(message, user, language) {
  try {
    // Extract note content from message
    const noteMatch = message.match(/add note:\s*(.+)/i) || 
                     message.match(/new note:\s*(.+)/i) || 
                     message.match(/create note:\s*(.+)/i);
    
    if (!noteMatch) {
      const responses = {
        en: `📝 *Add Note*

Please provide your note content:
"add note: [your note content]"

*Examples:*
• "add note: Cardiology - ECG interpretation key points"
• "add note: Drug interactions for warfarin"
• "add note: Clinical case - chest pain differential diagnosis"

*Categories available:* anatomy, physiology, pathology, pharmacology, clinical, surgery, medicine, pediatrics, emergency, radiology, research, exam_notes, case_studies, procedures, drugs, calculations, guidelines, personal, other

*After adding, I'll ask for:*
• Note title
• Category
• Tags (optional)
• Priority level`,
        si: `📝 *සටහන එකතු කිරීම*

කරුණාකර ඔබේ සටහනේ අන්තර්ගතය සපයන්න:
"add note: [ඔබේ සටහනේ අන්තර්ගතය]"

*උදාහරණ:*
• "add note: Cardiology - ECG interpretation key points"
• "add note: Drug interactions for warfarin"
• "add note: Clinical case - chest pain differential diagnosis"`,
        ta: `📝 *குறிப்பு சேர்க்க*

உங்கள் குறிப்பு உள்ளடக்கத்தை வழங்கவும்:
"add note: [உங்கள் குறிப்பு உள்ளடக்கம்]"

*எடுத்துக்காட்டுகள்:*
• "add note: Cardiology - ECG interpretation key points"
• "add note: Drug interactions for warfarin"
• "add note: Clinical case - chest pain differential diagnosis"`
      };
      return responses[language] || responses.en;
    }

    const noteContent = noteMatch[1].trim();
    
    // Store note content temporarily for user to confirm
    if (!global.tempNotes) {
      global.tempNotes = new Map();
    }
    
    const tempNoteId = uuidv4();
    global.tempNotes.set(tempNoteId, {
      studentId: user.uid,
      content: noteContent,
      createdAt: new Date()
    });

    const responses = {
      en: `📝 *Note Content Received!*

*Content:* ${noteContent}

*Next steps:*
1️⃣ *Title:* What would you like to name this note?
   Reply with: "title: [your title]"

2️⃣ *Category:* Which category fits best?
   Reply with: "category: [category]"

3️⃣ *Tags:* Any tags for easy finding? (optional)
   Reply with: "tags: [tag1, tag2, tag3]"

4️⃣ *Priority:* How important is this note?
   Reply with: "priority: [low/medium/high]"

*Available categories:* anatomy, physiology, pathology, pharmacology, clinical, surgery, medicine, pediatrics, emergency, radiology, research, exam_notes, case_studies, procedures, drugs, calculations, guidelines, personal, other

*Example:* "title: ECG Interpretation Guide"`,
      si: `📝 *සටහනේ අන්තර්ගතය ලැබුණි!*

*අන්තර්ගතය:* ${noteContent}

*ඊළඟ පියවර:*
1️⃣ *ශීර්ෂය:* මෙම සටහන නම් කිරීමට ඔබට අවශ්‍ය දේ කුමක්ද?
   පිළිතුරු: "title: [ඔබේ ශීර්ෂය]"

2️⃣ *වර්ගය:* කුමන වර්ගය හොඳින් ගැලපේද?
   පිළිතුරු: "category: [වර්ගය]"`,
      ta: `📝 *குறிப்பு உள்ளடக்கம் பெறப்பட்டது!*

*உள்ளடக்கம்:* ${noteContent}

*அடுத்த படிகள்:*
1️⃣ *தலைப்பு:* இந்த குறிப்பை என்ன பெயரிட விரும்புகிறீர்கள்?
   பதில்: "title: [உங்கள் தலைப்பு]"

2️⃣ *வகை:* எந்த வகை சிறப்பாக பொருந்துகிறது?
   பதில்: "category: [வகை]"`
    };

    return responses[language] || responses.en;
  } catch (error) {
    logger.error('❌ Error in add note command:', error);
    return 'Sorry, could not process note. Please try again.';
  }
}

async function handleNotesCommand(user, language) {
  try {
    const result = await notebookService.getNotes(user.uid, { limit: 10 });
    
    if (!result.success || result.notes.length === 0) {
      const responses = {
        en: `📝 *Your Notes*

No notes found. Start by adding your first note!

*Quick commands:*
• "add note: [your content]"
• "search notes: [keyword]"
• "my notes" - View all notes

*Example:* "add note: Cardiology - ECG interpretation key points"`,
        si: `📝 *ඔබේ සටහන්*

සටහන් හමු නොවීය. ඔබේ පළමු සටහන එකතු කිරීමෙන් ආරම්භ කරන්න!`,
        ta: `📝 *உங்கள் குறிப்புகள்*

குறிப்புகள் எதுவும் கிடைக்கவில்லை. உங்கள் முதல் குறிப்பை சேர்ப்பதன் மூலம் தொடங்கவும்!`
      };
      return responses[language] || responses.en;
    }

    let response = language === 'si' ? '📝 *ඔබේ සටහන්*\n\n' :
                   language === 'ta' ? '📝 *உங்கள் குறிப்புகள்*\n\n' :
                   '📝 *Your Notes*\n\n';

    result.notes.forEach((note, index) => {
      const date = new Date(note.updatedAt).toLocaleDateString();
      response += `${index + 1}. *${note.title}*\n`;
      response += `   📂 ${note.category} | 📅 ${date}\n`;
      response += `   📝 ${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}\n\n`;
    });

    response += `*Total:* ${result.total} notes\n`;
    response += `*Commands:*\n`;
    response += `• "search notes: [keyword]" - Find specific notes\n`;
    response += `• "add note: [content]" - Add new note\n`;
    response += `• "dashboard" - Open web dashboard for full management`;

    return response;
  } catch (error) {
    logger.error('❌ Error in notes command:', error);
    return 'Sorry, could not retrieve notes. Please try again.';
  }
}

async function handleSearchNotesCommand(message, user, language) {
  try {
    const searchMatch = message.match(/search notes:\s*(.+)/i) || 
                       message.match(/find note:\s*(.+)/i);
    
    if (!searchMatch) {
      const responses = {
        en: `🔍 *Search Notes*

Please provide search term:
"search notes: [keyword]"

*Examples:*
• "search notes: cardiology"
• "search notes: ECG interpretation"
• "search notes: drug interactions"`,
        si: `🔍 *සටහන් සොයා ගැනීම*

කරුණාකර සොයා ගැනීමේ වචනය සපයන්න:
"search notes: [keyword]"`,
        ta: `🔍 *குறிப்புகளைத் தேடுங்கள்*

தேடல் சொல்லை வழங்கவும்:
"search notes: [keyword]"`
      };
      return responses[language] || responses.en;
    }

    const searchTerm = searchMatch[1].trim();
    const result = await notebookService.searchNotes(user.uid, searchTerm, { limit: 5 });
    
    if (!result.success || result.notes.length === 0) {
      const responses = {
        en: `🔍 *Search Results*

No notes found for "${searchTerm}"

*Try:*
• Different keywords
• "add note: [content]" to create new note
• "my notes" to see all notes`,
        si: `🔍 *සොයා ගැනීමේ ප්‍රතිඵල*

"${searchTerm}" සඳහා සටහන් හමු නොවීය`,
        ta: `🔍 *தேடல் முடிவுகள்*

"${searchTerm}" க்கு குறிப்புகள் எதுவும் கிடைக்கவில்லை`
      };
      return responses[language] || responses.en;
    }

    let response = language === 'si' ? `🔍 *සොයා ගැනීමේ ප්‍රතිඵල: "${searchTerm}"*\n\n` :
                   language === 'ta' ? `🔍 *தேடல் முடிவுகள்: "${searchTerm}"*\n\n` :
                   `🔍 *Search Results: "${searchTerm}"*\n\n`;

    result.notes.forEach((note, index) => {
      const date = new Date(note.updatedAt).toLocaleDateString();
      response += `${index + 1}. *${note.title}*\n`;
      response += `   📂 ${note.category} | 📅 ${date}\n`;
      response += `   📝 ${note.content.substring(0, 150)}${note.content.length > 150 ? '...' : ''}\n\n`;
    });

    response += `*Found:* ${result.total} notes\n`;
    response += `*Commands:*\n`;
    response += `• "add note: [content]" - Add new note\n`;
    response += `• "my notes" - View all notes\n`;
    response += `• "dashboard" - Full note management`;

    return response;
  } catch (error) {
    logger.error('❌ Error in search notes command:', error);
    return 'Sorry, could not search notes. Please try again.';
  }
}

async function handleDashboardCommand(user, language) {
  try {
    const dashboardUrl = `http://localhost:3000/dashboard.html?userId=${user.uid}`;
    
    const responses = {
      en: `🖥️ *StethoLink AI Dashboard*

*Access your full dashboard:*
${dashboardUrl}

*What you can do in the dashboard:*
📚 **Study Management**
• View all tasks and progress
• Add/edit notes with rich formatting
• Track study analytics

🧮 **Medical Tools**
• All calculators (BMI, GFR, CHADS2)
• Drug database and interactions
• Clinical guidelines

🎭 **Clinical Practice**
• Patient simulations
• Emergency protocols
• Case studies

📊 **Advanced Features**
• Medical image analysis
• Research assistant
• Evidence-based medicine
• Performance tracking

*Quick access commands:*
• "my tasks" - View tasks
• "my notes" - View notes
• "my progress" - View progress
• "add note: [content]" - Add note

*Need help?* Type "help" for all commands!`,
      si: `🖥️ *StethoLink AI Dashboard*

*ඔබේ සම්පූර්ණ dashboard වෙත ප්‍රවේශය:*
${dashboardUrl}

*Dashboard හි ඔබට කළ හැක්කේ:*
📚 **අධ්‍යාපන කළමනාකරණය**
• සියලුම කාර්යයන් සහ ප්‍රගතිය බලන්න
• සටහන් එකතු කිරීම/සංස්කරණය කිරීම
• අධ්‍යාපන විශ්ලේෂණ ලුහුබැඳීම`,
      ta: `🖥️ *StethoLink AI Dashboard*

*உங்கள் முழு dashboard க்கு அணுகல்:*
${dashboardUrl}

*Dashboard இல் நீங்கள் செய்யக்கூடியவை:*
📚 **படிப்பு மேலாண்மை**
• அனைத்து பணிகளையும் முன்னேற்றத்தையும் காண்க
• குறிப்புகளை சேர்க்க/திருத்து
• படிப்பு பகுப்பாய்வு`
    };

    return responses[language] || responses.en;
  } catch (error) {
    logger.error('❌ Error in dashboard command:', error);
    return 'Sorry, could not access dashboard. Please try again.';
  }
}

// Handle callback queries (button clicks)
bot.on('callback_query', async (callbackQuery) => {
  try {
    const { data, message, from } = callbackQuery;
    const user = await getUserByTelegramId(from.id);
    
    if (!user) {
      await bot.answerCallbackQuery(callbackQuery.id, 'User not found. Please start with /start');
      return;
    }

    let response = '';
    
    switch (data) {
      case 'add_task':
        response = '📝 *Add a New Task*\n\nType your task with time:\n\nExamples:\n• "Study cardiology at 6 PM"\n• "Review ECG cases tomorrow"\n• "Practice drug calculations at 3 PM"';
        break;
        
      case 'my_tasks':
        const agent = await medicalAgentSystem.getAgent(user.uid || user.id);
        const tasks = agent.currentTasks || [];
        if (tasks.length === 0) {
          response = '📋 *Your Tasks*\n\nNo tasks found. Add your first task!\n\nTry: "add task: study cardiology"';
        } else {
          response = '📋 *Your Tasks*\n\n' + tasks.map((task, index) => 
            `${index + 1}. ${task.title}\n   📅 ${task.deadline}\n   ⏰ ${task.scheduledTime || 'No alert'}\n   📊 ${task.status}`
          ).join('\n\n');
        }
        break;
        
      case 'my_alerts':
        const agentAlerts = await medicalAgentSystem.getAgent(user.uid || user.id);
        const alerts = agentAlerts.currentAlerts || [];
        if (alerts.length === 0) {
          response = '⏰ *Your Alerts*\n\nNo pending alerts.';
        } else {
          response = '⏰ *Your Alerts*\n\n' + alerts.map((alert, index) => 
            `${index + 1}. ${alert.title}\n   ⏰ ${alert.scheduledTime}\n   📊 ${alert.priority}`
          ).join('\n\n');
        }
        break;
        
      case 'progress':
        response = '📊 *Study Progress*\n\nFeature coming soon! Track your study performance and analytics.';
        break;
        
      case 'add_note':
        response = '📝 *Add a New Note*\n\nType: "add note: [your note content]"\n\nExamples:\n• "add note: ECG interpretation basics"\n• "add note: Drug interactions summary"\n• "add note: Clinical guidelines for diabetes"';
        break;
        
      case 'my_notes':
        response = '📖 *My Notes*\n\nType: "my notes" to view all your notes\n\nOr search: "search notes: [keyword]"';
        break;
        
      case 'drugs':
        response = '💊 *Drug Information*\n\nType a drug name to get information:\n\nExamples:\n• "paracetamol"\n• "aspirin"\n• "warfarin"\n\nOr check interactions:\n• "check drug interaction warfarin aspirin"';
        break;
        
      case 'calculator':
        response = '🧮 *Medical Calculators*\n\nAvailable calculators:\n• BMI Calculator\n• GFR Calculator\n• CHADS2 Score\n\nType:\n• "Calculate BMI for 70kg 1.75m"\n• "Calculate GFR for creatinine 1.2"\n• "Calculate CHADS2 score"';
        break;
        
      case 'guidelines':
        response = '📋 *Clinical Guidelines*\n\nType a condition for guidelines:\n\nExamples:\n• "dengue fever"\n• "hypertension"\n• "diabetes"\n• "myocardial infarction"';
        break;
        
      case 'simulation':
        response = '🎭 *Patient Simulation*\n\nType: "Start patient simulation"\n\nOr use: /simulate';
        break;
        
      case 'dashboard':
        response = '🖥️ *Web Dashboard*\n\nAccess your full dashboard at:\nhttp://localhost:3000/dashboard.html\n\nAll features available in web interface!';
        break;
        
      case 'guide':
        response = '📖 *User Guide*\n\nType: /guide\n\nFor comprehensive help and examples.';
        break;
        
      case 'search_notes':
        response = '🔍 *Search Notes*\n\nType: "search notes: [keyword]"\n\nExamples:\n• "search notes: cardiology"\n• "search notes: ECG"\n• "search notes: diabetes"';
        break;
        
      default:
        response = 'Unknown button. Please try again.';
    }
    
    await bot.editMessageText(response, {
      chat_id: message.chat.id,
      message_id: message.message_id,
      parse_mode: 'Markdown'
    });
    
    await bot.answerCallbackQuery(callbackQuery.id);
    
  } catch (error) {
    logger.error('❌ Error handling callback query:', error);
    await bot.answerCallbackQuery(callbackQuery.id, 'Error occurred. Please try again.');
  }
});

module.exports = {
  initializeTelegramBot,
  processTelegramWebhook
}; 