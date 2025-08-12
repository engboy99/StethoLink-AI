const { logger } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const notificationService = require('./notification-service');

class MedicalAgentSystem {
    constructor() {
        this.activeAgents = new Map(); // studentId -> agent instance
        this.userSessions = new Map(); // sessionId -> user data
        this.alertQueue = new Map(); // studentId -> alerts array
        this.taskScheduler = new Map(); // studentId -> scheduled tasks
        this.notificationHistory = new Map(); // studentId -> notification history
        this.agentCapabilities = {
            taskManagement: true,
            alertSystem: true,
            notificationSystem: true,
            progressTracking: true,
            adaptiveLearning: true,
            emergencyResponse: true,
            studyPlanning: true,
            clinicalGuidance: true
        };
    }

    // Initialize agent for a student
    async initializeAgent(studentId, userData = {}) {
        try {
            const agentId = uuidv4();
            const agent = {
                id: agentId,
                studentId: studentId,
                userData: {
                    name: userData.name || 'Medical Student',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    telegramId: userData.telegramId || '',
                    whatsappId: userData.whatsappId || '',
                    preferences: userData.preferences || {},
                    studyLevel: userData.studyLevel || 'intermediate',
                    specialization: userData.specialization || 'general',
                    ...userData
                },
                status: 'active',
                createdAt: new Date(),
                lastActive: new Date(),
                capabilities: this.agentCapabilities,
                currentTasks: [],
                pendingAlerts: [],
                studyProgress: {
                    completedTopics: 0,
                    totalTopics: 0,
                    efficiency: 0,
                    lastStudySession: null
                },
                performance: {
                    taskCompletionRate: 0,
                    alertResponseTime: 0,
                    studyConsistency: 0,
                    clinicalAccuracy: 0
                }
            };

            this.activeAgents.set(studentId, agent);
            this.alertQueue.set(studentId, []);
            this.taskScheduler.set(studentId, []);
            this.notificationHistory.set(studentId, []);

            logger.info(`🤖 Medical Agent initialized for student: ${studentId}`, { agentId, studentId });
            return agent;
        } catch (error) {
            logger.error('❌ Error initializing medical agent:', error);
            throw error;
        }
    }

    // Get or create agent for student
    async getAgent(studentId, userData = {}) {
        let agent = this.activeAgents.get(studentId);
        if (!agent) {
            agent = await this.initializeAgent(studentId, userData);
        }
        agent.lastActive = new Date();
        return agent;
    }

    // Add task with automatic alert scheduling
    async addTaskWithAlerts(studentId, taskData) {
        try {
            const agent = await this.getAgent(studentId);
            const taskId = uuidv4();
            
            const task = {
                id: taskId,
                studentId: studentId,
                title: taskData.title,
                description: taskData.description || '',
                category: taskData.category || 'general',
                priority: taskData.priority || 'medium',
                status: 'pending',
                createdAt: new Date(),
                scheduledTime: taskData.scheduledTime || new Date(),
                deadline: taskData.deadline || null,
                duration: taskData.duration || 60,
                location: taskData.location || '',
                tags: taskData.tags || [],
                alertTimes: taskData.alertTimes || [],
                autoAlerts: taskData.autoAlerts !== false, // Default to true
                ...taskData
            };

            // Add to agent's current tasks
            agent.currentTasks.push(task);
            this.activeAgents.set(studentId, agent);

            // Schedule automatic alerts if enabled
            if (task.autoAlerts) {
                await this.scheduleTaskAlerts(studentId, task);
            }

            // Add to task scheduler
            const scheduler = this.taskScheduler.get(studentId) || [];
            scheduler.push(task);
            this.taskScheduler.set(studentId, scheduler);

            logger.info(`📅 Task added with alerts for student: ${studentId}`, { taskId, title: task.title });
            return task;
        } catch (error) {
            logger.error('❌ Error adding task with alerts:', error);
            throw error;
        }
    }

    // Schedule automatic alerts for tasks
    async scheduleTaskAlerts(studentId, task) {
        try {
            const alerts = [];
            const now = new Date();
            const taskTime = new Date(task.scheduledTime);

            // Alert 1 hour before
            const alert1Hour = new Date(taskTime.getTime() - 60 * 60 * 1000);
            if (alert1Hour > now) {
                alerts.push({
                    id: uuidv4(),
                    studentId: studentId,
                    taskId: task.id,
                    type: 'task_reminder',
                    priority: 'medium',
                    message: `Reminder: ${task.title} is scheduled in 1 hour`,
                    scheduledTime: alert1Hour,
                    status: 'pending',
                    channels: ['telegram', 'whatsapp', 'dashboard']
                });
            }

            // Alert 15 minutes before
            const alert15Min = new Date(taskTime.getTime() - 15 * 60 * 1000);
            if (alert15Min > now) {
                alerts.push({
                    id: uuidv4(),
                    studentId: studentId,
                    taskId: task.id,
                    type: 'task_urgent',
                    priority: 'high',
                    message: `URGENT: ${task.title} starts in 15 minutes!`,
                    scheduledTime: alert15Min,
                    status: 'pending',
                    channels: ['telegram', 'whatsapp', 'dashboard', 'email']
                });
            }

            // Add to alert queue
            const queue = this.alertQueue.get(studentId) || [];
            queue.push(...alerts);
            this.alertQueue.set(studentId, queue);

            // Schedule actual notifications
            alerts.forEach(alert => {
                setTimeout(async () => {
                    try {
                        await notificationService.sendAlert(studentId, alert);
                        logger.info(`🚨 Alert sent: ${alert.message}`, { studentId, alertId: alert.id });
                    } catch (error) {
                        logger.error('❌ Error sending scheduled alert:', error);
                    }
                }, alert.scheduledTime.getTime() - Date.now());
            });

            logger.info(`⏰ Scheduled ${alerts.length} alerts for task: ${task.title}`, { studentId, taskId: task.id });
            return alerts;
        } catch (error) {
            logger.error('❌ Error scheduling task alerts:', error);
            throw error;
        }
    }

    // Get pending alerts for student
    async getPendingAlerts(studentId) {
        try {
            const queue = this.alertQueue.get(studentId) || [];
            const now = new Date();
            const pendingAlerts = queue.filter(alert => 
                alert.status === 'pending' && 
                new Date(alert.scheduledTime) <= now
            );

            return pendingAlerts;
        } catch (error) {
            logger.error('❌ Error getting pending alerts:', error);
            throw error;
        }
    }

    // Mark alert as processed
    async markAlertProcessed(studentId, alertId, status = 'processed') {
        try {
            const queue = this.alertQueue.get(studentId) || [];
            const alertIndex = queue.findIndex(alert => alert.id === alertId);
            
            if (alertIndex !== -1) {
                queue[alertIndex].status = status;
                queue[alertIndex].processedAt = new Date();
                this.alertQueue.set(studentId, queue);
                
                logger.info(`✅ Alert marked as ${status}: ${alertId}`, { studentId });
                return true;
            }
            return false;
        } catch (error) {
            logger.error('❌ Error marking alert as processed:', error);
            throw error;
        }
    }

    // Send notification through multiple channels
    async sendNotification(studentId, notification) {
        try {
            const agent = await this.getAgent(studentId);
            const notificationId = uuidv4();
            
            const fullNotification = {
                id: notificationId,
                studentId: studentId,
                type: notification.type || 'general',
                priority: notification.priority || 'medium',
                title: notification.title,
                message: notification.message,
                data: notification.data || {},
                channels: notification.channels || ['dashboard'],
                status: 'sent',
                createdAt: new Date(),
                sentAt: new Date()
            };

            // Add to notification history
            const history = this.notificationHistory.get(studentId) || [];
            history.push(fullNotification);
            this.notificationHistory.set(studentId, history);

            // Update agent's last activity
            agent.lastActive = new Date();
            this.activeAgents.set(studentId, agent);

            logger.info(`📢 Notification sent to student: ${studentId}`, { 
                notificationId, 
                title: fullNotification.title,
                channels: fullNotification.channels 
            });

            return fullNotification;
        } catch (error) {
            logger.error('❌ Error sending notification:', error);
            throw error;
        }
    }

    // Get agent status and performance
    async getAgentStatus(studentId) {
        try {
            const agent = await this.getAgent(studentId);
            const pendingAlerts = await this.getPendingAlerts(studentId);
            const scheduler = this.taskScheduler.get(studentId) || [];
            const history = this.notificationHistory.get(studentId) || [];

            const status = {
                agentId: agent.id,
                studentId: agent.studentId,
                status: agent.status,
                lastActive: agent.lastActive,
                capabilities: agent.capabilities,
                currentTasks: agent.currentTasks.length,
                pendingAlerts: pendingAlerts.length,
                scheduledTasks: scheduler.length,
                notificationsSent: history.length,
                studyProgress: agent.studyProgress,
                performance: agent.performance,
                userData: agent.userData
            };

            return status;
        } catch (error) {
            logger.error('❌ Error getting agent status:', error);
            throw error;
        }
    }

    // Update study progress
    async updateStudyProgress(studentId, progressData) {
        try {
            const agent = await this.getAgent(studentId);
            
            agent.studyProgress = {
                ...agent.studyProgress,
                ...progressData,
                lastStudySession: new Date()
            };

            // Calculate efficiency
            if (agent.studyProgress.totalTopics > 0) {
                agent.studyProgress.efficiency = 
                    (agent.studyProgress.completedTopics / agent.studyProgress.totalTopics) * 100;
            }

            this.activeAgents.set(studentId, agent);

            logger.info(`📚 Study progress updated for student: ${studentId}`, { 
                efficiency: agent.studyProgress.efficiency,
                completedTopics: agent.studyProgress.completedTopics 
            });

            return agent.studyProgress;
        } catch (error) {
            logger.error('❌ Error updating study progress:', error);
            throw error;
        }
    }

    // Get agent recommendations
    async getAgentRecommendations(studentId) {
        try {
            const agent = await this.getAgent(studentId);
            const pendingAlerts = await this.getPendingAlerts(studentId);
            const recommendations = [];

            // Task completion recommendations
            if (agent.currentTasks.length > 5) {
                recommendations.push({
                    type: 'task_management',
                    priority: 'high',
                    title: 'Task Overload Alert',
                    message: 'You have many pending tasks. Consider prioritizing or delegating some tasks.',
                    action: 'review_tasks'
                });
            }

            // Study consistency recommendations
            if (agent.studyProgress.efficiency < 50) {
                recommendations.push({
                    type: 'study_improvement',
                    priority: 'medium',
                    title: 'Study Efficiency Low',
                    message: 'Your study efficiency is below 50%. Consider reviewing your study methods.',
                    action: 'improve_study_methods'
                });
            }

            // Alert response recommendations
            if (pendingAlerts.length > 3) {
                recommendations.push({
                    type: 'alert_management',
                    priority: 'high',
                    title: 'Multiple Pending Alerts',
                    message: 'You have several pending alerts. Please review and respond to them.',
                    action: 'review_alerts'
                });
            }

            // Performance-based recommendations
            if (agent.performance.taskCompletionRate < 70) {
                recommendations.push({
                    type: 'performance',
                    priority: 'medium',
                    title: 'Task Completion Rate Low',
                    message: 'Your task completion rate is below 70%. Focus on completing tasks on time.',
                    action: 'improve_task_completion'
                });
            }

            return recommendations;
        } catch (error) {
            logger.error('❌ Error getting agent recommendations:', error);
            throw error;
        }
    }

    // Emergency response system
    async handleEmergency(studentId, emergencyData) {
        try {
            const agent = await this.getAgent(studentId);
            
            // Create emergency alert
            const emergencyAlert = {
                id: uuidv4(),
                studentId: studentId,
                type: 'emergency',
                priority: 'critical',
                title: emergencyData.title || 'Emergency Alert',
                message: emergencyData.message,
                data: emergencyData,
                channels: ['telegram', 'whatsapp', 'dashboard', 'email', 'sms'],
                status: 'pending',
                createdAt: new Date(),
                requiresImmediateResponse: true
            };

            // Add to alert queue with highest priority
            const queue = this.alertQueue.get(studentId) || [];
            queue.unshift(emergencyAlert); // Add to beginning
            this.alertQueue.set(studentId, queue);

            // Send immediate notification
            await this.sendNotification(studentId, {
                type: 'emergency',
                priority: 'critical',
                title: '🚨 EMERGENCY ALERT',
                message: emergencyData.message,
                channels: ['telegram', 'whatsapp', 'dashboard']
            });

            logger.info(`🚨 Emergency handled for student: ${studentId}`, { 
                emergencyType: emergencyData.type,
                message: emergencyData.message 
            });

            return emergencyAlert;
        } catch (error) {
            logger.error('❌ Error handling emergency:', error);
            throw error;
        }
    }

    // Get all agents (for admin purposes)
    async getAllAgents() {
        try {
            const agents = Array.from(this.activeAgents.values());
            return agents.map(agent => ({
                id: agent.id,
                studentId: agent.studentId,
                status: agent.status,
                lastActive: agent.lastActive,
                currentTasks: agent.currentTasks.length,
                studyProgress: agent.studyProgress,
                userData: {
                    name: agent.userData.name,
                    email: agent.userData.email,
                    studyLevel: agent.userData.studyLevel
                }
            }));
        } catch (error) {
            logger.error('❌ Error getting all agents:', error);
            throw error;
        }
    }

    // Deactivate agent
    async deactivateAgent(studentId) {
        try {
            const agent = this.activeAgents.get(studentId);
            if (agent) {
                agent.status = 'inactive';
                agent.deactivatedAt = new Date();
                this.activeAgents.set(studentId, agent);
                
                logger.info(`🤖 Agent deactivated for student: ${studentId}`);
                return true;
            }
            return false;
        } catch (error) {
            logger.error('❌ Error deactivating agent:', error);
            throw error;
        }
    }
}

module.exports = new MedicalAgentSystem(); 