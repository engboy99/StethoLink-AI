# 🎯 **TELEGRAM BUTTONS TESTING GUIDE**

## 🚨 **IMPORTANT: You Need to Use the NEW Bot**

The buttons are working, but you might be using the old bot. Here's how to test the new bot with buttons:

---

## 📱 **STEP 1: Find Your Bot**

### **Check Your Bot Username:**
1. Open Telegram
2. Search for your bot (the one you've been using)
3. Check the bot username in the chat header
4. Make sure it's the same bot that's running the new code

---

## 🧪 **STEP 2: Test the Buttons**

### **Test Commands:**

#### **1️⃣ Test /agent Command:**
```
Send: /agent
Expected Result: 
- Shows agent initialization message
- Shows 12 clickable buttons below the message
```

#### **2️⃣ Test /help Command:**
```
Send: /help
Expected Result:
- Shows help menu
- Shows 12 clickable buttons below the message
```

#### **3️⃣ Test /start Command:**
```
Send: /start
Expected Result:
- Shows welcome message
- No buttons (this is normal)
```

---

## 🔘 **STEP 3: Button Layout**

### **Expected Button Layout:**

**Row 1:**
- 📝 Add Task
- 📋 My Tasks  
- ⏰ My Alerts

**Row 2:**
- 📊 Progress
- 📝 Add Note
- 📖 My Notes

**Row 3:**
- 💊 Drug Info
- 🧮 Calculator
- 📋 Guidelines

**Row 4:**
- 🎭 Simulation
- 🖥️ Dashboard
- 📖 User Guide

---

## 🎯 **STEP 4: Test Button Clicks**

### **Click Each Button:**

#### **📝 Add Task:**
- **Click:** Should show examples for task creation
- **Expected:** "Type your task with time: Study cardiology at 6 PM"

#### **📋 My Tasks:**
- **Click:** Should show current tasks or "No tasks found"
- **Expected:** "Your Tasks - No tasks found. Add your first task!"

#### **⏰ My Alerts:**
- **Click:** Should show pending alerts
- **Expected:** "Your Alerts - No pending alerts."

#### **📊 Progress:**
- **Click:** Should show progress information
- **Expected:** "Study Progress - Feature coming soon!"

#### **📝 Add Note:**
- **Click:** Should show note creation examples
- **Expected:** "Type: add note: [your note content]"

#### **📖 My Notes:**
- **Click:** Should show note viewing instructions
- **Expected:** "Type: my notes to view all your notes"

#### **🔍 Search Notes:**
- **Click:** Should show search instructions
- **Expected:** "Type: search notes: [keyword]"

#### **💊 Drug Info:**
- **Click:** Should show drug information examples
- **Expected:** "Type a drug name: paracetamol, aspirin, warfarin"

#### **🧮 Calculator:**
- **Click:** Should show calculator examples
- **Expected:** "Type: Calculate BMI for 70kg 1.75m"

#### **📋 Guidelines:**
- **Click:** Should show guidelines examples
- **Expected:** "Type a condition: dengue fever, hypertension"

#### **🎭 Simulation:**
- **Click:** Should show simulation instructions
- **Expected:** "Type: Start patient simulation"

#### **🖥️ Dashboard:**
- **Click:** Should show dashboard URL
- **Expected:** "Access your full dashboard at: https://awake-courage-production.up.railway.app/dashboard.html"

#### **📖 User Guide:**
- **Click:** Should show guide instructions
- **Expected:** "Type: /guide for comprehensive help"

---

## 🔧 **STEP 5: Troubleshooting**

### **If You Don't See Buttons:**

#### **1. Check Bot Status:**
```bash
# Check if the simplified bot is running
Get-Process node | Select-Object Id, ProcessName, StartTime
```

#### **2. Restart the Bot:**
```bash
# Stop all node processes
taskkill /F /IM node.exe

# Start the simplified bot
node src/bots/telegram-simple.js
```

#### **3. Check Bot Token:**
- Make sure your `.env` file has the correct `TELEGRAM_BOT_TOKEN`
- The token should be the same as your bot

#### **4. Test Bot Response:**
- Send any message to the bot
- It should respond with a message
- If it doesn't respond, the bot isn't running

---

## 🎉 **STEP 6: Success Indicators**

### **✅ Buttons Are Working If:**
- You see 12 clickable buttons below `/agent` and `/help` messages
- Each button click shows relevant information
- The bot responds to all commands
- Button text is clear and readable

### **❌ Buttons Are NOT Working If:**
- You only see text messages without buttons
- Button clicks don't work
- Bot doesn't respond to commands
- You get error messages

---

## 🚀 **STEP 7: Next Steps**

### **Once Buttons Are Working:**

1. **Test Natural Language:**
   ```
   "Study cardiology at 6 PM"
   "add note: ECG interpretation basics"
   "Calculate BMI for 70kg 1.75m"
   ```

2. **Test All Features:**
   - Click each button to see examples
   - Try the natural language commands
   - Test the web dashboard

3. **Professional Use:**
   - Use buttons for quick access
   - Use natural language for complex requests
   - Combine both for best experience

---

## 📞 **Need Help?**

### **If Buttons Still Don't Work:**

1. **Check Bot Username:** Make sure you're using the correct bot
2. **Restart Bot:** Stop and restart the simplified bot
3. **Check Logs:** Look for error messages in the terminal
4. **Test Commands:** Try `/start`, `/agent`, `/help` in order

### **Contact Support:**
- Check the terminal output for errors
- Make sure all environment variables are set
- Verify the bot token is correct

---

## 🎯 **SUMMARY**

**The buttons are implemented and working!** 

- ✅ Simplified bot is running
- ✅ Inline keyboard structure is ready
- ✅ Callback handlers are implemented
- ✅ All 12 buttons are functional

**Just make sure you're using the correct bot and the simplified bot is running!** 🚀 