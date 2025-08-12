# 🚀 RAILWAY BACKEND DEPLOYMENT GUIDE - StethoLink AI

## 🎯 **PERFECT SOLUTION: No Credit Card Required!**

Railway is actually **better than Heroku** for your StethoLink AI because:
- ✅ **No credit card required**
- ✅ **Generous free tier** (500 hours/month)
- ✅ **Better performance** than Heroku free tier
- ✅ **Perfect for medical apps**
- ✅ **Automatic HTTPS**

---

## 📋 **PREREQUISITES**

### **1. Create Railway Account (FREE)**
- Go to: https://railway.app/
- Click "Start a New Project"
- Sign up with GitHub (recommended) or email
- **No credit card required!**

### **2. Install Railway CLI**
```bash
npm install -g @railway/cli
```

### **3. Login to Railway**
```bash
railway login
```

---

## 🚀 **AUTOMATED DEPLOYMENT (RECOMMENDED)**

### **Option 1: Use the Automated Script**
```bash
# Run the automated Railway deployment script
npm run deploy:railway
```

This script will:
- ✅ Check prerequisites
- ✅ Create Railway project
- ✅ Set environment variables
- ✅ Deploy backend
- ✅ Give you the backend URL

---

## 🔧 **MANUAL DEPLOYMENT (Step by Step)**

### **Step 1: Create Railway Project**
```bash
# Create a new Railway project
railway init --name stetholink-ai-backend

# Or let Railway generate a name
railway init
```

### **Step 2: Set Environment Variables**
```bash
# Set critical environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-super-secure-jwt-secret-here
railway variables set ENCRYPTION_KEY=your-32-character-encryption-key
railway variables set FIREBASE_PROJECT_ID=your-firebase-project-id
railway variables set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
railway variables set FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
railway variables set FIREBASE_CLIENT_ID=your-client-id
railway variables set FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
railway variables set FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
railway variables set FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
railway variables set FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project.iam.gserviceaccount.com

# Set AI service keys
railway variables set OPENAI_API_KEY=your-openai-api-key
railway variables set HUGGINGFACE_API_KEY=your-huggingface-api-key

# Set bot tokens
railway variables set TELEGRAM_BOT_TOKEN=your-telegram-bot-token
railway variables set TWILIO_ACCOUNT_SID=your-twilio-account-sid
railway variables set TWILIO_AUTH_TOKEN=your-twilio-auth-token

# Set other variables
railway variables set CORS_ORIGIN=https://your-netlify-app.netlify.app
railway variables set SESSION_SECRET=your-session-secret
```

### **Step 3: Deploy Backend**
```bash
# Add all files
git add .

# Commit changes
git commit -m "Deploy backend to Railway"

# Deploy to Railway
railway up

# Alternative deployment method
railway deploy
```

### **Step 4: Get Your Backend URL**
```bash
# Get your Railway domain
railway domain

# Check project status
railway status
```

---

## 🔗 **CONNECT PWA TO BACKEND**

### **Step 1: Get Your Railway Domain**
```bash
railway domain
```

Your backend URL will look like: `https://your-app.railway.app`

### **Step 2: Update PWA Frontend**
In your PWA code (app.js), find and change:
```javascript
// Change this line:
const API_BASE_URL = 'http://localhost:3000';

// To your Railway backend URL:
const API_BASE_URL = 'https://your-app.railway.app';
```

### **Step 3: Redeploy PWA to Netlify**
After updating the backend URL:
1. Commit and push your changes
2. Netlify will automatically redeploy
3. Your PWA will now work with the Railway backend!

---

## 🧪 **TEST YOUR DEPLOYMENT**

### **Test Backend Health**
```bash
# Test backend health endpoint
curl https://your-app.railway.app/health
```

### **Test User Registration**
1. Go to your PWA on Netlify
2. Try to create a new account
3. Should work without network errors now!

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **1. Build Failed**
```bash
# Check build logs
railway logs

# Common fix: Ensure package.json has correct start script
# "start": "node src/server.js"
```

#### **2. Environment Variables Not Set**
```bash
# Check current variables
railway variables

# Set missing variables
railway variables set VARIABLE_NAME=value
```

#### **3. Port Binding Error**
```bash
# Railway sets PORT automatically
# Make sure your server.js uses:
const PORT = process.env.PORT || 3000;
```

#### **4. Database Connection Issues**
```bash
# Check Firebase credentials
railway variables get FIREBASE_PROJECT_ID
railway variables get FIREBASE_CLIENT_EMAIL
```

---

## 🎉 **SUCCESS CHECKLIST**

- ✅ Backend deployed to Railway
- ✅ Environment variables set
- ✅ PWA updated with backend URL
- ✅ PWA redeployed to Netlify
- ✅ User registration working
- ✅ No more network errors

---

## 🚀 **AFTER DEPLOYMENT**

### **Monitor Your Backend**
```bash
# Check logs
railway logs

# Check status
railway status

# Check domain
railway domain
```

### **Scale if Needed**
```bash
# Railway automatically scales based on usage
# No manual scaling needed for most apps
```

---

## 💡 **NEXT STEPS**

1. **Test all features** on your live PWA
2. **Monitor backend performance** on Railway
3. **Share with medical students** in Sri Lanka
4. **Start marketing** your medical AI app
5. **Build mobile apps** for app stores

---

## 🏆 **WHY RAILWAY IS BETTER THAN HEROKU**

| Feature | Railway | Heroku |
|---------|---------|---------|
| **Credit Card** | ❌ Not Required | ✅ Required |
| **Free Tier** | 500 hours/month | 550 hours/month |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Deployment** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🎉 **CONGRATULATIONS!**

**Your StethoLink AI is now fully functional with:**
- ✅ **PWA Frontend** on Netlify (perfect for medical apps)
- ✅ **Backend API** on Railway (better than Heroku, no credit card)
- ✅ **Full functionality** working worldwide
- ✅ **No more network errors**

**You're ready to help medical students worldwide!** 🚀🏥🇱🇰 