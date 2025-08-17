const { logger } = require('../utils/logger');
const { getDb } = require('../config/firebase');

class ChatMemoryService {
  constructor() {
    this.db = getDb();
    this.collections = {
      CONVERSATIONS: 'conversations',
      CHAT_MEMORIES: 'chat_memories',
      USER_PREFERENCES: 'user_preferences',
      LEARNING_CONTEXT: 'learning_context'
    };
  }

  // Save conversation with enhanced memory
  async saveConversation(userId, conversationData) {
    try {
      const {
        message,
        response,
        platform,
        messageType = 'text',
        context = {},
        metadata = {}
      } = conversationData;

      // Create conversation record
      const conversationRef = await this.db.collection(this.collections.CONVERSATIONS).add({
        userId,
        message,
        response,
        platform,
        messageType,
        context,
        metadata,
        timestamp: new Date(),
        createdAt: new Date()
      });

      // Update user's chat memory
      await this.updateChatMemory(userId, {
        lastMessage: message,
        lastResponse: response,
        lastInteraction: new Date(),
        messageCount: await this.getMessageCount(userId),
        platform
      });

      // Store context for future reference
      await this.storeLearningContext(userId, context, message, response);

      logger.info('💾 Conversation saved with memory', { 
        userId, 
        conversationId: conversationRef.id,
        platform 
      });

      return conversationRef.id;
    } catch (error) {
      logger.error('❌ Error saving conversation with memory:', error);
      throw error;
    }
  }

  // Get conversation history with context
  async getConversationHistory(userId, limit = 20, includeContext = true) {
    try {
      const conversationsRef = this.db.collection(this.collections.CONVERSATIONS);
      const query = conversationsRef
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit);

      const snapshot = await query.get();
      const conversations = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        conversations.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate()
        });
      });

      // Get learning context if requested
      let learningContext = null;
      if (includeContext) {
        learningContext = await this.getLearningContext(userId);
      }

      logger.info('📚 Retrieved conversation history', { 
        userId, 
        count: conversations.length,
        includeContext 
      });

      return {
        conversations: conversations.reverse(), // Oldest first
        learningContext,
        total: conversations.length,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('❌ Error getting conversation history:', error);
      throw error;
    }
  }

  // Get chat memory for user
  async getChatMemory(userId) {
    try {
      const memoryRef = this.db.collection(this.collections.CHAT_MEMORIES).doc(userId);
      const memoryDoc = await memoryRef.get();

      if (!memoryDoc.exists) {
        // Initialize memory if it doesn't exist
        const initialMemory = {
          userId,
          messageCount: 0,
          firstInteraction: new Date(),
          lastInteraction: new Date(),
          platforms: [],
          topics: [],
          preferences: {},
          learningStyle: 'adaptive',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await memoryRef.set(initialMemory);
        return initialMemory;
      }

      return {
        id: memoryDoc.id,
        ...memoryDoc.data()
      };
    } catch (error) {
      logger.error('❌ Error getting chat memory:', error);
      throw error;
    }
  }

  // Update chat memory
  async updateChatMemory(userId, updates) {
    try {
      const memoryRef = this.db.collection(this.collections.CHAT_MEMORIES).doc(userId);
      
      await memoryRef.update({
        ...updates,
        updatedAt: new Date()
      });

      logger.info('💾 Chat memory updated', { userId, updates });
    } catch (error) {
      logger.error('❌ Error updating chat memory:', error);
      throw error;
    }
  }

  // Store learning context
  async storeLearningContext(userId, context, message, response) {
    try {
      const contextRef = this.db.collection(this.collections.LEARNING_CONTEXT).doc(userId);
      const contextDoc = await contextRef.get();

      const newContext = {
        userId,
        lastTopics: context.topics || [],
        lastSubjects: context.subjects || [],
        lastDifficulty: context.difficulty || 'medium',
        lastLearningStyle: context.learningStyle || 'adaptive',
        messageKeywords: this.extractKeywords(message),
        responseKeywords: this.extractKeywords(response),
        timestamp: new Date()
      };

      if (contextDoc.exists) {
        // Update existing context
        await contextRef.update({
          ...newContext,
          updatedAt: new Date()
        });
      } else {
        // Create new context
        await contextRef.set({
          ...newContext,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      logger.info('🧠 Learning context stored', { userId, context: newContext });
    } catch (error) {
      logger.error('❌ Error storing learning context:', error);
      throw error;
    }
  }

  // Get learning context
  async getLearningContext(userId) {
    try {
      const contextRef = this.db.collection(this.collections.LEARNING_CONTEXT).doc(userId);
      const contextDoc = await contextRef.get();

      if (!contextDoc.exists) {
        return null;
      }

      return {
        id: contextDoc.id,
        ...contextDoc.data()
      };
    } catch (error) {
      logger.error('❌ Error getting learning context:', error);
      throw error;
    }
  }

  // Get personalized response context
  async getPersonalizedContext(userId, currentMessage) {
    try {
      const [memory, context, history] = await Promise.all([
        this.getChatMemory(userId),
        this.getLearningContext(userId),
        this.getConversationHistory(userId, 5, false)
      ]);

      // Analyze user's learning patterns
      const learningPatterns = this.analyzeLearningPatterns(history.conversations);
      
      // Extract current message context
      const currentContext = this.extractMessageContext(currentMessage);

      // Combine all context for personalized response
      const personalizedContext = {
        userMemory: memory,
        learningContext: context,
        recentHistory: history.conversations,
        learningPatterns,
        currentContext,
        preferences: memory.preferences || {},
        learningStyle: memory.learningStyle || 'adaptive',
        topics: context?.lastTopics || [],
        subjects: context?.lastSubjects || [],
        difficulty: context?.lastDifficulty || 'medium'
      };

      logger.info('🎯 Personalized context generated', { 
        userId, 
        contextSize: Object.keys(personalizedContext).length 
      });

      return personalizedContext;
    } catch (error) {
      logger.error('❌ Error getting personalized context:', error);
      throw error;
    }
  }

  // Analyze learning patterns from conversation history
  analyzeLearningPatterns(conversations) {
    try {
      const patterns = {
        preferredTopics: {},
        responseLength: [],
        interactionFrequency: [],
        learningPace: 'medium',
        engagementLevel: 'medium'
      };

      if (conversations.length === 0) return patterns;

      // Analyze topic preferences
      conversations.forEach(conv => {
        const topics = this.extractKeywords(conv.message);
        topics.forEach(topic => {
          patterns.preferredTopics[topic] = (patterns.preferredTopics[topic] || 0) + 1;
        });
      });

      // Analyze response patterns
      patterns.responseLength = conversations.map(conv => conv.response?.length || 0);
      patterns.engagementLevel = this.calculateEngagementLevel(conversations);

      return patterns;
    } catch (error) {
      logger.error('❌ Error analyzing learning patterns:', error);
      return {};
    }
  }

  // Extract keywords from text
  extractKeywords(text) {
    try {
      if (!text || typeof text !== 'string') return [];
      
      // Simple keyword extraction (can be enhanced with NLP)
      const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 10);

      return [...new Set(words)]; // Remove duplicates
    } catch (error) {
      logger.error('❌ Error extracting keywords:', error);
      return [];
    }
  }

  // Extract context from current message
  extractMessageContext(message) {
    try {
      const context = {
        topics: this.extractKeywords(message),
        length: message.length,
        hasQuestions: message.includes('?'),
        hasCommands: message.startsWith('/'),
        language: this.detectLanguage(message),
        urgency: this.detectUrgency(message)
      };

      return context;
    } catch (error) {
      logger.error('❌ Error extracting message context:', error);
      return {};
    }
  }

  // Detect language from message
  detectLanguage(message) {
    try {
      // Simple language detection based on character sets
      const sinhalaPattern = /[\u0D80-\u0DFF]/;
      const tamilPattern = /[\u0B80-\u0BFF]/;
      
      if (sinhalaPattern.test(message)) return 'si';
      if (tamilPattern.test(message)) return 'ta';
      return 'en';
    } catch (error) {
      return 'en';
    }
  }

  // Detect urgency in message
  detectUrgency(message) {
    try {
      const urgentWords = ['urgent', 'emergency', 'help', 'quick', 'asap', 'immediate'];
      const lowerMessage = message.toLowerCase();
      
      const urgentCount = urgentWords.filter(word => lowerMessage.includes(word)).length;
      
      if (urgentCount >= 2) return 'high';
      if (urgentCount >= 1) return 'medium';
      return 'low';
    } catch (error) {
      return 'low';
    }
  }

  // Calculate engagement level
  calculateEngagementLevel(conversations) {
    try {
      if (conversations.length === 0) return 'medium';

      const avgResponseLength = conversations.reduce((sum, conv) => 
        sum + (conv.response?.length || 0), 0) / conversations.length;

      if (avgResponseLength > 200) return 'high';
      if (avgResponseLength > 100) return 'medium';
      return 'low';
    } catch (error) {
      return 'medium';
    }
  }

  // Get message count for user
  async getMessageCount(userId) {
    try {
      const conversationsRef = this.db.collection(this.collections.CONVERSATIONS);
      const query = conversationsRef.where('userId', '==', userId);
      const snapshot = await query.get();
      return snapshot.size;
    } catch (error) {
      logger.error('❌ Error getting message count:', error);
      return 0;
    }
  }

  // Get user preferences
  async getUserPreferences(userId) {
    try {
      const prefsRef = this.db.collection(this.collections.USER_PREFERENCES).doc(userId);
      const prefsDoc = await prefsRef.get();

      if (!prefsDoc.exists) {
        // Return default preferences
        return {
          language: 'en',
          notifications: true,
          dailyReminders: true,
          learningStyle: 'adaptive',
          preferredTopics: [],
          responseLength: 'medium',
          urgencyLevel: 'medium'
        };
      }

      return {
        id: prefsDoc.id,
        ...prefsDoc.data()
      };
    } catch (error) {
      logger.error('❌ Error getting user preferences:', error);
      throw error;
    }
  }

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const prefsRef = this.db.collection(this.collections.USER_PREFERENCES).doc(userId);
      
      await prefsRef.set({
        userId,
        ...preferences,
        updatedAt: new Date()
      }, { merge: true });

      logger.info('⚙️ User preferences updated', { userId, preferences });
    } catch (error) {
      logger.error('❌ Error updating user preferences:', error);
      throw error;
    }
  }

  // Get conversation summary
  async getConversationSummary(userId, timeframe = 'week') {
    try {
      const startDate = this.getStartDate(timeframe);
      const conversationsRef = this.db.collection(this.collections.CONVERSATIONS);
      
      const query = conversationsRef
        .where('userId', '==', userId)
        .where('timestamp', '>=', startDate);

      const snapshot = await query.get();
      const conversations = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        conversations.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate()
        });
      });

      const summary = {
        totalConversations: conversations.length,
        totalMessages: conversations.length * 2, // User + AI
        averageResponseLength: this.calculateAverageResponseLength(conversations),
        topTopics: this.getTopTopics(conversations),
        platformUsage: this.getPlatformUsage(conversations),
        timeframe,
        startDate,
        endDate: new Date()
      };

      logger.info('📊 Conversation summary generated', { userId, summary });

      return summary;
    } catch (error) {
      logger.error('❌ Error getting conversation summary:', error);
      throw error;
    }
  }

  // Helper method to get start date based on timeframe
  getStartDate(timeframe) {
    const now = new Date();
    switch (timeframe) {
      case 'day':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case 'year':
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }

  // Calculate average response length
  calculateAverageResponseLength(conversations) {
    if (conversations.length === 0) return 0;
    
    const totalLength = conversations.reduce((sum, conv) => 
      sum + (conv.response?.length || 0), 0);
    
    return Math.round(totalLength / conversations.length);
  }

  // Get top topics from conversations
  getTopTopics(conversations) {
    const topicCounts = {};
    
    conversations.forEach(conv => {
      const topics = this.extractKeywords(conv.message);
      topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
  }

  // Get platform usage statistics
  getPlatformUsage(conversations) {
    const platformCounts = {};
    
    conversations.forEach(conv => {
      const platform = conv.platform || 'unknown';
      platformCounts[platform] = (platformCounts[platform] || 0) + 1;
    });

    return Object.entries(platformCounts)
      .map(([platform, count]) => ({ platform, count }));
  }
}

module.exports = new ChatMemoryService(); 