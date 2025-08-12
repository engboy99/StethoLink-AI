const axios = require('axios');
require('dotenv').config();

async function testTelegramWebhook() {
  console.log('🧪 Testing Telegram Webhook...\n');

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log('❌ TELEGRAM_BOT_TOKEN not found in environment');
    return;
  }

  const webhookUrl = `http://localhost:3000/webhook/telegram/${token}`;
  
  // Test 1: Simple text message
  console.log('📝 Test 1: Simple text message');
  try {
    const response = await axios.post(webhookUrl, {
      message: {
        text: "Hello, I have chest pain",
        chat: { id: 123456 },
        from: { id: 123456, first_name: "Test User" },
        message_id: 1,
        date: Math.floor(Date.now() / 1000)
      }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Test 1 PASSED - Status:', response.status);
  } catch (error) {
    console.log('❌ Test 1 FAILED:', error.response?.status, error.response?.data);
  }

  // Test 2: Command message
  console.log('\n📝 Test 2: Command message (/help)');
  try {
    const response = await axios.post(webhookUrl, {
      message: {
        text: "/help",
        chat: { id: 123456 },
        from: { id: 123456, first_name: "Test User" },
        message_id: 2,
        date: Math.floor(Date.now() / 1000)
      }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Test 2 PASSED - Status:', response.status);
  } catch (error) {
    console.log('❌ Test 2 FAILED:', error.response?.status, error.response?.data);
  }

  // Test 3: Simulation command
  console.log('\n📝 Test 3: Simulation command (/simulate)');
  try {
    const response = await axios.post(webhookUrl, {
      message: {
        text: "/simulate",
        chat: { id: 123456 },
        from: { id: 123456, first_name: "Test User" },
        message_id: 3,
        date: Math.floor(Date.now() / 1000)
      }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Test 3 PASSED - Status:', response.status);
  } catch (error) {
    console.log('❌ Test 3 FAILED:', error.response?.status, error.response?.data);
  }

  // Test 4: Calculator command
  console.log('\n📝 Test 4: Calculator command (/calculator)');
  try {
    const response = await axios.post(webhookUrl, {
      message: {
        text: "/calculator",
        chat: { id: 123456 },
        from: { id: 123456, first_name: "Test User" },
        message_id: 4,
        date: Math.floor(Date.now() / 1000)
      }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Test 4 PASSED - Status:', response.status);
  } catch (error) {
    console.log('❌ Test 4 FAILED:', error.response?.status, error.response?.data);
  }

  console.log('\n🎉 Telegram Webhook Testing Complete!');
}

testTelegramWebhook().catch(console.error); 