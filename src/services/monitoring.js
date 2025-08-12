const { logger } = require('../utils/logger');
const os = require('os');
const process = require('process');

class ProductionMonitor {
  constructor() {
    this.startTime = Date.now();
    this.requestCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
    this.activeConnections = 0;
    this.memoryUsage = [];
    this.cpuUsage = [];
    
    // Start monitoring intervals
    this.startMonitoring();
  }

  // Track request metrics
  trackRequest(req, res, next) {
    const startTime = Date.now();
    this.requestCount++;
    this.activeConnections++;

    // Track response time
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.responseTimes.push(duration);
      this.activeConnections--;

      // Keep only last 1000 response times for memory efficiency
      if (this.responseTimes.length > 1000) {
        this.responseTimes.shift();
      }

      // Log slow requests
      if (duration > 1000) {
        logger.warn('🐌 Slow request detected', {
          path: req.path,
          method: req.method,
          duration: `${duration}ms`,
          userAgent: req.get('User-Agent')
        });
      }
    });

    next();
  }

  // Track errors
  trackError(error, req) {
    this.errorCount++;
    logger.error('❌ Error tracked by monitor:', {
      error: error.message,
      stack: error.stack,
      path: req?.path,
      method: req?.method,
      timestamp: new Date().toISOString()
    });
  }

  // Get system health metrics
  getHealthMetrics() {
    const uptime = Date.now() - this.startTime;
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Calculate response time statistics
    const avgResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;
    
    const maxResponseTime = Math.max(...this.responseTimes, 0);
    const minResponseTime = Math.min(...this.responseTimes, 0);

    return {
      status: 'healthy',
      uptime: {
        server: Math.floor(uptime / 1000),
        process: process.uptime()
      },
      requests: {
        total: this.requestCount,
        active: this.activeConnections,
        errors: this.errorCount,
        successRate: this.requestCount > 0 
          ? ((this.requestCount - this.errorCount) / this.requestCount * 100).toFixed(2)
          : 100
      },
      performance: {
        avgResponseTime: Math.round(avgResponseTime),
        maxResponseTime: Math.round(maxResponseTime),
        minResponseTime: Math.round(minResponseTime),
        responseTime95th: this.calculatePercentile(95)
      },
      system: {
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024),
          rss: Math.round(memoryUsage.rss / 1024 / 1024)
        },
        cpu: {
          user: Math.round(cpuUsage.user / 1000),
          system: Math.round(cpuUsage.system / 1000)
        },
        platform: {
          os: os.platform(),
          arch: os.arch(),
          nodeVersion: process.version,
          pid: process.pid
        }
      },
      timestamp: new Date().toISOString()
    };
  }

  // Calculate percentile for response times
  calculatePercentile(percentile) {
    if (this.responseTimes.length === 0) return 0;
    
    const sorted = [...this.responseTimes].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return Math.round(sorted[index] || 0);
  }

  // Get detailed performance report
  getPerformanceReport() {
    const metrics = this.getHealthMetrics();
    
    return {
      summary: {
        status: metrics.status,
        uptime: `${Math.floor(metrics.uptime.server / 3600)}h ${Math.floor((metrics.uptime.server % 3600) / 60)}m`,
        totalRequests: metrics.requests.total,
        errorRate: `${(100 - parseFloat(metrics.requests.successRate)).toFixed(2)}%`,
        avgResponseTime: `${metrics.performance.avgResponseTime}ms`
      },
      details: metrics,
      recommendations: this.generateRecommendations(metrics)
    };
  }

  // Generate performance recommendations
  generateRecommendations(metrics) {
    const recommendations = [];

    if (metrics.performance.avgResponseTime > 500) {
      recommendations.push({
        priority: 'high',
        issue: 'Slow response times',
        recommendation: 'Consider implementing caching, database optimization, or scaling'
      });
    }

    if (metrics.requests.successRate < 95) {
      recommendations.push({
        priority: 'high',
        issue: 'High error rate',
        recommendation: 'Review error logs and implement better error handling'
      });
    }

    if (metrics.system.memory.used > metrics.system.memory.total * 0.8) {
      recommendations.push({
        priority: 'medium',
        issue: 'High memory usage',
        recommendation: 'Monitor for memory leaks and consider garbage collection optimization'
      });
    }

    if (metrics.performance.responseTime95th > 2000) {
      recommendations.push({
        priority: 'medium',
        issue: '95th percentile response time is high',
        recommendation: 'Identify and optimize slow endpoints'
      });
    }

    return recommendations;
  }

  // Start monitoring intervals
  startMonitoring() {
    // Memory usage monitoring every 30 seconds
    setInterval(() => {
      const memoryUsage = process.memoryUsage();
      this.memoryUsage.push({
        timestamp: Date.now(),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024)
      });

      // Keep only last 100 memory readings
      if (this.memoryUsage.length > 100) {
        this.memoryUsage.shift();
      }

      // Alert if memory usage is high
      if (memoryUsage.heapUsed > memoryUsage.heapTotal * 0.9) {
        logger.warn('⚠️ High memory usage detected', {
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          percentage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`
        });
      }
    }, 30000);

    // CPU usage monitoring every minute
    setInterval(() => {
      const cpuUsage = process.cpuUsage();
      this.cpuUsage.push({
        timestamp: Date.now(),
        user: Math.round(cpuUsage.user / 1000),
        system: Math.round(cpuUsage.system / 1000)
      });

      // Keep only last 60 CPU readings
      if (this.cpuUsage.length > 60) {
        this.cpuUsage.shift();
      }
    }, 60000);

    // Log system status every 5 minutes
    setInterval(() => {
      const metrics = this.getHealthMetrics();
      logger.info('📊 System health check', {
        uptime: `${Math.floor(metrics.uptime.server / 3600)}h`,
        requests: metrics.requests.total,
        errors: metrics.requests.errors,
        avgResponseTime: `${metrics.performance.avgResponseTime}ms`,
        memoryUsage: `${metrics.system.memory.used}MB / ${metrics.system.memory.total}MB`
      });
    }, 300000);

    logger.info('✅ Production monitoring started');
  }

  // Reset metrics (useful for testing)
  resetMetrics() {
    this.requestCount = 0;
    this.errorCount = 0;
    this.responseTimes = [];
    this.memoryUsage = [];
    this.cpuUsage = [];
    this.startTime = Date.now();
    logger.info('🔄 Monitoring metrics reset');
  }
}

// Create singleton instance
const productionMonitor = new ProductionMonitor();

module.exports = {
  productionMonitor,
  ProductionMonitor
}; 