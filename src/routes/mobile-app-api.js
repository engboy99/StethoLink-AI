const express = require('express');
const router = express.Router();
const mobileAgentService = require('../services/mobile-agent-service');
const logger = require('../utils/logger');

// Initialize mobile agent service
router.use(async (req, res, next) => {
    if (!mobileAgentService.isInitialized) {
        try {
            await mobileAgentService.initialize();
        } catch (error) {
            logger.error('❌ Failed to initialize mobile agent service:', error);
        }
    }
    next();
});

// Health check for mobile app
router.get('/health', async (req, res) => {
    try {
        const health = await mobileAgentService.healthCheck();
        res.json({
            success: true,
            message: 'Mobile app health check completed',
            data: health
        });
    } catch (error) {
        logger.error('❌ Mobile app health check failed:', error);
        res.status(500).json({
            success: false,
            message: 'Mobile app health check failed',
            error: error.message
        });
    }
});

// Send medical alert notification
router.post('/notifications/medical-alert', async (req, res) => {
    try {
        const { title, message, priority, category } = req.body;
        
        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: 'Title and message are required'
            });
        }

        const result = await mobileAgentService.sendMedicalAlert({
            title,
            message,
            priority: priority || 'normal',
            category: category || 'medical'
        });

        if (result) {
            res.json({
                success: true,
                message: 'Medical alert sent successfully',
                data: { title, message, priority, category }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send medical alert'
            });
        }
    } catch (error) {
        logger.error('❌ Error sending medical alert:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending medical alert',
            error: error.message
        });
    }
});

// Schedule study reminder
router.post('/notifications/study-reminder', async (req, res) => {
    try {
        const { subject, topic, dueDate, priority } = req.body;
        
        if (!subject || !topic || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Subject, topic, and due date are required'
            });
        }

        const result = await mobileAgentService.sendStudyReminder({
            subject,
            topic,
            dueDate: new Date(dueDate),
            priority: priority || 'normal'
        });

        if (result) {
            res.json({
                success: true,
                message: 'Study reminder scheduled successfully',
                data: { subject, topic, dueDate, priority }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to schedule study reminder'
            });
        }
    } catch (error) {
        logger.error('❌ Error scheduling study reminder:', error);
        res.status(500).json({
            success: false,
            message: 'Error scheduling study reminder',
            error: error.message
        });
    }
});

// Send emergency update
router.post('/notifications/emergency-update', async (req, res) => {
    try {
        const { title, message, location, urgency } = req.body;
        
        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: 'Title and message are required'
            });
        }

        const result = await mobileAgentService.sendEmergencyUpdate({
            title,
            message,
            location: location || 'Unknown',
            urgency: urgency || 'high'
        });

        if (result) {
            res.json({
                success: true,
                message: 'Emergency update sent successfully',
                data: { title, message, location, urgency }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send emergency update'
            });
        }
    } catch (error) {
        logger.error('❌ Error sending emergency update:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending emergency update',
            error: error.message
        });
    }
});

// Process background task
router.post('/background-task', async (req, res) => {
    try {
        const { taskType, data, priority } = req.body;
        
        if (!taskType) {
            return res.status(400).json({
                success: false,
                message: 'Task type is required'
            });
        }

        const result = await mobileAgentService.processBackgroundTask({
            taskType,
            data: data || {},
            priority: priority || 'normal'
        });

        if (result) {
            res.json({
                success: true,
                message: 'Background task processed successfully',
                data: result
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to process background task'
            });
        }
    } catch (error) {
        logger.error('❌ Error processing background task:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing background task',
            error: error.message
        });
    }
});

// Get device location
router.get('/device/location', async (req, res) => {
    try {
        const location = await mobileAgentService.getDeviceLocation();
        
        if (location) {
            res.json({
                success: true,
                message: 'Device location retrieved successfully',
                data: location
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to get device location'
            });
        }
    } catch (error) {
        logger.error('❌ Error getting device location:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting device location',
            error: error.message
        });
    }
});

// Take medical photo
router.post('/device/photo', async (req, res) => {
    try {
        const { options } = req.body;
        
        const photo = await mobileAgentService.takeMedicalPhoto(options || {});
        
        if (photo) {
            res.json({
                success: true,
                message: 'Medical photo captured successfully',
                data: {
                    format: photo.format,
                    width: photo.width,
                    height: photo.height,
                    size: photo.base64 ? Math.round(photo.base64.length * 0.75) : 0 // Approximate size
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to capture medical photo'
            });
        }
    } catch (error) {
        logger.error('❌ Error taking medical photo:', error);
        res.status(500).json({
            success: false,
            message: 'Error taking medical photo',
            error: error.message
        });
    }
});

// Update notification settings
router.put('/settings/notifications', async (req, res) => {
    try {
        const settings = req.body;
        
        if (!settings || Object.keys(settings).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Settings data is required'
            });
        }

        const result = await mobileAgentService.updateNotificationSettings(settings);
        
        if (result) {
            const currentSettings = mobileAgentService.getNotificationSettings();
            res.json({
                success: true,
                message: 'Notification settings updated successfully',
                data: currentSettings
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to update notification settings'
            });
        }
    } catch (error) {
        logger.error('❌ Error updating notification settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notification settings',
            error: error.message
        });
    }
});

// Get notification settings
router.get('/settings/notifications', async (req, res) => {
    try {
        const settings = mobileAgentService.getNotificationSettings();
        
        res.json({
            success: true,
            message: 'Notification settings retrieved successfully',
            data: settings
        });
    } catch (error) {
        logger.error('❌ Error getting notification settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting notification settings',
            error: error.message
        });
    }
});

// Get device information
router.get('/device/info', async (req, res) => {
    try {
        const deviceInfo = mobileAgentService.deviceInfo;
        
        if (deviceInfo) {
            res.json({
                success: true,
                message: 'Device information retrieved successfully',
                data: deviceInfo
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Device information not available'
            });
        }
    } catch (error) {
        logger.error('❌ Error getting device information:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting device information',
            error: error.message
        });
    }
});

// Test mobile agent features
router.post('/test', async (req, res) => {
    try {
        const { testType } = req.body;
        
        let result;
        switch (testType) {
            case 'notification':
                result = await mobileAgentService.sendMedicalAlert({
                    title: 'Test Alert',
                    message: 'This is a test medical alert',
                    priority: 'normal'
                });
                break;
            case 'background':
                result = await mobileAgentService.processBackgroundTask({
                    taskType: 'medical_analysis',
                    data: { test: true },
                    priority: 'normal'
                });
                break;
            case 'location':
                result = await mobileAgentService.getDeviceLocation();
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid test type. Use: notification, background, or location'
                });
        }

        if (result) {
            res.json({
                success: true,
                message: `${testType} test completed successfully`,
                data: result
            });
        } else {
            res.status(500).json({
                success: false,
                message: `${testType} test failed`
            });
        }
    } catch (error) {
        logger.error('❌ Error running mobile agent test:', error);
        res.status(500).json({
            success: false,
            message: 'Error running mobile agent test',
            error: error.message
        });
    }
});

module.exports = router; 