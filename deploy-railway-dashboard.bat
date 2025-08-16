@echo off
echo 🚀 STETHOLINK AI - RAILWAY DASHBOARD DEPLOYMENT
echo ==============================================
echo.

echo 📋 Opening Railway Dashboard...
start https://railway.com/project/adf4d3f4-f0c8-4a29-a47d-0a5aeb5d88ab

echo.
echo 🎯 DEPLOYMENT STEPS:
echo 1. Login to Railway dashboard
echo 2. Click on 'awake-courage' service
echo 3. Click 'Deploy' button
echo 4. Select 'Deploy from GitHub'
echo 5. Choose repository: engboy99/StethoLink-AI
echo 6. Wait for deployment to complete
echo.

echo 📱 Alternative: Connect GitHub for auto-deploy
echo    - Go to Settings → GitHub
echo    - Connect your repository
echo    - Enable auto-deploy on push
echo.

echo ✅ Environment variables are already set:
echo    - PORT=3000
echo    - NODE_ENV=production
echo    - JWT_SECRET=set
echo    - ENCRYPTION_KEY=set
echo    - RAILWAY_START_COMMAND=npm run railway:start
echo.

echo 🚨 If CLI deployment fails, dashboard deployment will work!
echo.

pause
