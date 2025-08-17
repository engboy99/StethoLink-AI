# 🏥 StethoLink AI - Standalone App

## 🎯 What is This?

**StethoLink AI Standalone** is a Progressive Web App (PWA) that medical students can install directly on their phones! It provides a complete medical learning experience without needing an app store.

## ✨ Features

### 📚 Study Tools
- **Year-specific curriculum** (1st, 2nd, 3rd year)
- **Study plans** tailored for Sri Lankan medical students
- **Task management** for organizing learning goals
- **Progress tracking** and achievement system

### 🧮 Medical Calculators
- **BMI Calculator** with formulas and examples
- **GFR Calculator** (Cockcroft-Gault formula)
- **CHADS2 Score** for stroke risk assessment
- **Wells DVT Score** for deep vein thrombosis

### 💊 Medical Information
- **Drug information** and classifications
- **Clinical guidelines** and protocols
- **Symptom education** (for learning purposes)
- **Patient simulation** scenarios

### 📱 Mobile Experience
- **Installable** on phone home screen
- **Offline capability** after installation
- **Responsive design** for all screen sizes
- **Touch-optimized** interface

## 🚀 Quick Start

### 1. Test the App
```bash
# Run tests to ensure everything works
npm run test-standalone
```

### 2. Start the App
```bash
# Start the standalone app
npm run start-standalone
```

### 3. Install on Phone
1. **Find your computer's IP address**
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`

2. **Open phone browser** and go to:
   ```
   http://YOUR_IP:3000
   ```

3. **Install the app**:
   - **Android**: Tap menu → "Add to Home screen"
   - **iPhone**: Tap share → "Add to Home Screen"

## 🔧 Technical Details

### Architecture
- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript (ES6+)
- **PWA**: Service Worker + Web App Manifest
- **Storage**: In-memory + LocalStorage

### File Structure
```
steth/
├── src/
│   └── standalone-app.js      # Main server file
├── public/
│   ├── index.html             # Main HTML
│   ├── css/style.css          # Styles
│   ├── js/app.js              # Frontend logic
│   └── icons/                 # App icons
├── start-standalone.js        # Startup script
├── test-standalone.js         # Test script
└── package.json               # Dependencies
```

### API Endpoints
- `GET /` - Main app interface
- `POST /api/chat` - AI chat functionality
- `GET /api/user/:userId` - User profile
- `POST /api/user/:userId` - Update profile
- `GET /api/curriculum/:year` - Year-specific curriculum
- `GET /api/tools` - Available medical tools
- `GET /health` - Health check

## 📱 PWA Features

### Installation
- **Manifest**: `public/manifest.json`
- **Service Worker**: `public/sw.js`
- **Icons**: Multiple sizes for different devices
- **Offline**: Caches essential resources

### Mobile Optimization
- **Viewport**: Responsive design
- **Touch**: Optimized for touch input
- **Performance**: Fast loading and smooth animations
- **Accessibility**: Screen reader friendly

## 🧪 Testing

### Run Tests
```bash
# Test the standalone app
npm run test-standalone

# Test everything
npm test
```

### Test Coverage
- ✅ File existence checks
- ✅ Package configuration
- ✅ App code validation
- ✅ HTML structure
- ✅ CSS styles
- ✅ JavaScript functionality
- ✅ Startup script

## 🔍 Troubleshooting

### Common Issues

#### App Won't Start
```bash
# Check Node.js version (requires 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Can't Access from Phone
1. **Check IP address** - ensure correct IP
2. **Check firewall** - allow Node.js through
3. **Check network** - both devices on same WiFi
4. **Try different port** - modify in `standalone-app.js`

#### PWA Not Installing
1. **Clear browser cache**
2. **Use HTTPS** if available
3. **Check browser compatibility**
4. **Restart browser**

### Debug Mode
```bash
# Start with debug logging
DEBUG=* npm run start-standalone

# Check logs
tail -f logs/app.log
```

## 🌐 Network Configuration

### Local Network
- **Computer**: Connected to WiFi
- **Phone**: Same WiFi network
- **Access**: `http://COMPUTER_IP:3000`

### External Access (Optional)
- **Port forwarding** on router
- **Public IP address**
- **Security considerations**

## 📚 Usage Examples

### Study Session
1. **Open app** from home screen
2. **Select year** (1st, 2nd, 3rd)
3. **Choose topic** (Anatomy, Pathology, etc.)
4. **Use calculators** for practice
5. **Track progress** and tasks

### Medical Calculations
```
User: "Show me BMI calculator"
Bot: [Detailed BMI formula and examples]

User: "Calculate GFR for 65-year-old male, 70kg, creatinine 1.2"
Bot: [GFR calculation with explanation]
```

### Curriculum Planning
```
User: "What should I study in 2nd year?"
Bot: [Complete 2nd year study plan with subjects and tips]
```

## 🔒 Security & Privacy

### Data Storage
- **User data**: Stored locally on phone
- **No external databases**: Everything runs locally
- **Privacy**: No data sent to external servers

### Educational Use
- **Disclaimer**: For learning purposes only
- **Medical advice**: Always consult healthcare professionals
- **Accuracy**: Educational content, not clinical guidance

## 🚀 Future Enhancements

### Planned Features
- **Offline database** for medical information
- **Voice input** for hands-free use
- **Image recognition** for medical images
- **Collaborative study groups**
- **Progress synchronization**

### Technical Improvements
- **Database integration** (SQLite/MongoDB)
- **Real-time updates** (WebSocket)
- **Push notifications** for reminders
- **Advanced caching** strategies

## 📞 Support

### Getting Help
1. **Check this README** for solutions
2. **Run tests** to identify issues
3. **Check logs** for error details
4. **Ask community** for help

### Contributing
- **Report bugs** with detailed information
- **Suggest features** for future versions
- **Improve documentation** and guides
- **Test on different devices**

---

## 🎉 Ready to Use!

Your StethoLink AI Standalone App is ready to help medical students learn effectively! 

**Start the app**: `npm run start-standalone`  
**Test everything**: `npm run test-standalone`  
**Install on phones**: Follow the phone installation guide

**Happy coding and learning!** 👨‍⚕️👩‍⚕️💻 