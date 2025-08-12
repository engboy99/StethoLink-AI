# 🧪 StethoLink AI - Testing Guide

This guide will help you test all components of the StethoLink AI medical chatbot.

## 🚀 Quick Start Testing

### 1. Basic Setup Verification

```bash
# Run the setup test
node test-setup.js

# Check if server starts without errors
npm run dev
```

### 2. Environment Configuration

Edit your `.env` file with the following required API keys:

```env
# OpenAI Configuration (Required for AI features)
OPENAI_API_KEY=your-openai-api-key-here

# Firebase Configuration (Required for database)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com

# Optional: Bot Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
```

## 🏥 API Testing

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "1.0.0"
}
```

### 2. API Documentation

```bash
curl http://localhost:3000/api/docs
```

### 3. Medical Diagnosis Test

```bash
curl -X POST http://localhost:3000/api/diagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "fever, headache, and nausea for the past 3 days",
    "language": "en"
  }'
```

### 4. Patient Simulation Test

```bash
curl -X POST http://localhost:3000/api/simulation \
  -H "Content-Type: application/json" \
  -d '{
    "condition": "Dengue fever",
    "language": "en",
    "patientProfile": {
      "age": 25,
      "gender": "Male",
      "occupation": "Student",
      "location": "Colombo, Sri Lanka"
    }
  }'
```

### 5. Medical Education Test

```bash
curl -X POST http://localhost:3000/api/education \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Dengue fever management",
    "language": "en",
    "complexity": "student"
  }'
```

### 6. Motivational Message Test

```bash
curl "http://localhost:3000/api/motivation?language=en&context=daily"
```

## 🔐 Authentication Testing

### 1. User Registration

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123",
    "displayName": "Test User",
    "language": "en",
    "platform": "api"
  }'
```

### 2. User Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

### 3. Protected Endpoint Test

```bash
# Use the token from login response
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🤖 Bot Testing

### Telegram Bot Testing

1. **Create a Telegram Bot:**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Use `/newbot` command
   - Get your bot token

2. **Configure Environment:**
   ```env
   TELEGRAM_BOT_TOKEN=your-bot-token-here
   ```

3. **Test Commands:**
   - Send `/start` to your bot
   - Send `/help` to see available commands
   - Send `/simulate` to start patient simulation
   - Send `/mentor` for motivational message

4. **Test Voice Messages:**
   - Send a voice message describing symptoms
   - Bot should transcribe and provide diagnosis

### WhatsApp Bot Testing

1. **Set up Twilio:**
   - Create account at [Twilio Console](https://console.twilio.com/)
   - Get Account SID and Auth Token
   - Configure WhatsApp Sandbox

2. **Configure Environment:**
   ```env
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=whatsapp:+14155238886
   ```

3. **Local Testing with ngrok:**
   ```bash
   # Install ngrok
   npm install -g ngrok

   # Start tunnel
   ngrok http 3000

   # Set webhook URL in Twilio console
   # Use: https://your-ngrok-url.ngrok.io/webhook/whatsapp
   ```

4. **Test Messages:**
   - Send text describing symptoms
   - Send voice messages
   - Use commands like `/simulate`, `/history`, `/mentor`

## 🌐 Multilingual Testing

### Sinhala (සිංහල) Testing

```bash
curl -X POST http://localhost:3000/api/diagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "උණ, හිසරදය සහ වමනය තුන් දිනක්",
    "language": "si"
  }'
```

### Tamil (தமிழ்) Testing

```bash
curl -X POST http://localhost:3000/api/diagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "காய்ச்சல், தலைவலி மற்றும் குமட்டல் மூன்று நாட்களாக",
    "language": "ta"
  }'
```

## 📊 System Status Testing

### 1. API Status

```bash
curl http://localhost:3000/api/status
```

### 2. Bot Health Checks

```bash
# WhatsApp bot health
curl http://localhost:3000/webhook/whatsapp/health

# Telegram bot health
curl http://localhost:3000/webhook/telegram/health
```

### 3. Authentication Health

```bash
curl http://localhost:3000/auth/health
```

## 🧪 Advanced Testing

### 1. Load Testing

```bash
# Install Apache Bench
# On Windows: Download from https://httpd.apache.org/download.cgi

# Test API endpoints
ab -n 100 -c 10 http://localhost:3000/health
ab -n 50 -c 5 -p diagnosis.json -T application/json http://localhost:3000/api/diagnosis
```

### 2. Error Testing

```bash
# Test invalid input
curl -X POST http://localhost:3000/api/diagnosis \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ""}'

# Test missing authentication
curl -X GET http://localhost:3000/auth/profile

# Test invalid token
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer invalid-token"
```

### 3. Voice Processing Test

```bash
# Create a test audio file (you'll need to create this manually)
# Test voice processing endpoint
curl -X POST http://localhost:3000/api/voice \
  -F "audio=@test-audio.wav" \
  -F "language=en"
```

## 🔍 Logging and Monitoring

### 1. Check Application Logs

```bash
# View real-time logs
tail -f logs/stetholink-$(date +%Y-%m-%d).log

# View error logs
tail -f logs/error.log
```

### 2. Monitor System Resources

```bash
# Check memory usage
node -e "console.log(process.memoryUsage())"

# Check uptime
node -e "console.log('Uptime:', process.uptime(), 'seconds')"
```

## 🐛 Troubleshooting

### Common Issues

1. **Server won't start:**
   - Check if port 3000 is available
   - Verify all environment variables are set
   - Check logs for specific errors

2. **AI features not working:**
   - Verify OpenAI API key is valid
   - Check API quota and billing
   - Test with simple prompts first

3. **Database connection issues:**
   - Verify Firebase credentials
   - Check internet connection
   - Ensure Firebase project is active

4. **Bot not responding:**
   - Verify bot tokens are correct
   - Check webhook URLs are accessible
   - Test with simple commands first

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=debug
npm run dev

# Or set in .env file
LOG_LEVEL=debug
```

## 📈 Performance Testing

### 1. Response Time Testing

```bash
# Test API response times
time curl http://localhost:3000/health
time curl -X POST http://localhost:3000/api/diagnosis \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "fever and headache", "language": "en"}'
```

### 2. Memory Usage Monitoring

```bash
# Monitor memory usage during testing
node -e "
const used = process.memoryUsage();
console.log('Memory usage:');
console.log('RSS:', Math.round(used.rss / 1024 / 1024), 'MB');
console.log('Heap Total:', Math.round(used.heapTotal / 1024 / 1024), 'MB');
console.log('Heap Used:', Math.round(used.heapUsed / 1024 / 1024), 'MB');
"
```

## ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] API documentation is accessible
- [ ] Medical diagnosis works in all languages
- [ ] Patient simulation works
- [ ] Authentication system works
- [ ] Telegram bot responds to commands
- [ ] WhatsApp bot responds (if configured)
- [ ] Voice processing works (if tested)
- [ ] Error handling works correctly
- [ ] Logging is working
- [ ] Database operations work
- [ ] Encryption/decryption works

## 🎯 Next Steps

After successful testing:

1. **Deploy to production:**
   - Set up production environment
   - Configure production databases
   - Set up monitoring and alerts

2. **Scale the application:**
   - Add load balancing
   - Implement caching
   - Set up CDN for static assets

3. **Enhance features:**
   - Add more medical conditions
   - Implement advanced analytics
   - Add mobile app support

---

**Happy Testing! 🏥**

For more information, see the main [README.md](README.md) file. 