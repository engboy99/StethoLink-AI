require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
// Simple logger for the bot
const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[ERROR] ${message}`, error || ''),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data || '')
};

// Initialize bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Simple agent command with buttons
bot.onText(/\/agent/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    
    const message = `🤖 *AI Agent Initialized Successfully!*

*Agent ID:* 124d6c15-f6e0-45a5-991a-2575ec12fbe1
*Student:* Imesha Udayangani
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

*Quick Access Buttons Below:* 👇

Your agent is now active and ready to help! 🚀`;

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

    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: inlineKeyboard
    });

    logger.info('✅ Agent command with buttons sent successfully');
    
  } catch (error) {
    logger.error('❌ Error in agent command:', error);
    await bot.sendMessage(msg.chat.id, 'Sorry, agent initialization failed.');
  }
});

// Help command with buttons
bot.onText(/\/help/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    
    const message = `🏥 *StethoLink AI Agent Help*

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

*Quick Access Buttons Below:* 👇

Start by typing a command or medical term!`;

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

    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: inlineKeyboard
    });

    logger.info('✅ Help command with buttons sent successfully');
    
  } catch (error) {
    logger.error('❌ Error in help command:', error);
    await bot.sendMessage(msg.chat.id, 'Sorry, could not load help menu.');
  }
});

// Handle callback queries (button clicks)
bot.on('callback_query', async (callbackQuery) => {
  try {
    const { data, message, from } = callbackQuery;
    
    let response = '';
    
    switch (data) {
      case 'add_task':
        response = '📝 *Add a New Task*\n\nType your task with time:\n\nExamples:\n• "Study cardiology at 6 PM"\n• "Review ECG cases tomorrow"\n• "Practice drug calculations at 3 PM"';
        break;
        
      case 'my_tasks':
        response = '📋 *Your Tasks*\n\nNo tasks found. Add your first task!\n\nTry: "add task: study cardiology"';
        break;
        
      case 'my_alerts':
        response = '⏰ *Your Alerts*\n\nNo pending alerts.';
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
        
      case 'search_notes':
        response = '🔍 *Search Notes*\n\nType: "search notes: [keyword]"\n\nExamples:\n• "search notes: cardiology"\n• "search notes: ECG"\n• "search notes: diabetes"';
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

// Start command
bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    
    const message = `🏥 *Welcome to StethoLink AI!*

I'm Dr. StethoLink, your AI medical assistant for Sri Lankan medical students.

*Available Commands:*
• Type your symptoms for diagnosis
• Send voice message for voice-to-text
• /simulate - Start patient simulation
• /history - View your case history
• /mentor - Get motivational tips
• /vault - Download your clinical log

*Advanced Features:*
• /calculator - Medical calculators
• /drugs - Sri Lankan drug database
• /guidelines - Clinical guidelines
• /interactions - Drug interactions
• /decision - Clinical decision support
• /education - Patient education
• /evidence - Evidence-based medicine
• /help - Show this menu

*Languages Supported:* 🇱🇰 Sinhala (සිංහල) 🇮🇳 Tamil (தமிழ்) 🇺🇸 English

*Quick Access Buttons Below:* 👇

Start by describing symptoms or use a command!`;

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

    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: inlineKeyboard
    });
    
    logger.info('✅ Start command with buttons sent successfully');
    
  } catch (error) {
    logger.error('❌ Error in start command:', error);
    await bot.sendMessage(msg.chat.id, 'Welcome to StethoLink AI!');
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
    const text = msg.text || '';

    // Simple response for now
    const response = `💬 *Message Received*

You said: "${text}"

*Try these commands:*
• /agent - Initialize your AI agent with buttons
• /help - Show help menu with buttons
• /start - Welcome message

*Or type naturally:*
• "Study cardiology at 6 PM"
• "add note: ECG interpretation basics"
• "Calculate BMI for 70kg 1.75m"`;

    await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    
  } catch (error) {
    logger.error('❌ Error handling text message:', error);
  }
});

logger.info('✅ Simple Telegram bot with buttons initialized successfully');

module.exports = bot; 