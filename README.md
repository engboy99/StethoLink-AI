# 🏥 StethoLink AI

**Cross-platform multilingual medical diagnostic chatbot for WhatsApp and Telegram**

A revolutionary AI-powered medical assistant designed specifically for Sri Lankan medical students, providing intelligent diagnosis, patient simulation, and clinical education in Sinhala, Tamil, and English.

## 🌟 Features

### 🤖 Core AI Capabilities
- **Multilingual Medical Diagnosis** - GPT-4 powered diagnosis in Sinhala, Tamil, and English
- **Voice-to-Text Processing** - Whisper AI for voice message transcription
- **Patient Simulation** - Interactive virtual patient scenarios
- **Medical Education** - Tailored learning content for medical students
- **Motivational Support** - Daily encouragement and study tips

### 📱 Platform Support
- **WhatsApp Bot** - Via Twilio WhatsApp Business API
- **Telegram Bot** - Native Telegram Bot API integration
- **REST API** - Full-featured API for web/mobile apps
- **Voice Support** - Audio message processing in all languages

### 🔐 Security & Privacy
- **AES-256 Encryption** - All sensitive medical data encrypted
- **Firebase Authentication** - Secure user management
- **HIPAA Compliant** - Medical data privacy standards
- **End-to-End Security** - HTTPS encryption throughout

### 📊 Analytics & Insights
- **User Analytics** - Comprehensive usage tracking
- **Performance Metrics** - System health monitoring
- **Medical Insights** - Disease pattern analysis
- **Learning Progress** - Student performance tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase project
- OpenAI API key
- Twilio account (for WhatsApp)
- Telegram Bot Token

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/stetholink-ai.git
cd stetholink-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp env.example .env
```

4. **Configure environment variables**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# Twilio Configuration (WhatsApp)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key-here
JWT_SECRET=your-jwt-secret-key-here
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## 📱 Bot Setup

### WhatsApp Bot Setup

1. **Create Twilio Account**
   - Sign up at [Twilio Console](https://console.twilio.com/)
   - Get Account SID and Auth Token

2. **Configure WhatsApp Sandbox**
   - Go to WhatsApp > Sandbox
   - Follow instructions to join sandbox
   - Note your WhatsApp number

3. **Set Webhook URL**
   - Webhook URL: `https://your-domain.com/webhook/whatsapp`
   - Method: POST

### Telegram Bot Setup

1. **Create Telegram Bot**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Use `/newbot` command
   - Get bot token

2. **Set Webhook**
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "https://your-domain.com/webhook/telegram/<YOUR_BOT_TOKEN>"}'
   ```

## 🔌 API Documentation

### Base URL
```
https://your-domain.com/api
```

### Authentication
```bash
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

#### 🔍 Medical Diagnosis
```http
POST /api/diagnosis
Content-Type: application/json

{
  "symptoms": "fever, headache, nausea for 3 days",
  "language": "en",
  "userId": "optional-user-id"
}
```

#### 🎭 Patient Simulation
```http
POST /api/simulation
Content-Type: application/json

{
  "condition": "Dengue fever",
  "language": "en",
  "patientProfile": {
    "age": 25,
    "gender": "Male",
    "occupation": "Student",
    "location": "Colombo, Sri Lanka"
  }
}
```

#### 📚 Medical Education
```http
POST /api/education
Content-Type: application/json

{
  "topic": "Dengue fever management",
  "language": "si",
  "complexity": "student"
}
```

#### 🎓 Motivational Messages
```http
GET /api/motivation?language=en&context=daily
```

#### 👤 User Management
```http
# Register
POST /auth/register
{
  "email": "student@medical.edu.lk",
  "password": "securepassword",
  "displayName": "Medical Student",
  "language": "si",
  "platform": "whatsapp"
}

# Login
POST /auth/login
{
  "email": "student@medical.edu.lk",
  "password": "securepassword"
}
```

## 🏗️ Architecture

```
StethoLink AI/
├── src/
│   ├── server.js              # Main Express server
│   ├── config/
│   │   └── firebase.js        # Firebase configuration
│   ├── services/
│   │   ├── ai.js              # OpenAI & Whisper integration
│   │   └── scheduler.js       # Automated tasks
│   ├── bots/
│   │   ├── whatsapp.js        # WhatsApp bot handler
│   │   └── telegram.js        # Telegram bot handler
│   ├── routes/
│   │   ├── api.js             # REST API endpoints
│   │   ├── auth.js            # Authentication routes
│   │   ├── whatsapp.js        # WhatsApp webhooks
│   │   └── telegram.js        # Telegram webhooks
│   ├── middleware/
│   │   └── errorHandler.js    # Error handling
│   └── utils/
│       ├── logger.js          # Logging utility
│       └── encryption.js      # AES-256 encryption
├── logs/                      # Application logs
├── uploads/                   # File uploads
├── package.json
├── env.example
└── README.md
```

## 🚀 Deployment

### Firebase Cloud Functions

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Initialize Firebase**
```bash
firebase login
firebase init functions
```

3. **Deploy**
```bash
firebase deploy --only functions
```

### Docker Deployment

1. **Build Image**
```bash
docker build -t stetholink-ai .
```

2. **Run Container**
```bash
docker run -p 3000:3000 --env-file .env stetholink-ai
```

### Render Deployment

1. **Connect Repository**
   - Connect your GitHub repository to Render
   - Set environment variables
   - Deploy automatically

2. **Environment Variables**
   - Add all required environment variables in Render dashboard
   - Set build command: `npm install`
   - Set start command: `npm start`

## 🔧 Configuration

### Language Support
- **English (en)** - Primary language
- **Sinhala (si)** - සිංහල
- **Tamil (ta)** - தமிழ்

### AI Models
- **GPT-4 Turbo** - Medical diagnosis and education
- **Whisper AI** - Voice-to-text processing
- **Custom Prompts** - Sri Lankan medical context

### Database Collections
- `users` - User profiles and preferences
- `cases` - Medical case history
- `conversations` - Chat history
- `simulations` - Patient simulation data
- `analytics` - Usage analytics
- `voice_messages` - Voice message storage

## 📊 Monitoring

### Health Checks
```bash
# Server health
GET /health

# API health
GET /api/health

# Bot health
GET /webhook/whatsapp/health
GET /webhook/telegram/health
```

### Logs
- **Application logs**: `logs/stetholink-YYYY-MM-DD.log`
- **Error logs**: `logs/error.log`
- **Medical logs**: `logs/medical-errors.log`

### Analytics
- User engagement metrics
- Diagnosis accuracy tracking
- Platform usage statistics
- Performance monitoring

## 🔒 Security Features

### Data Encryption
- **AES-256** encryption for all sensitive data
- **JWT tokens** for authentication
- **HTTPS** encryption for all communications
- **Secure headers** with Helmet.js

### Privacy Compliance
- **HIPAA compliant** data handling
- **GDPR ready** privacy controls
- **Data anonymization** for analytics
- **Secure deletion** capabilities

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Commit changes**
```bash
git commit -m 'Add amazing feature'
```
4. **Push to branch**
```bash
git push origin feature/amazing-feature
```
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](./docs/api.md)
- [Bot Setup Guide](./docs/bots.md)
- [Deployment Guide](./docs/deployment.md)

### Contact
- **Email**: support@stetholink.ai
- **Telegram**: [@StethoLinkSupport](https://t.me/StethoLinkSupport)
- **WhatsApp**: +94 11 234 5678

### Issues
- [GitHub Issues](https://github.com/your-username/stetholink-ai/issues)
- [Feature Requests](https://github.com/your-username/stetholink-ai/issues/new)

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and Whisper AI
- **Firebase** for backend services
- **Twilio** for WhatsApp integration
- **Telegram** for bot platform
- **Sri Lankan Medical Community** for domain expertise

## 📈 Roadmap

### Phase 1 (Current)
- ✅ WhatsApp & Telegram bots
- ✅ Multilingual support
- ✅ Voice processing
- ✅ Basic diagnosis

### Phase 2 (Q2 2024)
- 🔄 Advanced patient simulations
- 🔄 Medical image analysis
- 🔄 Drug interaction checking
- 🔄 Clinical decision support

### Phase 3 (Q3 2024)
- 📋 Mobile app development
- 📋 Offline capabilities
- 📋 Advanced analytics
- 📋 Integration with hospital systems

---

**Made with ❤️ for Sri Lankan Medical Students**

*Empowering the next generation of healthcare professionals through AI* 