const { logger, medicalLogger } = require('../utils/logger');
const { getDb, collections, saveAnalytics, getUserAnalytics } = require('../config/firebase');

class UserAnalyticsService {
  constructor() {
    this.db = getDb();
    this.collections = collections;
  }

  // Track user activity
  async trackUserActivity(userId, activity, metadata = {}) {
    try {
      const activityData = {
        userId,
        activity,
        metadata,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        hour: new Date().getHours(),
        dayOfWeek: new Date().getDay()
      };

      // Save to user activity collection
      const activityRef = await this.db.collection('user_activity').add(activityData);

      // Update user stats
      await this.updateUserStats(userId, activity);

      logger.info('📊 User activity tracked', {
        userId,
        activity,
        activityId: activityRef.id
      });

      return activityRef.id;
    } catch (error) {
      logger.error('❌ Error tracking user activity:', error);
      throw error;
    }
  }

  // Track user engagement
  async trackUserEngagement(userId, engagementData) {
    try {
    const {
      sessionDuration,
      pagesVisited,
      featuresUsed,
      interactions,
      platform,
      device
    } = engagementData;

    const engagement = {
      userId,
      sessionDuration,
      pagesVisited,
      featuresUsed,
      interactions,
      platform,
      device,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };

    // Save to engagement collection
    const engagementRef = await this.db.collection('user_engagement').add(engagement);

    // Update engagement metrics
    await this.updateEngagementMetrics(userId, engagement);

    logger.info('📈 User engagement tracked', {
      userId,
      sessionDuration,
      featuresUsed: featuresUsed.length,
      engagementId: engagementRef.id
    });

    return engagementRef.id;
    } catch (error) {
      logger.error('❌ Error tracking user engagement:', error);
      throw error;
    }
  }

  // Track feature usage
  async trackFeatureUsage(userId, feature, action, metadata = {}) {
    try {
      const usageData = {
        userId,
        feature,
        action,
        metadata,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      };

      // Save to feature usage collection
      const usageRef = await this.db.collection('feature_usage').add(usageData);

      // Update feature usage stats
      await this.updateFeatureUsageStats(userId, feature, action);

      logger.info('🔧 Feature usage tracked', {
        userId,
        feature,
        action,
        usageId: usageRef.id
      });

      return usageRef.id;
    } catch (error) {
      logger.error('❌ Error tracking feature usage:', error);
      throw error;
    }
  }

  // Track learning progress
  async trackLearningProgress(userId, learningData) {
    try {
      const {
        topic,
        progress,
        timeSpent,
        questionsAnswered,
        correctAnswers,
        difficulty,
        completionRate
      } = learningData;

      const learningRecord = {
        userId,
        topic,
        progress,
        timeSpent,
        questionsAnswered,
        correctAnswers,
        difficulty,
        completionRate,
        accuracy: questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      };

      // Save to learning progress collection
      const learningRef = await this.db.collection('learning_progress').add(learningRecord);

      // Update learning analytics
      await this.updateLearningAnalytics(userId, topic, learningRecord);

      logger.info('📚 Learning progress tracked', {
        userId,
        topic,
        progress,
        accuracy: learningRecord.accuracy.toFixed(2),
        learningId: learningRef.id
      });

      return learningRef.id;
    } catch (error) {
      logger.error('❌ Error tracking learning progress:', error);
      throw error;
    }
  }

  // Update user statistics
  async updateUserStats(userId, activity) {
    try {
      const userRef = this.db.collection(this.collections.USERS).doc(userId);
      
      // Get current user data
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        logger.warn('User not found for stats update:', userId);
        return;
      }

      const userData = userDoc.data();
      const stats = userData.stats || {};
      
      // Update activity counts
      if (!stats.activities) stats.activities = {};
      if (!stats.activities[activity]) stats.activities[activity] = 0;
      stats.activities[activity]++;

      // Update last activity
      stats.lastActivity = new Date().toISOString();
      stats.totalActivities = (stats.totalActivities || 0) + 1;

      // Update user document
      await userRef.update({
        stats,
        'stats.lastActive': new Date()
      });

      logger.debug('✅ User stats updated', { userId, activity });
    } catch (error) {
      logger.error('❌ Error updating user stats:', error);
      throw error;
    }
  }

  // Update engagement metrics
  async updateEngagementMetrics(userId, engagement) {
    try {
      const userRef = this.db.collection(this.collections.USERS).doc(userId);
      
      // Get current user data
      const userDoc = await userRef.get();
      if (!userDoc.exists) return;

      const userData = userDoc.data();
      const engagementStats = userData.engagementStats || {};
      
      // Update session metrics
      if (!engagementStats.sessions) engagementStats.sessions = [];
      engagementStats.sessions.push({
        duration: engagement.sessionDuration,
        date: engagement.date,
        features: engagement.featuresUsed.length
      });

      // Keep only last 30 sessions
      if (engagementStats.sessions.length > 30) {
        engagementStats.sessions = engagementStats.sessions.slice(-30);
      }

      // Calculate averages
      const totalDuration = engagementStats.sessions.reduce((sum, session) => sum + session.duration, 0);
      const totalFeatures = engagementStats.sessions.reduce((sum, session) => sum + session.features, 0);
      
      engagementStats.averageSessionDuration = totalDuration / engagementStats.sessions.length;
      engagementStats.averageFeaturesPerSession = totalFeatures / engagementStats.sessions.length;
      engagementStats.totalSessions = engagementStats.sessions.length;

      // Update user document
      await userRef.update({
        engagementStats,
        'stats.lastActive': new Date()
      });

      logger.debug('✅ Engagement metrics updated', { userId });
    } catch (error) {
      logger.error('❌ Error updating engagement metrics:', error);
      throw error;
    }
  }

  // Update feature usage statistics
  async updateFeatureUsageStats(userId, feature, action) {
    try {
      const userRef = this.db.collection(this.collections.USERS).doc(userId);
      
      // Get current user data
      const userDoc = await userRef.get();
      if (!userDoc.exists) return;

      const userData = userDoc.data();
      const featureStats = userData.featureStats || {};
      
      // Update feature usage
      if (!featureStats[feature]) {
        featureStats[feature] = {
          totalUsage: 0,
          actions: {},
          lastUsed: null
        };
      }

      featureStats[feature].totalUsage++;
      featureStats[feature].lastUsed = new Date().toISOString();
      
      if (!featureStats[feature].actions[action]) {
        featureStats[feature].actions[action] = 0;
      }
      featureStats[feature].actions[action]++;

      // Update user document
      await userRef.update({
        featureStats,
        'stats.lastActive': new Date()
      });

      logger.debug('✅ Feature usage stats updated', { userId, feature, action });
    } catch (error) {
      logger.error('❌ Error updating feature usage stats:', error);
      throw error;
    }
  }

  // Update learning analytics
  async updateLearningAnalytics(userId, topic, learningRecord) {
    try {
      const userRef = this.db.collection(this.collections.USERS).doc(userId);
      
      // Get current user data
      const userDoc = await userRef.get();
      if (!userDoc.exists) return;

      const userData = userDoc.data();
      const learningStats = userData.learningStats || {};
      
      // Update topic stats
      if (!learningStats.topics) learningStats.topics = {};
      if (!learningStats.topics[topic]) {
        learningStats.topics[topic] = {
          totalSessions: 0,
          totalTime: 0,
          totalQuestions: 0,
          totalCorrect: 0,
          averageProgress: 0,
          lastSession: null
        };
      }

      const topicStats = learningStats.topics[topic];
      topicStats.totalSessions++;
      topicStats.totalTime += learningRecord.timeSpent || 0;
      topicStats.totalQuestions += learningRecord.questionsAnswered || 0;
      topicStats.totalCorrect += learningRecord.correctAnswers || 0;
      topicStats.lastSession = learningRecord.timestamp;

      // Calculate average progress
      const progressValues = [learningRecord.progress];
      if (topicStats.averageProgress > 0) {
        progressValues.push(topicStats.averageProgress);
      }
      topicStats.averageProgress = progressValues.reduce((sum, p) => sum + p, 0) / progressValues.length;

      // Update overall learning stats
      if (!learningStats.overall) {
        learningStats.overall = {
          totalSessions: 0,
          totalTime: 0,
          averageAccuracy: 0,
          topicsStudied: 0
        };
      }

      learningStats.overall.totalSessions++;
      learningStats.overall.totalTime += learningRecord.timeSpent || 0;
      learningStats.overall.topicsStudied = Object.keys(learningStats.topics).length;

      // Calculate overall accuracy
      const allQuestions = Object.values(learningStats.topics).reduce((sum, topic) => sum + topic.totalQuestions, 0);
      const allCorrect = Object.values(learningStats.topics).reduce((sum, topic) => sum + topic.totalCorrect, 0);
      learningStats.overall.averageAccuracy = allQuestions > 0 ? allCorrect / allQuestions : 0;

      // Update user document
      await userRef.update({
        learningStats,
        'stats.lastActive': new Date()
      });

      logger.debug('✅ Learning analytics updated', { userId, topic });
    } catch (error) {
      logger.error('❌ Error updating learning analytics:', error);
      throw error;
    }
  }

  // Get user analytics summary
  async getUserAnalyticsSummary(userId, timeRange = '30d') {
    try {
      const analytics = await getUserAnalytics(userId, timeRange);
      
      const summary = {
        userId,
        timeRange,
        generatedAt: new Date().toISOString(),
        activity: {
          totalActivities: 0,
          activityBreakdown: {},
          mostActiveDay: null,
          mostActiveHour: null
        },
        engagement: {
          totalSessions: 0,
          averageSessionDuration: 0,
          totalFeatures: 0,
          mostUsedFeatures: []
        },
        learning: {
          totalSessions: 0,
          topicsStudied: 0,
          averageProgress: 0,
          averageAccuracy: 0,
          timeSpent: 0
        },
        performance: {
          improvement: 0,
          consistency: 0,
          recommendations: []
        }
      };

      // Process analytics data
      if (analytics && analytics.length > 0) {
        // Activity analysis
        const activities = analytics.filter(a => a.type === 'user_activity');
        summary.activity.totalActivities = activities.length;
        
        activities.forEach(activity => {
          const activityType = activity.activity;
          if (!summary.activity.activityBreakdown[activityType]) {
            summary.activity.activityBreakdown[activityType] = 0;
          }
          summary.activity.activityBreakdown[activityType]++;
        });

        // Engagement analysis
        const engagement = analytics.filter(a => a.type === 'user_engagement');
        summary.engagement.totalSessions = engagement.length;
        
        if (engagement.length > 0) {
          const totalDuration = engagement.reduce((sum, e) => sum + (e.sessionDuration || 0), 0);
          summary.engagement.averageSessionDuration = totalDuration / engagement.length;
          
          const allFeatures = engagement.flatMap(e => e.featuresUsed || []);
          summary.engagement.totalFeatures = allFeatures.length;
          
          // Count feature usage
          const featureCounts = {};
          allFeatures.forEach(feature => {
            featureCounts[feature] = (featureCounts[feature] || 0) + 1;
          });
          
          summary.engagement.mostUsedFeatures = Object.entries(featureCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([feature, count]) => ({ feature, count }));
        }

        // Learning analysis
        const learning = analytics.filter(a => a.type === 'learning_progress');
        summary.learning.totalSessions = learning.length;
        
        if (learning.length > 0) {
          const topics = new Set(learning.map(l => l.topic));
          summary.learning.topicsStudied = topics.size;
          
          const totalProgress = learning.reduce((sum, l) => sum + (l.progress || 0), 0);
          summary.learning.averageProgress = totalProgress / learning.length;
          
          const totalTime = learning.reduce((sum, l) => sum + (l.timeSpent || 0), 0);
          summary.learning.timeSpent = totalTime;
          
          // Calculate accuracy
          const totalQuestions = learning.reduce((sum, l) => sum + (l.questionsAnswered || 0), 0);
          const totalCorrect = learning.reduce((sum, l) => sum + (l.correctAnswers || 0), 0);
          summary.learning.averageAccuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;
        }
      }

      // Generate recommendations
      summary.performance.recommendations = this.generateAnalyticsRecommendations(summary);

      return summary;
    } catch (error) {
      logger.error('❌ Error getting user analytics summary:', error);
      throw error;
    }
  }

  // Generate analytics recommendations
  generateAnalyticsRecommendations(summary) {
    const recommendations = [];

    // Activity recommendations
    if (summary.activity.totalActivities < 10) {
      recommendations.push({
        type: 'activity',
        priority: 'medium',
        message: 'Increase your activity to get better insights',
        action: 'Try using more features and engaging with the platform regularly'
      });
    }

    // Engagement recommendations
    if (summary.engagement.averageSessionDuration < 300) { // Less than 5 minutes
      recommendations.push({
        type: 'engagement',
        priority: 'medium',
        message: 'Consider longer study sessions for better retention',
        action: 'Aim for sessions of at least 10-15 minutes'
      });
    }

    // Learning recommendations
    if (summary.learning.averageAccuracy < 0.7) {
      recommendations.push({
        type: 'learning',
        priority: 'high',
        message: 'Focus on improving accuracy in your studies',
        action: 'Review incorrect answers and practice more challenging topics'
      });
    }

    if (summary.learning.topicsStudied < 3) {
      recommendations.push({
        type: 'learning',
        priority: 'medium',
        message: 'Explore more diverse topics',
        action: 'Try studying different medical subjects to broaden your knowledge'
      });
    }

    // Performance recommendations
    if (summary.learning.timeSpent < 3600) { // Less than 1 hour
      recommendations.push({
        type: 'performance',
        priority: 'low',
        message: 'Consider increasing study time for better progress',
        action: 'Aim for at least 2-3 hours of study time per week'
      });
    }

    return recommendations;
  }

  // Get comparative analytics
  async getComparativeAnalytics(userId, comparisonGroup = 'all') {
    try {
      // This would typically compare user performance with others
      // For now, return placeholder data
      const comparison = {
        userId,
        comparisonGroup,
        generatedAt: new Date().toISOString(),
        userRank: 'Top 25%',
        percentile: 75,
        comparison: {
          averageAccuracy: 0.72,
          userAccuracy: 0.78,
          averageStudyTime: 5400, // 1.5 hours
          userStudyTime: 7200,    // 2 hours
          averageTopics: 4,
          userTopics: 6
        },
        strengths: ['Above average accuracy', 'More topics studied'],
        areasForImprovement: ['Could increase study time consistency']
      };

      return comparison;
    } catch (error) {
      logger.error('❌ Error getting comparative analytics:', error);
      throw error;
    }
  }
}

module.exports = UserAnalyticsService; 