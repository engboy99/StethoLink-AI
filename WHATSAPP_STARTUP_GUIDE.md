# 📱 **WHATSAPP ULTIMATE MEDICAL STUDENT AGENT - STARTUP GUIDE**

## 🚀 **STEP-BY-STEP STARTUP INSTRUCTIONS**

### **Step 1: Environment Setup**

1. **Check Environment Variables**
   ```bash
   # Make sure these are set in your .env file:
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=whatsapp:+14155238886
   ```

2. **Verify Environment File**
   ```bash
   # Check if .env file exists and has required variables
   cat .env | grep TWILIO
   ```

### **Step 2: Start the Server**

1. **Stop any existing Node.js processes**
   ```bash
   # Windows
   taskkill /F /IM node.exe
   
   # Or PowerShell
   Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

2. **Start the server**
   ```bash
   node src/server.js
   ```

3. **Verify server is running**
   ```bash
   # Check if port 3000 is active
   netstat -ano | findstr :3000
   
   # Or visit in browser
   https://awake-courage-production.up.railway.app
   ```

### **Step 3: WhatsApp Bot Configuration**

1. **Twilio WhatsApp Setup**
   - Go to [Twilio Console](https://console.twilio.com/)
   - Navigate to Messaging > Try it out > Send a WhatsApp message
   - Get your WhatsApp number (usually +14155238886)

2. **Webhook Configuration**
   - In Twilio Console, go to Messaging > Settings > WhatsApp sandbox
   - Set webhook URL to: `https://your-domain.com/whatsapp`
   - For local testing: Use ngrok or similar service

3. **Test Webhook**
   ```bash
   # Test webhook endpoint
   curl -X GET https://awake-courage-production.up.railway.app/whatsapp
   ```

### **Step 4: WhatsApp Testing**

#### **Initial Setup:**
1. **Open WhatsApp** on your phone
2. **Find your Twilio WhatsApp number** (usually +14155238886)
3. **Send `start`** - Bot will ask for your name
4. **Provide your name** - e.g., "Imesha Udayangani"
5. **See welcome message** - Personalized greeting
6. **See 16-number menu** - All features available

#### **Testing Menu Options:**
1. **Type `1`** - Test Add Task feature
2. **Type `2`** - Test My Tasks feature
3. **Type `3`** - Test My Alerts feature
4. **Type `4`** - Test Progress tracking
5. **Type `5`** - Test Add Note feature
6. **Type `6`** - Test My Notes feature
7. **Type `7`** - Test Drug Info feature
8. **Type `8`** - Test Calculator feature
9. **Type `9`** - Test Guidelines feature
10. **Type `10`** - Test Simulation feature
11. **Type `11`** - Test Research feature
12. **Type `12`** - Test Image Analysis feature
13. **Type `13`** - Test Emergency feature
14. **Type `14`** - Test Education feature
15. **Type `15`** - Test Dashboard feature
16. **Type `16`** - Test Help feature

#### **Testing Natural Language:**
1. **"Study cardiology at 6 PM tomorrow"** - Add task
2. **"add note: ECG interpretation basics"** - Add note
3. **"Calculate BMI for 70kg 1.75m"** - BMI calculator
4. **"drug: paracetamol"** - Drug information
5. **"Start patient simulation"** - Start simulation
6. **"research: diabetes management"** - Research assistant
7. **"guidelines: hypertension"** - Clinical guidelines

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues and Solutions:**

#### **1. Server Not Starting**
```bash
# Check if port 3000 is already in use
netstat -ano | findstr :3000

# Kill process using port 3000
taskkill /PID <PID> /F

# Start server again
node src/server.js
```

#### **2. Environment Variables Missing**
```bash
# Check .env file
cat .env

# If missing, create or update .env file
echo "TWILIO_ACCOUNT_SID=your-sid" >> .env
echo "TWILIO_AUTH_TOKEN=your-token" >> .env
echo "TWILIO_PHONE_NUMBER=whatsapp:+14155238886" >> .env
```

#### **3. WhatsApp Bot Not Responding**
- Check if Twilio credentials are correct
- Verify webhook URL is accessible
- Check server logs for errors
- Ensure WhatsApp number is correct

#### **4. Webhook Not Working**
```bash
# Test webhook endpoint
curl -X POST https://awake-courage-production.up.railway.app/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"Body":"start","From":"whatsapp:+1234567890"}'
```

---

## 📱 **EXPECTED CONVERSATION FLOW**

### **Initial Conversation:**
```
You: start
Bot: 🏥 Welcome to StethoLink AI!

I'm Dr. StethoLink, your AI medical assistant for Sri Lankan medical students.

Before we begin, I'd like to know your name:

Please reply with your name (e.g., "Imesha Udayangani" or just "Imesha") so I can address you properly as Dr. [Your Name].

You: Imesha Udayangani
Bot: 🎉 Welcome, Dr. Imesha Udayangani!

Your AI medical assistant is now personalized and ready to be your best friend throughout your medical journey!

I can help you with:
• 📝 Task Management - Add tasks with smart reminders
• 📊 Study Progress - Track your learning journey
• 📝 Note Taking - Interactive medical notes
• 💊 Drug Database - Sri Lankan drug information
• 🧮 Medical Calculators - BMI, GFR, CHADS2, etc.
• 📋 Clinical Guidelines - Evidence-based medicine
• 🎭 Patient Simulations - Practice real cases
• 🔬 Research Assistant - Literature search & analysis
• 🖼️ Image Analysis - X-ray, ECG, CT, MRI interpretation
• 🎯 Practice Cases - Real-world scenarios
• 🏥 Emergency Support - Critical care guidance
• 📚 Medical Education - Comprehensive learning

Let's get started! Type a number or use natural language commands!

🏥 StethoLink AI - Dr. Imesha Udayangani

Main Menu - Choose an option:

📝 Task Management
1. Add Task - "Study cardiology at 6 PM"
2. My Tasks - View all tasks
3. My Alerts - Check reminders

📊 Study Tools
4. Progress - Track study progress
5. Add Note - "add note: ECG basics"
6. My Notes - View all notes

💊 Medical Tools
7. Drug Info - "drug: paracetamol"
8. Calculator - "Calculate BMI for 70kg 1.75m"
9. Guidelines - "guidelines: hypertension"

🎭 Advanced Features
10. Simulation - "Start patient simulation"
11. Research - "research: diabetes"
12. Image Analysis - "Analyze chest X-ray"

🏥 Support
13. Emergency - Emergency protocols
14. Education - Medical education
15. Dashboard - Web dashboard
16. Help - Show this menu

Type the number or use natural language commands!
```

---

## 🎯 **QUICK START COMMANDS**

### **Windows PowerShell:**
```powershell
# Stop existing processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Start server
node src/server.js

# Check if running
netstat -ano | findstr :3000
```

### **Linux/Mac:**
```bash
# Stop existing processes
pkill -f node

# Start server
node src/server.js

# Check if running
lsof -i :3000
```

---

## 🎊 **SUCCESS INDICATORS**

### ✅ **WhatsApp Bot is Working If:**
- ✅ Bot responds to `start` command
- ✅ Bot asks for your name
- ✅ Bot addresses you as "Dr. [Your Name]"
- ✅ Bot shows 16-number menu
- ✅ Each number (1-16) shows relevant information
- ✅ Bot responds to natural language commands
- ✅ Bot provides Sri Lankan medical context
- ✅ Bot offers emergency training modules
- ✅ Bot provides clinical procedures training
- ✅ Bot tracks achievements and progress
- ✅ Bot manages research projects
- ✅ Bot handles clinical cases
- ✅ Bot provides exam schedule and study planning

---

## 🚀 **FINAL STATUS**

**🎯 ENHANCED WHATSAPP ULTIMATE MEDICAL STUDENT AGENT STATUS: ✅ READY**

- ✅ **WhatsApp Bot** - Running with 16-number menu
- ✅ **Year-Specific Features** - 1st-5th year curriculum
- ✅ **Sri Lankan Context** - Local medical practices
- ✅ **Emergency Training** - CPR, ACLS, ATLS modules
- ✅ **Clinical Procedures** - Comprehensive training
- ✅ **Achievement Tracking** - Gamification system
- ✅ **Research Projects** - Management system
- ✅ **Clinical Cases** - Case management
- ✅ **Exam Schedule** - Study planning
- ✅ **Natural Language** - Processing ready
- ✅ **Menu Navigation** - 16 options available

**🚀 Your enhanced WhatsApp ultimate medical student agent is ready to revolutionize medical education in Sri Lanka! 🎓**

**This is the first-ever comprehensive AI medical student agent for WhatsApp!**

**🇱🇰 Specifically designed for Sri Lankan medical students at the highest level!** 🎊

---

## 📞 **SUPPORT & CONTACT**

### **Technical Support:**
- Check terminal logs for errors
- Verify environment variables
- Ensure WhatsApp webhook is configured
- Test all features systematically

### **User Support:**
- Comprehensive user guides
- Feature documentation
- Troubleshooting guides
- Best practices

**🎊 Congratulations! Your enhanced WhatsApp ultimate medical student agent is ready to amaze everyone! 🎊** 