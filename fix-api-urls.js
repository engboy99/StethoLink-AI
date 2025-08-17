const fs = require('fs');
const path = require('path');

// Read the app.js file
const appJsPath = path.join(__dirname, 'public', 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

// Replace all Netlify function URLs with Railway backend URLs
content = content.replace(/\/\.netlify\/functions\/api/g, 'https://awake-courage-production.up.railway.app/api');
content = content.replace(/\/\.netlify\/functions\/auth/g, 'https://awake-courage-production.up.railway.app/auth');

// Write the updated content back
fs.writeFileSync(appJsPath, content, 'utf8');

console.log('✅ API URLs updated successfully!');
console.log('🔗 Now pointing to Railway backend: https://awake-courage-production.up.railway.app');
