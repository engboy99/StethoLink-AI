const express = require('express');
const router = express.Router();
const medicalAgentSystem = require('../services/medical-agent-system');
const logger = require('../utils/logger');

// Initialize agent for student
router.post('/initialize', async (req, res) => {
    try {
        const { studentId, userData } = req.body;
        
        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: 'Student ID is required'
            });
        }

        const agent = await medicalAgentSystem.initializeAgent(studentId, userData);
        
        logger.info(`🤖 Agent initialized via API for student: ${studentId}`);
        
        res.json({
            success: true,
            message: 'Medical agent initialized successfully',
            data: {
                agentId: agent.id,
                studentId: agent.studentId,
                status: agent.status,
                capabilities: agent.capabilities
            }
        });
    } catch (error) {
        logger.error('❌ Error in agent initialization API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initialize agent',
            message: error.message
        });
    }
});

// Add task with automatic alerts
router.post('/tasks', async (req, res) => {
    try {
        const { studentId, ...taskData } = req.body;
        
        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: 'Student ID is required'
            });
        }

        const task = await medicalAgentSystem.addTaskWithAlerts(studentId, taskData);
        
        logger.info(`📅 Task added with alerts via API for student: ${studentId}`, { taskId: task.id });
        
        res.json({
            success: true,
            message: 'Task added successfully with automatic alerts',
            data: task
        });
    } catch (error) {
        logger.error('❌ Error in add task API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add task',
            message: error.message
        });
    }
});

// Get pending alerts for student
router.get('/alerts/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const alerts = await medicalAgentSystem.getPendingAlerts(studentId);
        
        logger.info(`⏰ Retrieved ${alerts.length} pending alerts for student: ${studentId}`);
        
        res.json({
            success: true,
            message: 'Pending alerts retrieved successfully',
            data: alerts
        });
    } catch (error) {
        logger.error('❌ Error in get alerts API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get alerts',
            message: error.message
        });
    }
});

// Mark alert as processed
router.put('/alerts/:studentId/:alertId', async (req, res) => {
    try {
        const { studentId, alertId } = req.params;
        const { status } = req.body;
        
        const result = await medicalAgentSystem.markAlertProcessed(studentId, alertId, status);
        
        if (result) {
            logger.info(`✅ Alert marked as ${status} for student: ${studentId}`, { alertId });
            
            res.json({
                success: true,
                message: `Alert marked as ${status} successfully`,
                data: { alertId, status }
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Alert not found'
            });
        }
    } catch (error) {
        logger.error('❌ Error in mark alert API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mark alert',
            message: error.message
        });
    }
});

// Send notification
router.post('/notifications', async (req, res) => {
    try {
        const { studentId, ...notificationData } = req.body;
        
        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: 'Student ID is required'
            });
        }

        const notification = await medicalAgentSystem.sendNotification(studentId, notificationData);
        
        logger.info(`📢 Notification sent via API to student: ${studentId}`, { notificationId: notification.id });
        
        res.json({
            success: true,
            message: 'Notification sent successfully',
            data: notification
        });
    } catch (error) {
        logger.error('❌ Error in send notification API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send notification',
            message: error.message
        });
    }
});

// Get agent status
router.get('/status/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const status = await medicalAgentSystem.getAgentStatus(studentId);
        
        logger.info(`📊 Agent status retrieved for student: ${studentId}`);
        
        res.json({
            success: true,
            message: 'Agent status retrieved successfully',
            data: status
        });
    } catch (error) {
        logger.error('❌ Error in get agent status API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get agent status',
            message: error.message
        });
    }
});

// Update study progress
router.put('/progress/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const progressData = req.body;
        
        const progress = await medicalAgentSystem.updateStudyProgress(studentId, progressData);
        
        logger.info(`📚 Study progress updated for student: ${studentId}`, { efficiency: progress.efficiency });
        
        res.json({
            success: true,
            message: 'Study progress updated successfully',
            data: progress
        });
    } catch (error) {
        logger.error('❌ Error in update progress API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update study progress',
            message: error.message
        });
    }
});

// Get agent recommendations
router.get('/recommendations/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const recommendations = await medicalAgentSystem.getAgentRecommendations(studentId);
        
        logger.info(`💡 Retrieved ${recommendations.length} recommendations for student: ${studentId}`);
        
        res.json({
            success: true,
            message: 'Recommendations retrieved successfully',
            data: recommendations
        });
    } catch (error) {
        logger.error('❌ Error in get recommendations API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get recommendations',
            message: error.message
        });
    }
});

// Handle emergency
router.post('/emergency', async (req, res) => {
    try {
        const { studentId, ...emergencyData } = req.body;
        
        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: 'Student ID is required'
            });
        }

        const emergencyAlert = await medicalAgentSystem.handleEmergency(studentId, emergencyData);
        
        logger.info(`🚨 Emergency handled via API for student: ${studentId}`, { alertId: emergencyAlert.id });
        
        res.json({
            success: true,
            message: 'Emergency handled successfully',
            data: emergencyAlert
        });
    } catch (error) {
        logger.error('❌ Error in emergency API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to handle emergency',
            message: error.message
        });
    }
});

// Get all agents (admin only)
router.get('/agents', async (req, res) => {
    try {
        const agents = await medicalAgentSystem.getAllAgents();
        
        logger.info(`👥 Retrieved ${agents.length} active agents`);
        
        res.json({
            success: true,
            message: 'All agents retrieved successfully',
            data: agents
        });
    } catch (error) {
        logger.error('❌ Error in get all agents API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get agents',
            message: error.message
        });
    }
});

// Deactivate agent
router.delete('/agents/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const result = await medicalAgentSystem.deactivateAgent(studentId);
        
        if (result) {
            logger.info(`🤖 Agent deactivated via API for student: ${studentId}`);
            
            res.json({
                success: true,
                message: 'Agent deactivated successfully',
                data: { studentId, status: 'inactive' }
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Agent not found'
            });
        }
    } catch (error) {
        logger.error('❌ Error in deactivate agent API:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to deactivate agent',
            message: error.message
        });
    }
});

module.exports = router; 