# 🚀 HEROKU BACKEND DEPLOYMENT GUIDE - StethoLink AI

## 🎯 **PROBLEM SOLVED: PWA Network Error**

Your PWA is working perfectly on Netlify, but it's getting network errors because there's no backend server running. This guide will deploy your Node.js backend to Heroku and fix the issue.

---

## 📋 **PREREQUISITES**

### **1. Install Heroku CLI**
```bash
npm install -g heroku
```

### **2. Create Heroku Account**
- Go to: https://signup.heroku.com/
- Sign up with your email
- Verify your account

### **3. Login to Heroku**
```bash
heroku login
```

---

## 🚀 **AUTOMATED DEPLOYMENT (RECOMMENDED)**

### **Option 1: Use the Automated Script**
```bash
# Run the automated deployment script
node deploy-heroku-backend.js
```

This script will:
- ✅ Check prerequisites
- ✅ Create Heroku app
- ✅ Set environment variables
- ✅ Deploy backend
- ✅ Give you the backend URL

---

## 🔧 **MANUAL DEPLOYMENT (Step by Step)**

### **Step 1: Create Heroku App**
```bash
# Create a new Heroku app
heroku create stetholink-ai-backend

# Or let Heroku generate a name
heroku create
```

### **Step 2: Set Environment Variables**
```bash
# Set critical environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secure-jwt-secret-here
heroku config:set ENCRYPTION_KEY=your-32-character-encryption-key
heroku config:set FIREBASE_PROJECT_ID=your-firebase-project-id
heroku config:set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
heroku config:set FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
heroku config:set FIREBASE_CLIENT_ID=your-client-id
heroku config:set FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
heroku config:set FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
heroku config:set FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
heroku config:set FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project.iam.gserviceaccount.com

# Set AI service keys
heroku config:set OPENAI_API_KEY=your-openai-api-key
heroku config:set HUGGINGFACE_API_KEY=your-huggingface-api-key

# Set bot tokens
heroku config:set TELEGRAM_BOT_TOKEN=your-telegram-bot-token
heroku config:set TWILIO_ACCOUNT_SID=your-twilio-account-sid
heroku config:set TWILIO_AUTH_TOKEN=your-twilio-auth-token

# Set other variables
heroku config:set CORS_ORIGIN=https://your-netlify-app.netlify.app
heroku config:set SESSION_SECRET=your-session-secret
```

### **Step 3: Deploy Backend**
```bash
# Add all files
git add .

# Commit changes
git commit -m "Deploy backend to Heroku"

# Deploy to Heroku
git push heroku main

# If main branch doesn't work, try master
git push heroku master
```

### **Step 4: Verify Deployment**
```bash
# Check app status
heroku ps

# Open app in browser
heroku open

# Check logs
heroku logs --tail
```

---

## 🔗 **CONNECT PWA TO BACKEND**

### **Step 1: Get Your Backend URL**
```bash
# Get your Heroku app URL
heroku info
```

Your backend URL will look like: `https://your-app-name.herokuapp.com`

### **Step 2: Update PWA Frontend**
In your PWA code (app.js), find and change:
```javascript
// Change this line:
const API_BASE_URL = 'https://awake-courage-production.up.railway.app';

// To your Heroku backend URL:
const API_BASE_URL = 'https://your-app-name.herokuapp.com';
```

### **Step 3: Redeploy PWA to Netlify**
After updating the backend URL:
1. Commit and push your changes
2. Netlify will automatically redeploy
3. Your PWA will now work with the Heroku backend!

---

## 🧪 **TEST YOUR DEPLOYMENT**

### **Test Backend Health**
```bash
# Test backend health endpoint
curl https://your-app-name.herokuapp.com/health
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
heroku logs --tail

# Common fix: Ensure Procfile exists
echo "web: node src/server.js" > Procfile
```

#### **2. Environment Variables Not Set**
```bash
# Check current config
heroku config

# Set missing variables
heroku config:set VARIABLE_NAME=value
```

#### **3. Port Binding Error**
```bash
# Heroku sets PORT automatically
# Make sure your server.js uses:
const PORT = process.env.PORT || 3000;
```

#### **4. Database Connection Issues**
```bash
# Check Firebase credentials
heroku config:get FIREBASE_PROJECT_ID
heroku config:get FIREBASE_CLIENT_EMAIL
```

---

## 🎉 **SUCCESS CHECKLIST**

- ✅ Backend deployed to Heroku
- ✅ Environment variables set
- ✅ PWA updated with backend URL
- ✅ PWA redeployed to Netlify
- ✅ User registration working
- ✅ No more network errors

---

## 🚀 **AFTER DEPLOYMENT**

### **Monitor Your Backend**
```bash
# Check performance
heroku logs --tail

# Monitor dyno usage
heroku ps

# Check app info
heroku info
```

### **Scale if Needed**
```bash
# Scale to more dynos for better performance
heroku ps:scale web=2
```

---

## 💡 **NEXT STEPS**

1. **Test all features** on your live PWA
2. **Monitor backend performance** on Heroku
3. **Share with medical students** in Sri Lanka
4. **Start marketing** your medical AI app
5. **Build mobile apps** for app stores

---

## 🏆 **CONGRATULATIONS!**

**Your StethoLink AI is now fully functional with:**
- ✅ **PWA Frontend** on Netlify (perfect for medical apps)
- ✅ **Backend API** on Heroku (scalable and reliable)
- ✅ **Full functionality** working worldwide
- ✅ **No more network errors**

**You're ready to help medical students worldwide!** 🚀🏥🇱🇰 