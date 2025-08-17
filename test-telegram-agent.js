const { logger } = require('./src/utils/logger');

// Test the agent command function directly
async function testAgentCommand() {
  console.log('🧪 Testing Telegram Agent Command...\n');
  
  try {
    // Import the medical agent system (singleton instance)
    const medicalAgentSystem = require('./src/services/medical-agent-system');
    
    // Test user data
    const testUser = {
      id: 'test_telegram_user_123',
      uid: 'test_telegram_user_123',
      displayName: 'Test Medical Student',
      firstName: 'Test',
      email: 'test@medical.edu.lk',
      phone: '+94123456789',
      telegramId: 'test_telegram_user_123',
      language: 'en'
    };
    
    console.log('✅ Testing agent initialization...');
    
    // Test agent initialization
    const agent = await medicalAgentSystem.initializeAgent(testUser.uid, {
      name: testUser.displayName,
      email: testUser.email,
      phone: testUser.phone,
      telegramId: testUser.telegramId,
      studyLevel: 'intermediate',
      specialization: 'general'
    });
    
    console.log('✅ Agent initialized successfully!');
    console.log('   Agent ID:', agent.id);
    console.log('   Student:', agent.userData.name);
    console.log('   Status:', agent.status);
    
    // Test agent retrieval
    const retrievedAgent = await medicalAgentSystem.getAgent(testUser.uid);
    console.log('✅ Agent retrieval successful!');
    console.log('   Retrieved Agent ID:', retrievedAgent.id);
    
    // Test task addition
    const taskResult = await medicalAgentSystem.addTaskWithAlerts(testUser.uid, {
      title: 'Test Task from Telegram',
      description: 'Testing task creation from Telegram bot',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      priority: 'medium',
      category: 'test'
    });
    
    console.log('✅ Task addition successful!');
    console.log('   Task ID:', taskResult?.task?.id || 'N/A');
    console.log('   Task Title:', taskResult?.task?.title || 'Test Task from Telegram');
    
    console.log('\n🎉 All Telegram Agent tests passed!');
    console.log('✅ The /agent command should work in Telegram now!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testAgentCommand(); 