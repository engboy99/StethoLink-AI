const { logger, medicalLogger } = require('../utils/logger');
const { saveAnalytics, getUserAnalytics, getMedicalInsights } = require('../config/firebase');

class AdvancedAnalyticsService {
    constructor() {
        this.analyticsQueue = [];
        this.batchSize = 50;
        this.flushInterval = 30000; // 30 seconds
        this.initBatchProcessing();
    }

    // Initialize batch processing for analytics
    initBatchProcessing() {
        setInterval(() => {
            this.flushAnalyticsQueue();
        }, this.flushInterval);
    }

    // Track user interaction
    async trackUserInteraction(userId, event, data = {}) {
        try {
            const interaction = {
                userId,
                event,
                data,
                timestamp: new Date().toISOString(),
                sessionId: this.getSessionId(),
                userAgent: this.getUserAgent(),
                platform: this.getPlatform()
            };

            this.analyticsQueue.push(interaction);
            
            // Flush if queue is full
            if (this.analyticsQueue.length >= this.batchSize) {
                await this.flushAnalyticsQueue();
            }

            logger.info('📊 User interaction tracked', { userId, event, data });
        } catch (error) {
            logger.error('❌ Error tracking user interaction:', error);
        }
    }

    // Track medical diagnosis usage
    async trackMedicalDiagnosis(userId, symptoms, diagnosis, processingTime, accuracy = null) {
        try {
            const medicalEvent = {
                userId,
                event: 'medical_diagnosis',
                data: {
                    symptoms,
                    diagnosis,
                    processingTime,
                    accuracy,
                    language: diagnosis.language || 'en',
                    confidence: diagnosis.confidence || 0,
                    model: diagnosis.model || 'unknown'
                },
                timestamp: new Date().toISOString(),
                category: 'medical_ai'
            };

            this.analyticsQueue.push(medicalEvent);
            
            // Also track medical insights
            await this.trackMedicalInsights(symptoms, diagnosis);
            
            logger.info('🏥 Medical diagnosis tracked', { userId, symptoms: symptoms.substring(0, 50) });
        } catch (error) {
            logger.error('❌ Error tracking medical diagnosis:', error);
        }
    }

    // Track learning progress
    async trackLearningProgress(userId, topic, action, progress, timeSpent) {
        try {
            const learningEvent = {
                userId,
                event: 'learning_progress',
                data: {
                    topic,
                    action,
                    progress,
                    timeSpent,
                    timestamp: new Date().toISOString()
                },
                timestamp: new Date().toISOString(),
                category: 'education'
            };

            this.analyticsQueue.push(learningEvent);
            
            logger.info('📚 Learning progress tracked', { userId, topic, action, progress });
        } catch (error) {
            logger.error('❌ Error tracking learning progress:', error);
        }
    }

    // Track performance metrics
    async trackPerformanceMetrics(userId, metric, value, context = {}) {
        try {
            const performanceEvent = {
                userId,
                event: 'performance_metric',
                data: {
                    metric,
                    value,
                    context,
                    timestamp: new Date().toISOString()
                },
                timestamp: new Date().toISOString(),
                category: 'performance'
            };

            this.analyticsQueue.push(performanceEvent);
            
            logger.info('⚡ Performance metric tracked', { userId, metric, value });
        } catch (error) {
            logger.error('❌ Error tracking performance metric:', error);
        }
    }

    // Track medical insights and patterns
    async trackMedicalInsights(symptoms, diagnosis) {
        try {
            const insight = {
                symptoms: symptoms.toLowerCase(),
                diagnosis: diagnosis.diagnosis,
                confidence: diagnosis.confidence || 0,
                timestamp: new Date().toISOString(),
                frequency: 1,
                patterns: this.extractMedicalPatterns(symptoms, diagnosis)
            };

            // Save to medical insights collection
            await saveAnalytics('medical_insights', insight);
            
            logger.info('🔍 Medical insight tracked', { symptoms: symptoms.substring(0, 50) });
        } catch (error) {
            logger.error('❌ Error tracking medical insights:', error);
        }
    }

    // Extract medical patterns from symptoms and diagnosis
    extractMedicalPatterns(symptoms, diagnosis) {
        const patterns = {
            symptomGroups: this.groupSymptoms(symptoms),
            diagnosisCategories: this.categorizeDiagnosis(diagnosis),
            severity: this.assessSeverity(symptoms, diagnosis),
            urgency: this.assessUrgency(symptoms, diagnosis)
        };

        return patterns;
    }

    // Group symptoms by body system
    groupSymptoms(symptoms) {
        const symptomGroups = {
            cardiovascular: ['chest pain', 'palpitations', 'shortness of breath', 'edema'],
            respiratory: ['cough', 'dyspnea', 'wheezing', 'chest tightness'],
            gastrointestinal: ['nausea', 'vomiting', 'abdominal pain', 'diarrhea'],
            neurological: ['headache', 'dizziness', 'numbness', 'weakness'],
            musculoskeletal: ['joint pain', 'muscle weakness', 'stiffness', 'swelling']
        };

        const foundGroups = [];
        const lowerSymptoms = symptoms.toLowerCase();

        for (const [system, systemSymptoms] of Object.entries(symptomGroups)) {
            if (systemSymptoms.some(symptom => lowerSymptoms.includes(symptom))) {
                foundGroups.push(system);
            }
        }

        return foundGroups;
    }

    // Categorize diagnosis
    categorizeDiagnosis(diagnosis) {
        const categories = {
            infectious: ['infection', 'viral', 'bacterial', 'fever'],
            cardiovascular: ['heart', 'cardiac', 'hypertension', 'arrhythmia'],
            respiratory: ['pneumonia', 'asthma', 'bronchitis', 'copd'],
            gastrointestinal: ['gastritis', 'ulcer', 'colitis', 'hepatitis'],
            neurological: ['migraine', 'stroke', 'seizure', 'meningitis']
        };

        const foundCategories = [];
        const lowerDiagnosis = diagnosis.diagnosis.toLowerCase();

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerDiagnosis.includes(keyword))) {
                foundCategories.push(category);
            }
        }

        return foundCategories;
    }

    // Assess symptom severity
    assessSeverity(symptoms, diagnosis) {
        const severeKeywords = ['severe', 'intense', 'excruciating', 'unbearable', 'critical'];
        const moderateKeywords = ['moderate', 'mild', 'slight', 'manageable'];
        
        const lowerSymptoms = symptoms.toLowerCase();
        
        if (severeKeywords.some(keyword => lowerSymptoms.includes(keyword))) {
            return 'severe';
        } else if (moderateKeywords.some(keyword => lowerSymptoms.includes(keyword))) {
            return 'moderate';
        } else {
            return 'mild';
        }
    }

    // Assess urgency
    assessUrgency(symptoms, diagnosis) {
        const urgentKeywords = ['sudden', 'acute', 'emergency', 'immediate', 'severe pain'];
        const lowerSymptoms = symptoms.toLowerCase();
        
        if (urgentKeywords.some(keyword => lowerSymptoms.includes(keyword))) {
            return 'urgent';
        } else {
            return 'routine';
        }
    }

    // Get user analytics
    async getUserAnalytics(userId, timeRange = '30d') {
        try {
            const analytics = await getUserAnalytics(userId, timeRange);
            
            // Process and aggregate data
            const processed = this.processUserAnalytics(analytics);
            
            logger.info('📊 User analytics retrieved', { userId, timeRange });
            return processed;
        } catch (error) {
            logger.error('❌ Error getting user analytics:', error);
            throw error;
        }
    }

    // Process user analytics data
    processUserAnalytics(analytics) {
        const processed = {
            totalSessions: 0,
            totalDiagnoses: 0,
            learningProgress: {},
            performanceMetrics: {},
            medicalInsights: {},
            timeSpent: 0,
            mostUsedFeatures: [],
            improvementAreas: []
        };

        // Aggregate data
        analytics.forEach(event => {
            switch (event.event) {
                case 'session_start':
                    processed.totalSessions++;
                    break;
                case 'medical_diagnosis':
                    processed.totalDiagnoses++;
                    break;
                case 'learning_progress':
                    if (!processed.learningProgress[event.data.topic]) {
                        processed.learningProgress[event.data.topic] = 0;
                    }
                    processed.learningProgress[event.data.topic] += event.data.progress;
                    processed.timeSpent += event.data.timeSpent || 0;
                    break;
                case 'performance_metric':
                    if (!processed.performanceMetrics[event.data.metric]) {
                        processed.performanceMetrics[event.data.metric] = [];
                    }
                    processed.performanceMetrics[event.data.metric].push(event.data.value);
                    break;
            }
        });

        // Calculate averages and trends
        Object.keys(processed.performanceMetrics).forEach(metric => {
            const values = processed.performanceMetrics[metric];
            processed.performanceMetrics[metric] = {
                average: values.reduce((a, b) => a + b, 0) / values.length,
                trend: this.calculateTrend(values),
                min: Math.min(...values),
                max: Math.max(...values)
            };
        });

        // Identify improvement areas
        processed.improvementAreas = this.identifyImprovementAreas(processed);

        return processed;
    }

    // Calculate trend from values
    calculateTrend(values) {
        if (values.length < 2) return 'stable';
        
        const recent = values.slice(-5);
        const older = values.slice(0, -5);
        
        if (recent.length === 0 || older.length === 0) return 'stable';
        
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        
        const change = ((recentAvg - olderAvg) / olderAvg) * 100;
        
        if (change > 5) return 'improving';
        if (change < -5) return 'declining';
        return 'stable';
    }

    // Identify areas for improvement
    identifyImprovementAreas(analytics) {
        const areas = [];
        
        // Check learning progress
        Object.entries(analytics.learningProgress).forEach(([topic, progress]) => {
            if (progress < 70) {
                areas.push({
                    type: 'learning',
                    topic,
                    current: progress,
                    target: 100,
                    suggestion: `Focus more on ${topic} to improve understanding`
                });
            }
        });

        // Check performance metrics
        Object.entries(analytics.performanceMetrics).forEach(([metric, data]) => {
            if (data.trend === 'declining') {
                areas.push({
                    type: 'performance',
                    metric,
                    trend: data.trend,
                    suggestion: `Review ${metric} strategies to reverse declining trend`
                });
            }
        });

        return areas;
    }

    // Get medical insights and trends
    async getMedicalInsights(timeRange = '30d', filters = {}) {
        try {
            const insights = await getMedicalInsights(timeRange, filters);
            
            // Process insights
            const processed = this.processMedicalInsights(insights);
            
            logger.info('🔍 Medical insights retrieved', { timeRange, filters });
            return processed;
        } catch (error) {
            logger.error('❌ Error getting medical insights:', error);
            throw error;
        }
    }

    // Process medical insights
    processMedicalInsights(insights) {
        const processed = {
            commonSymptoms: {},
            diagnosisPatterns: {},
            seasonalTrends: {},
            severityDistribution: {},
            urgencyLevels: {},
            recommendations: []
        };

        // Aggregate insights
        insights.forEach(insight => {
            // Common symptoms
            if (insight.symptoms) {
                const symptomWords = insight.symptoms.split(' ');
                symptomWords.forEach(word => {
                    if (word.length > 3) {
                        processed.commonSymptoms[word] = (processed.commonSymptoms[word] || 0) + 1;
                    }
                });
            }

            // Diagnosis patterns
            if (insight.diagnosis) {
                processed.diagnosisPatterns[insight.diagnosis] = (processed.diagnosisPatterns[insight.diagnosis] || 0) + 1;
            }

            // Severity distribution
            if (insight.patterns?.severity) {
                processed.severityDistribution[insight.patterns.severity] = (processed.severityDistribution[insight.patterns.severity] || 0) + 1;
            }

            // Urgency levels
            if (insight.patterns?.urgency) {
                processed.urgencyLevels[insight.patterns.urgency] = (processed.urgencyLevels[insight.patterns.urgency] || 0) + 1;
            }
        });

        // Generate recommendations
        processed.recommendations = this.generateMedicalRecommendations(processed);

        return processed;
    }

    // Generate medical recommendations
    generateMedicalRecommendations(insights) {
        const recommendations = [];

        // Symptom-based recommendations
        const topSymptoms = Object.entries(insights.commonSymptoms)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        if (topSymptoms.length > 0) {
            recommendations.push({
                type: 'symptom_awareness',
                title: 'Common Symptoms to Watch',
                description: `The most frequently reported symptoms are: ${topSymptoms.map(([symptom]) => symptom).join(', ')}`,
                action: 'Review differential diagnoses for these common presentations'
            });
        }

        // Severity-based recommendations
        if (insights.severityDistribution.severe > 0) {
            recommendations.push({
                type: 'severity_management',
                title: 'Severe Case Management',
                description: `${insights.severityDistribution.severe} severe cases identified`,
                action: 'Review severe case protocols and escalation procedures'
            });
        }

        // Urgency-based recommendations
        if (insights.urgencyLevels.urgent > 0) {
            recommendations.push({
                type: 'urgency_protocols',
                title: 'Urgent Case Protocols',
                description: `${insights.urgencyLevels.urgent} urgent cases requiring immediate attention`,
                action: 'Ensure urgent care protocols are clearly defined and accessible'
            });
        }

        return recommendations;
    }

    // Flush analytics queue to database
    async flushAnalyticsQueue() {
        if (this.analyticsQueue.length === 0) return;

        try {
            const batch = this.analyticsQueue.splice(0, this.batchSize);
            
            // Save analytics in batch
            for (const event of batch) {
                await saveAnalytics('user_analytics', event);
            }

            logger.info('📊 Analytics queue flushed', { count: batch.length });
        } catch (error) {
            logger.error('❌ Error flushing analytics queue:', error);
            
            // Put events back in queue for retry
            this.analyticsQueue.unshift(...this.analyticsQueue.splice(0, this.batchSize));
        }
    }

    // Utility methods
    getSessionId() {
        return Math.random().toString(36).substring(2, 15);
    }

    getUserAgent() {
        return navigator?.userAgent || 'unknown';
    }

    getPlatform() {
        if (navigator?.userAgent) {
            if (navigator.userAgent.includes('Mobile')) return 'mobile';
            if (navigator.userAgent.includes('Tablet')) return 'tablet';
            return 'desktop';
        }
        return 'unknown';
    }

    // Cleanup
    destroy() {
        this.flushAnalyticsQueue();
        clearInterval(this.flushInterval);
    }
}

module.exports = new AdvancedAnalyticsService(); 