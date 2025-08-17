const { logger, medicalLogger } = require('../utils/logger');
const { getDb, collections, saveAnalytics } = require('../config/firebase');
const os = require('os');

class PerformanceMetricsCollector {
  constructor() {
    this.db = getDb();
    this.collections = collections;
    this.metricsInterval = null;
    this.startCollection();
  }

  // Start automatic metrics collection
  startCollection() {
    try {
      // Collect system metrics every 5 minutes
      this.metricsInterval = setInterval(() => {
        this.collectSystemMetrics();
      }, 5 * 60 * 1000);

      // Collect performance metrics every 10 minutes
      setInterval(() => {
        this.collectPerformanceMetrics();
      }, 10 * 60 * 1000);

      logger.info('✅ Performance metrics collection started');
    } catch (error) {
      logger.error('❌ Error starting metrics collection:', error);
    }
  }

  // Collect system metrics
  async collectSystemMetrics() {
    try {
      const metrics = {
        timestamp: new Date().toISOString(),
        type: 'system_metrics',
        system: {
          platform: os.platform(),
          arch: os.arch(),
          nodeVersion: process.version,
          uptime: process.uptime(),
          memory: {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem(),
            percentage: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)
          },
          cpu: {
            loadAverage: os.loadavg(),
            cores: os.cpus().length
          }
        },
        process: {
          memory: process.memoryUsage(),
          cpu: process.cpuUsage(),
          pid: process.pid,
          title: process.title
        }
      };

      // Save to analytics collection
      await saveAnalytics('system_metrics', metrics);

      logger.debug('✅ System metrics collected and saved');
    } catch (error) {
      logger.error('❌ Error collecting system metrics:', error);
    }
  }

  // Collect performance metrics
  async collectPerformanceMetrics() {
    try {
      const metrics = {
        timestamp: new Date().toISOString(),
        type: 'performance_metrics',
        performance: {
          responseTime: await this.getAverageResponseTime(),
          errorRate: await this.getErrorRate(),
          activeUsers: await this.getActiveUsers(),
          apiUsage: await this.getAPIUsageStats()
        }
      };

      // Save to analytics collection
      await saveAnalytics('performance_metrics', metrics);

      logger.debug('✅ Performance metrics collected and saved');
    } catch (error) {
      logger.error('❌ Error collecting performance metrics:', error);
    }
  }

  // Track API response time
  async trackAPIResponseTime(endpoint, method, responseTime, statusCode, userId = null) {
    try {
      const metric = {
        timestamp: new Date().toISOString(),
        type: 'api_response_time',
        endpoint,
        method,
        responseTime,
        statusCode,
        userId,
        success: statusCode < 400
      };

      // Save to analytics collection
      await saveAnalytics('api_metrics', metric);

      // Log performance metric
      medicalLogger.performance('api_response', responseTime, {
        endpoint,
        method,
        statusCode,
        userId
      });

      logger.debug('✅ API response time tracked', { endpoint, responseTime });
    } catch (error) {
      logger.error('❌ Error tracking API response time:', error);
    }
  }

  // Track medical diagnosis performance
  async trackMedicalDiagnosisPerformance(diagnosisData) {
    try {
      const {
        userId,
        symptoms,
        diagnosis,
        processingTime,
        confidence,
        accuracy,
        language,
        platform
      } = diagnosisData;

      const metric = {
        timestamp: new Date().toISOString(),
        type: 'medical_diagnosis_performance',
        userId,
        symptoms: symptoms.substring(0, 100), // Truncate for privacy
        diagnosis: diagnosis.substring(0, 100),
        processingTime,
        confidence: confidence || 0,
        accuracy: accuracy || null,
        language,
        platform,
        success: confidence > 0.7
      };

      // Save to analytics collection
      await saveAnalytics('medical_performance', metric);

      // Track accuracy if available
      if (accuracy !== null) {
        await this.trackDiagnosisAccuracy(accuracy, language, platform);
      }

      logger.info('✅ Medical diagnosis performance tracked', {
        userId,
        processingTime,
        confidence,
        accuracy
      });
    } catch (error) {
      logger.error('❌ Error tracking medical diagnosis performance:', error);
    }
  }

  // Track diagnosis accuracy
  async trackDiagnosisAccuracy(accuracy, language, platform) {
    try {
      const metric = {
        timestamp: new Date().toISOString(),
        type: 'diagnosis_accuracy',
        accuracy,
        language,
        platform,
        category: this.categorizeAccuracy(accuracy)
      };

      await saveAnalytics('diagnosis_accuracy', metric);
    } catch (error) {
      logger.error('❌ Error tracking diagnosis accuracy:', error);
    }
  }

  // Categorize accuracy levels
  categorizeAccuracy(accuracy) {
    if (accuracy >= 0.9) return 'excellent';
    if (accuracy >= 0.8) return 'very_good';
    if (accuracy >= 0.7) return 'good';
    if (accuracy >= 0.6) return 'fair';
    if (accuracy >= 0.5) return 'poor';
    return 'very_poor';
  }

  // Track user engagement metrics
  async trackUserEngagement(userId, action, duration, platform, metadata = {}) {
    try {
      const metric = {
        timestamp: new Date().toISOString(),
        type: 'user_engagement',
        userId,
        action,
        duration,
        platform,
        metadata
      };

      await saveAnalytics('user_engagement', metric);

      logger.debug('✅ User engagement tracked', { userId, action, duration });
    } catch (error) {
      logger.error('❌ Error tracking user engagement:', error);
    }
  }

  // Track learning session performance
  async trackLearningSessionPerformance(sessionData) {
    try {
      const {
        userId,
        topic,
        duration,
        questionsAnswered,
        correctAnswers,
        timePerQuestion,
        difficulty
      } = sessionData;

      const accuracy = questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0;
      const efficiency = duration > 0 ? correctAnswers / duration : 0;

      const metric = {
        timestamp: new Date().toISOString(),
        type: 'learning_session_performance',
        userId,
        topic,
        duration,
        questionsAnswered,
        correctAnswers,
        accuracy,
        efficiency,
        timePerQuestion,
        difficulty,
        performance: this.categorizeLearningPerformance(accuracy, efficiency)
      };

      await saveAnalytics('learning_performance', metric);

      logger.info('✅ Learning session performance tracked', {
        userId,
        topic,
        accuracy: accuracy.toFixed(2),
        efficiency: efficiency.toFixed(2)
      });
    } catch (error) {
      logger.error('❌ Error tracking learning session performance:', error);
    }
  }

  // Categorize learning performance
  categorizeLearningPerformance(accuracy, efficiency) {
    if (accuracy >= 0.8 && efficiency >= 0.1) return 'excellent';
    if (accuracy >= 0.7 && efficiency >= 0.08) return 'very_good';
    if (accuracy >= 0.6 && efficiency >= 0.06) return 'good';
    if (accuracy >= 0.5 && efficiency >= 0.04) return 'fair';
    if (accuracy >= 0.4 && efficiency >= 0.02) return 'poor';
    return 'needs_improvement';
  }

  // Get average response time
  async getAverageResponseTime() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const responseTimeSnapshot = await this.db.collection('analytics')
        .where('type', '==', 'api_response_time')
        .where('timestamp', '>=', oneHourAgo.toISOString())
        .get();

      if (responseTimeSnapshot.empty) return 0;

      let totalTime = 0;
      let count = 0;

      responseTimeSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.responseTime) {
          totalTime += data.responseTime;
          count++;
        }
      });

      return count > 0 ? totalTime / count : 0;
    } catch (error) {
      logger.error('❌ Error getting average response time:', error);
      return 0;
    }
  }

  // Get error rate
  async getErrorRate() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const totalRequestsSnapshot = await this.db.collection('analytics')
        .where('type', '==', 'api_response_time')
        .where('timestamp', '>=', oneHourAgo.toISOString())
        .get();

      const errorRequestsSnapshot = await this.db.collection('analytics')
        .where('type', '==', 'api_response_time')
        .where('timestamp', '>=', oneHourAgo.toISOString())
        .where('success', '==', false)
        .get();

      const totalRequests = totalRequestsSnapshot.size;
      const errorRequests = errorRequestsSnapshot.size;

      return totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
    } catch (error) {
      logger.error('❌ Error getting error rate:', error);
      return 0;
    }
  }

  // Get active users count
  async getActiveUsers() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const activeUsersSnapshot = await this.db.collection('analytics')
        .where('timestamp', '>=', oneHourAgo.toISOString())
        .get();

      const uniqueUsers = new Set();
      activeUsersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.userId) {
          uniqueUsers.add(data.userId);
        }
      });

      return uniqueUsers.size;
    } catch (error) {
      logger.error('❌ Error getting active users:', error);
      return 0;
    }
  }

  // Get API usage statistics
  async getAPIUsageStats() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const apiUsageSnapshot = await this.db.collection('analytics')
        .where('type', '==', 'api_response_time')
        .where('timestamp', '>=', oneHourAgo.toISOString())
        .get();

      const usageStats = {};
      
      apiUsageSnapshot.forEach(doc => {
        const data = doc.data();
        const endpoint = data.endpoint || 'unknown';
        
        if (!usageStats[endpoint]) {
          usageStats[endpoint] = {
            count: 0,
            totalTime: 0,
            errors: 0
          };
        }

        usageStats[endpoint].count++;
        usageStats[endpoint].totalTime += data.responseTime || 0;
        
        if (!data.success) {
          usageStats[endpoint].errors++;
        }
      });

      // Calculate averages
      Object.keys(usageStats).forEach(endpoint => {
        const stats = usageStats[endpoint];
        stats.averageTime = stats.count > 0 ? stats.totalTime / stats.count : 0;
        stats.errorRate = stats.count > 0 ? (stats.errors / stats.count) * 100 : 0;
      });

      return usageStats;
    } catch (error) {
      logger.error('❌ Error getting API usage stats:', error);
      return {};
    }
  }

  // Generate performance report
  async generatePerformanceReport(timeRange = '24h') {
    try {
      const now = new Date();
      let startTime;

      switch (timeRange) {
        case '1h':
          startTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const report = {
        generatedAt: now.toISOString(),
        timeRange,
        period: {
          start: startTime.toISOString(),
          end: now.toISOString()
        },
        system: {
          averageMemoryUsage: await this.getAverageMemoryUsage(startTime),
          averageCPUUsage: await this.getAverageCPUUsage(startTime),
          uptime: process.uptime()
        },
        performance: {
          averageResponseTime: await this.getAverageResponseTime(),
          errorRate: await this.getErrorRate(),
          activeUsers: await this.getActiveUsers()
        },
        medical: {
          totalDiagnoses: await this.getTotalDiagnoses(startTime),
          averageAccuracy: await this.getAverageDiagnosisAccuracy(startTime),
          languageDistribution: await this.getLanguageDistribution(startTime)
        },
        learning: {
          totalSessions: await this.getTotalLearningSessions(startTime),
          averageSessionDuration: await this.getAverageSessionDuration(startTime),
          topicPopularity: await this.getTopicPopularity(startTime)
        }
      };

      return report;
    } catch (error) {
      logger.error('❌ Error generating performance report:', error);
      throw error;
    }
  }

  // Helper methods for report generation
  async getAverageMemoryUsage(startTime) {
    // Implementation for getting average memory usage
    return 0; // Placeholder
  }

  async getAverageCPUUsage(startTime) {
    // Implementation for getting average CPU usage
    return 0; // Placeholder
  }

  async getTotalDiagnoses(startTime) {
    // Implementation for getting total diagnoses
    return 0; // Placeholder
  }

  async getAverageDiagnosisAccuracy(startTime) {
    // Implementation for getting average diagnosis accuracy
    return 0; // Placeholder
  }

  async getLanguageDistribution(startTime) {
    // Implementation for getting language distribution
    return {}; // Placeholder
  }

  async getTotalLearningSessions(startTime) {
    // Implementation for getting total learning sessions
    return 0; // Placeholder
  }

  async getAverageSessionDuration(startTime) {
    // Implementation for getting average session duration
    return 0; // Placeholder
  }

  async getTopicPopularity(startTime) {
    // Implementation for getting topic popularity
    return {}; // Placeholder
  }

  // Stop metrics collection
  stopCollection() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
      logger.info('✅ Performance metrics collection stopped');
    }
  }

  // Cleanup
  destroy() {
    this.stopCollection();
  }
}

module.exports = PerformanceMetricsCollector; 