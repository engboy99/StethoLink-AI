const { logger } = require('../utils/logger');

// Advanced Medical Planner System - Level 1 Medical Training
class AdvancedMedicalPlanner {
  constructor() {
    this.dailySchedules = new Map();
    this.careerPaths = new Map();
    this.availableLearningTracks = new Map();
    this.studentLearningTracks = new Map();
    this.achievements = new Map();
    this.mentorshipPrograms = new Map();
    this.researchProjects = new Map();
    this.clinicalRotations = new Map();
    this.specializationTracks = new Map();
    this.alertSystem = new Map();
    this.initializeAdvancedFeatures();
  }

  // Initialize Advanced Level 1 Medical Features
  initializeAdvancedFeatures() {
    this.careerPaths = {
      'Emergency Medicine Specialist': {
        description: 'Become a leading emergency medicine specialist in Sri Lanka',
        requirements: ['Advanced Life Support', 'Trauma Management', 'Critical Care'],
        duration: '5 years',
        hospitals: ['Colombo National Hospital', 'Kandy Teaching Hospital', 'Jaffna Teaching Hospital'],
        salary: 'LKR 500,000 - 1,200,000',
        opportunities: ['International fellowships', 'Research grants', 'Teaching positions'],
        milestones: [
          { year: 1, milestone: 'Complete emergency medicine residency' },
          { year: 2, milestone: 'Obtain ACLS and ATLS certifications' },
          { year: 3, milestone: 'Lead emergency department team' },
          { year: 4, milestone: 'Publish research in emergency medicine' },
          { year: 5, milestone: 'Become consultant emergency physician' }
        ]
      },
      'Cardiologist': {
        description: 'Specialize in cardiovascular medicine with advanced interventions',
        requirements: ['Internal Medicine', 'Cardiology Fellowship', 'Interventional Skills'],
        duration: '6 years',
        hospitals: ['National Hospital of Sri Lanka', 'Asiri Hospital', 'Nawaloka Hospital'],
        salary: 'LKR 800,000 - 2,000,000',
        opportunities: ['International training', 'Research collaborations', 'Private practice'],
        milestones: [
          { year: 1, milestone: 'Complete internal medicine residency' },
          { year: 3, milestone: 'Begin cardiology fellowship' },
          { year: 4, milestone: 'Learn interventional procedures' },
          { year: 5, milestone: 'Perform complex cardiac interventions' },
          { year: 6, milestone: 'Establish cardiology practice' }
        ]
      },
      'Neurologist': {
        description: 'Expert in neurological disorders and advanced diagnostics',
        requirements: ['Internal Medicine', 'Neurology Fellowship', 'Neuroimaging Skills'],
        duration: '6 years',
        hospitals: ['National Hospital of Sri Lanka', 'Teaching Hospitals'],
        salary: 'LKR 600,000 - 1,500,000',
        opportunities: ['Research grants', 'International conferences', 'Academic positions'],
        milestones: [
          { year: 1, milestone: 'Complete internal medicine residency' },
          { year: 3, milestone: 'Begin neurology fellowship' },
          { year: 4, milestone: 'Master neuroimaging interpretation' },
          { year: 5, milestone: 'Lead neurology department' },
          { year: 6, milestone: 'Establish neurology practice' }
        ]
      },
      'Oncologist': {
        description: 'Specialize in cancer treatment and research',
        requirements: ['Internal Medicine', 'Oncology Fellowship', 'Research Skills'],
        duration: '6 years',
        hospitals: ['National Cancer Institute', 'Teaching Hospitals'],
        salary: 'LKR 700,000 - 1,800,000',
        opportunities: ['International research', 'Clinical trials', 'Academic medicine'],
        milestones: [
          { year: 1, milestone: 'Complete internal medicine residency' },
          { year: 3, milestone: 'Begin oncology fellowship' },
          { year: 4, milestone: 'Participate in clinical trials' },
          { year: 5, milestone: 'Lead oncology research' },
          { year: 6, milestone: 'Establish oncology practice' }
        ]
      }
    };

    this.availableLearningTracks = {
      'Clinical Excellence': {
        modules: [
          'Advanced Clinical Reasoning',
          'Evidence-Based Medicine',
          'Patient Safety Protocols',
          'Quality Improvement',
          'Clinical Audit'
        ],
        duration: '12 months',
        certification: 'Clinical Excellence Certificate',
        assessment: 'Clinical competency evaluation'
      },
      'Research & Innovation': {
        modules: [
          'Research Methodology',
          'Statistical Analysis',
          'Clinical Trial Design',
          'Medical Writing',
          'Grant Writing'
        ],
        duration: '18 months',
        certification: 'Research Excellence Certificate',
        assessment: 'Research project completion'
      },
      'Leadership & Management': {
        modules: [
          'Healthcare Leadership',
          'Hospital Management',
          'Team Building',
          'Strategic Planning',
          'Healthcare Policy'
        ],
        duration: '12 months',
        certification: 'Healthcare Leadership Certificate',
        assessment: 'Leadership project implementation'
      }
    };

    this.specializationTracks = {
      'Emergency Medicine': {
        skills: ['ACLS', 'ATLS', 'PALS', 'Trauma Management', 'Critical Care'],
        rotations: ['Emergency Department', 'ICU', 'Trauma Center', 'Ambulance Service'],
        certifications: ['ACLS', 'ATLS', 'PALS', 'Emergency Medicine Board'],
        research: ['Trauma outcomes', 'Emergency protocols', 'Disaster medicine']
      },
      'Cardiology': {
        skills: ['ECG interpretation', 'Echocardiography', 'Cardiac catheterization', 'Interventional procedures'],
        rotations: ['Cardiology Ward', 'CCU', 'Cath Lab', 'Cardiac OPD'],
        certifications: ['Cardiology Board', 'Interventional Cardiology', 'Echocardiography'],
        research: ['Cardiovascular outcomes', 'Interventional techniques', 'Preventive cardiology']
      },
      'Neurology': {
        skills: ['Neurological examination', 'Neuroimaging', 'EMG/NCV', 'Stroke management'],
        rotations: ['Neurology Ward', 'Stroke Unit', 'Neurophysiology Lab', 'Neurology OPD'],
        certifications: ['Neurology Board', 'Stroke Medicine', 'Neurophysiology'],
        research: ['Stroke outcomes', 'Neurological disorders', 'Neuroimaging advances']
      }
    };
  }

  // Create Advanced Daily Schedule with Exact Time Alerts
  createDailySchedule(studentId, date, schedule) {
    try {
      const dailySchedule = {
        studentId,
        date: date || new Date().toDateString(),
        schedule: schedule.map(item => ({
          ...item,
          id: `task-${Date.now()}-${Math.random()}`,
          status: 'scheduled',
          completed: false,
          alertSent: false,
          startTime: new Date(item.startTime),
          endTime: new Date(item.endTime)
        })),
        totalTasks: schedule.length,
        completedTasks: 0,
        alerts: []
      };

      this.dailySchedules.set(studentId, dailySchedule);
      
      // Set up exact time alerts for each task
      schedule.forEach(task => {
        this.setupExactTimeAlert(studentId, task);
      });

      logger.info('📅 Advanced daily schedule created', { studentId, taskCount: schedule.length });
      return dailySchedule;
    } catch (error) {
      logger.error('❌ Error creating daily schedule:', error);
      throw error;
    }
  }

  // Setup Exact Time Alerts
  setupExactTimeAlert(studentId, task) {
    try {
      const alertTimes = [
        { time: -30, message: `⏰ 30 minutes until: ${task.title}` },
        { time: -15, message: `⚠️ 15 minutes until: ${task.title}` },
        { time: -5, message: `🚨 5 minutes until: ${task.title}` },
        { time: 0, message: `🔔 NOW: ${task.title} - ${task.description}` },
        { time: 15, message: `⏳ 15 minutes into: ${task.title}` },
        { time: 30, message: `📊 30 minutes into: ${task.title} - Check progress` }
      ];

      const taskStartTime = new Date(task.startTime);
      
      alertTimes.forEach(alert => {
        const alertTime = new Date(taskStartTime.getTime() + alert.time * 60000);
        const timeUntilAlert = alertTime.getTime() - Date.now();
        
        if (timeUntilAlert > 0) {
          setTimeout(() => {
            this.sendExactTimeAlert(studentId, alert.message, task);
          }, timeUntilAlert);
        }
      });

      logger.info('⏰ Exact time alerts set up', { studentId, task: task.title });
    } catch (error) {
      logger.error('❌ Error setting up exact time alert:', error);
    }
  }

  // Send Exact Time Alert
  sendExactTimeAlert(studentId, message, task) {
    try {
      const alert = {
        id: Date.now(),
        studentId,
        message,
        task: task.title,
        timestamp: new Date(),
        type: 'exact_time_alert',
        priority: 'high',
        read: false
      };

      let alerts = this.alertSystem.get(studentId) || [];
      alerts.push(alert);
      this.alertSystem.set(studentId, alerts);

      logger.info('🔔 Exact time alert sent', { studentId, message });
      return alert;
    } catch (error) {
      logger.error('❌ Error sending exact time alert:', error);
    }
  }

  // Get Career Path Recommendations
  getCareerPathRecommendations(studentId, interests, skills) {
    try {
      const recommendations = [];
      
      for (const [career, details] of Object.entries(this.careerPaths)) {
        const matchScore = this.calculateCareerMatch(interests, skills, details.requirements);
        
        if (matchScore > 70) {
          recommendations.push({
            career,
            matchScore,
            details,
            nextSteps: this.getNextSteps(career, skills),
            timeline: this.createCareerTimeline(career)
          });
        }
      }

      recommendations.sort((a, b) => b.matchScore - a.matchScore);
      
      logger.info('🎯 Career path recommendations generated', { studentId, recommendations: recommendations.length });
      return recommendations;
    } catch (error) {
      logger.error('❌ Error getting career recommendations:', error);
      throw error;
    }
  }

  // Calculate Career Match Score
  calculateCareerMatch(interests, skills, requirements) {
    let matchScore = 0;
    const totalRequirements = requirements.length;
    
    requirements.forEach(requirement => {
      if (skills.includes(requirement)) matchScore += 30;
      if (interests.includes(requirement)) matchScore += 20;
    });

    return Math.min(100, (matchScore / totalRequirements) * 100);
  }

  // Get Next Steps for Career Path
  getNextSteps(career, currentSkills) {
    const careerPath = this.careerPaths[career];
    const missingSkills = careerPath.requirements.filter(req => !currentSkills.includes(req));
    
    return {
      immediate: missingSkills.slice(0, 2),
      shortTerm: missingSkills.slice(2, 4),
      longTerm: missingSkills.slice(4),
      certifications: this.getRequiredCertifications(career),
      rotations: this.getRequiredRotations(career)
    };
  }

  // Create Career Timeline
  createCareerTimeline(career) {
    const careerPath = this.careerPaths[career];
    const timeline = [];
    
    careerPath.milestones.forEach(milestone => {
      timeline.push({
        year: milestone.year,
        milestone: milestone.milestone,
        estimatedDate: this.calculateEstimatedDate(milestone.year),
        status: 'pending'
      });
    });

    return timeline;
  }

  // Calculate Estimated Date
  calculateEstimatedDate(yearsFromNow) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + yearsFromNow);
    return date.toDateString();
  }

  // Get Required Certifications
  getRequiredCertifications(career) {
    const certifications = {
      'Emergency Medicine Specialist': ['ACLS', 'ATLS', 'PALS', 'Emergency Medicine Board'],
      'Cardiologist': ['Internal Medicine Board', 'Cardiology Board', 'Interventional Cardiology'],
      'Neurologist': ['Internal Medicine Board', 'Neurology Board', 'Neuroimaging'],
      'Oncologist': ['Internal Medicine Board', 'Oncology Board', 'Research Certification']
    };
    
    return certifications[career] || [];
  }

  // Get Required Rotations
  getRequiredRotations(career) {
    const rotations = {
      'Emergency Medicine Specialist': ['Emergency Department', 'ICU', 'Trauma Center'],
      'Cardiologist': ['Cardiology Ward', 'CCU', 'Cath Lab'],
      'Neurologist': ['Neurology Ward', 'Stroke Unit', 'Neurophysiology'],
      'Oncologist': ['Oncology Ward', 'Chemotherapy Unit', 'Research Lab']
    };
    
    return rotations[career] || [];
  }

  // Create Learning Track
  createLearningTrack(studentId, trackName) {
    try {
      const track = this.availableLearningTracks[trackName];
      if (!track) {
        throw new Error('Learning track not found');
      }

      const learningTrack = {
        studentId,
        trackName,
        modules: track.modules.map(module => ({
          name: module,
          status: 'not_started',
          progress: 0,
          startDate: null,
          completionDate: null
        })),
        overallProgress: 0,
        startDate: new Date(),
        estimatedCompletion: this.calculateTrackCompletion(track.duration),
        certification: track.certification,
        assessment: track.assessment
      };

      this.studentLearningTracks.set(studentId, learningTrack);
      
      logger.info('📚 Learning track created', { studentId, trackName });
      return learningTrack;
    } catch (error) {
      logger.error('❌ Error creating learning track:', error);
      throw error;
    }
  }

  // Calculate Track Completion Date
  calculateTrackCompletion(duration) {
    const date = new Date();
    const months = parseInt(duration.split(' ')[0]);
    date.setMonth(date.getMonth() + months);
    return date.toDateString();
  }

  // Update Learning Progress
  updateLearningProgress(studentId, moduleName, progress) {
    try {
      const track = this.studentLearningTracks.get(studentId);
      if (!track) {
        throw new Error('Learning track not found');
      }

      const module = track.modules.find(m => m.name === moduleName);
      if (module) {
        module.progress = progress;
        if (progress >= 100) {
          module.status = 'completed';
          module.completionDate = new Date();
        } else if (progress > 0) {
          module.status = 'in_progress';
          if (!module.startDate) {
            module.startDate = new Date();
          }
        }

        // Calculate overall progress
        const totalProgress = track.modules.reduce((sum, m) => sum + m.progress, 0);
        track.overallProgress = Math.round(totalProgress / track.modules.length);

        this.studentLearningTracks.set(studentId, track);
        
        logger.info('📈 Learning progress updated', { studentId, moduleName, progress });
        return track;
      }
    } catch (error) {
      logger.error('❌ Error updating learning progress:', error);
      throw error;
    }
  }

  // Get Specialization Recommendations
  getSpecializationRecommendations(studentId, performance, interests) {
    try {
      const recommendations = [];
      
      for (const [specialty, details] of Object.entries(this.specializationTracks)) {
        const matchScore = this.calculateSpecialtyMatch(performance, interests, details);
        
        recommendations.push({
          specialty,
          matchScore,
          details,
          requiredSkills: details.skills,
          rotations: details.rotations,
          certifications: details.certifications,
          researchOpportunities: details.research
        });
      }

      recommendations.sort((a, b) => b.matchScore - a.matchScore);
      
      logger.info('🎯 Specialization recommendations generated', { studentId, recommendations: recommendations.length });
      return recommendations;
    } catch (error) {
      logger.error('❌ Error getting specialization recommendations:', error);
      throw error;
    }
  }

  // Calculate Specialty Match
  calculateSpecialtyMatch(performance, interests, specialtyDetails) {
    let matchScore = 0;
    
    // Performance-based scoring
    if (performance > 90) matchScore += 40;
    else if (performance > 80) matchScore += 30;
    else if (performance > 70) matchScore += 20;
    
    // Interest-based scoring
    const interestMatches = specialtyDetails.skills.filter(skill => 
      interests.includes(skill)
    ).length;
    matchScore += (interestMatches / specialtyDetails.skills.length) * 60;
    
    return Math.min(100, matchScore);
  }

  // Get Daily Schedule
  getDailySchedule(studentId, date) {
    try {
      const schedule = this.dailySchedules.get(studentId);
      if (!schedule) {
        return null;
      }

      if (date) {
        return schedule.date === date ? schedule : null;
      }

      return schedule;
    } catch (error) {
      logger.error('❌ Error getting daily schedule:', error);
      throw error;
    }
  }

  // Complete Task
  completeTask(studentId, taskId) {
    try {
      const schedule = this.dailySchedules.get(studentId);
      if (!schedule) {
        throw new Error('Daily schedule not found');
      }

      const task = schedule.schedule.find(t => t.id === taskId);
      if (task) {
        task.status = 'completed';
        task.completed = true;
        task.completionTime = new Date();
        schedule.completedTasks++;

        this.dailySchedules.set(studentId, schedule);
        
        logger.info('✅ Task completed', { studentId, taskId });
        return task;
      }
    } catch (error) {
      logger.error('❌ Error completing task:', error);
      throw error;
    }
  }

  // Get Alerts
  getAlerts(studentId) {
    try {
      const alerts = this.alertSystem.get(studentId) || [];
      return alerts.filter(alert => !alert.read);
    } catch (error) {
      logger.error('❌ Error getting alerts:', error);
      throw error;
    }
  }

  // Mark Alert as Read
  markAlertAsRead(studentId, alertId) {
    try {
      const alerts = this.alertSystem.get(studentId) || [];
      const alert = alerts.find(a => a.id === alertId);
      
      if (alert) {
        alert.read = true;
        this.alertSystem.set(studentId, alerts);
      }
      
      return alert;
    } catch (error) {
      logger.error('❌ Error marking alert as read:', error);
      throw error;
    }
  }

  // Get Career Statistics
  getCareerStatistics(studentId) {
    try {
      const schedule = this.dailySchedules.get(studentId);
      const learningTrack = this.studentLearningTracks.get(studentId);
      
      return {
        totalTasks: schedule?.totalTasks || 0,
        completedTasks: schedule?.completedTasks || 0,
        taskCompletionRate: schedule ? (schedule.completedTasks / schedule.totalTasks) * 100 : 0,
        learningProgress: learningTrack?.overallProgress || 0,
        activeAlerts: this.getAlerts(studentId).length,
        careerRecommendations: this.getCareerPathRecommendations(studentId, [], []).length
      };
    } catch (error) {
      logger.error('❌ Error getting career statistics:', error);
      throw error;
    }
  }
}

module.exports = new AdvancedMedicalPlanner(); 