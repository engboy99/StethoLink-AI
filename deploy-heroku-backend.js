const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 STETHOLINK AI - HEROKU BACKEND DEPLOYMENT');
console.log('=============================================\n');

async function deployToHeroku() {
    try {
        console.log('📋 Step 1: Checking prerequisites...\n');
        
        // Check if Heroku CLI is installed
        try {
            execSync('heroku --version', { stdio: 'pipe' });
            console.log('✅ Heroku CLI is installed');
        } catch (error) {
            console.log('❌ Heroku CLI not found');
            console.log('\n📥 Installing Heroku CLI...');
            console.log('Please run this command in your terminal:');
            console.log('npm install -g heroku');
            console.log('\nThen run this script again.');
            return false;
        }

        // Check if user is logged in to Heroku
        try {
            execSync('heroku auth:whoami', { stdio: 'pipe' });
            console.log('✅ Logged in to Heroku');
        } catch (error) {
            console.log('❌ Not logged in to Heroku');
            console.log('\n🔐 Please login to Heroku first:');
            console.log('heroku login');
            console.log('\nThen run this script again.');
            return false;
        }

        console.log('\n📋 Step 2: Creating Heroku app...\n');
        
        // Create Heroku app
        const appName = `stetholink-ai-${Date.now()}`;
        console.log(`Creating Heroku app: ${appName}`);
        
        try {
            execSync(`heroku create ${appName}`, { stdio: 'inherit' });
            console.log('✅ Heroku app created successfully');
        } catch (error) {
            console.log('❌ Failed to create Heroku app');
            console.log('Trying to create without custom name...');
            try {
                execSync('heroku create', { stdio: 'inherit' });
                console.log('✅ Heroku app created with auto-generated name');
            } catch (error2) {
                console.log('❌ Failed to create Heroku app');
                return false;
            }
        }

        // Get the app name
        let appNameOutput;
        try {
            appNameOutput = execSync('heroku info -s', { encoding: 'utf8' });
            const appNameMatch = appNameOutput.match(/app_name=([^\n]+)/);
            const actualAppName = appNameMatch ? appNameMatch[1] : 'unknown';
            console.log(`📱 Heroku app name: ${actualAppName}`);
        } catch (error) {
            console.log('⚠️ Could not determine app name, continuing...');
        }

        console.log('\n📋 Step 3: Setting up environment variables...\n');
        
        // Check if .env file exists
        if (!fs.existsSync('.env')) {
            console.log('❌ .env file not found');
            console.log('Please create a .env file with your production credentials first.');
            console.log('You can copy from env.example and fill in your values.');
            return false;
        }

        // Read .env file and set variables on Heroku
        const envContent = fs.readFileSync('.env', 'utf8');
        const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

        console.log('Setting environment variables on Heroku...');
        
        for (const line of envLines) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                if (value && value !== 'your-value-here') {
                    try {
                        console.log(`Setting ${key}...`);
                        execSync(`heroku config:set ${key}="${value}"`, { stdio: 'pipe' });
                        console.log(`✅ ${key} set successfully`);
                    } catch (error) {
                        console.log(`⚠️ Failed to set ${key}, continuing...`);
                    }
                } else {
                    console.log(`⚠️ Skipping ${key} (placeholder value)`);
                }
            }
        }

        // Set additional production variables
        const additionalVars = {
            'NODE_ENV': 'production',
            'PORT': '3000'
        };

        for (const [key, value] of Object.entries(additionalVars)) {
            try {
                execSync(`heroku config:set ${key}=${value}`, { stdio: 'pipe' });
                console.log(`✅ ${key}=${value} set successfully`);
            } catch (error) {
                console.log(`⚠️ Failed to set ${key}, continuing...`);
            }
        }

        console.log('\n📋 Step 4: Deploying backend to Heroku...\n');
        
        try {
            execSync('git add .', { stdio: 'inherit' });
            execSync('git commit -m "Deploy backend to Heroku"', { stdio: 'inherit' });
            execSync('git push heroku main', { stdio: 'inherit' });
            console.log('✅ Backend deployed successfully to Heroku');
        } catch (error) {
            console.log('❌ Deployment failed');
            console.log('Trying alternative deployment method...');
            
            try {
                execSync('git push heroku master', { stdio: 'inherit' });
                console.log('✅ Backend deployed successfully to Heroku (master branch)');
            } catch (error2) {
                console.log('❌ Deployment failed completely');
                return false;
            }
        }

        console.log('\n📋 Step 5: Getting your backend URL...\n');
        
        try {
            const appInfo = execSync('heroku info -s', { encoding: 'utf8' });
            const webUrlMatch = appInfo.match(/web_url=([^\n]+)/);
            const webUrl = webUrlMatch ? webUrlMatch[1] : 'unknown';
            
            console.log('🎉 DEPLOYMENT SUCCESSFUL!');
            console.log('=====================================');
            console.log(`🌐 Your backend URL: ${webUrl}`);
            console.log(`📱 Your PWA URL: ${process.env.NETLIFY_URL || 'Your Netlify URL'}`);
            console.log('\n📋 Step 6: Update your PWA frontend...\n');
            
            // Create a configuration file for the frontend
            const frontendConfig = {
                backendUrl: webUrl,
                timestamp: new Date().toISOString(),
                instructions: [
                    '1. Open your PWA code (app.js)',
                    '2. Find the API_BASE_URL variable',
                    '3. Change it to your backend URL above',
                    '4. Redeploy your PWA to Netlify'
                ]
            };
            
            fs.writeFileSync('frontend-config.json', JSON.stringify(frontendConfig, null, 2));
            console.log('✅ Frontend configuration saved to: frontend-config.json');
            
            console.log('\n🔧 NEXT STEPS:');
            console.log('1. Copy your backend URL above');
            console.log('2. Update your PWA frontend with the new backend URL');
            console.log('3. Redeploy your PWA to Netlify');
            console.log('4. Test user registration - it should work now!');
            
            return true;
            
        } catch (error) {
            console.log('⚠️ Could not get app info, but deployment was successful');
            console.log('Please check your Heroku dashboard for the app URL');
            return true;
        }

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        return false;
    }
}

// Run deployment if this file is executed directly
if (require.main === module) {
    deployToHeroku().then(success => {
        if (success) {
            console.log('\n🎉 Backend deployment completed successfully!');
        } else {
            console.log('\n❌ Backend deployment failed. Please check the errors above.');
            process.exit(1);
        }
    });
}

module.exports = { deployToHeroku }; 