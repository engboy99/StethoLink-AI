const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001; // Use different port to avoid conflicts

// Basic middleware
app.use(cors());
app.use(express.json());

// Test the student task manager service directly
const studentTaskManager = require('./src/services/student-task-manager');

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Test student task manager
app.post('/test-task', (req, res) => {
  try {
    const { studentId, title, scheduledTime } = req.body;
    
    if (!studentId || !title || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    const task = studentTaskManager.addTask(studentId, {
      title,
      scheduledTime,
      category: 'academic',
      priority: 'medium',
      duration: 60
    });

    res.json({
      success: true,
      message: 'Task added successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding task',
      error: error.message
    });
  }
});

// Test notebook
app.post('/test-notebook', (req, res) => {
  try {
    const { studentId, title, content } = req.body;
    
    if (!studentId || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    const entry = studentTaskManager.addNotebookEntry(studentId, {
      title,
      content,
      category: 'clinical_notes'
    });

    res.json({
      success: true,
      message: 'Notebook entry added successfully',
      entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding notebook entry',
      error: error.message
    });
  }
});

// Test categories
app.get('/test-categories', (req, res) => {
  try {
    const taskCategories = studentTaskManager.getTaskCategories();
    const notebookCategories = studentTaskManager.getNotebookCategories();
    
    res.json({
      success: true,
      taskCategories,
      notebookCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting categories',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Minimal test server running on port ${PORT}`);
  console.log(`📅 Test endpoints:`);
  console.log(`   GET  /test - Basic server test`);
  console.log(`   POST /test-task - Test task creation`);
  console.log(`   POST /test-notebook - Test notebook creation`);
  console.log(`   GET  /test-categories - Test categories`);
});

module.exports = app; 