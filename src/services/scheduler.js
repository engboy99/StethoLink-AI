const cron = require('node-cron');
const { logger, medicalLogger } = require('../utils/logger');
const { generateMotivationalMessage } = require('./ai');
const { 
  getActiveReminders, 
  saveReminder, 
  logAnalytics,
  getDb,
  collections 
} = require('../config/firebase');

let scheduler;

// Initialize scheduler
async function initializeScheduler() {
  try {
    logger.info('⏰ Initializing scheduler...');
    
    // Wait a moment for Firebase to be fully initialized
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Schedule daily motivational messages
    scheduleDailyMotivationalMessages();
    
    // Schedule reminder processing
    scheduleReminderProcessing();
    
    // Schedule analytics cleanup
    scheduleAnalyticsCleanup();
    
    // Schedule health checks
    scheduleHealthChecks();
    
    logger.info('✅ Scheduler initialized successfully');
  } catch (error) {
    logger.error('❌ Error initializing scheduler:', error);
    throw error;
  }
}

// Schedule daily motivational messages
function scheduleDailyMotivationalMessages() {
  // Send motivational messages every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    try {
      logger.info('🎓 Sending daily motivational messages...');
      
      // Get all active users
      const usersSnapshot = await getDb().collection(collections.USERS)
        .where('isActive', '==', true)
        .where('preferences.dailyReminders', '==', true)
        .get();

      let successCount = 0;
      let errorCount = 0;

      for (const userDoc of usersSnapshot.docs) {
        try {
          const user = userDoc.data();
          const language = user.language || 'en';
          
          // Generate motivational message
          const motivation = await generateMotivationalMessage(language, 'daily');
          
          // Save reminder
          await saveReminder({
            userId: user.uid,
            type: 'motivational',
            message: motivation.message,
            language: language,
            scheduledFor: new Date(),
            platform: user.platform || 'api'
          });

          // Log analytics
          await logAnalytics({
            event: 'daily_motivational_sent',
            userId: user.uid,
            language: language,
            platform: user.platform || 'api'
          });

          successCount++;
          
        } catch (error) {
          logger.error('❌ Error sending motivational message to user:', {
            userId: userDoc.id,
            error: error.message
          });
          errorCount++;
        }
      }

      logger.info('✅ Daily motivational messages completed', {
        successCount,
        errorCount,
        totalUsers: usersSnapshot.size
      });

    } catch (error) {
      logger.error('❌ Error in daily motivational messages job:', error);
    }
  }, {
    timezone: 'Asia/Colombo'
  });

  logger.info('✅ Daily motivational messages scheduled (8:00 AM daily)');
}

// Schedule reminder processing
function scheduleReminderProcessing() {
  // Process reminders every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      logger.info('⏰ Processing scheduled reminders...');
      
      const now = new Date();
      const remindersSnapshot = await getDb().collection(collections.REMINDERS)
        .where('isActive', '==', true)
        .where('scheduledFor', '<=', now)
        .get();

      let processedCount = 0;
      let errorCount = 0;

      for (const reminderDoc of remindersSnapshot.docs) {
        try {
          const reminder = reminderDoc.data();
          
          // Process the reminder based on type
          await processReminder(reminder);
          
          // Mark reminder as processed
          await reminderDoc.ref.update({
            isActive: false,
            processedAt: new Date()
          });

          processedCount++;
          
        } catch (error) {
          logger.error('❌ Error processing reminder:', {
            reminderId: reminderDoc.id,
            error: error.message
          });
          errorCount++;
        }
      }

      logger.info('✅ Reminder processing completed', {
        processedCount,
        errorCount,
        totalReminders: remindersSnapshot.size
      });

    } catch (error) {
      logger.error('❌ Error in reminder processing job:', error);
    }
  });

  logger.info('✅ Reminder processing scheduled (every 15 minutes)');
}

// Process individual reminder
async function processReminder(reminder) {
  try {
    switch (reminder.type) {
      case 'motivational':
        await processMotivationalReminder(reminder);
        break;
      case 'practice':
        await processPracticeReminder(reminder);
        break;
      case 'exam':
        await processExamReminder(reminder);
        break;
      default:
        logger.warn('⚠️ Unknown reminder type:', reminder.type);
    }
  } catch (error) {
    logger.error('❌ Error processing reminder:', error);
    throw error;
  }
}

// Process motivational reminder
async function processMotivationalReminder(reminder) {
  try {
    // For now, just log the reminder
    // In a full implementation, you'd send the message via the appropriate platform
    logger.info('💌 Motivational reminder processed', {
      userId: reminder.userId,
      message: reminder.message.substring(0, 100) + '...',
      language: reminder.language
    });

    // Log analytics
    await logAnalytics({
      event: 'motivational_reminder_processed',
      userId: reminder.userId,
      language: reminder.language,
      platform: reminder.platform
    });

  } catch (error) {
    logger.error('❌ Error processing motivational reminder:', error);
    throw error;
  }
}

// Process practice reminder
async function processPracticeReminder(reminder) {
  try {
    logger.info('📚 Practice reminder processed', {
      userId: reminder.userId,
      message: reminder.message.substring(0, 100) + '...',
      language: reminder.language
    });

    // Log analytics
    await logAnalytics({
      event: 'practice_reminder_processed',
      userId: reminder.userId,
      language: reminder.language,
      platform: reminder.platform
    });

  } catch (error) {
    logger.error('❌ Error processing practice reminder:', error);
    throw error;
  }
}

// Process exam reminder
async function processExamReminder(reminder) {
  try {
    logger.info('📝 Exam reminder processed', {
      userId: reminder.userId,
      message: reminder.message.substring(0, 100) + '...',
      language: reminder.language
    });

    // Log analytics
    await logAnalytics({
      event: 'exam_reminder_processed',
      userId: reminder.userId,
      language: reminder.language,
      platform: reminder.platform
    });

  } catch (error) {
    logger.error('❌ Error processing exam reminder:', error);
    throw error;
  }
}

// Schedule analytics cleanup
function scheduleAnalyticsCleanup() {
  // Clean up old analytics data every day at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      logger.info('🧹 Cleaning up old analytics data...');
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const oldAnalyticsSnapshot = await getDb().collection(collections.ANALYTICS)
        .where('timestamp', '<', thirtyDaysAgo)
        .limit(1000) // Process in batches
        .get();

      let deletedCount = 0;
      let errorCount = 0;

      for (const doc of oldAnalyticsSnapshot.docs) {
        try {
          await doc.ref.delete();
          deletedCount++;
        } catch (error) {
          logger.error('❌ Error deleting old analytics:', error);
          errorCount++;
        }
      }

      logger.info('✅ Analytics cleanup completed', {
        deletedCount,
        errorCount
      });

    } catch (error) {
      logger.error('❌ Error in analytics cleanup job:', error);
    }
  }, {
    timezone: 'Asia/Colombo'
  });

  logger.info('✅ Analytics cleanup scheduled (2:00 AM daily)');
}

// Schedule health checks
function scheduleHealthChecks() {
  // Run health checks every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      logger.info('🏥 Running scheduled health checks...');
      
      // Check database connectivity
      await checkDatabaseHealth();
      
      // Check AI service health
      await checkAIServiceHealth();
      
      // Log system metrics
      await logSystemMetrics();
      
      logger.info('✅ Health checks completed successfully');
      
    } catch (error) {
      logger.error('❌ Error in health checks job:', error);
    }
  });

  logger.info('✅ Health checks scheduled (every 5 minutes)');
}

// Check database health
async function checkDatabaseHealth() {
  try {
    const healthDoc = await getDb().collection('health').doc('scheduler').get();
    
    if (!healthDoc.exists) {
              await getDb().collection('health').doc('scheduler').set({
        lastCheck: new Date(),
        status: 'healthy',
        uptime: process.uptime()
      });
    } else {
              await getDb().collection('health').doc('scheduler').update({
        lastCheck: new Date(),
        status: 'healthy',
        uptime: process.uptime()
      });
    }

    logger.debug('✅ Database health check passed');
    
  } catch (error) {
    logger.error('❌ Database health check failed:', error);
    throw error;
  }
}

// Check AI service health
async function checkAIServiceHealth() {
  try {
    // Simple test to check if AI service is responsive
    const testMessage = await generateMotivationalMessage('en', 'daily');
    
    if (testMessage && testMessage.message) {
      logger.debug('✅ AI service health check passed');
    } else {
      throw new Error('AI service returned empty response');
    }
    
  } catch (error) {
    logger.error('❌ AI service health check failed:', error);
    throw error;
  }
}

// Log system metrics
async function logSystemMetrics() {
  try {
    const metrics = {
      timestamp: new Date(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version
    };

    await logAnalytics({
      event: 'system_metrics',
      data: metrics
    });

    logger.debug('✅ System metrics logged');
    
  } catch (error) {
    logger.error('❌ Error logging system metrics:', error);
  }
}

// Create reminder for user
async function createUserReminder(userId, type, message, scheduledFor, language = 'en', platform = 'api') {
  try {
    const reminderId = await saveReminder({
      userId,
      type,
      message,
      language,
      platform,
      scheduledFor: new Date(scheduledFor)
    });

    logger.info('✅ User reminder created', {
      reminderId,
      userId,
      type,
      scheduledFor
    });

    return reminderId;
    
  } catch (error) {
    logger.error('❌ Error creating user reminder:', error);
    throw error;
  }
}

// Get user reminders
async function getUserReminders(userId) {
  try {
    const reminders = await getActiveReminders(userId);
    
    logger.info('✅ User reminders retrieved', {
      userId,
      count: reminders.length
    });

    return reminders;
    
  } catch (error) {
    logger.error('❌ Error getting user reminders:', error);
    throw error;
  }
}

// Stop scheduler
function stopScheduler() {
  try {
    if (scheduler) {
      scheduler.stop();
      logger.info('✅ Scheduler stopped');
    }
  } catch (error) {
    logger.error('❌ Error stopping scheduler:', error);
  }
}

module.exports = {
  initializeScheduler,
  createUserReminder,
  getUserReminders,
  stopScheduler
}; 