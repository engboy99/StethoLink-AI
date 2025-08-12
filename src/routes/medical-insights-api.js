const express = require('express');
const { requireAuth, validateRequest } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const MedicalInsightsEngine = require('../services/medical-insights-engine');
const Joi = require('joi');

const router = express.Router();
const insightsEngine = new MedicalInsightsEngine();

// Validation schemas
const analyzeConversationSchema = Joi.object({
  symptoms: Joi.string().min(10).max(1000).required(),
  diagnosis: Joi.string().min(5).max(500).optional(),
  confidence: Joi.number().min(0).max(1).optional(),
  language: Joi.string().valid('english', 'spanish', 'french').default('english'),
  platform: Joi.string().min(2).max(50).optional()
});

const getInsightsSchema = Joi.object({
  timeRange: Joi.string().valid('7d', '30d', '90d').default('30d'),
  userId: Joi.string().min(1).max(100).optional()
});

// Analyze medical conversation and generate insights
router.post('/analyze', requireAuth, validateRequest(analyzeConversationSchema), async (req, res) => {
  try {
    const { symptoms, diagnosis, confidence, language, platform } = req.body;
    const userId = req.user.id;

    logger.info('🔍 Analyzing medical conversation for insights', {
      userId,
      symptomsLength: symptoms.length,
      language,
      platform
    });

    const conversationData = {
      userId,
      symptoms,
      diagnosis,
      confidence,
      language,
      platform,
      timestamp: new Date().toISOString()
    };

    const insights = await insightsEngine.analyzeMedicalConversation(conversationData);

    res.json({
      success: true,
      message: 'Medical insights generated successfully',
      data: insights
    });

  } catch (error) {
    logger.error('❌ Error analyzing medical conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze medical conversation',
      message: error.message
    });
  }
});

// Get medical insights for a user
router.get('/insights', requireAuth, validateRequest(getInsightsSchema, 'query'), async (req, res) => {
  try {
    const { timeRange, userId } = req.query;
    const currentUserId = req.user.id;
    
    // Users can only get their own insights unless they're admin
    const targetUserId = userId && req.user.role === 'admin' ? userId : currentUserId;

    logger.info('📊 Getting medical insights', {
      currentUserId,
      targetUserId,
      timeRange
    });

    const insights = await insightsEngine.getUserInsights(targetUserId, timeRange);

    res.json({
      success: true,
      data: {
        insights,
        count: insights.length,
        timeRange,
        userId: targetUserId
      }
    });

  } catch (error) {
    logger.error('❌ Error getting medical insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve medical insights',
      message: error.message
    });
  }
});

// Get insights summary for dashboard
router.get('/summary', requireAuth, validateRequest(getInsightsSchema, 'query'), async (req, res) => {
  try {
    const { timeRange, userId } = req.query;
    const currentUserId = req.user.id;
    
    // Users can only get their own summary unless they're admin
    const targetUserId = userId && req.user.role === 'admin' ? userId : currentUserId;

    logger.info('📋 Getting medical insights summary', {
      currentUserId,
      targetUserId,
      timeRange
    });

    const summary = await insightsEngine.generateInsightsSummary(targetUserId, timeRange);

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    logger.error('❌ Error getting insights summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve insights summary',
      message: error.message
    });
  }
});

// Get pattern analysis
router.get('/patterns', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info('🔍 Getting medical pattern analysis', { userId });

    const insights = await insightsEngine.getUserInsights(userId, '30d');
    
    // Analyze patterns from insights
    const patternAnalysis = {
      userId,
      timeRange: '30d',
      generatedAt: new Date().toISOString(),
      patterns: {},
      seasonalTrends: {},
      riskPatterns: {}
    };

    insights.forEach(insight => {
      // Count pattern occurrences
      insight.analysis.patternRecognition.forEach(pattern => {
        const patternName = pattern.pattern;
        if (!patternAnalysis.patterns[patternName]) {
          patternAnalysis.patterns[patternName] = {
            count: 0,
            conditions: pattern.conditions,
            severity: pattern.severity,
            urgency: pattern.urgency
          };
        }
        patternAnalysis.patterns[patternName].count++;
      });

      // Analyze seasonal trends
      const season = insight.analysis.seasonalFactors.season;
      if (!patternAnalysis.seasonalTrends[season]) {
        patternAnalysis.seasonalTrends[season] = 0;
      }
      patternAnalysis.seasonalTrends[season]++;

      // Analyze risk patterns
      insight.analysis.riskFactors.forEach(risk => {
        const riskType = risk.risk;
        if (!patternAnalysis.riskPatterns[riskType]) {
          patternAnalysis.riskPatterns[riskType] = 0;
        }
        patternAnalysis.riskPatterns[riskType]++;
      });
    });

    res.json({
      success: true,
      data: patternAnalysis
    });

  } catch (error) {
    logger.error('❌ Error getting pattern analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve pattern analysis',
      message: error.message
    });
  }
});

// Get recommendations based on insights
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info('💡 Getting personalized medical recommendations', { userId });

    const insights = await insightsEngine.getUserInsights(userId, '30d');
    
    // Aggregate recommendations from insights
    const recommendations = {
      userId,
      generatedAt: new Date().toISOString(),
      urgent: [],
      high: [],
      medium: [],
      low: []
    };

    insights.forEach(insight => {
      insight.analysis.recommendations.forEach(rec => {
        const priority = rec.priority || 'medium';
        if (recommendations[priority]) {
          recommendations[priority].push({
            ...rec,
            source: 'AI Analysis',
            timestamp: insight.timestamp
          });
        }
      });
    });

    // Remove duplicates and sort by priority
    Object.keys(recommendations).forEach(priority => {
      if (Array.isArray(recommendations[priority])) {
        // Remove duplicates based on message content
        const unique = [];
        const seen = new Set();
        
        recommendations[priority].forEach(rec => {
          const key = rec.message.toLowerCase().trim();
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(rec);
          }
        });
        
        recommendations[priority] = unique;
      }
    });

    res.json({
      success: true,
      data: recommendations
    });

  } catch (error) {
    logger.error('❌ Error getting recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve recommendations',
      message: error.message
    });
  }
});

// Get risk assessment
router.get('/risk-assessment', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info('⚠️ Getting medical risk assessment', { userId });

    const insights = await insightsEngine.getUserInsights(userId, '30d');
    
    // Aggregate risk factors from insights
    const riskAssessment = {
      userId,
      generatedAt: new Date().toISOString(),
      overallRisk: 'low',
      riskFactors: [],
      riskLevels: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      }
    };

    insights.forEach(insight => {
      insight.analysis.riskFactors.forEach(risk => {
        riskAssessment.riskFactors.push({
          ...risk,
          timestamp: insight.timestamp,
          symptoms: insight.analysis.symptomAnalysis.identifiedSymptoms
        });

        // Count risk levels
        const riskLevel = risk.risk;
        if (riskAssessment.riskLevels[riskLevel] !== undefined) {
          riskAssessment.riskLevels[riskLevel]++;
        }
      });
    });

    // Determine overall risk level
    if (riskAssessment.riskLevels.critical > 0) {
      riskAssessment.overallRisk = 'critical';
    } else if (riskAssessment.riskLevels.high > 0) {
      riskAssessment.overallRisk = 'high';
    } else if (riskAssessment.riskLevels.medium > 0) {
      riskAssessment.overallRisk = 'medium';
    }

    res.json({
      success: true,
      data: riskAssessment
    });

  } catch (error) {
    logger.error('❌ Error getting risk assessment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve risk assessment',
      message: error.message
    });
  }
});

// Get seasonal health trends
router.get('/seasonal-trends', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info('🌤️ Getting seasonal health trends', { userId });

    const insights = await insightsEngine.getUserInsights(userId, '90d'); // 3 months for seasonal analysis
    
    const seasonalTrends = {
      userId,
      generatedAt: new Date().toISOString(),
      seasons: {},
      recommendations: []
    };

    // Analyze seasonal patterns
    insights.forEach(insight => {
      const season = insight.analysis.seasonalFactors.season;
      if (!seasonalTrends.seasons[season]) {
        seasonalTrends.seasons[season] = {
          count: 0,
          commonConditions: [],
          symptoms: new Set()
        };
      }

      seasonalTrends.seasons[season].count++;
      
      // Add symptoms to set
      insight.analysis.symptomAnalysis.identifiedSymptoms.forEach(symptom => {
        seasonalTrends.seasons[season].symptoms.add(symptom);
      });
    });

    // Convert sets to arrays and add seasonal recommendations
    Object.keys(seasonalTrends.seasons).forEach(season => {
      seasonalTrends.seasons[season].symptoms = Array.from(seasonalTrends.seasons[season].symptoms);
      
      // Add seasonal health recommendations
      seasonalTrends.recommendations.push({
        season,
        message: `Be aware of seasonal health factors in ${season}`,
        actions: [
          'Monitor for seasonal symptoms',
          'Consider preventive measures',
          'Stay updated on seasonal health alerts'
        ]
      });
    });

    res.json({
      success: true,
      data: seasonalTrends
    });

  } catch (error) {
    logger.error('❌ Error getting seasonal trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve seasonal trends',
      message: error.message
    });
  }
});

module.exports = router; 