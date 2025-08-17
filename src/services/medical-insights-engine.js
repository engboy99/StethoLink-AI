const { logger, medicalLogger } = require('../utils/logger');
const { getDb, collections, getMedicalInsights } = require('../config/firebase');

class MedicalInsightsEngine {
  constructor() {
    this.db = getDb();
    this.collections = collections;
    this.medicalPatterns = this.initializeMedicalPatterns();
  }

  // Initialize medical patterns and knowledge base
  initializeMedicalPatterns() {
    return {
      // Common symptom patterns
      symptomPatterns: {
        'fever_cough_fatigue': {
          name: 'Respiratory Infection Pattern',
          conditions: ['Common Cold', 'Flu', 'COVID-19', 'Bronchitis'],
          severity: 'moderate',
          urgency: 'medium'
        },
        'chest_pain_shortness_breath': {
          name: 'Cardiac Pattern',
          conditions: ['Angina', 'Heart Attack', 'Pulmonary Embolism'],
          severity: 'high',
          urgency: 'immediate'
        },
        'abdominal_pain_nausea_vomiting': {
          name: 'Gastrointestinal Pattern',
          conditions: ['Gastritis', 'Food Poisoning', 'Appendicitis'],
          severity: 'moderate',
          urgency: 'medium'
        }
      },

      // Language-specific patterns
      languagePatterns: {
        'english': {
          commonTerms: ['pain', 'fever', 'cough', 'headache', 'nausea'],
          severityIndicators: ['severe', 'mild', 'sharp', 'dull', 'throbbing']
        },
        'spanish': {
          commonTerms: ['dolor', 'fiebre', 'tos', 'dolor de cabeza', 'náusea'],
          severityIndicators: ['severo', 'leve', 'agudo', 'sordo', 'pulsante']
        },
        'french': {
          commonTerms: ['douleur', 'fièvre', 'toux', 'mal de tête', 'nausée'],
          severityIndicators: ['sévère', 'léger', 'aigu', 'sourd', 'pulsant']
        }
      },

      // Seasonal patterns
      seasonalPatterns: {
        'winter': ['flu', 'cold', 'pneumonia', 'bronchitis'],
        'spring': ['allergies', 'asthma', 'hay fever'],
        'summer': ['heat stroke', 'dehydration', 'sunburn'],
        'fall': ['allergies', 'cold', 'flu']
      }
    };
  }

  // Analyze medical conversation for insights
  async analyzeMedicalConversation(conversationData) {
    try {
      const {
        userId,
        symptoms,
        diagnosis,
        confidence,
        language,
        timestamp,
        platform
      } = conversationData;

      const insights = {
        timestamp: new Date().toISOString(),
        userId,
        analysis: {
          symptomAnalysis: this.analyzeSymptoms(symptoms, language),
          patternRecognition: this.recognizePatterns(symptoms, language),
          seasonalFactors: this.analyzeSeasonalFactors(timestamp),
          confidenceAssessment: this.assessConfidence(confidence, symptoms),
          recommendations: [],
          riskFactors: [],
          followUpActions: []
        },
        metadata: {
          language,
          platform,
          analysisVersion: '1.0'
        }
      };

      // Generate recommendations based on analysis
      insights.analysis.recommendations = this.generateRecommendations(insights.analysis);
      
      // Identify risk factors
      insights.analysis.riskFactors = this.identifyRiskFactors(insights.analysis);
      
      // Suggest follow-up actions
      insights.analysis.followUpActions = this.suggestFollowUpActions(insights.analysis);

      // Save insights to database
      await this.saveMedicalInsights(insights);

      logger.info('🔍 Medical insights generated', {
        userId,
        symptoms: symptoms.substring(0, 50),
        patterns: insights.analysis.patternRecognition.length
      });

      return insights;
    } catch (error) {
      logger.error('❌ Error analyzing medical conversation:', error);
      throw error;
    }
  }

  // Analyze symptoms for patterns and severity
  analyzeSymptoms(symptoms, language = 'english') {
    try {
      const symptomText = symptoms.toLowerCase();
      const analysis = {
        identifiedSymptoms: [],
        severity: 'low',
        urgency: 'low',
        confidence: 0.5
      };

      // Get language-specific patterns
      const langPatterns = this.medicalPatterns.languagePatterns[language] || 
                          this.medicalPatterns.languagePatterns.english;

      // Identify symptoms based on language
      langPatterns.commonTerms.forEach(term => {
        if (symptomText.includes(term)) {
          analysis.identifiedSymptoms.push(term);
        }
      });

      // Assess severity based on language indicators
      langPatterns.severityIndicators.forEach(indicator => {
        if (symptomText.includes(indicator)) {
          if (indicator.includes('severe') || indicator.includes('agudo') || indicator.includes('sévère')) {
            analysis.severity = 'high';
            analysis.urgency = 'high';
          } else if (indicator.includes('moderate') || indicator.includes('moderado') || indicator.includes('modéré')) {
            analysis.severity = 'moderate';
            analysis.urgency = 'medium';
          }
        }
      });

      // Calculate confidence based on symptom clarity
      analysis.confidence = Math.min(0.9, 0.5 + (analysis.identifiedSymptoms.length * 0.1));

      return analysis;
    } catch (error) {
      logger.error('❌ Error analyzing symptoms:', error);
      return { identifiedSymptoms: [], severity: 'low', urgency: 'low', confidence: 0.5 };
    }
  }

  // Recognize medical patterns
  recognizePatterns(symptoms, language = 'english') {
    try {
      const symptomText = symptoms.toLowerCase();
      const recognizedPatterns = [];

      // Check against known symptom patterns
      Object.entries(this.medicalPatterns.symptomPatterns).forEach(([patternKey, pattern]) => {
        const patternSymptoms = patternKey.split('_');
        const matches = patternSymptoms.filter(symptom => 
          symptomText.includes(symptom)
        );

        if (matches.length >= 2) { // At least 2 symptoms match
          recognizedPatterns.push({
            pattern: pattern.name,
            conditions: pattern.conditions,
            severity: pattern.severity,
            urgency: pattern.urgency,
            confidence: matches.length / patternSymptoms.length,
            matchedSymptoms: matches
          });
        }
      });

      return recognizedPatterns;
    } catch (error) {
      logger.error('❌ Error recognizing patterns:', error);
      return [];
    }
  }

  // Analyze seasonal factors
  analyzeSeasonalFactors(timestamp) {
    try {
      const date = new Date(timestamp);
      const month = date.getMonth() + 1;
      let season = '';

      if (month >= 12 || month <= 2) season = 'winter';
      else if (month >= 3 && month <= 5) season = 'spring';
      else if (month >= 6 && month <= 8) season = 'summer';
      else season = 'fall';

      const seasonalConditions = this.medicalPatterns.seasonalPatterns[season] || [];

      return {
        season,
        month,
        seasonalConditions,
        relevance: seasonalConditions.length > 0 ? 'high' : 'low'
      };
    } catch (error) {
      logger.error('❌ Error analyzing seasonal factors:', error);
      return { season: 'unknown', seasonalConditions: [], relevance: 'low' };
    }
  }

  // Assess diagnosis confidence
  assessConfidence(confidence, symptoms) {
    try {
      const assessment = {
        overallConfidence: confidence || 0.5,
        factors: [],
        reliability: 'medium'
      };

      // Analyze factors affecting confidence
      if (symptoms && symptoms.length > 20) {
        assessment.factors.push('Detailed symptom description');
        assessment.overallConfidence += 0.1;
      }

      if (confidence > 0.8) {
        assessment.reliability = 'high';
        assessment.factors.push('High AI confidence');
      } else if (confidence < 0.5) {
        assessment.reliability = 'low';
        assessment.factors.push('Low AI confidence');
      }

      // Cap confidence at 0.95
      assessment.overallConfidence = Math.min(0.95, assessment.overallConfidence);

      return assessment;
    } catch (error) {
      logger.error('❌ Error assessing confidence:', error);
      return { overallConfidence: 0.5, factors: [], reliability: 'medium' };
    }
  }

  // Generate medical recommendations
  generateRecommendations(analysis) {
    try {
      const recommendations = [];

      // Based on severity
      if (analysis.symptomAnalysis.severity === 'high') {
        recommendations.push({
          type: 'urgent_care',
          priority: 'high',
          message: 'Seek immediate medical attention',
          action: 'Visit emergency room or call emergency services'
        });
      }

      // Based on patterns
      analysis.patternRecognition.forEach(pattern => {
        if (pattern.urgency === 'immediate') {
          recommendations.push({
            type: 'emergency',
            priority: 'critical',
            message: `Possible ${pattern.conditions[0]} - Immediate attention required`,
            action: 'Call emergency services immediately'
          });
        }
      });

      // Based on seasonal factors
      if (analysis.seasonalFactors.relevance === 'high') {
        recommendations.push({
          type: 'seasonal_awareness',
          priority: 'medium',
          message: 'Seasonal factors may be contributing',
          action: 'Consider seasonal treatments and prevention'
        });
      }

      // General health recommendations
      recommendations.push({
        type: 'general_health',
        priority: 'low',
        message: 'Monitor symptoms and maintain good health practices',
        action: 'Rest, hydrate, and monitor for changes'
      });

      return recommendations;
    } catch (error) {
      logger.error('❌ Error generating recommendations:', error);
      return [];
    }
  }

  // Identify risk factors
  identifyRiskFactors(analysis) {
    try {
      const riskFactors = [];

      // High severity symptoms
      if (analysis.symptomAnalysis.severity === 'high') {
        riskFactors.push({
          factor: 'High symptom severity',
          risk: 'high',
          description: 'Symptoms indicate serious condition requiring immediate attention'
        });
      }

      // Pattern-based risks
      analysis.patternRecognition.forEach(pattern => {
        if (pattern.severity === 'high') {
          riskFactors.push({
            factor: pattern.pattern,
            risk: 'high',
            description: `Pattern suggests ${pattern.conditions.join(' or ')}`
          });
        }
      });

      // Low confidence risks
      if (analysis.confidenceAssessment.overallConfidence < 0.6) {
        riskFactors.push({
          factor: 'Low diagnosis confidence',
          risk: 'medium',
          description: 'AI diagnosis confidence is low, consider professional evaluation'
        });
      }

      return riskFactors;
    } catch (error) {
      logger.error('❌ Error identifying risk factors:', error);
      return [];
    }
  }

  // Suggest follow-up actions
  suggestFollowUpActions(analysis) {
    try {
      const actions = [];

      // Immediate actions
      if (analysis.symptomAnalysis.urgency === 'high') {
        actions.push({
          action: 'Seek immediate medical care',
          timeline: 'immediate',
          priority: 'critical'
        });
      }

      // Short-term actions
      actions.push({
        action: 'Monitor symptoms for 24-48 hours',
        timeline: '24-48 hours',
        priority: 'medium'
      });

      // Professional consultation
      if (analysis.confidenceAssessment.reliability === 'low') {
        actions.push({
          action: 'Consult healthcare professional',
          timeline: 'within 24 hours',
          priority: 'high'
        });
      }

      // Follow-up monitoring
      actions.push({
        action: 'Track symptom changes',
        timeline: 'ongoing',
        priority: 'low'
      });

      return actions;
    } catch (error) {
      logger.error('❌ Error suggesting follow-up actions:', error);
      return [];
    }
  }

  // Save medical insights to database
  async saveMedicalInsights(insights) {
    try {
      const insightsRef = await this.db.collection('medical_insights').add({
        ...insights,
        createdAt: new Date().toISOString()
      });

      logger.info('✅ Medical insights saved', { insightsId: insightsRef.id });
      return insightsRef.id;
    } catch (error) {
      logger.error('❌ Error saving medical insights:', error);
      throw error;
    }
  }

  // Get insights for a specific user
  async getUserInsights(userId, timeRange = '30d') {
    try {
      const insights = await getMedicalInsights(timeRange, { userId });
      
      // Filter insights for specific user
      const userInsights = insights.filter(insight => 
        insight.userId === userId
      );

      return userInsights;
    } catch (error) {
      logger.error('❌ Error getting user insights:', error);
      return [];
    }
  }

  // Generate insights summary
  async generateInsightsSummary(userId, timeRange = '30d') {
    try {
      const insights = await this.getUserInsights(userId, timeRange);
      
      if (insights.length === 0) {
        return {
          totalInsights: 0,
          message: 'No insights available for this period'
        };
      }

      const summary = {
        totalInsights: insights.length,
        timeRange,
        generatedAt: new Date().toISOString(),
        patterns: {},
        recommendations: {},
        riskFactors: {},
        seasonalTrends: {}
      };

      // Analyze patterns
      insights.forEach(insight => {
        insight.analysis.patternRecognition.forEach(pattern => {
          const patternName = pattern.pattern;
          if (!summary.patterns[patternName]) {
            summary.patterns[patternName] = 0;
          }
          summary.patterns[patternName]++;
        });
      });

      // Analyze recommendations
      insights.forEach(insight => {
        insight.analysis.recommendations.forEach(rec => {
          const recType = rec.type;
          if (!summary.recommendations[recType]) {
            summary.recommendations[recType] = 0;
          }
          summary.recommendations[recType]++;
        });
      });

      // Analyze risk factors
      insights.forEach(insight => {
        insight.analysis.riskFactors.forEach(risk => {
          const riskFactor = risk.factor;
          if (!summary.riskFactors[riskFactor]) {
            summary.riskFactors[riskFactor] = 0;
          }
          summary.riskFactors[riskFactor]++;
        });
      });

      // Analyze seasonal trends
      insights.forEach(insight => {
        const season = insight.analysis.seasonalFactors.season;
        if (!summary.seasonalTrends[season]) {
          summary.seasonalTrends[season] = 0;
        }
        summary.seasonalTrends[season]++;
      });

      return summary;
    } catch (error) {
      logger.error('❌ Error generating insights summary:', error);
      return { totalInsights: 0, error: error.message };
    }
  }
}

module.exports = MedicalInsightsEngine; 