const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const advancedMedicalPlanner = require('../services/advanced-medical-planner');

// Advanced Medical Planner API - Level 1 Medical Training

// Create Daily Schedule with Exact Time Alerts
router.post('/daily-schedule', async (req, res) => {
  try {
    const { studentId, date, schedule } = req.body;
    logger.info('📅 Creating advanced daily schedule', { studentId, taskCount: schedule.length });
    
    if (!studentId || !schedule || !Array.isArray(schedule)) {
      return res.status(400).json({
        success: false,
        error: 'Student ID and schedule array are required'
      });
    }
    
    const dailySchedule = advancedMedicalPlanner.createDailySchedule(studentId, date, schedule);
    
    res.json({
      success: true,
      data: dailySchedule
    });
  } catch (error) {
    logger.error('❌ Create daily schedule error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create daily schedule'
    });
  }
});

// Get Daily Schedule
router.get('/daily-schedule/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { date } = req.query;
    logger.info('📅 Getting daily schedule', { studentId, date });
    
    const schedule = advancedMedicalPlanner.getDailySchedule(studentId, date);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        error: 'Daily schedule not found'
      });
    }
    
    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    logger.error('❌ Get daily schedule error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve daily schedule'
    });
  }
});

// Complete Task
router.post('/complete-task', async (req, res) => {
  try {
    const { studentId, taskId } = req.body;
    logger.info('✅ Completing task', { studentId, taskId });
    
    if (!studentId || !taskId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID and task ID are required'
      });
    }
    
    const task = advancedMedicalPlanner.completeTask(studentId, taskId);
    
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

// Get Career Path Recommendations
router.post('/career-recommendations', async (req, res) => {
  try {
    const { studentId, interests, skills } = req.body;
    logger.info('🎯 Getting career recommendations', { studentId });
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID is required'
      });
    }
    
    const recommendations = advancedMedicalPlanner.getCareerPathRecommendations(
      studentId, 
      interests || [], 
      skills || []
    );
    
    res.json({
      success: true,
      data: {
        recommendations,
        totalCareers: recommendations.length,
        topRecommendation: recommendations[0]
      }
    });
  } catch (error) {
    logger.error('❌ Career recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get career recommendations'
    });
  }
});

// Get Available Career Paths
router.get('/career-paths', async (req, res) => {
  try {
    logger.info('🎯 Getting available career paths');
    
    const careerPaths = Object.keys(advancedMedicalPlanner.careerPaths).map(name => ({
      name,
      description: advancedMedicalPlanner.careerPaths[name].description,
      duration: advancedMedicalPlanner.careerPaths[name].duration,
      salary: advancedMedicalPlanner.careerPaths[name].salary,
      requirements: advancedMedicalPlanner.careerPaths[name].requirements.length
    }));
    
    res.json({
      success: true,
      data: {
        careerPaths,
        total: careerPaths.length
      }
    });
  } catch (error) {
    logger.error('❌ Career paths error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve career paths'
    });
  }
});

// Get Career Path Details
router.get('/career-paths/:careerName', async (req, res) => {
  try {
    const { careerName } = req.params;
    logger.info('🎯 Getting career path details', { careerName });
    
    const careerPath = advancedMedicalPlanner.careerPaths[careerName];
    if (!careerPath) {
      return res.status(404).json({
        success: false,
        error: 'Career path not found'
      });
    }
    
    res.json({
      success: true,
      data: careerPath
    });
  } catch (error) {
    logger.error('❌ Career path details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve career path details'
    });
  }
});

// Create Learning Track
router.post('/learning-track', async (req, res) => {
  try {
    const { studentId, trackName } = req.body;
    logger.info('📚 Creating learning track', { studentId, trackName });
    
    if (!studentId || !trackName) {
      return res.status(400).json({
        success: false,
        error: 'Student ID and track name are required'
      });
    }
    
    const learningTrack = advancedMedicalPlanner.createLearningTrack(studentId, trackName);
    
    res.json({
      success: true,
      data: learningTrack
    });
  } catch (error) {
    logger.error('❌ Create learning track error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create learning track'
    });
  }
});

// Update Learning Progress
router.put('/learning-progress', async (req, res) => {
  try {
    const { studentId, moduleName, progress } = req.body;
    logger.info('📈 Updating learning progress', { studentId, moduleName, progress });
    
    if (!studentId || !moduleName || progress === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Student ID, module name, and progress are required'
      });
    }
    
    const track = advancedMedicalPlanner.updateLearningProgress(studentId, moduleName, progress);
    
    res.json({
      success: true,
      data: track
    });
  } catch (error) {
    logger.error('❌ Update learning progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update learning progress'
    });
  }
});

// Get Available Learning Tracks
router.get('/learning-tracks', async (req, res) => {
  try {
    logger.info('📚 Getting available learning tracks');
    
    const learningTracks = Object.keys(advancedMedicalPlanner.availableLearningTracks).map(name => ({
      name,
      modules: advancedMedicalPlanner.availableLearningTracks[name].modules.length,
      duration: advancedMedicalPlanner.availableLearningTracks[name].duration,
      certification: advancedMedicalPlanner.availableLearningTracks[name].certification
    }));
    
    res.json({
      success: true,
      data: {
        learningTracks,
        total: learningTracks.length
      }
    });
  } catch (error) {
    logger.error('❌ Learning tracks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve learning tracks'
    });
  }
});

// Get Specialization Recommendations
router.post('/specialization-recommendations', async (req, res) => {
  try {
    const { studentId, performance, interests } = req.body;
    logger.info('🎯 Getting specialization recommendations', { studentId });
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID is required'
      });
    }
    
    const recommendations = advancedMedicalPlanner.getSpecializationRecommendations(
      studentId,
      performance || 0,
      interests || []
    );
    
    res.json({
      success: true,
      data: {
        recommendations,
        totalSpecialties: recommendations.length,
        topSpecialty: recommendations[0]
      }
    });
  } catch (error) {
    logger.error('❌ Specialization recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get specialization recommendations'
    });
  }
});

// Get Available Specializations
router.get('/specializations', async (req, res) => {
  try {
    logger.info('🎯 Getting available specializations');
    
    const specializations = Object.keys(advancedMedicalPlanner.specializationTracks).map(name => ({
      name,
      skills: advancedMedicalPlanner.specializationTracks[name].skills.length,
      rotations: advancedMedicalPlanner.specializationTracks[name].rotations.length,
      certifications: advancedMedicalPlanner.specializationTracks[name].certifications.length
    }));
    
    res.json({
      success: true,
      data: {
        specializations,
        total: specializations.length
      }
    });
  } catch (error) {
    logger.error('❌ Specializations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve specializations'
    });
  }
});

// Get Alerts
router.get('/alerts/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    logger.info('🔔 Getting alerts', { studentId });
    
    const alerts = advancedMedicalPlanner.getAlerts(studentId);
    
    res.json({
      success: true,
      data: {
        alerts,
        unreadCount: alerts.length,
        totalAlerts: alerts.length
      }
    });
  } catch (error) {
    logger.error('❌ Get alerts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve alerts'
    });
  }
});

// Mark Alert as Read
router.put('/alerts/:studentId/:alertId', async (req, res) => {
  try {
    const { studentId, alertId } = req.params;
    logger.info('✅ Marking alert as read', { studentId, alertId });
    
    const alert = advancedMedicalPlanner.markAlertAsRead(studentId, parseInt(alertId));
    
    res.json({
      success: true,
      data: { alert }
    });
  } catch (error) {
    logger.error('❌ Mark alert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark alert as read'
    });
  }
});

// Get Career Statistics
router.get('/statistics/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    logger.info('📊 Getting career statistics', { studentId });
    
    const statistics = advancedMedicalPlanner.getCareerStatistics(studentId);
    
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    logger.error('❌ Career statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve career statistics'
    });
  }
});

// Create Sample Daily Schedule
router.post('/sample-schedule', async (req, res) => {
  try {
    const { studentId, specialty } = req.body;
    logger.info('📅 Creating sample daily schedule', { studentId, specialty });
    
    const sampleSchedules = {
      'Emergency Medicine': [
        {
          title: 'Morning Emergency Department Rounds',
          description: 'Review overnight cases, handover from night team',
          startTime: '08:00',
          endTime: '09:00',
          priority: 'High',
          location: 'Emergency Department'
        },
        {
          title: 'Trauma Team Response',
          description: 'Respond to trauma calls, coordinate with surgical team',
          startTime: '09:00',
          endTime: '12:00',
          priority: 'Critical',
          location: 'Trauma Bay'
        },
        {
          title: 'Lunch Break & Case Review',
          description: 'Review morning cases, discuss with colleagues',
          startTime: '12:00',
          endTime: '13:00',
          priority: 'Medium',
          location: 'Staff Lounge'
        },
        {
          title: 'Afternoon Emergency Cases',
          description: 'Manage walk-in emergency cases, procedures',
          startTime: '13:00',
          endTime: '17:00',
          priority: 'High',
          location: 'Emergency Department'
        },
        {
          title: 'Evening Handover',
          description: 'Handover to night team, complete documentation',
          startTime: '17:00',
          endTime: '18:00',
          priority: 'High',
          location: 'Emergency Department'
        }
      ],
      'Cardiology': [
        {
          title: 'Morning Cardiology Ward Rounds',
          description: 'Review cardiac patients, update treatment plans',
          startTime: '08:00',
          endTime: '10:00',
          priority: 'High',
          location: 'Cardiology Ward'
        },
        {
          title: 'Cardiac Catheterization Lab',
          description: 'Perform diagnostic and interventional procedures',
          startTime: '10:00',
          endTime: '14:00',
          priority: 'Critical',
          location: 'Cath Lab'
        },
        {
          title: 'Lunch Break & Case Discussion',
          description: 'Discuss complex cases with team',
          startTime: '14:00',
          endTime: '15:00',
          priority: 'Medium',
          location: 'Cardiology Conference Room'
        },
        {
          title: 'Cardiology Outpatient Clinic',
          description: 'See follow-up patients, new consultations',
          startTime: '15:00',
          endTime: '17:00',
          priority: 'High',
          location: 'Cardiology OPD'
        },
        {
          title: 'Research & Documentation',
          description: 'Update patient records, research activities',
          startTime: '17:00',
          endTime: '18:00',
          priority: 'Medium',
          location: 'Cardiology Office'
        }
      ],
      'General': [
        {
          title: 'Morning Ward Rounds',
          description: 'Review all patients, update treatment plans',
          startTime: '08:00',
          endTime: '10:00',
          priority: 'High',
          location: 'Medical Ward'
        },
        {
          title: 'Patient Consultations',
          description: 'See new patients, follow-up cases',
          startTime: '10:00',
          endTime: '12:00',
          priority: 'High',
          location: 'Outpatient Clinic'
        },
        {
          title: 'Lunch Break',
          description: 'Rest and refresh',
          startTime: '12:00',
          endTime: '13:00',
          priority: 'Medium',
          location: 'Staff Lounge'
        },
        {
          title: 'Afternoon Procedures',
          description: 'Perform medical procedures, interventions',
          startTime: '13:00',
          endTime: '16:00',
          priority: 'High',
          location: 'Procedure Room'
        },
        {
          title: 'Evening Documentation',
          description: 'Complete patient records, prepare reports',
          startTime: '16:00',
          endTime: '18:00',
          priority: 'Medium',
          location: 'Medical Office'
        }
      ]
    };
    
    const schedule = sampleSchedules[specialty] || sampleSchedules['General'];
    
    // Convert time strings to Date objects for today
    const today = new Date();
    const scheduleWithDates = schedule.map(task => ({
      ...task,
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
        parseInt(task.startTime.split(':')[0]), parseInt(task.startTime.split(':')[1])),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
        parseInt(task.endTime.split(':')[0]), parseInt(task.endTime.split(':')[1]))
    }));
    
    const dailySchedule = advancedMedicalPlanner.createDailySchedule(studentId, today.toDateString(), scheduleWithDates);
    
    res.json({
      success: true,
      data: dailySchedule
    });
  } catch (error) {
    logger.error('❌ Sample schedule error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create sample schedule'
    });
  }
});

module.exports = router; 