const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 STETHOLINK AI - RAILWAY BACKEND DEPLOYMENT');
console.log('==============================================\n');

async function deployToRailway() {
    try {
        console.log('📋 Step 1: Checking prerequisites...\n');
        
        // Check if Railway CLI is installed
        try {
            execSync('railway --version', { stdio: 'pipe' });
            console.log('✅ Railway CLI is installed');
        } catch (error) {
            console.log('❌ Railway CLI not found');
            console.log('\n📥 Installing Railway CLI...');
            console.log('Please run this command in your terminal:');
            console.log('npm install -g @railway/cli');
            console.log('\nThen run this script again.');
            return false;
        }

        // Check if user is logged in to Railway
        try {
            execSync('railway whoami', { stdio: 'pipe' });
            console.log('✅ Logged in to Railway');
        } catch (error) {
            console.log('❌ Not logged in to Railway');
            console.log('\n🔐 Please login to Railway first:');
            console.log('railway login');
            console.log('\nThen run this script again.');
            return false;
        }

        console.log('\n📋 Step 2: Creating Railway project...\n');
        
        // Create Railway project
        try {
            console.log('Creating Railway project...');
            execSync('railway init --name stetholink-ai-backend', { stdio: 'inherit' });
            console.log('✅ Railway project created successfully');
        } catch (error) {
            console.log('❌ Failed to create Railway project');
            console.log('Trying to create without custom name...');
            try {
                execSync('railway init', { stdio: 'inherit' });
                console.log('✅ Railway project created with auto-generated name');
            } catch (error2) {
                console.log('❌ Failed to create Railway project');
                return false;
            }
        }

        console.log('\n📋 Step 3: Setting up environment variables...\n');
        
        // Check if .env file exists
        if (!fs.existsSync('.env')) {
            console.log('❌ .env file not found');
            console.log('Please create a .env file with your production credentials first.');
            console.log('You can copy from env.example and fill in your values.');
            return false;
        }

        // Read .env file and set variables on Railway
        const envContent = fs.readFileSync('.env', 'utf8');
        const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));

        console.log('Setting environment variables on Railway...');
        
        for (const line of envLines) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                if (value && value !== 'your-value-here') {
                    try {
                        console.log(`Setting ${key}...`);
                        execSync(`railway variables set ${key}="${value}"`, { stdio: 'pipe' });
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
                execSync(`railway variables set ${key}=${value}`, { stdio: 'pipe' });
                console.log(`✅ ${key}=${value} set successfully`);
            } catch (error) {
                console.log(`⚠️ Failed to set ${key}, continuing...`);
            }
        }

        console.log('\n📋 Step 4: Deploying backend to Railway...\n');
        
        try {
            execSync('git add .', { stdio: 'inherit' });
            execSync('git commit -m "Deploy backend to Railway"', { stdio: 'inherit' });
            execSync('railway up', { stdio: 'inherit' });
            console.log('✅ Backend deployed successfully to Railway');
        } catch (error) {
            console.log('❌ Deployment failed');
            console.log('Trying alternative deployment method...');
            
            try {
                execSync('railway deploy', { stdio: 'inherit' });
                console.log('✅ Backend deployed successfully to Railway (alternative method)');
            } catch (error2) {
                console.log('❌ Deployment failed completely');
                return false;
            }
        }

        console.log('\n📋 Step 5: Getting your backend URL...\n');
        
        try {
            const projectInfo = execSync('railway status', { encoding: 'utf8' });
            console.log('Project Status:');
            console.log(projectInfo);
            
            // Get the domain
            const domainInfo = execSync('railway domain', { encoding: 'utf8' });
            console.log('\nDomain Information:');
            console.log(domainInfo);
            
            console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
            console.log('=====================================');
            console.log('🌐 Your backend is now deployed on Railway!');
            console.log('📱 Your PWA URL: Your Netlify URL');
            console.log('\n📋 Step 6: Get your Railway domain...\n');
            
            console.log('🔧 NEXT STEPS:');
            console.log('1. Run: railway domain');
            console.log('2. Copy your Railway domain (e.g., https://your-app.railway.app)');
            console.log('3. Update your PWA frontend with the new backend URL');
            console.log('4. Redeploy your PWA to Netlify');
            console.log('5. Test user registration - it should work now!');
            
            // Create a configuration file for the frontend
            const frontendConfig = {
                platform: 'railway',
                timestamp: new Date().toISOString(),
                instructions: [
                    '1. Run: railway domain',
                    '2. Copy your Railway domain URL',
                    '3. Open your PWA code (app.js)',
                    '4. Find the API_BASE_URL variable',
                    '5. Change it to your Railway domain URL',
                    '6. Redeploy your PWA to Netlify'
                ]
            };
            
            fs.writeFileSync('railway-frontend-config.json', JSON.stringify(frontendConfig, null, 2));
            console.log('✅ Frontend configuration saved to: railway-frontend-config.json');
            
            return true;
            
        } catch (error) {
            console.log('⚠️ Could not get project info, but deployment was successful');
            console.log('Please check your Railway dashboard for the domain');
            return true;
        }

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        return false;
    }
}

// Run deployment if this file is executed directly
if (require.main === module) {
    deployToRailway().then(success => {
        if (success) {
            console.log('\n🎉 Backend deployment completed successfully on Railway!');
        } else {
            console.log('\n❌ Backend deployment failed. Please check the errors above.');
            process.exit(1);
        }
    });
}

module.exports = { deployToRailway }; 