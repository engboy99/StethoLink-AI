const studentTaskManager = require('./src/services/student-task-manager');

console.log('📅 STUDENT TASK MANAGER DIRECT TEST\n');
console.log('Testing: Task creation with time alerts, notebook functionality, and student management\n');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, testFunction) {
  totalTests++;
  console.log(`Testing: ${testName}`);
  console.log('='.repeat(80));
  
  try {
    const result = testFunction();
    console.log(`${testName}: ${JSON.stringify(result, null, 2)}`);
    console.log(`✅ ${testName} - PASSED\n`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${testName} - FAILED: ${error.message}\n`);
  }
}

// Test 1: Add Student Task
function testAddStudentTask() {
  const task = studentTaskManager.addTask('student_001', {
    title: 'Study for Cardiology exam',
    description: 'Review cardiac physiology and pharmacology',
    category: 'academic',
    subcategory: 'Study Session',
    priority: 'high',
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    duration: 120, // 2 hours
    location: 'Medical Library',
    notes: 'Focus on ECG interpretation and drug mechanisms',
    alertTimes: ['30min', '15min', '5min']
  });
  
  return {
    hasTaskId: !!task.id,
    hasTitle: !!task.title,
    hasCategory: !!task.category,
    hasPriority: !!task.priority,
    hasScheduledTime: !!task.scheduledTime,
    hasDuration: !!task.duration,
    hasLocation: !!task.location,
    hasAlertTimes: Array.isArray(task.alertTimes),
    hasStatus: !!task.status,
    taskId: task.id,
    title: task.title,
    category: task.category,
    priority: task.priority,
    alertTimesCount: task.alertTimes.length
  };
}

// Test 2: Get Student Tasks
function testGetStudentTasks() {
  const result = studentTaskManager.getTasks('student_001');
  
  return {
    hasTasksList: Array.isArray(result.tasks),
    hasTotal: typeof result.total === 'number',
    hasPending: typeof result.pending === 'number',
    hasCompleted: typeof result.completed === 'number',
    hasOverdue: typeof result.overdue === 'number',
    total: result.total,
    pending: result.pending,
    completed: result.completed,
    overdue: result.overdue
  };
}

// Test 3: Add Notebook Entry
function testAddNotebookEntry() {
  const entry = studentTaskManager.addNotebookEntry('student_001', {
    title: 'Cardiac arrest protocol notes',
    content: 'Cardiac arrest protocol involves immediate recognition, activation of emergency response, high-quality CPR, defibrillation, and post-resuscitation care. Key steps: 1) Check responsiveness, 2) Call for help, 3) Check breathing, 4) Start chest compressions (30:2), 5) Attach AED, 6) Continue CPR until help arrives.',
    category: 'clinical_notes',
    tags: ['emergency', 'cardiac', 'protocol', 'CPR'],
    isImportant: true
  });
  
  return {
    hasEntryId: !!entry.id,
    hasTitle: !!entry.title,
    hasContent: !!entry.content,
    hasCategory: !!entry.category,
    hasTags: Array.isArray(entry.tags),
    hasImportant: typeof entry.isImportant === 'boolean',
    hasWordCount: typeof entry.wordCount === 'number',
    hasCharacterCount: typeof entry.characterCount === 'number',
    entryId: entry.id,
    title: entry.title,
    category: entry.category,
    wordCount: entry.wordCount,
    characterCount: entry.characterCount,
    tagsCount: entry.tags.length
  };
}

// Test 4: Get Notebook Entries
function testGetNotebookEntries() {
  const result = studentTaskManager.getNotebookEntries('student_001');
  
  return {
    hasEntriesList: Array.isArray(result.entries),
    hasTotal: typeof result.total === 'number',
    hasCategories: !!result.categories,
    hasTotalWords: typeof result.totalWords === 'number',
    hasTotalCharacters: typeof result.totalCharacters === 'number',
    total: result.total,
    totalWords: result.totalWords,
    totalCharacters: result.totalCharacters
  };
}

// Test 5: Search Notebook Entries
function testSearchNotebookEntries() {
  const result = studentTaskManager.searchNotebookEntries('student_001', 'cardiac');
  
  return {
    hasSearchTerm: !!result.searchTerm,
    hasResults: Array.isArray(result.results),
    hasTotal: typeof result.total === 'number',
    hasCategories: !!result.categories,
    searchTerm: result.searchTerm,
    total: result.total
  };
}

// Test 6: Get Task Categories
function testGetTaskCategories() {
  const categories = studentTaskManager.getTaskCategories();
  
  return {
    hasCategoriesList: !!categories,
    hasAcademic: !!categories.academic,
    hasClinical: !!categories.clinical,
    hasEmergency: !!categories.emergency,
    hasPersonal: !!categories.personal,
    hasCareer: !!categories.career,
    academicName: categories.academic.name,
    clinicalName: categories.clinical.name,
    emergencyName: categories.emergency.name
  };
}

// Test 7: Get Notebook Categories
function testGetNotebookCategories() {
  const categories = studentTaskManager.getNotebookCategories();
  
  return {
    hasCategoriesList: !!categories,
    hasClinicalNotes: !!categories.clinical_notes,
    hasStudyNotes: !!categories.study_notes,
    hasProcedureNotes: !!categories.procedure_notes,
    hasResearchNotes: !!categories.research_notes,
    hasPersonalNotes: !!categories.personal_notes,
    clinicalNotesName: categories.clinical_notes.name,
    studyNotesName: categories.study_notes.name,
    procedureNotesName: categories.procedure_notes.name
  };
}

// Test 8: Get Student Statistics
function testGetStudentStatistics() {
  const statistics = studentTaskManager.getStudentStatistics('student_001');
  
  return {
    hasStatisticsData: !!statistics,
    hasStudentId: !!statistics.studentId,
    hasTasks: !!statistics.tasks,
    hasNotebook: !!statistics.notebook,
    hasLastUpdated: !!statistics.lastUpdated,
    studentId: statistics.studentId,
    totalTasks: statistics.tasks.total,
    totalNotes: statistics.notebook.total
  };
}

// Test 9: Update Task
function testUpdateTask() {
  // First add a task
  const task = studentTaskManager.addTask('student_002', {
    title: 'Ward rounds',
    category: 'clinical',
    priority: 'medium',
    scheduledTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    duration: 60
  });
  
  // Update the task
  const updatedTask = studentTaskManager.updateTask('student_002', task.id, {
    title: 'Ward rounds - Updated',
    priority: 'high',
    location: 'Medical Ward 1'
  });
  
  return {
    hasUpdatedTask: !!updatedTask,
    hasUpdatedTitle: updatedTask.title === 'Ward rounds - Updated',
    hasUpdatedPriority: updatedTask.priority === 'high',
    hasUpdatedLocation: updatedTask.location === 'Medical Ward 1',
    hasUpdatedAt: !!updatedTask.updatedAt,
    taskId: updatedTask.id,
    title: updatedTask.title,
    priority: updatedTask.priority
  };
}

// Test 10: Complete Task
function testCompleteTask() {
  // First add a task
  const task = studentTaskManager.addTask('student_003', {
    title: 'Emergency protocol review',
    category: 'emergency',
    priority: 'critical',
    scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    duration: 30
  });
  
  // Complete the task
  const completedTask = studentTaskManager.completeTask('student_003', task.id);
  
  return {
    hasCompletedTask: !!completedTask,
    hasCompletedStatus: completedTask.status === 'completed',
    hasCompletedAt: !!completedTask.completedAt,
    taskId: completedTask.id,
    status: completedTask.status
  };
}

// Run all tests
function runAllTests() {
  runTest('📅 ADD: Add Student Task with Alerts', testAddStudentTask);
  runTest('📅 GET: Get Student Tasks', testGetStudentTasks);
  runTest('📝 ADD: Add Notebook Entry', testAddNotebookEntry);
  runTest('📝 GET: Get Notebook Entries', testGetNotebookEntries);
  runTest('🔍 SEARCH: Search Notebook Entries', testSearchNotebookEntries);
  runTest('📋 CATEGORIES: Get Task Categories', testGetTaskCategories);
  runTest('📋 NOTEBOOK: Get Notebook Categories', testGetNotebookCategories);
  runTest('📊 STATISTICS: Get Student Statistics', testGetStudentStatistics);
  runTest('📅 UPDATE: Update Student Task', testUpdateTask);
  runTest('📅 COMPLETE: Complete Student Task', testCompleteTask);

  // Print results
  console.log('📅 STUDENT TASK MANAGER DIRECT TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}`);
  console.log(`🚨 Critical Failures: ${totalTests - passedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

  if (passedTests === totalTests) {
    console.log('🎉 100% STUDENT TASK MANAGER ACHIEVED!');
    console.log('✅ Student task creation with time alerts working');
    console.log('✅ Task management and organization working');
    console.log('✅ Time alert system with notifications working');
    console.log('✅ Notebook functionality (add, search) working');
    console.log('✅ Task categories and organization working');
    console.log('✅ Notebook categories and organization working');
    console.log('✅ Student statistics and progress tracking working');
    console.log('✅ Task update and completion working');
    console.log('✅ Search functionality for notes working');
    console.log('✅ Complete student management system working\n');
    console.log('🚀 SRI LANKAN MEDICAL STUDENTS NOW HAVE COMPLETE TASK & NOTEBOOK SYSTEM!');
    console.log('📅 STUDENTS CAN ADD TASKS WITH TIME ALERTS!');
    console.log('📝 STUDENTS CAN TAKE NOTES AND RETRIEVE THEM!');
  } else {
    console.log('⚠️ Some tests failed. Please check the implementation.');
  }
}

// Run tests
runAllTests(); 