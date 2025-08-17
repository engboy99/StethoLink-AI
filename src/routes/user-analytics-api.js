const express = require('express');
const { requireAuth, validateRequest } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const UserAnalyticsService = require('../services/user-analytics-service');
const Joi = require('joi');

const router = express.Router();
const analyticsService = new UserAnalyticsService();

// Validation schemas
const trackActivitySchema = Joi.object({
  activity: Joi.string().min(2).max(100).required(),
  metadata: Joi.object().optional()
});

const trackEngagementSchema = Joi.object({
  sessionDuration: Joi.number().min(0).required(),
  pagesVisited: Joi.array().items(Joi.string()).optional(),
  featuresUsed: Joi.array().items(Joi.string()).optional(),
  interactions: Joi.number().min(0).optional(),
  platform: Joi.string().min(2).max(50).optional(),
  device: Joi.string().min(2).max(50).optional()
});

const trackFeatureUsageSchema = Joi.object({
  feature: Joi.string().min(2).max(100).required(),
  action: Joi.string().min(2).max(100).required(),
  metadata: Joi.object().optional()
});

const trackLearningSchema = Joi.object({
  topic: Joi.string().min(2).max(100).required(),
  progress: Joi.number().min(0).max(100).required(),
  timeSpent: Joi.number().min(0).optional(),
  questionsAnswered: Joi.number().min(0).optional(),
  correctAnswers: Joi.number().min(0).optional(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
  completionRate: Joi.number().min(0).max(100).optional()
});

const getAnalyticsSchema = Joi.object({
  timeRange: Joi.string().valid('7d', '30d', '90d').default('30d')
});

// Track user activity
router.post('/activity', requireAuth, validateRequest(trackActivitySchema), async (req, res) => {
  try {
    const { activity, metadata } = req.body;
    const userId = req.user.id;

    logger.info('📊 Tracking user activity', {
      userId,
      activity
    });

    const activityId = await analyticsService.trackUserActivity(userId, activity, metadata);

    res.json({
      success: true,
      message: 'User activity tracked successfully',
      data: {
        activityId,
        activity,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('❌ Error tracking user activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track user activity',
      message: error.message
    });
  }
});

// Track user engagement
router.post('/engagement', requireAuth, validateRequest(trackEngagementSchema), async (req, res) => {
  try {
    const engagementData = req.body;
    const userId = req.user.id;

    logger.info('📈 Tracking user engagement', {
      userId,
      sessionDuration: engagementData.sessionDuration
    });

    const engagementId = await analyticsService.trackUserEngagement(userId, engagementData);

    res.json({
      success: true,
      message: 'User engagement tracked successfully',
      data: {
        engagementId,
        sessionDuration: engagementData.sessionDuration,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('❌ Error tracking user engagement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track user engagement',
      message: error.message
    });
  }
});

// Track feature usage
router.post('/feature-usage', requireAuth, validateRequest(trackFeatureUsageSchema), async (req, res) => {
  try {
    const { feature, action, metadata } = req.body;
    const userId = req.user.id;

    logger.info('🔧 Tracking feature usage', {
      userId,
      feature,
      action
    });

    const usageId = await analyticsService.trackFeatureUsage(userId, feature, action, metadata);

    res.json({
      success: true,
      message: 'Feature usage tracked successfully',
      data: {
        usageId,
        feature,
        action,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('❌ Error tracking feature usage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track feature usage',
      message: error.message
    });
  }
});

// Track learning progress
router.post('/learning', requireAuth, validateRequest(trackLearningSchema), async (req, res) => {
  try {
    const learningData = req.body;
    const userId = req.user.id;

    logger.info('📚 Tracking learning progress', {
      userId,
      topic: learningData.topic,
      progress: learningData.progress
    });

    const learningId = await analyticsService.trackLearningProgress(userId, learningData);

    res.json({
      success: true,
      message: 'Learning progress tracked successfully',
      data: {
        learningId,
        topic: learningData.topic,
        progress: learningData.progress,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('❌ Error tracking learning progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track learning progress',
      message: error.message
    });
  }
});

// Get user analytics summary
router.get('/summary', requireAuth, validateRequest(getAnalyticsSchema, 'query'), async (req, res) => {
  try {
    const { timeRange } = req.query;
    const userId = req.user.id;

    logger.info('📊 Getting user analytics summary', {
      userId,
      timeRange
    });

    const summary = await analyticsService.getUserAnalyticsSummary(userId, timeRange);

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    logger.error('❌ Error getting user analytics summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user analytics summary',
      message: error.message
    });
  }
});

// Get comparative analytics
router.get('/comparison', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { comparisonGroup } = req.query;

    logger.info('📊 Getting comparative analytics', {
      userId,
      comparisonGroup: comparisonGroup || 'all'
    });

    const comparison = await analyticsService.getComparativeAnalytics(userId, comparisonGroup);

    res.json({
      success: true,
      data: comparison
    });

  } catch (error) {
    logger.error('❌ Error getting comparative analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve comparative analytics',
      message: error.message
    });
  }
});

// Get user activity timeline
router.get('/timeline', requireAuth, validateRequest(getAnalyticsSchema, 'query'), async (req, res) => {
  try {
    const { timeRange } = req.query;
    const userId = req.user.id;

    logger.info('📅 Getting user activity timeline', {
      userId,
      timeRange
    });

    // Get analytics data for timeline
    const analytics = await analyticsService.getUserAnalyticsSummary(userId, timeRange);
    
    // Create timeline data
    const timeline = {
      userId,
      timeRange,
      generatedAt: new Date().toISOString(),
      activities: [],
      milestones: []
    };

    // Add recent activities (placeholder - would need to implement actual timeline data)
    timeline.activities = [
      {
        date: new Date().toISOString().split('T')[0],
        type: 'learning',
        description: 'Completed medical terminology module',
        impact: 'positive'
      },
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'engagement',
        description: 'Used AI diagnosis feature',
        impact: 'positive'
      }
    ];

    // Add milestones
    if (analytics.learning.totalSessions >= 10) {
      timeline.milestones.push({
        type: 'learning',
        title: '10 Learning Sessions',
        description: 'Completed 10 learning sessions',
        achieved: true,
        date: new Date().toISOString()
      });
    }

    if (analytics.learning.averageAccuracy >= 0.8) {
      timeline.milestones.push({
        type: 'performance',
        title: 'High Accuracy Achiever',
        description: 'Maintained 80%+ accuracy',
        achieved: true,
        date: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: timeline
    });

  } catch (error) {
    logger.error('❌ Error getting user activity timeline:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user activity timeline',
      message: error.message
    });
  }
});

// Get user performance trends
router.get('/trends', requireAuth, validateRequest(getAnalyticsSchema, 'query'), async (req, res) => {
  try {
    const { timeRange } = req.query;
    const userId = req.user.id;

    logger.info('📈 Getting user performance trends', {
      userId,
      timeRange
    });

    // Get analytics data for trends
    const analytics = await analyticsService.getUserAnalyticsSummary(userId, timeRange);
    
    // Create trends data
    const trends = {
      userId,
      timeRange,
      generatedAt: new Date().toISOString(),
      learningTrend: 'improving',
      engagementTrend: 'stable',
      accuracyTrend: 'improving',
      recommendations: []
    };

    // Analyze trends based on data
    if (analytics.learning.averageProgress > 70) {
      trends.learningTrend = 'improving';
      trends.recommendations.push({
        type: 'learning',
        message: 'Great progress! Consider tackling more advanced topics',
        priority: 'low'
      });
    } else if (analytics.learning.averageProgress < 50) {
      trends.learningTrend = 'needs_improvement';
      trends.recommendations.push({
        type: 'learning',
        message: 'Focus on fundamentals and practice more',
        priority: 'high'
      });
    }

    if (analytics.engagement.averageSessionDuration < 300) {
      trends.engagementTrend = 'declining';
      trends.recommendations.push({
        type: 'engagement',
        message: 'Try longer study sessions for better retention',
        priority: 'medium'
      });
    }

    if (analytics.learning.averageAccuracy < 0.7) {
      trends.accuracyTrend = 'needs_improvement';
      trends.recommendations.push({
        type: 'accuracy',
        message: 'Review incorrect answers and practice more',
        priority: 'high'
      });
    }

    res.json({
      success: true,
      data: trends
    });

  } catch (error) {
    logger.error('❌ Error getting user performance trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user performance trends',
      message: error.message
    });
  }
});

// Export analytics data
router.get('/export', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { format = 'json' } = req.query;

    logger.info('📤 Exporting user analytics data', {
      userId,
      format
    });

    // Get comprehensive analytics data
    const summary = await analyticsService.getUserAnalyticsSummary(userId, '90d');
    const comparison = await analyticsService.getComparativeAnalytics(userId);

    const exportData = {
      user: {
        id: userId,
        exportDate: new Date().toISOString(),
        timeRange: '90d'
      },
      analytics: summary,
      comparison,
      metadata: {
        generatedBy: 'StethoLink AI Analytics',
        version: '1.0',
        exportFormat: format
      }
    };

    if (format === 'csv') {
      // Convert to CSV format (simplified)
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${userId}-${new Date().toISOString().split('T')[0]}.csv"`);
      
      const csvData = this.convertToCSV(exportData);
      res.send(csvData);
    } else {
      // Default JSON format
      res.json({
        success: true,
        data: exportData
      });
    }

  } catch (error) {
    logger.error('❌ Error exporting analytics data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export analytics data',
      message: error.message
    });
  }
});

// Helper method to convert data to CSV
convertToCSV(data) {
  // Simple CSV conversion for analytics data
  const csvRows = [];
  
  // Add headers
  csvRows.push(['Metric', 'Value', 'Category']);
  
  // Add data rows
  if (data.analytics) {
    csvRows.push(['Total Activities', data.analytics.activity.totalActivities, 'Activity']);
    csvRows.push(['Total Sessions', data.analytics.engagement.totalSessions, 'Engagement']);
    csvRows.push(['Topics Studied', data.analytics.learning.topicsStudied, 'Learning']);
    csvRows.push(['Average Progress', data.analytics.learning.averageProgress.toFixed(2), 'Learning']);
    csvRows.push(['Average Accuracy', data.analytics.learning.averageAccuracy.toFixed(2), 'Learning']);
  }
  
  return csvRows.map(row => row.join(',')).join('\n');
}

module.exports = router; 