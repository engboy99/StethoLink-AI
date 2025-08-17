const Anthropic = require('@anthropic-ai/sdk');
const { logger } = require('../utils/logger');

// Initialize Claude client
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

// Medical diagnosis prompt template
const DIAGNOSIS_PROMPT = `You are Dr. StethoLink, an expert AI medical assistant specializing in Sri Lankan healthcare. 

Your role is to provide medical analysis and guidance for patients. Always consider:
- Sri Lankan healthcare context and available resources
- Common local diseases and conditions
- Cultural and environmental factors
- Appropriate referral recommendations

Provide responses in the requested language (English, Sinhala, or Tamil).

For medical analysis, include:
1. Possible differential diagnoses
2. Recommended next steps
3. When to seek immediate medical attention
4. General health advice
5. Prevention tips

IMPORTANT: Always remind patients that this is for educational purposes and they should consult healthcare professionals for proper diagnosis and treatment.

Patient symptoms: {symptoms}
Language: {language}

Please provide a comprehensive medical analysis:`;

// Simulation prompt template
const SIMULATION_PROMPT = `You are Dr. StethoLink, creating an interactive patient simulation for medical students.

Create a realistic patient case with:
- Patient demographics (age, gender, occupation, location)
- Presenting symptoms and history
- Physical examination findings
- Laboratory results (if relevant)
- Context appropriate for Sri Lankan healthcare

Make it interactive and educational. The student should be able to ask questions to diagnose the patient.

Condition: {condition}
Language: {language}
Patient Profile: {patientProfile}

Create an engaging patient simulation:`;

// Medical education prompt template
const EDUCATION_PROMPT = `You are Dr. StethoLink, a medical educator specializing in Sri Lankan medical education.

Create comprehensive educational content about the given medical topic, considering:
- Sri Lankan medical curriculum
- Local healthcare practices
- Common conditions in Sri Lanka
- Practical clinical applications

Topic: {topic}
Language: {language}
Complexity Level: {complexity}

Provide detailed educational content:`;

// Motivational message prompt template
const MOTIVATION_PROMPT = `You are Dr. StethoLink, a mentor for medical students in Sri Lanka.

Provide motivational and encouraging messages that:
- Inspire medical students
- Acknowledge the challenges of medical education
- Offer practical advice for success
- Consider Sri Lankan medical education context
- Be culturally appropriate

Context: {context}
Language: {language}

Provide an inspiring motivational message:`;

// Generate medical diagnosis using Claude
async function generateDiagnosis(symptoms, language = 'en', userId) {
  try {
    logger.info('🏥 Generating medical diagnosis with Claude', { userId, language, symptoms: symptoms.substring(0, 50) });
    
    const startTime = Date.now();
    
    const prompt = DIAGNOSIS_PROMPT
      .replace('{symptoms}', symptoms)
      .replace('{language}', language);
    
    const response = await claude.messages.create({
      model: MODEL,
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    const processingTime = Date.now() - startTime;
    
    logger.info('✅ Diagnosis generated successfully with Claude', { 
      userId, 
      processingTime,
      responseLength: response.content[0].text.length 
    });
    
    return {
      diagnosis: response.content[0].text,
      processingTime,
      model: MODEL,
      provider: 'claude'
    };
    
  } catch (error) {
    logger.error('❌ Error generating diagnosis with Claude:', error);
    throw new Error(`Diagnosis generation failed: ${error.message}`);
  }
}

// Generate patient simulation using Claude
async function generateSimulation(condition, language = 'en', patientProfile = {}) {
  try {
    logger.info('🎭 Generating patient simulation with Claude', { condition, language });
    
    const startTime = Date.now();
    
    const prompt = SIMULATION_PROMPT
      .replace('{condition}', condition)
      .replace('{language}', language)
      .replace('{patientProfile}', JSON.stringify(patientProfile));
    
    const response = await claude.messages.create({
      model: MODEL,
      max_tokens: 1500,
      temperature: 0.8,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    const processingTime = Date.now() - startTime;
    
    logger.info('✅ Simulation generated successfully with Claude', { 
      condition, 
      processingTime,
      responseLength: response.content[0].text.length 
    });
    
    return {
      simulation: response.content[0].text,
      patientProfile,
      processingTime,
      model: MODEL,
      provider: 'claude'
    };
    
  } catch (error) {
    logger.error('❌ Error generating simulation with Claude:', error);
    throw new Error(`Simulation generation failed: ${error.message}`);
  }
}

// Generate medical education content using Claude
async function generateMedicalEducation(topic, language = 'en', complexity = 'intermediate') {
  try {
    logger.info('📚 Generating medical education content with Claude', { topic, language, complexity });
    
    const startTime = Date.now();
    
    const prompt = EDUCATION_PROMPT
      .replace('{topic}', topic)
      .replace('{language}', language)
      .replace('{complexity}', complexity);
    
    const response = await claude.messages.create({
      model: MODEL,
      max_tokens: 2000,
      temperature: 0.6,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    const processingTime = Date.now() - startTime;
    
    logger.info('✅ Medical education content generated successfully with Claude', { 
      topic, 
      processingTime,
      responseLength: response.content[0].text.length 
    });
    
    return {
      content: response.content[0].text,
      topic,
      complexity,
      processingTime,
      model: MODEL,
      provider: 'claude'
    };
    
  } catch (error) {
    logger.error('❌ Error generating medical education with Claude:', error);
    throw new Error(`Medical education generation failed: ${error.message}`);
  }
}

// Generate motivational message using Claude
async function generateMotivationalMessage(language = 'en', context = 'daily') {
  try {
    logger.info('💪 Generating motivational message with Claude', { language, context });
    
    const startTime = Date.now();
    
    const prompt = MOTIVATION_PROMPT
      .replace('{context}', context)
      .replace('{language}', language);
    
    const response = await claude.messages.create({
      model: MODEL,
      max_tokens: 800,
      temperature: 0.9,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    const processingTime = Date.now() - startTime;
    
    logger.info('✅ Motivational message generated successfully with Claude', { 
      context, 
      processingTime,
      responseLength: response.content[0].text.length 
    });
    
    return {
      message: response.content[0].text,
      context,
      processingTime,
      model: MODEL,
      provider: 'claude'
    };
    
  } catch (error) {
    logger.error('❌ Error generating motivational message with Claude:', error);
    throw new Error(`Motivational message generation failed: ${error.message}`);
  }
}

// Test Claude connection
async function testClaudeConnection() {
  try {
    logger.info('🧪 Testing Claude connection...');
    
    const response = await claude.messages.create({
      model: MODEL,
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hello, this is a test message.'
        }
      ]
    });
    
    logger.info('✅ Claude connection test successful', { 
      model: MODEL,
      responseLength: response.content[0].text.length 
    });
    
    return true;
  } catch (error) {
    logger.error('❌ Claude connection test failed:', error);
    return false;
  }
}

module.exports = {
  generateDiagnosis,
  generateSimulation,
  generateMedicalEducation,
  generateMotivationalMessage,
  testClaudeConnection
}; 