const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

let db;
let auth;

function initializeFirebase() {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      db = admin.firestore();
      auth = admin.auth();
      logger.info('✅ Firebase already initialized');
      return;
    }

    // Initialize Firebase Admin SDK
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
    });

    db = admin.firestore();
    auth = admin.auth();

    // Configure Firestore settings
    db.settings({
      ignoreUndefinedProperties: true,
      timestampsInSnapshots: true
    });

    logger.info('✅ Firebase initialized successfully');
    
    // Test connection
    return getDb().collection('health').doc('test').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'connected'
    }).then(() => {
      logger.info('✅ Firebase connection test successful');
    }).catch((error) => {
      logger.error('❌ Firebase connection test failed:', error);
    });

  } catch (error) {
    logger.error('❌ Error initializing Firebase:', error);
    throw error;
  }
}

// Database collections
const collections = {
  USERS: 'users',
  CASES: 'cases',
  CONVERSATIONS: 'conversations',
  SIMULATIONS: 'simulations',
  MENTORS: 'mentors',
  REMINDERS: 'reminders',
  ANALYTICS: 'analytics',
  DISEASES: 'diseases',
  MEDICATIONS: 'medications',
  VOICE_MESSAGES: 'voice_messages'
};

// User management functions
async function createUser(userData) {
  try {
    const userRecord = await auth.createUser({
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      displayName: userData.displayName,
      password: userData.password
    });

    // Create user document in Firestore
    await getDb().collection(collections.USERS).doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      displayName: userData.displayName,
      language: userData.language || 'en',
      platform: userData.platform || 'whatsapp',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      preferences: {
        notifications: true,
        dailyReminders: true,
        language: userData.language || 'en'
      },
      stats: {
        totalCases: 0,
        totalSimulations: 0,
        streakDays: 0,
        lastActive: admin.firestore.FieldValue.serverTimestamp()
      }
    });

    logger.info(`✅ User created successfully: ${userRecord.uid}`);
    return userRecord;
  } catch (error) {
    logger.error('❌ Error creating user:', error);
    throw error;
  }
}

async function getUser(uid) {
  try {
    const userDoc = await getDb().collection(collections.USERS).doc(uid).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    return userDoc.data();
  } catch (error) {
    logger.error('❌ Error getting user:', error);
    throw error;
  }
}

async function updateUser(uid, updateData) {
  try {
    await getDb().collection(collections.USERS).doc(uid).update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    logger.info(`✅ User updated successfully: ${uid}`);
  } catch (error) {
    logger.error('❌ Error updating user:', error);
    throw error;
  }
}

// Case management functions
async function saveCase(caseData) {
  try {
    const caseRef = await getDb().collection(collections.CASES).add({
      ...caseData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user stats
    await updateUserStats(caseData.userId, 'totalCases');

    logger.info(`✅ Case saved successfully: ${caseRef.id}`);
    return caseRef.id;
  } catch (error) {
    logger.error('❌ Error saving case:', error);
    throw error;
  }
}

async function getCases(userId, limit = 10) {
  try {
    const casesSnapshot = await getDb().collection(collections.CASES)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const cases = [];
    casesSnapshot.forEach(doc => {
      cases.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return cases;
  } catch (error) {
    logger.error('❌ Error getting cases:', error);
    throw error;
  }
}

// Conversation management
async function saveConversation(conversationData) {
  try {
    const conversationRef = await getDb().collection(collections.CONVERSATIONS).add({
      ...conversationData,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logger.info(`✅ Conversation saved: ${conversationRef.id}`);
    return conversationRef.id;
  } catch (error) {
    logger.error('❌ Error saving conversation:', error);
    throw error;
  }
}

// Simulation management
async function saveSimulation(simulationData) {
  try {
    const simulationRef = await getDb().collection(collections.SIMULATIONS).add({
      ...simulationData,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user stats
    await updateUserStats(simulationData.userId, 'totalSimulations');

    logger.info(`✅ Simulation saved: ${simulationRef.id}`);
    return simulationRef.id;
  } catch (error) {
    logger.error('❌ Error saving simulation:', error);
    throw error;
  }
}

// Voice message storage
async function saveVoiceMessage(messageData) {
  try {
    const messageRef = await getDb().collection(collections.VOICE_MESSAGES).add({
      ...messageData,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logger.info(`✅ Voice message saved: ${messageRef.id}`);
    return messageRef.id;
  } catch (error) {
    logger.error('❌ Error saving voice message:', error);
    throw error;
  }
}

// Analytics
async function logAnalytics(analyticsData) {
  try {
    await getDb().collection(collections.ANALYTICS).add({
      ...analyticsData,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    logger.error('❌ Error logging analytics:', error);
  }
}

// Save analytics data to specific collection
async function saveAnalytics(collection, data) {
  try {
    const analyticsRef = await getDb().collection(collection).add({
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    logger.info(`✅ Analytics saved to ${collection}: ${analyticsRef.id}`);
    return analyticsRef.id;
  } catch (error) {
    logger.error(`❌ Error saving analytics to ${collection}:`, error);
    throw error;
  }
}

// Get user analytics data
async function getUserAnalytics(userId, timeRange = '30d') {
  try {
    const timeLimit = new Date();
    
    // Calculate time range
    switch (timeRange) {
      case '7d':
        timeLimit.setDate(timeLimit.getDate() - 7);
        break;
      case '30d':
        timeLimit.setDate(timeLimit.getDate() - 30);
        break;
      case '90d':
        timeLimit.setDate(timeLimit.getDate() - 90);
        break;
      case '1y':
        timeLimit.setFullYear(timeLimit.getFullYear() - 1);
        break;
      default:
        timeLimit.setDate(timeLimit.getDate() - 30);
    }

    const analyticsSnapshot = await getDb().collection(collections.ANALYTICS)
      .where('userId', '==', userId)
      .where('timestamp', '>=', timeLimit)
      .orderBy('timestamp', 'desc')
      .get();

    const analytics = [];
    analyticsSnapshot.forEach(doc => {
      analytics.push({
        id: doc.id,
        ...doc.data()
      });
    });

    logger.info(`✅ Retrieved ${analytics.length} analytics records for user ${userId}`);
    return analytics;
  } catch (error) {
    logger.error('❌ Error getting user analytics:', error);
    throw error;
  }
}

// Get medical insights from analytics data
async function getMedicalInsights(timeRange = '30d', filters = {}) {
  try {
    const timeLimit = new Date();
    
    // Calculate time range
    switch (timeRange) {
      case '7d':
        timeLimit.setDate(timeLimit.getDate() - 7);
        break;
      case '30d':
        timeLimit.setDate(timeLimit.getDate() - 30);
        break;
      case '90d':
        timeLimit.setDate(timeLimit.getDate() - 90);
        break;
      case '1y':
        timeLimit.setFullYear(timeLimit.getFullYear() - 1);
        break;
      default:
        timeLimit.setDate(timeLimit.getDate() - 30);
    }

    let query = getDb().collection(collections.ANALYTICS)
      .where('category', '==', 'medical_ai')
      .where('timestamp', '>=', timeLimit);

    // Apply filters
    if (filters.language) {
      query = query.where('data.language', '==', filters.language);
    }
    if (filters.event) {
      query = query.where('event', '==', filters.event);
    }

    const insightsSnapshot = await query
      .orderBy('timestamp', 'desc')
      .limit(1000)
      .get();

    const insights = [];
    insightsSnapshot.forEach(doc => {
      insights.push({
        id: doc.id,
        ...doc.data()
      });
    });

    logger.info(`✅ Retrieved ${insights.length} medical insights`);
    return insights;
  } catch (error) {
    logger.error('❌ Error getting medical insights:', error);
    throw error;
  }
}

// Helper function to update user stats
async function updateUserStats(userId, statField) {
  try {
    const userRef = getDb().collection(collections.USERS).doc(userId);
    await userRef.update({
      [`stats.${statField}`]: admin.firestore.FieldValue.increment(1),
      'stats.lastActive': admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    logger.error('❌ Error updating user stats:', error);
  }
}

// Reminder management
async function saveReminder(reminderData) {
  try {
    const reminderRef = await getDb().collection(collections.REMINDERS).add({
      ...reminderData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    });

    logger.info(`✅ Reminder saved: ${reminderRef.id}`);
    return reminderRef.id;
  } catch (error) {
    logger.error('❌ Error saving reminder:', error);
    throw error;
  }
}

async function getActiveReminders(userId) {
  try {
    const remindersSnapshot = await getDb().collection(collections.REMINDERS)
      .where('userId', '==', userId)
      .where('isActive', '==', true)
      .get();

    const reminders = [];
    remindersSnapshot.forEach(doc => {
      reminders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return reminders;
  } catch (error) {
    logger.error('❌ Error getting reminders:', error);
    throw error;
  }
}

// Get database instance
function getDb() {
  if (!db) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return db;
}

// Get auth instance
function getAuth() {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
}

module.exports = {
  initializeFirebase,
  getDb,
  getAuth,
  collections,
  createUser,
  getUser,
  updateUser,
  saveCase,
  getCases,
  saveConversation,
  saveSimulation,
  saveVoiceMessage,
  logAnalytics,
  saveReminder,
  getActiveReminders,
  saveAnalytics,
  getUserAnalytics,
  getMedicalInsights
}; 