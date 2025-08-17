@echo off
echo 🚀 STETHOLINK AI - QUICK RAILWAY DEPLOYMENT
echo =============================================
echo.

echo 📋 Step 1: Checking Railway CLI...
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI not found. Installing...
    npm install -g @railway/cli
    echo ✅ Railway CLI installed
) else (
    echo ✅ Railway CLI found
)

echo.
echo 📋 Step 2: Checking Railway login...
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Not logged in to Railway
    echo 🔐 Please login to Railway:
    railway login
    echo.
    echo After login, run this script again.
    pause
    exit /b 1
) else (
    echo ✅ Logged in to Railway
)

echo.
echo 📋 Step 3: Creating Railway project...
railway init --name stetholink-ai-backend
if %errorlevel% neq 0 (
    echo ❌ Failed to create project with custom name, trying auto-name...
    railway init
)

echo.
echo 📋 Step 4: Setting environment variables...
echo ⚠️  IMPORTANT: You need to set these environment variables in Railway dashboard:
echo.
echo Go to your Railway project dashboard and set these variables:
echo - NODE_ENV=production
echo - PORT=3000
echo - JWT_SECRET=your-secret
echo - ENCRYPTION_KEY=your-key
echo - FIREBASE_PROJECT_ID=your-project-id
echo - And all other variables from railway-env-template.txt
echo.

echo 📋 Step 5: Deploying to Railway...
git add .
git commit -m "Deploy to Railway - $(date /t)"
railway up

echo.
echo 🎉 DEPLOYMENT COMPLETE!
echo.
echo Your backend URL will be shown in Railway dashboard.
echo Update your Netlify frontend with the new backend URL.
echo.
pause
