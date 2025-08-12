const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Medical Practice System Test - Real Doctor Practice for Sri Lankan Medical Students
async function testMedicalPracticeSystem() {
  console.log('🏥 MEDICAL PRACTICE SYSTEM TEST\n');
  console.log('Testing advanced clinical scenarios and real doctor practice...\n');

  const studentId = 'med-student-001';

  const tests = [
    // CLINICAL SCENARIOS
    {
      name: '🏥 ADVANCED: Emergency Department - Chest Pain Emergency',
      test: async () => {
        // Start practice session
        const startResponse = await axios.post(`${BASE_URL}/api/practice/session/start`, {
          studentId,
          scenarioType: 'Emergency Department',
          scenarioName: 'Chest Pain Emergency'
        });
        
        const session = startResponse.data.data;
        const hasPatientData = session.patientData && session.patientData.name === 'Mr. Perera';
        const hasRequiredActions = session.requiredActions && session.requiredActions.length > 0;
        const hasTimeLimit = session.timeLimit === 15;
        const hasLearningObjectives = session.learningObjectives && session.learningObjectives.length > 0;
        
        console.log('Chest Pain Session:', {
          hasPatientData,
          hasRequiredActions,
          hasTimeLimit,
          hasLearningObjectives,
          patientName: session.patientData?.name,
          requiredActions: session.requiredActions?.length,
          timeLimit: session.timeLimit
        });
        
        return hasPatientData && hasRequiredActions && hasTimeLimit && hasLearningObjectives;
      }
    },

    {
      name: '🏥 ADVANCED: Medical Ward - Dengue Hemorrhagic Fever',
      test: async () => {
        // Start practice session
        const startResponse = await axios.post(`${BASE_URL}/api/practice/session/start`, {
          studentId: 'med-student-002',
          scenarioType: 'Medical Ward',
          scenarioName: 'Dengue Hemorrhagic Fever'
        });
        
        const session = startResponse.data.data;
        const hasPatientData = session.patientData && session.patientData.name === 'Ms. Silva';
        const hasWarningSigns = session.patientData?.history?.associated?.includes('petechial rash');
        const hasTimeLimit = session.timeLimit === 20;
        const hasTimeCritical = session.timeCritical === true;
        
        console.log('Dengue Session:', {
          hasPatientData,
          hasWarningSigns,
          hasTimeLimit,
          hasTimeCritical,
          patientName: session.patientData?.name,
          warningSigns: session.patientData?.history?.associated
        });
        
        return hasPatientData && hasWarningSigns && hasTimeLimit && hasTimeCritical;
      }
    },

    // MEDICAL ACTIONS AND DECISIONS
    {
      name: '⚡ CRITICAL: Medical Action - ECG Interpretation',
      test: async () => {
        const actionResponse = await axios.post(`${BASE_URL}/api/practice/session/action`, {
          studentId,
          action: 'Immediate ECG interpretation',
          details: 'ST elevation in leads II, III, aVF consistent with inferior STEMI'
        });
        
        const data = actionResponse.data.data;
        const hasAction = data.action && data.action.action === 'Immediate ECG interpretation';
        const hasEvaluation = data.evaluation && data.evaluation.score > 0;
        const hasTimeRemaining = data.timeRemaining >= 0;
        
        console.log('ECG Action:', {
          hasAction,
          hasEvaluation,
          hasTimeRemaining,
          action: data.action?.action,
          score: data.evaluation?.score,
          feedback: data.evaluation?.feedback
        });
        
        return hasAction && hasEvaluation && hasTimeRemaining;
      }
    },

    {
      name: '⚡ CRITICAL: Medical Decision - STEMI Management',
      test: async () => {
        const decisionResponse = await axios.post(`${BASE_URL}/api/practice/session/decision`, {
          studentId,
          decision: 'Immediate PCI',
          reasoning: 'Patient has STEMI with ST elevation. Immediate PCI is the gold standard treatment.'
        });
        
        const data = decisionResponse.data.data;
        const hasDecision = data.decision && data.decision.decision === 'Immediate PCI';
        const hasEvaluation = data.evaluation && data.evaluation.score > 0;
        const hasReasoning = data.decision && data.decision.reasoning;
        
        console.log('STEMI Decision:', {
          hasDecision,
          hasEvaluation,
          hasReasoning,
          decision: data.decision?.decision,
          score: data.evaluation?.score,
          feedback: data.evaluation?.feedback
        });
        
        return hasDecision && hasEvaluation && hasReasoning;
      }
    },

    // SESSION COMPLETION AND PERFORMANCE
    {
      name: '📊 PERFORMANCE: Complete Practice Session with Evaluation',
      test: async () => {
        const completeResponse = await axios.post(`${BASE_URL}/api/practice/session/complete`, {
          studentId
        });
        
        const data = completeResponse.data.data;
        const hasSession = data.session && data.session.status === 'completed';
        const hasPerformance = data.performance && data.performance.overallScore > 0;
        const hasFeedback = data.feedback && data.feedback.strengths && data.feedback.areas;
        const hasGrade = data.performance && data.performance.grade;
        
        console.log('Session Completion:', {
          hasSession,
          hasPerformance,
          hasFeedback,
          hasGrade,
          overallScore: data.performance?.overallScore,
          grade: data.performance?.grade,
          strengths: data.feedback?.strengths?.length
        });
        
        return hasSession && hasPerformance && hasFeedback && hasGrade;
      }
    },

    // DIAGNOSTIC CHALLENGES
    {
      name: '🔍 DIAGNOSTIC: ECG Interpretation Challenge',
      test: async () => {
        const challengesResponse = await axios.get(`${BASE_URL}/api/practice/diagnostic-challenges`);
        
        const data = challengesResponse.data.data;
        const hasChallenges = data.challenges && Object.keys(data.challenges).length > 0;
        const hasECG = data.challenges['ECG Interpretation'] && data.challenges['ECG Interpretation'].length > 0;
        const hasSTEMI = data.challenges['ECG Interpretation']?.some(c => c.name === 'STEMI');
        const hasTimeLimits = data.challenges['ECG Interpretation']?.every(c => c.timeLimit > 0);
        
        console.log('Diagnostic Challenges:', {
          hasChallenges,
          hasECG,
          hasSTEMI,
          hasTimeLimits,
          totalTypes: data.totalTypes,
          totalChallenges: data.totalChallenges,
          ecgChallenges: data.challenges['ECG Interpretation']?.length
        });
        
        return hasChallenges && hasECG && hasSTEMI && hasTimeLimits;
      }
    },

    // MEDICAL RESPONSIBILITIES
    {
      name: '👨‍⚕️ RESPONSIBILITIES: Daily Medical Tasks and Duties',
      test: async () => {
        const responsibilitiesResponse = await axios.get(`${BASE_URL}/api/practice/responsibilities`);
        
        const data = responsibilitiesResponse.data.data;
        const hasResponsibilities = data.responsibilities && data.responsibilities.length > 0;
        const hasWardRounds = data.responsibilities.some(r => r.name === 'Daily Ward Rounds');
        const hasEmergencyShifts = data.responsibilities.some(r => r.name === 'Emergency Department Shifts');
        const hasICUMgmt = data.responsibilities.some(r => r.name === 'ICU Management');
        const hasTasks = data.responsibilities.every(r => r.tasks && r.tasks.length > 0);
        
        console.log('Medical Responsibilities:', {
          hasResponsibilities,
          hasWardRounds,
          hasEmergencyShifts,
          hasICUMgmt,
          hasTasks,
          total: data.total,
          responsibilities: data.responsibilities?.length
        });
        
        return hasResponsibilities && hasWardRounds && hasEmergencyShifts && hasICUMgmt && hasTasks;
      }
    },

    // DAILY TASKS AND NOTIFICATIONS
    {
      name: '📋 DAILY: Set and Manage Medical Tasks',
      test: async () => {
        const tasks = [
          {
            id: 'task-001',
            description: 'Morning ward rounds - Medical Ward A',
            priority: 'High',
            timeRequired: 120,
            department: 'Medical Ward'
          },
          {
            id: 'task-002',
            description: 'Review patient charts and update treatment plans',
            priority: 'Medium',
            timeRequired: 60,
            department: 'Medical Ward'
          },
          {
            id: 'task-003',
            description: 'Emergency department shift (8 hours)',
            priority: 'Critical',
            timeRequired: 480,
            department: 'Emergency Department'
          }
        ];
        
        const setTasksResponse = await axios.post(`${BASE_URL}/api/practice/daily-tasks`, {
          studentId,
          tasks
        });
        
        const data = setTasksResponse.data.data;
        const hasTasks = data.tasks && data.tasks.length === 3;
        const hasDate = data.date;
        const hasPendingStatus = data.tasks.every(t => t.status === 'pending');
        
        console.log('Daily Tasks Set:', {
          hasTasks,
          hasDate,
          hasPendingStatus,
          taskCount: data.tasks?.length,
          date: data.date
        });
        
        return hasTasks && hasDate && hasPendingStatus;
      }
    },

    {
      name: '✅ DAILY: Complete Medical Tasks',
      test: async () => {
        const completeTaskResponse = await axios.post(`${BASE_URL}/api/practice/daily-tasks/complete`, {
          studentId,
          taskId: 'task-001'
        });
        
        const data = completeTaskResponse.data.data;
        const hasTask = data && data.id === 'task-001';
        const hasCompletedStatus = data.status === 'completed';
        const hasEndTime = data.endTime;
        
        console.log('Task Completion:', {
          hasTask,
          hasCompletedStatus,
          hasEndTime,
          taskId: data?.id,
          status: data?.status
        });
        
        return hasTask && hasCompletedStatus && hasEndTime;
      }
    },

    // STUDENT PROGRESS AND STATISTICS
    {
      name: '📊 PROGRESS: Student Performance Tracking',
      test: async () => {
        const progressResponse = await axios.get(`${BASE_URL}/api/practice/progress/${studentId}`);
        
        const data = progressResponse.data.data;
        const hasProgress = data && data.studentId === studentId;
        const hasSessions = data.totalSessions >= 0;
        const hasCompletedSessions = data.completedSessions >= 0;
        const hasAveragePerformance = data.averagePerformance >= 0;
        
        console.log('Student Progress:', {
          hasProgress,
          hasSessions,
          hasCompletedSessions,
          hasAveragePerformance,
          totalSessions: data.totalSessions,
          completedSessions: data.completedSessions,
          averagePerformance: data.averagePerformance
        });
        
        return hasProgress && hasSessions && hasCompletedSessions && hasAveragePerformance;
      }
    },

    {
      name: '📈 STATISTICS: Comprehensive Practice Statistics',
      test: async () => {
        const statisticsResponse = await axios.get(`${BASE_URL}/api/practice/statistics/${studentId}`);
        
        const data = statisticsResponse.data.data;
        const hasProgress = data.progress;
        const hasActiveSession = data.activeSession !== null;
        const hasDailyTasks = data.dailyTasks;
        const hasNotifications = data.notifications;
        
        console.log('Practice Statistics:', {
          hasProgress,
          hasActiveSession,
          hasDailyTasks,
          hasNotifications,
          unreadNotifications: data.notifications?.unreadCount,
          totalTasks: data.dailyTasks?.totalTasks,
          completedTasks: data.dailyTasks?.completedTasks
        });
        
        return hasProgress && hasDailyTasks && hasNotifications;
      }
    },

    // NOTIFICATIONS AND ALERTS
    {
      name: '🔔 NOTIFICATIONS: Medical Alerts and Reminders',
      test: async () => {
        const notificationsResponse = await axios.get(`${BASE_URL}/api/practice/notifications/${studentId}`);
        
        const data = notificationsResponse.data.data;
        const hasNotifications = data.notifications && Array.isArray(data.notifications);
        const hasUnreadCount = data.unreadCount >= 0;
        
        console.log('Notifications:', {
          hasNotifications,
          hasUnreadCount,
          unreadCount: data.unreadCount,
          notifications: data.notifications?.length
        });
        
        return hasNotifications && hasUnreadCount;
      }
    },

    // LEARNING RECOMMENDATIONS
    {
      name: '📚 RECOMMENDATIONS: Personalized Learning Guidance',
      test: async () => {
        const recommendationsResponse = await axios.get(`${BASE_URL}/api/practice/recommendations/${studentId}`);
        
        const data = recommendationsResponse.data.data;
        const hasNextScenarios = data.nextScenarios && Array.isArray(data.nextScenarios);
        const hasSkillImprovements = data.skillImprovements && Array.isArray(data.skillImprovements);
        const hasStudyAreas = data.studyAreas && Array.isArray(data.studyAreas);
        const hasPracticeFocus = data.practiceFocus && Array.isArray(data.practiceFocus);
        
        console.log('Learning Recommendations:', {
          hasNextScenarios,
          hasSkillImprovements,
          hasStudyAreas,
          hasPracticeFocus,
          nextScenarios: data.nextScenarios?.length,
          skillImprovements: data.skillImprovements?.length,
          studyAreas: data.studyAreas?.length,
          practiceFocus: data.practiceFocus?.length
        });
        
        return hasNextScenarios && hasSkillImprovements && hasStudyAreas && hasPracticeFocus;
      }
    }
  ];

  let passed = 0;
  let failed = 0;
  let criticalFailures = 0;

  console.log('🏥 STARTING MEDICAL PRACTICE SYSTEM TESTING...\n');

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
  console.log('🏥 MEDICAL PRACTICE SYSTEM TEST RESULTS');
  console.log(`${'='.repeat(80)}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🚨 Critical Failures: ${criticalFailures}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 100% MEDICAL PRACTICE SYSTEM ACHIEVED!');
    console.log('✅ Medical students can practice as real doctors');
    console.log('✅ Advanced clinical scenarios working perfectly');
    console.log('✅ Diagnostic challenges comprehensive');
    console.log('✅ Medical responsibilities realistic');
    console.log('✅ Daily tasks and notifications functional');
    console.log('✅ Performance tracking accurate');
    console.log('✅ Learning recommendations personalized');
    console.log('✅ Real doctor responsibility simulation complete');
    console.log('\n🚀 SRI LANKAN MEDICAL STUDENTS CAN NOW PRACTICE AS REAL DOCTORS!');
  } else if (criticalFailures === 0) {
    console.log('\n⚠️ MOSTLY FUNCTIONAL:');
    console.log('• Core medical practice features working');
    console.log('• Advanced scenarios functional');
    console.log('• Some advanced features need improvement');
    console.log('• System provides realistic doctor practice');
  } else {
    console.log('\n🚨 CRITICAL PRACTICE ISSUES:');
    console.log('• Advanced clinical scenarios not working');
    console.log('• Medical practice system incomplete');
    console.log('• Students cannot practice as real doctors');
    console.log('• Immediate fixes required for medical training');
  }

  return {
    passed,
    failed,
    criticalFailures,
    successRate: ((passed / (passed + failed)) * 100).toFixed(1),
    isReady: failed === 0
  };
}

// Run the medical practice system test
testMedicalPracticeSystem().catch(error => {
  console.error('❌ Medical practice system test failed:', error.message);
  process.exit(1);
}); 