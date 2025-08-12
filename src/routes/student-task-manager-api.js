const express = require('express');
const router = express.Router();
const studentTaskManager = require('../services/student-task-manager');
const { logger } = require('../utils/logger');

// 📅 STUDENT TASK MANAGER API

// Add Student Task
router.post('/tasks', async (req, res) => {
  try {
    const { studentId, ...taskData } = req.body;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: studentId'
      });
    }

    logger.info('📅 Adding student task', { studentId, title: taskData.title });
    
    const task = studentTaskManager.addTask(studentId, taskData);
    
    res.json({
      success: true,
      message: 'Student task added successfully',
      task
    });
  } catch (error) {
    logger.error('❌ Error adding student task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add student task',
      error: error.message
    });
  }
});

// Get Student Tasks
router.get('/tasks/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const filters = req.query;
    
    logger.info('📅 Getting student tasks', { studentId, filters });
    
    const result = studentTaskManager.getTasks(studentId, filters);
    
    res.json({
      success: true,
      message: 'Student tasks retrieved successfully',
      ...result
    });
  } catch (error) {
    logger.error('❌ Error getting student tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student tasks',
      error: error.message
    });
  }
});

// Update Student Task
router.put('/tasks/:studentId/:taskId', async (req, res) => {
  try {
    const { studentId, taskId } = req.params;
    const updates = req.body;
    
    logger.info('📅 Updating student task', { studentId, taskId, updates: Object.keys(updates) });
    
    const task = studentTaskManager.updateTask(studentId, taskId, updates);
    
    res.json({
      success: true,
      message: 'Student task updated successfully',
      task
    });
  } catch (error) {
    logger.error('❌ Error updating student task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student task',
      error: error.message
    });
  }
});

// Complete Student Task
router.post('/tasks/:studentId/:taskId/complete', async (req, res) => {
  try {
    const { studentId, taskId } = req.params;
    
    logger.info('📅 Completing student task', { studentId, taskId });
    
    const task = studentTaskManager.completeTask(studentId, taskId);
    
    res.json({
      success: true,
      message: 'Student task completed successfully',
      task
    });
  } catch (error) {
    logger.error('❌ Error completing student task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete student task',
      error: error.message
    });
  }
});

// Delete Student Task
router.delete('/tasks/:studentId/:taskId', async (req, res) => {
  try {
    const { studentId, taskId } = req.params;
    
    logger.info('📅 Deleting student task', { studentId, taskId });
    
    const task = studentTaskManager.deleteTask(studentId, taskId);
    
    res.json({
      success: true,
      message: 'Student task deleted successfully',
      task
    });
  } catch (error) {
    logger.error('❌ Error deleting student task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student task',
      error: error.message
    });
  }
});

// Get Task Alerts
router.get('/alerts/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    logger.info('🔔 Getting task alerts', { studentId });
    
    const alerts = studentTaskManager.getTaskAlerts(studentId);
    
    res.json({
      success: true,
      message: 'Task alerts retrieved successfully',
      ...alerts
    });
  } catch (error) {
    logger.error('❌ Error getting task alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get task alerts',
      error: error.message
    });
  }
});

// Mark Alert as Read
router.put('/alerts/:studentId/:alertId/read', async (req, res) => {
  try {
    const { studentId, alertId } = req.params;
    
    logger.info('🔔 Marking alert as read', { studentId, alertId });
    
    const alert = studentTaskManager.markAlertAsRead(studentId, alertId);
    
    res.json({
      success: true,
      message: 'Alert marked as read successfully',
      alert
    });
  } catch (error) {
    logger.error('❌ Error marking alert as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark alert as read',
      error: error.message
    });
  }
});

// Get Task Categories
router.get('/categories/tasks', async (req, res) => {
  try {
    logger.info('📅 Getting task categories');
    
    const categories = studentTaskManager.getTaskCategories();
    
    res.json({
      success: true,
      message: 'Task categories retrieved successfully',
      categories
    });
  } catch (error) {
    logger.error('❌ Error getting task categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get task categories',
      error: error.message
    });
  }
});

// Add Notebook Entry
router.post('/notebook', async (req, res) => {
  try {
    const { studentId, ...entryData } = req.body;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: studentId'
      });
    }

    logger.info('📝 Adding notebook entry', { studentId, title: entryData.title });
    
    const entry = studentTaskManager.addNotebookEntry(studentId, entryData);
    
    res.json({
      success: true,
      message: 'Notebook entry added successfully',
      entry
    });
  } catch (error) {
    logger.error('❌ Error adding notebook entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add notebook entry',
      error: error.message
    });
  }
});

// Get Notebook Entries
router.get('/notebook/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const filters = req.query;
    
    logger.info('📝 Getting notebook entries', { studentId, filters });
    
    const result = studentTaskManager.getNotebookEntries(studentId, filters);
    
    res.json({
      success: true,
      message: 'Notebook entries retrieved successfully',
      ...result
    });
  } catch (error) {
    logger.error('❌ Error getting notebook entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notebook entries',
      error: error.message
    });
  }
});

// Update Notebook Entry
router.put('/notebook/:studentId/:entryId', async (req, res) => {
  try {
    const { studentId, entryId } = req.params;
    const updates = req.body;
    
    logger.info('📝 Updating notebook entry', { studentId, entryId, updates: Object.keys(updates) });
    
    const entry = studentTaskManager.updateNotebookEntry(studentId, entryId, updates);
    
    res.json({
      success: true,
      message: 'Notebook entry updated successfully',
      entry
    });
  } catch (error) {
    logger.error('❌ Error updating notebook entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notebook entry',
      error: error.message
    });
  }
});

// Delete Notebook Entry
router.delete('/notebook/:studentId/:entryId', async (req, res) => {
  try {
    const { studentId, entryId } = req.params;
    
    logger.info('📝 Deleting notebook entry', { studentId, entryId });
    
    const entry = studentTaskManager.deleteNotebookEntry(studentId, entryId);
    
    res.json({
      success: true,
      message: 'Notebook entry deleted successfully',
      entry
    });
  } catch (error) {
    logger.error('❌ Error deleting notebook entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notebook entry',
      error: error.message
    });
  }
});

// Search Notebook Entries
router.get('/notebook/:studentId/search', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { q: searchTerm } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: q (search term)'
      });
    }

    logger.info('📝 Searching notebook entries', { studentId, searchTerm });
    
    const result = studentTaskManager.searchNotebookEntries(studentId, searchTerm);
    
    res.json({
      success: true,
      message: 'Notebook search completed successfully',
      ...result
    });
  } catch (error) {
    logger.error('❌ Error searching notebook entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search notebook entries',
      error: error.message
    });
  }
});

// Get Notebook Categories
router.get('/categories/notebook', async (req, res) => {
  try {
    logger.info('📝 Getting notebook categories');
    
    const categories = studentTaskManager.getNotebookCategories();
    
    res.json({
      success: true,
      message: 'Notebook categories retrieved successfully',
      categories
    });
  } catch (error) {
    logger.error('❌ Error getting notebook categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notebook categories',
      error: error.message
    });
  }
});

// Get Student Statistics
router.get('/statistics/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    logger.info('📊 Getting student statistics', { studentId });
    
    const statistics = studentTaskManager.getStudentStatistics(studentId);
    
    res.json({
      success: true,
      message: 'Student statistics retrieved successfully',
      statistics
    });
  } catch (error) {
    logger.error('❌ Error getting student statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student statistics',
      error: error.message
    });
  }
});

// Quick Add Task with Alerts
router.post('/quick-task', async (req, res) => {
  try {
    const { studentId, title, scheduledTime, category, priority, alertTimes } = req.body;
    
    if (!studentId || !title || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: studentId, title, scheduledTime'
      });
    }

    logger.info('📅 Quick adding student task', { studentId, title, scheduledTime });
    
    const taskData = {
      title,
      scheduledTime,
      category: category || 'personal',
      priority: priority || 'medium',
      alertTimes: alertTimes || ['30min', '15min', '5min'],
      description: `Quick task: ${title}`,
      location: '',
      duration: 60
    };
    
    const task = studentTaskManager.addTask(studentId, taskData);
    
    res.json({
      success: true,
      message: 'Quick task added successfully with alerts',
      task,
      alerts: task.alertTimes
    });
  } catch (error) {
    logger.error('❌ Error quick adding task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to quick add task',
      error: error.message
    });
  }
});

// Quick Add Note
router.post('/quick-note', async (req, res) => {
  try {
    const { studentId, title, content, category, isImportant } = req.body;
    
    if (!studentId || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: studentId, title, content'
      });
    }

    logger.info('📝 Quick adding notebook entry', { studentId, title });
    
    const entryData = {
      title,
      content,
      category: category || 'personal_notes',
      isImportant: isImportant || false,
      tags: []
    };
    
    const entry = studentTaskManager.addNotebookEntry(studentId, entryData);
    
    res.json({
      success: true,
      message: 'Quick note added successfully',
      entry
    });
  } catch (error) {
    logger.error('❌ Error quick adding note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to quick add note',
      error: error.message
    });
  }
});

module.exports = router; 