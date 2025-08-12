const express = require('express');
const { requireAuth, validateRequest } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const LearningProgressTracker = require('../services/learning-progress-tracker');
const Joi = require('joi');

const router = express.Router();
const progressTracker = new LearningProgressTracker();

// Validation schemas
const trackProgressSchema = Joi.object({
  topic: Joi.string().min(2).max(100).required(),
  action: Joi.string().min(2).max(100).required(),
  progress: Joi.number().min(0).max(100).required(),
  timeSpent: Joi.number().min(0).optional(),
  metadata: Joi.object().optional()
});

const getProgressSchema = Joi.object({
  topic: Joi.string().min(2).max(100).optional(),
  timeRange: Joi.string().valid('7d', '30d', '90d').default('30d')
});

// Track learning progress
router.post('/track', requireAuth, validateRequest(trackProgressSchema), async (req, res) => {
  try {
    const { topic, action, progress, timeSpent, metadata } = req.body;
    const userId = req.user.id;

    logger.info('📚 Tracking learning progress', {
      userId,
      topic,
      action,
      progress,
      timeSpent
    });

    const progressId = await progressTracker.trackProgress(
      userId,
      topic,
      action,
      progress,
      timeSpent,
      metadata
    );

    res.json({
      success: true,
      message: 'Learning progress tracked successfully',
      data: {
        progressId,
        topic,
        action,
        progress,
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

// Get user's learning progress
router.get('/progress', requireAuth, validateRequest(getProgressSchema, 'query'), async (req, res) => {
  try {
    const { topic, timeRange } = req.query;
    const userId = req.user.id;

    logger.info('📊 Getting user learning progress', {
      userId,
      topic: topic || 'all',
      timeRange
    });

    const progressData = await progressTracker.getUserProgress(userId, topic);

    res.json({
      success: true,
      data: progressData
    });

  } catch (error) {
    logger.error('❌ Error getting learning progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve learning progress',
      message: error.message
    });
  }
});

// Get learning recommendations
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info('💡 Getting learning recommendations', { userId });

    const recommendations = await progressTracker.getLearningRecommendations(userId);

    res.json({
      success: true,
      data: {
        recommendations,
        count: recommendations.length,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('❌ Error getting learning recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve learning recommendations',
      message: error.message
    });
  }
});

// Get progress analytics
router.get('/analytics', requireAuth, validateRequest(getProgressSchema, 'query'), async (req, res) => {
  try {
    const { timeRange } = req.query;
    const userId = req.user.id;

    logger.info('📈 Getting progress analytics', {
      userId,
      timeRange
    });

    const analytics = await progressTracker.getProgressAnalytics(userId, timeRange);

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    logger.error('❌ Error getting progress analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve progress analytics',
      message: error.message
    });
  }
});

// Get progress summary for dashboard
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info('📋 Getting progress summary', { userId });

    const progressData = await progressTracker.getUserProgress(userId);
    const recommendations = await progressTracker.getLearningRecommendations(userId);

    const summary = {
      ...progressData.summary,
      recommendations: recommendations.slice(0, 3), // Top 3 recommendations
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    logger.error('❌ Error getting progress summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve progress summary',
      message: error.message
    });
  }
});

// Update progress for a specific topic
router.put('/progress/:topic', requireAuth, validateRequest(trackProgressSchema), async (req, res) => {
  try {
    const { topic } = req.params;
    const { action, progress, timeSpent, metadata } = req.body;
    const userId = req.user.id;

    logger.info('🔄 Updating learning progress', {
      userId,
      topic,
      action,
      progress
    });

    const progressId = await progressTracker.trackProgress(
      userId,
      topic,
      action,
      progress,
      timeSpent,
      metadata
    );

    res.json({
      success: true,
      message: 'Learning progress updated successfully',
      data: {
        progressId,
        topic,
        action,
        progress,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('❌ Error updating learning progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update learning progress',
      message: error.message
    });
  }
});

// Get progress comparison with other students (anonymized)
router.get('/comparison', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info('📊 Getting progress comparison', { userId });

    // Get user's progress
    const userProgress = await progressTracker.getUserProgress(userId);
    
    // For now, return basic comparison data
    // In a real implementation, this would aggregate data from multiple users
    const comparison = {
      userRank: 'Top 25%', // Placeholder
      averageClassProgress: 65, // Placeholder
      userProgress: userProgress.summary.averageProgress,
      improvement: '+15% this month', // Placeholder
      benchmark: {
        excellent: 90,
        good: 75,
        average: 60,
        needsImprovement: 40
      }
    };

    res.json({
      success: true,
      data: comparison
    });

  } catch (error) {
    logger.error('❌ Error getting progress comparison:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve progress comparison',
      message: error.message
    });
  }
});

module.exports = router; 