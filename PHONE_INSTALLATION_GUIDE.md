# 📱 Phone Installation Guide for StethoLink AI

## 🎯 Quick Start (5 minutes)

### Step 1: Start the App on Your Computer
```bash
# Navigate to the project folder
cd steth

# Install dependencies (if not already done)
npm install

# Start the standalone app
npm run start-standalone
```

### Step 2: Find Your Computer's IP Address
- **Windows**: Open Command Prompt and type `ipconfig`
- **Mac/Linux**: Open Terminal and type `ifconfig` or `ip addr`
- Look for your local IP (usually starts with `192.168.` or `10.0.`)

### Step 3: Install on Your Phone
1. **Open your phone's browser** (Chrome, Safari, etc.)
2. **Go to**: `http://YOUR_COMPUTER_IP:3000`
   - Example: `http://192.168.1.100:3000`
3. **Tap "Add to Home Screen"** or **"Install App"**
4. **Enjoy your new medical assistant!** 🎉

---

## 🔧 Detailed Installation Steps

### Prerequisites
- ✅ Node.js 18+ installed on your computer
- ✅ Computer and phone on the same WiFi network
- ✅ Modern smartphone (iOS 11+ or Android 8+)

### Computer Setup

#### 1. Install Node.js
- Download from [nodejs.org](https://nodejs.org/)
- Choose LTS version (18.x or higher)
- Verify installation: `node --version`

#### 2. Clone/Download Project
```bash
# If using git
git clone <repository-url>
cd steth

# Or download and extract ZIP file
cd steth
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Start the App
```bash
npm run start-standalone
```

You should see:
```
🏥 StethoLink AI Standalone App
================================

✅ Node.js version: v18.17.0

🔍 Checking required files...
   ✅ src/standalone-app.js
   ✅ public/index.html
   ✅ public/css/style.css
   ✅ public/js/app.js

📦 Checking dependencies...
   ✅ Found 25 dependencies

🚀 Starting StethoLink AI Standalone App...

🚀 StethoLink AI Standalone App running on port 3000
📱 Access on your phone: https://awake-courage-production.up.railway.app
🔗 PWA ready for installation
📚 Simple AI system initialized
```

---

## 📱 Phone Installation Methods

### Method 1: Chrome (Android)
1. Open Chrome browser
2. Navigate to `http://YOUR_IP:3000`
3. Tap the **three dots menu** (⋮)
4. Select **"Add to Home screen"**
5. Tap **"Add"**

### Method 2: Safari (iPhone/iPad)
1. Open Safari browser
2. Navigate to `http://YOUR_IP:3000`
3. Tap the **share button** (📤)
4. Select **"Add to Home Screen"**
5. Tap **"Add"**

### Method 3: Samsung Internet (Android)
1. Open Samsung Internet
2. Navigate to `http://YOUR_IP:3000`
3. Tap the **menu button** (☰)
4. Select **"Add page to"**
5. Choose **"Home screen"**

---

## 🌐 Network Configuration

### Same Network Setup
- **Computer**: Connected to WiFi network
- **Phone**: Connected to the same WiFi network
- **Router**: Allows local network communication

### Firewall Settings
- **Windows**: Allow Node.js through Windows Firewall
- **Mac**: Allow incoming connections for Node.js
- **Linux**: Check `ufw` or `iptables` settings

### Port Forwarding (Optional)
If you want to access from outside your network:
- Router admin panel → Port Forwarding
- Forward port 3000 to your computer's IP
- Use your public IP address

---

## 🚀 Features Available on Phone

### 📚 Study Tools
- **Year-specific curriculum** (1st, 2nd, 3rd year)
- **Study plans** with Sri Lankan context
- **Task management** for learning goals
- **Progress tracking** and achievements

### 🧮 Medical Calculators
- **BMI Calculator** with formulas
- **GFR Calculator** (Cockcroft-Gault)
- **CHADS2 Score** for stroke risk
- **Wells DVT Score** for thrombosis

### 💊 Medical Information
- **Drug information** and classifications
- **Clinical guidelines** and protocols
- **Symptom education** (learning purposes)
- **Patient simulation** scenarios

### 📱 Mobile Features
- **Offline capability** after installation
- **Home screen icon** for quick access
- **Responsive design** for all screen sizes
- **Touch-optimized** interface

---

## 🔍 Troubleshooting

### App Won't Start
```bash
# Check Node.js version
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm run start-standalone
```

### Can't Access from Phone
1. **Check IP address**: Make sure you're using the correct IP
2. **Check firewall**: Allow Node.js through firewall
3. **Check network**: Ensure both devices on same WiFi
4. **Try different port**: Change port in `standalone-app.js`

### PWA Not Installing
1. **Clear browser cache** and try again
2. **Use HTTPS** (if available) for better PWA support
3. **Check browser compatibility** (Chrome/Safari recommended)
4. **Restart browser** and try again

### Performance Issues
1. **Close other apps** on phone
2. **Check WiFi signal** strength
3. **Restart the app** on computer
4. **Clear browser data** on phone

---

## 📚 Usage Tips

### Daily Study Routine
1. **Morning**: Check today's tasks and study plan
2. **Study sessions**: Use medical calculators and tools
3. **Evening**: Review progress and plan tomorrow

### Offline Study
- **Install the app** when you have internet
- **Use offline** for study sessions
- **Sync data** when back online

### Collaboration
- **Share study plans** with classmates
- **Compare progress** and achievements
- **Group study sessions** using the app

---

## 🆘 Support

### Common Issues
- **App not loading**: Check computer is running and accessible
- **Can't install**: Try different browser or clear cache
- **Features not working**: Ensure all dependencies installed

### Getting Help
1. **Check this guide** for solutions
2. **Review error messages** in computer terminal
3. **Ask classmates** who have successfully installed
4. **Contact support** if issues persist

---

## 🎉 Success!

Once installed, you'll have:
- 🏥 **Medical AI Assistant** on your phone
- 📚 **Study tools** for Sri Lankan curriculum
- 🧮 **Medical calculators** at your fingertips
- 💊 **Drug information** for learning
- 📱 **Professional app** experience

**Happy studying, future doctors!** 👨‍⚕️👩‍⚕️

---

*Last updated: December 2024*
*Version: 1.0* 