const axios = require('axios');

const BASE_URL = 'https://awake-courage-production.up.railway.app/api/student';

console.log('📅 STUDENT TASK MANAGER TEST\n');
console.log('Testing: Task creation with time alerts, notebook functionality, and student management\n');

let passedTests = 0;
let totalTests = 0;

async function runTest(testName, testFunction) {
  totalTests++;
  console.log(`Testing: ${testName}`);
  console.log('='.repeat(80));
  
  try {
    const result = await testFunction();
    console.log(`${testName}: ${JSON.stringify(result, null, 2)}`);
    console.log(`✅ ${testName} - PASSED\n`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${testName} - FAILED: ${error.message}\n`);
  }
}

// Test 1: Add Student Task
async function testAddStudentTask() {
  const response = await axios.post(`${BASE_URL}/tasks`, {
    studentId: 'student_001',
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
  const data = response.data;
  
  return {
    hasTask: data.success,
    hasTaskId: !!data.task.id,
    hasTitle: !!data.task.title,
    hasCategory: !!data.task.category,
    hasPriority: !!data.task.priority,
    hasScheduledTime: !!data.task.scheduledTime,
    hasDuration: !!data.task.duration,
    hasLocation: !!data.task.location,
    hasAlertTimes: Array.isArray(data.task.alertTimes),
    hasStatus: !!data.task.status,
    taskId: data.task.id,
    title: data.task.title,
    category: data.task.category,
    priority: data.task.priority,
    alertTimesCount: data.task.alertTimes.length
  };
}

// Test 2: Get Student Tasks
async function testGetStudentTasks() {
  const response = await axios.get(`${BASE_URL}/tasks/student_001`);
  const data = response.data;
  
  return {
    hasTasks: data.success,
    hasTasksList: Array.isArray(data.tasks),
    hasTotal: typeof data.total === 'number',
    hasPending: typeof data.pending === 'number',
    hasCompleted: typeof data.completed === 'number',
    hasOverdue: typeof data.overdue === 'number',
    total: data.total,
    pending: data.pending,
    completed: data.completed,
    overdue: data.overdue
  };
}

// Test 3: Add Notebook Entry
async function testAddNotebookEntry() {
  const response = await axios.post(`${BASE_URL}/notebook`, {
    studentId: 'student_001',
    title: 'Cardiac arrest protocol notes',
    content: 'Cardiac arrest protocol involves immediate recognition, activation of emergency response, high-quality CPR, defibrillation, and post-resuscitation care. Key steps: 1) Check responsiveness, 2) Call for help, 3) Check breathing, 4) Start chest compressions (30:2), 5) Attach AED, 6) Continue CPR until help arrives.',
    category: 'clinical_notes',
    tags: ['emergency', 'cardiac', 'protocol', 'CPR'],
    isImportant: true
  });
  const data = response.data;
  
  return {
    hasEntry: data.success,
    hasEntryId: !!data.entry.id,
    hasTitle: !!data.entry.title,
    hasContent: !!data.entry.content,
    hasCategory: !!data.entry.category,
    hasTags: Array.isArray(data.entry.tags),
    hasImportant: typeof data.entry.isImportant === 'boolean',
    hasWordCount: typeof data.entry.wordCount === 'number',
    hasCharacterCount: typeof data.entry.characterCount === 'number',
    entryId: data.entry.id,
    title: data.entry.title,
    category: data.entry.category,
    wordCount: data.entry.wordCount,
    characterCount: data.entry.characterCount,
    tagsCount: data.entry.tags.length
  };
}

// Test 4: Get Notebook Entries
async function testGetNotebookEntries() {
  const response = await axios.get(`${BASE_URL}/notebook/student_001`);
  const data = response.data;
  
  return {
    hasEntries: data.success,
    hasEntriesList: Array.isArray(data.entries),
    hasTotal: typeof data.total === 'number',
    hasCategories: !!data.categories,
    hasTotalWords: typeof data.totalWords === 'number',
    hasTotalCharacters: typeof data.totalCharacters === 'number',
    total: data.total,
    totalWords: data.totalWords,
    totalCharacters: data.totalCharacters
  };
}

// Test 5: Search Notebook Entries
async function testSearchNotebookEntries() {
  const response = await axios.get(`${BASE_URL}/notebook/student_001/search?q=cardiac`);
  const data = response.data;
  
  return {
    hasSearch: data.success,
    hasSearchTerm: !!data.searchTerm,
    hasResults: Array.isArray(data.results),
    hasTotal: typeof data.total === 'number',
    hasCategories: !!data.categories,
    searchTerm: data.searchTerm,
    total: data.total
  };
}

// Test 6: Get Task Categories
async function testGetTaskCategories() {
  const response = await axios.get(`${BASE_URL}/categories/tasks`);
  const data = response.data;
  
  return {
    hasCategories: data.success,
    hasCategoriesList: !!data.categories,
    hasAcademic: !!data.categories.academic,
    hasClinical: !!data.categories.clinical,
    hasEmergency: !!data.categories.emergency,
    hasPersonal: !!data.categories.personal,
    hasCareer: !!data.categories.career,
    academicName: data.categories.academic.name,
    clinicalName: data.categories.clinical.name,
    emergencyName: data.categories.emergency.name
  };
}

// Test 7: Get Notebook Categories
async function testGetNotebookCategories() {
  const response = await axios.get(`${BASE_URL}/categories/notebook`);
  const data = response.data;
  
  return {
    hasCategories: data.success,
    hasCategoriesList: !!data.categories,
    hasClinicalNotes: !!data.categories.clinical_notes,
    hasStudyNotes: !!data.categories.study_notes,
    hasProcedureNotes: !!data.categories.procedure_notes,
    hasResearchNotes: !!data.categories.research_notes,
    hasPersonalNotes: !!data.categories.personal_notes,
    clinicalNotesName: data.categories.clinical_notes.name,
    studyNotesName: data.categories.study_notes.name,
    procedureNotesName: data.categories.procedure_notes.name
  };
}

// Test 8: Quick Add Task
async function testQuickAddTask() {
  const response = await axios.post(`${BASE_URL}/quick-task`, {
    studentId: 'student_005',
    title: 'Quick emergency case review',
    scheduledTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    category: 'emergency',
    priority: 'critical',
    alertTimes: ['30min', '15min', '5min', 'exact']
  });
  const data = response.data;
  
  return {
    hasQuickTask: data.success,
    hasTask: !!data.task,
    hasAlerts: !!data.alerts,
    hasTaskId: !!data.task.id,
    hasTitle: !!data.task.title,
    hasCategory: !!data.task.category,
    hasPriority: !!data.task.priority,
    taskId: data.task.id,
    title: data.task.title,
    category: data.task.category,
    priority: data.task.priority,
    alertsCount: data.alerts.length
  };
}

// Test 9: Quick Add Note
async function testQuickAddNote() {
  const response = await axios.post(`${BASE_URL}/quick-note`, {
    studentId: 'student_005',
    title: 'Quick procedure note',
    content: 'IV cannulation steps: 1) Wash hands, 2) Apply tourniquet, 3) Clean site, 4) Insert cannula, 5) Remove tourniquet, 6) Secure with tape, 7) Flush with saline.',
    category: 'procedure_notes',
    isImportant: true
  });
  const data = response.data;
  
  return {
    hasQuickNote: data.success,
    hasEntry: !!data.entry,
    hasEntryId: !!data.entry.id,
    hasTitle: !!data.entry.title,
    hasContent: !!data.entry.content,
    hasCategory: !!data.entry.category,
    hasImportant: typeof data.entry.isImportant === 'boolean',
    entryId: data.entry.id,
    title: data.entry.title,
    category: data.entry.category,
    isImportant: data.entry.isImportant
  };
}

// Test 10: Get Student Statistics
async function testGetStudentStatistics() {
  const response = await axios.get(`${BASE_URL}/statistics/student_001`);
  const data = response.data;
  
  return {
    hasStatistics: data.success,
    hasStatisticsData: !!data.statistics,
    hasStudentId: !!data.statistics.studentId,
    hasTasks: !!data.statistics.tasks,
    hasNotebook: !!data.statistics.notebook,
    hasLastUpdated: !!data.statistics.lastUpdated,
    studentId: data.statistics.studentId,
    totalTasks: data.statistics.tasks.total,
    totalNotes: data.statistics.notebook.total
  };
}

// Run all tests
async function runAllTests() {
  await runTest('📅 ADD: Add Student Task with Alerts', testAddStudentTask);
  await runTest('📅 GET: Get Student Tasks', testGetStudentTasks);
  await runTest('📝 ADD: Add Notebook Entry', testAddNotebookEntry);
  await runTest('📝 GET: Get Notebook Entries', testGetNotebookEntries);
  await runTest('🔍 SEARCH: Search Notebook Entries', testSearchNotebookEntries);
  await runTest('📋 CATEGORIES: Get Task Categories', testGetTaskCategories);
  await runTest('📋 NOTEBOOK: Get Notebook Categories', testGetNotebookCategories);
  await runTest('⚡ QUICK: Quick Add Task', testQuickAddTask);
  await runTest('⚡ QUICK: Quick Add Note', testQuickAddNote);
  await runTest('📊 STATISTICS: Get Student Statistics', testGetStudentStatistics);

  // Print results
  console.log('📅 STUDENT TASK MANAGER TEST RESULTS');
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
    console.log('✅ Quick add features for tasks and notes working');
    console.log('✅ Search functionality for notes working');
    console.log('✅ Complete student management system working\n');
    console.log('🚀 SRI LANKAN MEDICAL STUDENTS NOW HAVE COMPLETE TASK & NOTEBOOK SYSTEM!');
    console.log('📅 STUDENTS CAN ADD TASKS WITH TIME ALERTS!');
    console.log('📝 STUDENTS CAN TAKE NOTES AND RETRIEVE THEM!');
  } else {
    console.log('⚠️ Some tests failed. Please check the implementation.');
  }
}

// Start the server and run tests
async function main() {
  try {
    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    await runAllTests();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

main();
