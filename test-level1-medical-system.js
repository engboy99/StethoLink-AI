const axios = require('axios');

const BASE_URL = 'https://awake-courage-production.up.railway.app';

// Level 1 Medical System Test - Advanced Features for Future Doctors
async function testLevel1MedicalSystem() {
  console.log('🏥 LEVEL 1 MEDICAL SYSTEM TEST\n');
  console.log('Testing advanced features for future doctors...\n');

  const studentId = 'level1-med-student-001';

  const tests = [
    // ADVANCED DAILY PLANNER WITH EXACT TIME ALERTS
    {
      name: '📅 ADVANCED: Daily Schedule with Exact Time Alerts',
      test: async () => {
        const schedule = [
          {
            title: 'Morning Emergency Department Rounds',
            description: 'Review overnight cases, handover from night team',
            startTime: new Date(Date.now() + 60000), // 1 minute from now
            endTime: new Date(Date.now() + 120000), // 2 minutes from now
            priority: 'High',
            location: 'Emergency Department'
          },
          {
            title: 'Trauma Team Response',
            description: 'Respond to trauma calls, coordinate with surgical team',
            startTime: new Date(Date.now() + 180000), // 3 minutes from now
            endTime: new Date(Date.now() + 300000), // 5 minutes from now
            priority: 'Critical',
            location: 'Trauma Bay'
          }
        ];
        
        const response = await axios.post(`${BASE_URL}/api/planner/daily-schedule`, {
          studentId,
          schedule
        });
        
        const data = response.data.data;
        const hasSchedule = data.schedule && data.schedule.length === 2;
        const hasExactTimes = data.schedule.every(task => task.startTime && task.endTime);
        const hasAlerts = data.alerts && Array.isArray(data.alerts);
        const hasTaskIds = data.schedule.every(task => task.id);
        
        console.log('Daily Schedule:', {
          hasSchedule,
          hasExactTimes,
          hasAlerts,
          hasTaskIds,
          taskCount: data.schedule?.length,
          totalTasks: data.totalTasks
        });
        
        return hasSchedule && hasExactTimes && hasAlerts && hasTaskIds;
      }
    },

    // CAREER PATH RECOMMENDATIONS
    {
      name: '🎯 CAREER: Advanced Career Path Recommendations',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/planner/career-recommendations`, {
          studentId,
          interests: ['Emergency Medicine', 'Trauma Management', 'Critical Care'],
          skills: ['ACLS', 'ATLS', 'Basic Life Support']
        });
        
        const data = response.data.data;
        const hasRecommendations = data.recommendations && data.recommendations.length > 0;
        const hasTopRecommendation = data.topRecommendation;
        const hasMatchScores = data.recommendations.every(r => r.matchScore > 0);
        const hasEmergencyMedicine = data.recommendations.some(r => r.career.includes('Emergency'));
        
        console.log('Career Recommendations:', {
          hasRecommendations,
          hasTopRecommendation,
          hasMatchScores,
          hasEmergencyMedicine,
          totalCareers: data.totalCareers,
          topCareer: data.topRecommendation?.career
        });
        
        return hasRecommendations && hasTopRecommendation && hasMatchScores && hasEmergencyMedicine;
      }
    },

    // CAREER PATHS DETAILS
    {
      name: '🎯 CAREER: Comprehensive Career Path Details',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/planner/career-paths`);
        
        const data = response.data.data;
        const hasCareerPaths = data.careerPaths && data.careerPaths.length > 0;
        const hasEmergencyMedicine = data.careerPaths.some(c => c.name.includes('Emergency'));
        const hasCardiology = data.careerPaths.some(c => c.name.includes('Cardiologist'));
        const hasNeurology = data.careerPaths.some(c => c.name.includes('Neurologist'));
        const hasOncology = data.careerPaths.some(c => c.name.includes('Oncologist'));
        
        console.log('Career Paths:', {
          hasCareerPaths,
          hasEmergencyMedicine,
          hasCardiology,
          hasNeurology,
          hasOncology,
          total: data.total,
          careerPaths: data.careerPaths?.length
        });
        
        return hasCareerPaths && hasEmergencyMedicine && hasCardiology && hasNeurology && hasOncology;
      }
    },

    // LEARNING TRACKS
    {
      name: '📚 LEARNING: Advanced Learning Tracks',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/planner/learning-tracks`);
        
        const data = response.data.data;
        const hasLearningTracks = data.learningTracks && data.learningTracks.length > 0;
        const hasClinicalExcellence = data.learningTracks.some(t => t.name.includes('Clinical Excellence'));
        const hasResearchInnovation = data.learningTracks.some(t => t.name.includes('Research'));
        const hasLeadership = data.learningTracks.some(t => t.name.includes('Leadership'));
        const hasCertifications = data.learningTracks.every(t => t.certification);
        
        console.log('Learning Tracks:', {
          hasLearningTracks,
          hasClinicalExcellence,
          hasResearchInnovation,
          hasLeadership,
          hasCertifications,
          total: data.total,
          tracks: data.learningTracks?.length
        });
        
        return hasLearningTracks && hasClinicalExcellence && hasResearchInnovation && hasLeadership && hasCertifications;
      }
    },

    // CREATE LEARNING TRACK
    {
      name: '📚 LEARNING: Create Learning Track',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/planner/learning-track`, {
          studentId,
          trackName: 'Clinical Excellence'
        });
        
        const data = response.data.data;
        const hasTrack = data.trackName === 'Clinical Excellence';
        const hasModules = data.modules && data.modules.length > 0;
        const hasProgress = data.overallProgress === 0;
        const hasStartDate = data.startDate;
        const hasCertification = data.certification;
        
        console.log('Learning Track Created:', {
          hasTrack,
          hasModules,
          hasProgress,
          hasStartDate,
          hasCertification,
          trackName: data.trackName,
          modules: data.modules?.length
        });
        
        return hasTrack && hasModules && hasProgress && hasStartDate && hasCertification;
      }
    },

    // UPDATE LEARNING PROGRESS
    {
      name: '📈 LEARNING: Update Learning Progress',
      test: async () => {
        const response = await axios.put(`${BASE_URL}/api/planner/learning-progress`, {
          studentId,
          moduleName: 'Advanced Clinical Reasoning',
          progress: 75
        });
        
        const data = response.data.data;
        const hasTrack = data.trackName === 'Clinical Excellence';
        const hasUpdatedModule = data.modules.some(m => m.name === 'Advanced Clinical Reasoning' && m.progress === 75);
        const hasOverallProgress = data.overallProgress > 0;
        const hasModuleStatus = data.modules.some(m => m.status === 'in_progress');
        
        console.log('Learning Progress Updated:', {
          hasTrack,
          hasUpdatedModule,
          hasOverallProgress,
          hasModuleStatus,
          overallProgress: data.overallProgress,
          updatedModule: data.modules?.find(m => m.name === 'Advanced Clinical Reasoning')?.progress
        });
        
        return hasTrack && hasUpdatedModule && hasOverallProgress && hasModuleStatus;
      }
    },

    // SPECIALIZATION RECOMMENDATIONS
    {
      name: '🎯 SPECIALIZATION: Advanced Specialization Recommendations',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/planner/specialization-recommendations`, {
          studentId,
          performance: 85,
          interests: ['Emergency Medicine', 'Trauma', 'Critical Care']
        });
        
        const data = response.data.data;
        const hasRecommendations = data.recommendations && data.recommendations.length > 0;
        const hasTopSpecialty = data.topSpecialty;
        const hasMatchScores = data.recommendations.every(r => r.matchScore > 0);
        const hasEmergencyMedicine = data.recommendations.some(r => r.specialty.includes('Emergency'));
        
        console.log('Specialization Recommendations:', {
          hasRecommendations,
          hasTopSpecialty,
          hasMatchScores,
          hasEmergencyMedicine,
          totalSpecialties: data.totalSpecialties,
          topSpecialty: data.topSpecialty?.specialty
        });
        
        return hasRecommendations && hasTopSpecialty && hasMatchScores && hasEmergencyMedicine;
      }
    },

    // SPECIALIZATIONS
    {
      name: '🎯 SPECIALIZATION: Available Specializations',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/planner/specializations`);
        
        const data = response.data.data;
        const hasSpecializations = data.specializations && data.specializations.length > 0;
        const hasEmergencyMedicine = data.specializations.some(s => s.name.includes('Emergency'));
        const hasCardiology = data.specializations.some(s => s.name.includes('Cardiology'));
        const hasNeurology = data.specializations.some(s => s.name.includes('Neurology'));
        const hasSkills = data.specializations.every(s => s.skills > 0);
        
        console.log('Specializations:', {
          hasSpecializations,
          hasEmergencyMedicine,
          hasCardiology,
          hasNeurology,
          hasSkills,
          total: data.total,
          specializations: data.specializations?.length
        });
        
        return hasSpecializations && hasEmergencyMedicine && hasCardiology && hasNeurology && hasSkills;
      }
    },

    // SAMPLE DAILY SCHEDULE
    {
      name: '📅 SAMPLE: Create Sample Daily Schedule',
      test: async () => {
        const response = await axios.post(`${BASE_URL}/api/planner/sample-schedule`, {
          studentId,
          specialty: 'Emergency Medicine'
        });
        
        const data = response.data.data;
        const hasSchedule = data.schedule && data.schedule.length > 0;
        const hasEmergencyTasks = data.schedule.some(t => t.title.includes('Emergency'));
        const hasTraumaTask = data.schedule.some(t => t.title.includes('Trauma'));
        const hasExactTimes = data.schedule.every(t => t.startTime && t.endTime);
        const hasAlerts = data.alerts && Array.isArray(data.alerts);
        
        console.log('Sample Schedule:', {
          hasSchedule,
          hasEmergencyTasks,
          hasTraumaTask,
          hasExactTimes,
          hasAlerts,
          taskCount: data.schedule?.length,
          totalTasks: data.totalTasks
        });
        
        return hasSchedule && hasEmergencyTasks && hasTraumaTask && hasExactTimes && hasAlerts;
      }
    },

    // COMPLETE TASK
    {
      name: '✅ TASK: Complete Medical Task',
      test: async () => {
        // First get the schedule to find a task ID
        const scheduleResponse = await axios.get(`${BASE_URL}/api/planner/daily-schedule/${studentId}`);
        const schedule = scheduleResponse.data.data;
        
        if (!schedule || !schedule.schedule.length) {
          console.log('No schedule found for task completion test');
          return false;
        }
        
        const taskId = schedule.schedule[0].id;
        
        const response = await axios.post(`${BASE_URL}/api/planner/complete-task`, {
          studentId,
          taskId
        });
        
        const data = response.data.data;
        const hasTask = data && data.id === taskId;
        const hasCompletedStatus = data.status === 'completed';
        const hasCompletionTime = data.completionTime;
        
        console.log('Task Completion:', {
          hasTask,
          hasCompletedStatus,
          hasCompletionTime,
          taskId: data?.id,
          status: data?.status
        });
        
        return hasTask && hasCompletedStatus && hasCompletionTime;
      }
    },

    // ALERTS SYSTEM
    {
      name: '🔔 ALERTS: Advanced Alert System',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/planner/alerts/${studentId}`);
        
        const data = response.data.data;
        const hasAlerts = data.alerts && Array.isArray(data.alerts);
        const hasUnreadCount = data.unreadCount >= 0;
        const hasTotalAlerts = data.totalAlerts >= 0;
        
        console.log('Alert System:', {
          hasAlerts,
          hasUnreadCount,
          hasTotalAlerts,
          unreadCount: data.unreadCount,
          totalAlerts: data.totalAlerts
        });
        
        return hasAlerts && hasUnreadCount && hasTotalAlerts;
      }
    },

    // CAREER STATISTICS
    {
      name: '📊 STATISTICS: Career Development Statistics',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/api/planner/statistics/${studentId}`);
        
        const data = response.data.data;
        const hasTotalTasks = data.totalTasks >= 0;
        const hasCompletedTasks = data.completedTasks >= 0;
        const hasCompletionRate = data.taskCompletionRate >= 0;
        const hasLearningProgress = data.learningProgress >= 0;
        const hasActiveAlerts = data.activeAlerts >= 0;
        const hasCareerRecommendations = data.careerRecommendations >= 0;
        
        console.log('Career Statistics:', {
          hasTotalTasks,
          hasCompletedTasks,
          hasCompletionRate,
          hasLearningProgress,
          hasActiveAlerts,
          hasCareerRecommendations,
          totalTasks: data.totalTasks,
          completedTasks: data.completedTasks,
          completionRate: data.taskCompletionRate,
          learningProgress: data.learningProgress
        });
        
        return hasTotalTasks && hasCompletedTasks && hasCompletionRate && hasLearningProgress && hasActiveAlerts && hasCareerRecommendations;
      }
    }
  ];

  let passed = 0;
  let failed = 0;
  let criticalFailures = 0;

  console.log('🏥 STARTING LEVEL 1 MEDICAL SYSTEM TESTING...\n');

  for (const test of tests) {
    try {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`Testing: ${test.name}`);
      console.log(`${'='.repeat(80)}`);
      
      const result = await test.test();
      
      if (result) {
        console.log(`✅ ${test.name} - PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - FAILED`);
        failed++;
        if (test.name.includes('ADVANCED') || test.name.includes('CRITICAL')) {
          criticalFailures++;
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED (${error.message})`);
      failed++;
      if (test.name.includes('ADVANCED') || test.name.includes('CRITICAL')) {
        criticalFailures++;
      }
    }
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('🏥 LEVEL 1 MEDICAL SYSTEM TEST RESULTS');
  console.log(`${'='.repeat(80)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🚨 Critical Failures: ${criticalFailures}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 100% LEVEL 1 MEDICAL SYSTEM ACHIEVED!');
    console.log('✅ Advanced daily planner with exact time alerts working');
    console.log('✅ Career path recommendations comprehensive');
    console.log('✅ Learning tracks with progress tracking functional');
    console.log('✅ Specialization recommendations accurate');
    console.log('✅ Alert system with notifications working');
    console.log('✅ Career statistics and development tracking');
    console.log('✅ Sample schedules for different specialties');
    console.log('✅ Task completion and progress monitoring');
    console.log('✅ Level 1 medical training system complete');
    console.log('\n🚀 SRI LANKAN MEDICAL STUDENTS NOW HAVE LEVEL 1 MEDICAL SYSTEM!');
  } else if (criticalFailures === 0) {
    console.log('\n⚠️ MOSTLY LEVEL 1:');
    console.log('• Core Level 1 features working');
    console.log('• Advanced planning system functional');
    console.log('• Some advanced features need improvement');
    console.log('• System provides Level 1 medical training');
  } else {
    console.log('\n🚨 CRITICAL LEVEL 1 ISSUES:');
    console.log('• Advanced features not working');
    console.log('• Level 1 system incomplete');
    console.log('• Students cannot access Level 1 training');
    console.log('• Immediate fixes required for Level 1 system');
  }

  return {
    passed,
    failed,
    criticalFailures,
    successRate: ((passed / (passed + failed)) * 100).toFixed(1),
    isLevel1: failed === 0
  };
}

// Run the Level 1 medical system test
testLevel1MedicalSystem().catch(error => {
  console.error('❌ Level 1 medical system test failed:', error.message);
  process.exit(1);
}); 