const { logger } = require('../utils/logger');
const medicalAgentSystem = require('./medical-agent-system');
const notificationService = require('./notification-service');

class AlertProcessor {
    constructor() {
        this.isRunning = false;
        this.checkInterval = 30000; // Check every 30 seconds
        this.processedAlerts = new Set();
    }

    // Start the alert processor
    start() {
        if (this.isRunning) {
            logger.warn('⚠️ Alert processor is already running');
            return;
        }

        this.isRunning = true;
        logger.info('🚨 Alert processor started');

        this.processAlerts();
        this.interval = setInterval(() => {
            this.processAlerts();
        }, this.checkInterval);
    }

    // Stop the alert processor
    stop() {
        if (!this.isRunning) {
            logger.warn('⚠️ Alert processor is not running');
            return;
        }

        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        logger.info('🛑 Alert processor stopped');
    }

    // Process pending alerts
    async processAlerts() {
        try {
            // Get all active agents
            const agents = await medicalAgentSystem.getAllAgents();
            
            for (const agent of agents) {
                try {
                    // Get pending alerts for this agent
                    const pendingAlerts = await medicalAgentSystem.getPendingAlerts(agent.studentId);
                    
                    for (const alert of pendingAlerts) {
                        // Check if we've already processed this alert
                        if (this.processedAlerts.has(alert.id)) {
                            continue;
                        }

                        // Mark as processed to avoid duplicates
                        this.processedAlerts.add(alert.id);

                        // Send notification through multiple channels
                        await this.sendAlertNotification(agent, alert);
                        
                        // Mark alert as processed in the system
                        await medicalAgentSystem.markAlertProcessed(agent.studentId, alert.id, 'sent');
                        
                        logger.info(`🚨 Alert sent for student ${agent.studentId}: ${alert.message}`);
                    }
                } catch (error) {
                    logger.error(`❌ Error processing alerts for agent ${agent.studentId}:`, error);
                }
            }

            // Clean up old processed alerts (keep only last 1000)
            if (this.processedAlerts.size > 1000) {
                const alertsArray = Array.from(this.processedAlerts);
                this.processedAlerts = new Set(alertsArray.slice(-500));
            }

        } catch (error) {
            logger.error('❌ Error in alert processor:', error);
        }
    }

    // Send alert notification through multiple channels
    async sendAlertNotification(agent, alert) {
        try {
            // Get user data for notification
            const userData = {
                name: agent.userData?.name || 'Student',
                telegramId: agent.userData?.telegramId,
                email: agent.userData?.email,
                language: agent.userData?.language || 'en'
            };

            // Send through notification service
            await notificationService.sendAlert(agent.studentId, alert, userData);

            // Send immediate Telegram message if available
            if (userData.telegramId && global.telegramNotifications) {
                const telegramNotification = global.telegramNotifications.get(alert.id);
                if (telegramNotification) {
                    await this.sendImmediateTelegramAlert(userData.telegramId, telegramNotification);
                }
            }

            // Log alert sent
            logger.info(`📢 Alert notification sent for ${userData.name}`, {
                studentId: agent.studentId,
                alertId: alert.id,
                type: alert.type,
                priority: alert.priority
            });

        } catch (error) {
            logger.error('❌ Error sending alert notification:', error);
        }
    }

    // Send immediate Telegram alert
    async sendImmediateTelegramAlert(telegramId, notification) {
        try {
            if (!global.bot) {
                logger.warn('⚠️ Telegram bot not available for immediate alert');
                return;
            }

            // Send the formatted message
            await global.bot.sendMessage(telegramId, notification.formattedMessage, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            });

            // Add sound notification indicator
            const soundEmoji = this.getSoundEmoji(notification.priority);
            await global.bot.sendMessage(telegramId, `${soundEmoji} *Alert Sound:* ${notification.priority.toUpperCase()} priority notification`, {
                parse_mode: 'Markdown'
            });

            logger.info(`📱 Immediate Telegram alert sent to ${telegramId}`);
        } catch (error) {
            logger.error('❌ Error sending immediate Telegram alert:', error);
        }
    }

    // Get sound emoji based on priority
    getSoundEmoji(priority) {
        const emojis = {
            'low': '🔵',
            'medium': '🟡',
            'high': '🟠',
            'urgent': '🔴'
        };
        return emojis[priority] || '📢';
    }

    // Get processor status
    getStatus() {
        return {
            isRunning: this.isRunning,
            checkInterval: this.checkInterval,
            processedAlertsCount: this.processedAlerts.size,
            lastCheck: new Date()
        };
    }

    // Manually trigger alert processing
    async triggerProcessing() {
        if (!this.isRunning) {
            logger.warn('⚠️ Alert processor is not running');
            return false;
        }

        await this.processAlerts();
        return true;
    }

    // Update check interval
    updateInterval(newInterval) {
        if (newInterval < 10000) { // Minimum 10 seconds
            logger.warn('⚠️ Check interval too short, using minimum 10 seconds');
            newInterval = 10000;
        }

        this.checkInterval = newInterval;
        
        if (this.isRunning && this.interval) {
            clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.processAlerts();
            }, this.checkInterval);
        }

        logger.info(`⏰ Alert processor interval updated to ${newInterval}ms`);
    }
}

// Create singleton instance
const alertProcessor = new AlertProcessor();

// Start processor when module is loaded
setTimeout(() => {
    alertProcessor.start();
}, 5000); // Start after 5 seconds

module.exports = alertProcessor; 