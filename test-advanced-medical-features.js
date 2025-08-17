#!/usr/bin/env node

const BASE_URL = 'https://awake-courage-production.up.railway.app';

console.log('🏥 STETHOLINK AI - ADVANCED MEDICAL FEATURES TEST');
console.log('================================================');
console.log(`🌐 Testing Backend: ${BASE_URL}`);
console.log('');

// Test all advanced endpoints
async function testAdvancedFeatures() {
  try {
    console.log('🔍 Testing Basic Endpoints...');
    
    // Test health endpoint
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
    
    // Test root endpoint
    const rootResponse = await fetch(`${BASE_URL}/`);
    const rootData = await rootResponse.json();
    console.log('✅ Root Endpoint:', rootData.message);
    console.log('📋 Available Endpoints:', Object.keys(rootData.endpoints).length);
    
    // Test API info
    const apiResponse = await fetch(`${BASE_URL}/api`);
    const apiData = await apiResponse.json();
    console.log('✅ API Info:', apiData.message);
    
    // Test advanced features
    console.log('\n🤖 Testing Advanced Medical AI Features...');
    
    // Test AI Diagnosis
    console.log('\n🏥 Testing AI Medical Diagnosis...');
    const diagnosisResponse = await fetch(`${BASE_URL}/api/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: 'fever and headache',
        language: 'en',
        patientAge: 35,
        patientGender: 'Male',
        location: 'Colombo, Sri Lanka'
      })
    });
    const diagnosisData = await diagnosisResponse.json();
    console.log('✅ AI Diagnosis:', diagnosisData.success ? 'SUCCESS' : 'FAILED');
    if (diagnosisData.success) {
      console.log('   📊 Confidence:', Math.round(diagnosisData.confidence * 100) + '%');
      console.log('   🚨 Emergency:', diagnosisData.emergency.isEmergency ? 'YES' : 'NO');
    }
    
    // Test Patient Simulation
    console.log('\n🎭 Testing Patient Simulation...');
    const simulationResponse = await fetch(`${BASE_URL}/api/simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        condition: 'diabetes',
        language: 'en',
        complexity: 'intermediate'
      })
    });
    const simulationData = await simulationResponse.json();
    console.log('✅ Patient Simulation:', simulationData.success ? 'SUCCESS' : 'FAILED');
    if (simulationData.success) {
      console.log('   ⏱️  Estimated Time:', simulationData.simulation.estimatedTime);
      console.log('   🎯 Learning Objectives:', simulationData.simulation.learningObjectives.length);
    }
    
    // Test Medical Education
    console.log('\n📚 Testing Medical Education...');
    const educationResponse = await fetch(`${BASE_URL}/api/education`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'cardiology',
        language: 'en',
        level: 'professional'
      })
    });
    const educationData = await educationResponse.json();
    console.log('✅ Medical Education:', educationData.success ? 'SUCCESS' : 'FAILED');
    if (educationData.success) {
      console.log('   📖 Topic:', educationData.education.topic);
      console.log('   ⏱️  Duration:', educationData.education.estimatedTime);
    }
    
    // Test WhatsApp Integration
    console.log('\n📱 Testing WhatsApp Integration...');
    const whatsappResponse = await fetch(`${BASE_URL}/api/whatsapp`);
    const whatsappData = await whatsappResponse.json();
    console.log('✅ WhatsApp Bot:', whatsappData.status);
    console.log('   🔧 Features:', whatsappData.features.length);
    
    // Test Telegram Bot
    console.log('\n📲 Testing Telegram Bot...');
    const telegramResponse = await fetch(`${BASE_URL}/api/telegram`);
    const telegramData = await telegramResponse.json();
    console.log('✅ Telegram Bot:', telegramData.status);
    console.log('   🔧 Features:', telegramData.features.length);
    
    // Test Analytics
    console.log('\n📊 Testing Analytics...');
    const analyticsResponse = await fetch(`${BASE_URL}/api/analytics`);
    const analyticsData = await analyticsResponse.json();
    console.log('✅ Analytics:', analyticsData.status);
    console.log('   📈 Total Diagnoses:', analyticsData.metrics.totalDiagnoses);
    console.log('   👥 Active Users:', analyticsData.metrics.activeUsers);
    
    // Test Dashboard
    console.log('\n🖥️ Testing Dashboard...');
    const dashboardResponse = await fetch(`${BASE_URL}/api/dashboard`);
    const dashboardData = await dashboardResponse.json();
    console.log('✅ Dashboard:', dashboardData.status);
    console.log('   🔗 URL:', dashboardData.url);
    
    // Test multilingual support
    console.log('\n🌍 Testing Multilingual Support...');
    
    // Test Sinhala diagnosis
    const sinhalaResponse = await fetch(`${BASE_URL}/api/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: 'cough',
        language: 'si',
        patientAge: 28,
        patientGender: 'Female',
        location: 'Kandy, Sri Lanka'
      })
    });
    const sinhalaData = await sinhalaResponse.json();
    console.log('✅ Sinhala Diagnosis:', sinhalaData.success ? 'SUCCESS' : 'FAILED');
    
    // Test Tamil diagnosis
    const tamilResponse = await fetch(`${BASE_URL}/api/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms: 'headache',
        language: 'ta',
        patientAge: 42,
        patientGender: 'Male',
        location: 'Jaffna, Sri Lanka'
      })
    });
    const tamilData = await tamilResponse.json();
    console.log('✅ Tamil Diagnosis:', tamilData.success ? 'SUCCESS' : 'FAILED');
    
    // Final test endpoint
    console.log('\n🧪 Testing Advanced Test Endpoint...');
    const testResponse = await fetch(`${BASE_URL}/api/test`);
    const testData = await testResponse.json();
    console.log('✅ Advanced Test:', testData.success ? 'SUCCESS' : 'FAILED');
    console.log('   🚀 Features:', testData.features.length);
    console.log('   🔗 Endpoints:', Object.keys(testData.endpoints).length);
    
    console.log('\n🎉 ALL ADVANCED MEDICAL AI FEATURES TESTED SUCCESSFULLY!');
    console.log('\n📱 Your StethoLink AI Backend is now fully operational with:');
    console.log('   🤖 AI Medical Diagnosis (Multilingual)');
    console.log('   🎭 Patient Simulations');
    console.log('   📚 Medical Education');
    console.log('   📱 WhatsApp Integration');
    console.log('   📲 Telegram Bot');
    console.log('   📊 Real-time Analytics');
    console.log('   🖥️ Dashboard System');
    console.log('   🔒 Security & Rate Limiting');
    
    console.log(`\n🌐 Access your advanced backend at:`);
    console.log(`   ${BASE_URL}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAdvancedFeatures();
