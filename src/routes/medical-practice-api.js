const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const medicalPracticeSystem = require('../services/medical-practice-system');

// Advanced Medical Practice API for Sri Lankan Medical Students

// Get Available Clinical Scenarios
router.get('/scenarios', async (req, res) => {
  try {
    logger.info('🏥 Medical practice scenarios request');
    
    const scenarios = {};
    for (const [department, departmentScenarios] of Object.entries(medicalPracticeSystem.clinicalScenarios)) {
      scenarios[department] = Object.keys(departmentScenarios).map(name => ({
        name,
        difficulty: departmentScenarios[name].difficulty,
        timeLimit: departmentScenarios[name].timeLimit,
        timeCritical: departmentScenarios[name].timeCritical,
        learningObjectives: departmentScenarios[name].learningObjectives
      }));
    }
    
    res.json({
      success: true,
      data: {
        scenarios,
        totalDepartments: Object.keys(scenarios).length,
        totalScenarios: Object.values(scenarios).flat().length
      }
    });
  } catch (error) {
    logger.error('❌ Medical practice scenarios error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve scenarios'
    });
  }
});

// Start Medical Practice Session
router.post('/session/start', async (req, res) => {
  try {
    const { studentId, scenarioType, scenarioName } = req.body;
    logger.info('🏥 Starting medical practice session', { studentId, scenarioType, scenarioName });
    
    if (!studentId || !scenarioType || !scenarioName) {
      return res.status(400).json({
        success: false,
        error: 'Student ID, scenario type, and scenario name are required'
      });
    }
    
    const session = medicalPracticeSystem.startPracticeSession(studentId, scenarioType, scenarioName);
    
    res.json({
      success: true,
      data: {
        sessionId: studentId,
        scenario: session.scenarioName,
        patientData: session.patientData,
        requiredActions: session.requiredActions,
        timeLimit: session.timeLimit,
        difficulty: session.difficulty,
        learningObjectives: session.learningObjectives,
        startTime: session.startTime,
        timeRemaining: session.timeRemaining
      }
    });
  } catch (error) {
    logger.error('❌ Start session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start practice session'
    });
  }
});

// Take Medical Action
router.post('/session/action', async (req, res) => {
  try {
    const { studentId, action, details } = req.body;
    logger.info('🏥 Medical action taken', { studentId, action });
    
    if (!studentId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Student ID and action are required'
      });
    }
    
    const result = medicalPracticeSystem.takeAction(studentId, action, details);
    
    res.json({
      success: true,
      data: {
        action: result.actionRecord,
        evaluation: result.evaluation,
        timeRemaining: result.actionRecord.timeRemaining
      }
    });
  } catch (error) {
    logger.error('❌ Medical action error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process medical action'
    });
  }
});

// Make Medical Decision
router.post('/session/decision', async (req, res) => {
  try {
    const { studentId, decision, reasoning } = req.body;
    logger.info('🏥 Medical decision made', { studentId, decision });
    
    if (!studentId || !decision) {
      return res.status(400).json({
        success: false,
        error: 'Student ID and decision are required'
      });
    }
    
    const result = medicalPracticeSystem.makeDecision(studentId, decision, reasoning);
    
    res.json({
      success: true,
      data: {
        decision: result.decisionRecord,
        evaluation: result.evaluation,
        timeRemaining: result.decisionRecord.timeRemaining
      }
    });
  } catch (error) {
    logger.error('❌ Medical decision error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process medical decision'
    });
  }
});

// Complete Practice Session
router.post('/session/complete', async (req, res) => {
  try {
    const { studentId } = req.body;
    logger.info('🏥 Completing medical practice session', { studentId });
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID is required'
      });
    }
    
    const result = medicalPracticeSystem.completeSession(studentId);
    
    res.json({
      success: true,
      data: {
        session: result.session,
        performance: result.performance,
        feedback: result.feedback
      }
    });
  } catch (error) {
    logger.error('❌ Complete session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete practice session'
    });
  }
});

// Get Active Session
router.get('/session/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    logger.info('🏥 Getting active session', { studentId });
    
    const session = medicalPracticeSystem.activeCases.get(studentId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'No active session found'
      });
    }
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    logger.error('❌ Get session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve session'
    });
  }
});

// Get Diagnostic Challenges
router.get('/diagnostic-challenges', async (req, res) => {
  try {
    logger.info('🔍 Diagnostic challenges request');
    
    const challenges = {};
    for (const [type, typeChallenges] of Object.entries(medicalPracticeSystem.diagnosticChallenges)) {
      challenges[type] = Object.keys(typeChallenges).map(name => ({
        name,
        description: typeChallenges[name].description,
        timeLimit: typeChallenges[name].timeLimit,
        difficulty: typeChallenges[name].difficulty
      }));
    }
    
    res.json({
      success: true,
      data: {
        challenges,
        totalTypes: Object.keys(challenges).length,
        totalChallenges: Object.values(challenges).flat().length
      }
    });
  } catch (error) {
    logger.error('❌ Diagnostic challenges error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve diagnostic challenges'
    });
  }
});

// Get Medical Responsibilities
router.get('/responsibilities', async (req, res) => {
  try {
    logger.info('👨‍⚕️ Medical responsibilities request');
    
    const responsibilities = Object.keys(medicalPracticeSystem.medicalResponsibilities).map(name => ({
      name,
      description: medicalPracticeSystem.medicalResponsibilities[name].description,
      tasks: medicalPracticeSystem.medicalResponsibilities[name].tasks,
      timeRequired: medicalPracticeSystem.medicalResponsibilities[name].timeRequired,
      priority: medicalPracticeSystem.medicalResponsibilities[name].priority,
      frequency: medicalPracticeSystem.medicalResponsibilities[name].frequency
    }));
    
    res.json({
      success: true,
      data: {
        responsibilities,
        total: responsibilities.length
      }
    });
  } catch (error) {
    logger.error('❌ Medical responsibilities error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve medical responsibilities'
    });
  }
});

// Set Daily Medical Tasks
router.post('/daily-tasks', async (req, res) => {
  try {
    const { studentId, tasks } = req.body;
    logger.info('📋 Setting daily medical tasks', { studentId, taskCount: tasks.length });
    
    if (!studentId || !tasks || !Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        error: 'Student ID and tasks array are required'
      });
    }
    
    const dailyTasks = medicalPracticeSystem.setDailyTasks(studentId, tasks);
    
    res.json({
      success: true,
      data: dailyTasks
    });
  } catch (error) {
    logger.error('❌ Set daily tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set daily tasks'
    });
  }
});

// Complete Daily Task
router.post('/daily-tasks/complete', async (req, res) => {
  try {
    const { studentId, taskId } = req.body;
    logger.info('✅ Completing daily task', { studentId, taskId });
    
    if (!studentId || !taskId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID and task ID are required'
      });
    }
    
    const task = medicalPracticeSystem.completeTask(studentId, taskId);
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error('❌ Complete task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete task'
    });
  }
});

// Get Daily Tasks
router.get('/daily-tasks/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    logger.info('📋 Getting daily tasks', { studentId });
    
    const dailyTasks = medicalPracticeSystem.dailyTasks.get(studentId);
    if (!dailyTasks) {
      return res.status(404).json({
        success: false,
        error: 'No daily tasks found'
      });
    }
    
    res.json({
      success: true,
      data: dailyTasks
    });
  } catch (error) {
    logger.error('❌ Get daily tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve daily tasks'
    });
  }
});

// Get Student Progress
router.get('/progress/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    logger.info('📊 Getting student progress', { studentId });
    
    const progress = medicalPracticeSystem.getStudentProgress(studentId);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    logger.error('❌ Get progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve student progress'
    });
  }
});

// Get Notifications
router.get('/notifications/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    logger.info('🔔 Getting notifications', { studentId });
    
    const notifications = medicalPracticeSystem.getNotifications(studentId);
    
    res.json({
      success: true,
      data: {
        notifications,
        unreadCount: notifications.length
      }
    });
  } catch (error) {
    logger.error('❌ Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve notifications'
    });
  }
});

// Mark Notification as Read
router.put('/notifications/:studentId/:notificationId', async (req, res) => {
  try {
    const { studentId, notificationId } = req.params;
    logger.info('✅ Marking notification as read', { studentId, notificationId });
    
    const notifications = medicalPracticeSystem.notifications.get(studentId) || [];
    const notification = notifications.find(n => n.id === parseInt(notificationId));
    
    if (notification) {
      notification.read = true;
      medicalPracticeSystem.notifications.set(studentId, notifications);
    }
    
    res.json({
      success: true,
      data: { markedAsRead: !!notification }
    });
  } catch (error) {
    logger.error('❌ Mark notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read'
    });
  }
});

// Get Practice Statistics
router.get('/statistics/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    logger.info('📈 Getting practice statistics', { studentId });
    
    const progress = medicalPracticeSystem.getStudentProgress(studentId);
    const activeSession = medicalPracticeSystem.activeCases.get(studentId);
    const dailyTasks = medicalPracticeSystem.dailyTasks.get(studentId);
    const notifications = medicalPracticeSystem.getNotifications(studentId);
    
    const statistics = {
      progress,
      activeSession: activeSession ? {
        scenario: activeSession.scenarioName,
        timeRemaining: activeSession.timeRemaining,
        actionsTaken: activeSession.actionsTaken.length,
        decisionsMade: activeSession.decisionsMade.length
      } : null,
      dailyTasks: dailyTasks ? {
        totalTasks: dailyTasks.tasks.length,
        completedTasks: dailyTasks.tasks.filter(t => t.completed).length,
        pendingTasks: dailyTasks.tasks.filter(t => !t.completed).length
      } : null,
      notifications: {
        unreadCount: notifications.length,
        recentNotifications: notifications.slice(0, 5)
      }
    };
    
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    logger.error('❌ Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve practice statistics'
    });
  }
});

// Get Learning Recommendations
router.get('/recommendations/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    logger.info('📚 Getting learning recommendations', { studentId });
    
    const progress = medicalPracticeSystem.getStudentProgress(studentId);
    
    const recommendations = {
      nextScenarios: [],
      skillImprovements: [],
      studyAreas: [],
      practiceFocus: []
    };
    
    // Generate personalized recommendations based on progress
    if (progress.averagePerformance < 70) {
      recommendations.practiceFocus.push('Focus on basic clinical scenarios to build confidence');
      recommendations.nextScenarios.push('Start with intermediate difficulty scenarios');
    } else if (progress.averagePerformance >= 80) {
      recommendations.practiceFocus.push('Challenge yourself with advanced scenarios');
      recommendations.nextScenarios.push('Try expert-level emergency scenarios');
    }
    
    if (progress.completedSessions < 5) {
      recommendations.skillImprovements.push('Complete more practice sessions to develop clinical reasoning');
    }
    
    if (progress.completedTasks < progress.totalTasks * 0.8) {
      recommendations.studyAreas.push('Improve time management and task completion');
    }
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    logger.error('❌ Get recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve learning recommendations'
    });
  }
});

module.exports = router; 