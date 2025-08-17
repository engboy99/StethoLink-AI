const { logger, medicalLogger } = require('../utils/logger');
const { getDb, collections } = require('../config/firebase');

class LearningProgressTracker {
  constructor() {
    this.db = getDb();
    this.collections = collections;
  }

  // Track learning progress for a specific topic/module
  async trackProgress(userId, topic, action, progress, timeSpent, metadata = {}) {
    try {
      const progressData = {
        userId,
        topic,
        action,
        progress: Math.min(Math.max(progress, 0), 100), // Ensure 0-100 range
        timeSpent,
        metadata,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0] // Date only for daily tracking
      };

      // Save to learning progress collection
      const progressRef = await this.db.collection('learning_progress').add(progressData);

      // Update user's overall progress
      await this.updateUserOverallProgress(userId, topic, progress);

      // Update daily streak if applicable
      await this.updateDailyStreak(userId);

      logger.info('📚 Learning progress tracked', { 
        userId, 
        topic, 
        action, 
        progress,
        progressId: progressRef.id 
      });

      return progressRef.id;
    } catch (error) {
      logger.error('❌ Error tracking learning progress:', error);
      throw error;
    }
  }

  // Update user's overall progress for a topic
  async updateUserOverallProgress(userId, topic, progress) {
    try {
      const userRef = this.db.collection(this.collections.USERS).doc(userId);
      
      // Get current progress
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        logger.warn('User not found for progress update:', userId);
        return;
      }

      const userData = userDoc.data();
      const currentProgress = userData.learningProgress || {};
      
      // Update topic progress
      if (!currentProgress[topic]) {
        currentProgress[topic] = {
          overallProgress: 0,
          lastUpdated: new Date().toISOString(),
          sessions: 0,
          totalTime: 0
        };
      }

      // Calculate weighted progress (considering previous progress)
      const previousProgress = currentProgress[topic].overallProgress || 0;
      const newProgress = Math.max(previousProgress, progress);
      
      currentProgress[topic] = {
        ...currentProgress[topic],
        overallProgress: newProgress,
        lastUpdated: new Date().toISOString(),
        sessions: (currentProgress[topic].sessions || 0) + 1
      };

      // Update user document
      await userRef.update({
        learningProgress: currentProgress,
        'stats.lastActive': new Date()
      });

      logger.info('✅ User overall progress updated', { userId, topic, newProgress });
    } catch (error) {
      logger.error('❌ Error updating user overall progress:', error);
      throw error;
    }
  }

  // Update daily streak for learning
  async updateDailyStreak(userId) {
    try {
      const userRef = this.db.collection(this.collections.USERS).doc(userId);
      
      // Get current user data
      const userDoc = await userRef.get();
      if (!userDoc.exists) return;

      const userData = userDoc.data();
      const today = new Date().toISOString().split('T')[0];
      const lastActive = userData.stats?.lastActive?.toDate?.() || new Date();
      const lastActiveDate = lastActive.toISOString().split('T')[0];
      
      let currentStreak = userData.stats?.streakDays || 0;
      
      if (today === lastActiveDate) {
        // Same day, no change needed
        return;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toISOString().split('T')[0];

      if (lastActiveDate === yesterdayDate) {
        // Consecutive day, increment streak
        currentStreak += 1;
      } else if (lastActiveDate !== today) {
        // Gap in days, reset streak
        currentStreak = 1;
      }

      // Update streak
      await userRef.update({
        'stats.streakDays': currentStreak,
        'stats.lastActive': new Date()
      });

      logger.info('🔥 Daily streak updated', { userId, currentStreak });
    } catch (error) {
      logger.error('❌ Error updating daily streak:', error);
      // Don't throw error for streak updates as it's not critical
    }
  }

  // Get user's learning progress
  async getUserProgress(userId, topic = null) {
    try {
      let query = this.db.collection('learning_progress')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc');

      if (topic) {
        query = query.where('topic', '==', topic);
      }

      const progressSnapshot = await query.limit(100).get();
      
      const progress = [];
      progressSnapshot.forEach(doc => {
        progress.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Get overall progress from user document
      const userRef = this.db.collection(this.collections.USERS).doc(userId);
      const userDoc = await userRef.get();
      const userData = userDoc.exists ? userDoc.data() : {};
      const overallProgress = userData.learningProgress || {};

      return {
        progress,
        overallProgress,
        stats: userData.stats || {},
        summary: this.generateProgressSummary(progress, overallProgress)
      };
    } catch (error) {
      logger.error('❌ Error getting user progress:', error);
      throw error;
    }
  }

  // Generate progress summary
  generateProgressSummary(progress, overallProgress) {
    try {
      const summary = {
        totalSessions: progress.length,
        totalTime: progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0),
        topics: Object.keys(overallProgress),
        averageProgress: 0,
        topTopics: [],
        recentActivity: progress.slice(0, 5)
      };

      // Calculate average progress across all topics
      const progressValues = Object.values(overallProgress)
        .map(topic => topic.overallProgress || 0)
        .filter(p => p > 0);

      if (progressValues.length > 0) {
        summary.averageProgress = progressValues.reduce((sum, p) => sum + p, 0) / progressValues.length;
      }

      // Get top performing topics
      summary.topTopics = Object.entries(overallProgress)
        .map(([topic, data]) => ({
          topic,
          progress: data.overallProgress || 0,
          sessions: data.sessions || 0
        }))
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 5);

      return summary;
    } catch (error) {
      logger.error('❌ Error generating progress summary:', error);
      return {};
    }
  }

  // Get learning recommendations based on progress
  async getLearningRecommendations(userId) {
    try {
      const userProgress = await this.getUserProgress(userId);
      const recommendations = [];

      // Analyze weak areas (topics with low progress)
      const weakTopics = userProgress.overallProgress
        ? Object.entries(userProgress.overallProgress)
            .filter(([topic, data]) => (data.overallProgress || 0) < 50)
            .map(([topic, data]) => ({
              topic,
              progress: data.overallProgress || 0,
              recommendation: `Focus on ${topic} - current progress: ${data.overallProgress || 0}%`
            }))
        : [];

      // Analyze study patterns
      const recentSessions = userProgress.progress.slice(0, 10);
      const averageTime = recentSessions.length > 0 
        ? recentSessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / recentSessions.length
        : 0;

      // Generate recommendations
      if (weakTopics.length > 0) {
        recommendations.push({
          type: 'weak_areas',
          priority: 'high',
          message: 'Focus on these topics to improve overall performance',
          topics: weakTopics.slice(0, 3)
        });
      }

      if (averageTime < 30) {
        recommendations.push({
          type: 'study_time',
          priority: 'medium',
          message: 'Consider spending more time on each topic for better retention',
          suggestion: 'Aim for at least 30 minutes per session'
        });
      }

      if (userProgress.stats.streakDays < 3) {
        recommendations.push({
          type: 'consistency',
          priority: 'medium',
          message: 'Build a consistent study habit',
          suggestion: 'Try to study daily to maintain momentum'
        });
      }

      // Add positive reinforcement
      if (userProgress.summary.averageProgress > 70) {
        recommendations.push({
          type: 'achievement',
          priority: 'low',
          message: 'Great progress! Keep up the excellent work',
          suggestion: 'Consider exploring advanced topics'
        });
      }

      return recommendations;
    } catch (error) {
      logger.error('❌ Error getting learning recommendations:', error);
      return [];
    }
  }

  // Get progress analytics for dashboard
  async getProgressAnalytics(userId, timeRange = '30d') {
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
        default:
          timeLimit.setDate(timeLimit.getDate() - 30);
      }

      const progressSnapshot = await this.db.collection('learning_progress')
        .where('userId', '==', userId)
        .where('timestamp', '>=', timeLimit.toISOString())
        .orderBy('timestamp', 'asc')
        .get();

      const progress = [];
      progressSnapshot.forEach(doc => {
        progress.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Process analytics
      const analytics = {
        totalSessions: progress.length,
        totalTime: progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0),
        averageProgress: 0,
        progressByTopic: {},
        dailyProgress: {},
        timeDistribution: {
          morning: 0,    // 6 AM - 12 PM
          afternoon: 0,  // 12 PM - 6 PM
          evening: 0,    // 6 PM - 12 AM
          night: 0       // 12 AM - 6 AM
        }
      };

      // Calculate progress by topic
      progress.forEach(session => {
        const topic = session.topic;
        if (!analytics.progressByTopic[topic]) {
          analytics.progressByTopic[topic] = {
            sessions: 0,
            totalTime: 0,
            averageProgress: 0,
            progressHistory: []
          };
        }

        analytics.progressByTopic[topic].sessions += 1;
        analytics.progressByTopic[topic].totalTime += session.timeSpent || 0;
        analytics.progressByTopic[topic].progressHistory.push({
          progress: session.progress,
          timestamp: session.timestamp
        });
      });

      // Calculate averages
      Object.keys(analytics.progressByTopic).forEach(topic => {
        const topicData = analytics.progressByTopic[topic];
        const progressValues = topicData.progressHistory.map(h => h.progress);
        topicData.averageProgress = progressValues.reduce((sum, p) => sum + p, 0) / progressValues.length;
      });

      // Calculate overall average progress
      const allProgress = progress.map(p => p.progress);
      if (allProgress.length > 0) {
        analytics.averageProgress = allProgress.reduce((sum, p) => sum + p, 0) / allProgress.length;
      }

      // Calculate daily progress
      progress.forEach(session => {
        const date = session.timestamp.split('T')[0];
        if (!analytics.dailyProgress[date]) {
          analytics.dailyProgress[date] = {
            sessions: 0,
            totalTime: 0,
            averageProgress: 0
          };
        }
        
        analytics.dailyProgress[date].sessions += 1;
        analytics.dailyProgress[date].totalTime += session.timeSpent || 0;
      });

      // Calculate time distribution
      progress.forEach(session => {
        const hour = new Date(session.timestamp).getHours();
        if (hour >= 6 && hour < 12) analytics.timeDistribution.morning += session.timeSpent || 0;
        else if (hour >= 12 && hour < 18) analytics.timeDistribution.afternoon += session.timeSpent || 0;
        else if (hour >= 18 && hour < 24) analytics.timeDistribution.evening += session.timeSpent || 0;
        else analytics.timeDistribution.night += session.timeSpent || 0;
      });

      return analytics;
    } catch (error) {
      logger.error('❌ Error getting progress analytics:', error);
      throw error;
    }
  }
}

module.exports = LearningProgressTracker; 