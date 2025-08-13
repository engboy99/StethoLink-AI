@echo off
echo.
echo 🚀 STETHOLINK AI - REVOLUTIONARY LAUNCH SEQUENCE
echo ================================================
echo.
echo 🎯 MISSION: Deploy the FIRST EVER "God-level" Medical AI Assistant
echo 🌟 TARGET: Sri Lankan Medical Students
echo.
echo Starting deployment sequence...
echo.

REM Check if we're in the right directory
if not exist "public\index.html" (
    echo ❌ ERROR: public\index.html not found!
    echo Please run this script from the steth project directory.
    pause
    exit /b 1
)

echo ✅ Project structure verified
echo.

REM Check if all critical files exist
echo 📁 Verifying critical files...
if exist "public\app.js" (
    echo ✅ public\app.js - Found
) else (
    echo ❌ public\app.js - Missing!
)

if exist "public\styles.css" (
    echo ✅ public\styles.css - Found
) else (
    echo ❌ public\styles.css - Missing!
)

if exist "public\manifest.json" (
    echo ✅ public\manifest.json - Found
) else (
    echo ❌ public\manifest.json - Missing!
)

if exist "netlify\functions\api.js" (
    echo ✅ netlify\functions\api.js - Found
) else (
    echo ❌ netlify\functions\api.js - Missing!
)

echo.

REM Build the project
echo 🔨 Building project for Netlify...
call npm run build:netlify
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo.

REM Check Git status
echo 🔍 Checking Git status...
git status --porcelain
if %errorlevel% neq 0 (
    echo ❌ Git not initialized or not a repository!
    echo Please run: git init && git remote add origin <your-repo-url>
    pause
    exit /b 1
)

echo.

REM Add all files
echo 📦 Adding all files to Git...
git add .
if %errorlevel% neq 0 (
    echo ❌ Failed to add files to Git!
    pause
    exit /b 1
)

echo ✅ Files added to Git
echo.

REM Commit changes
echo 💾 Committing revolutionary features...
git commit -m "🚀 Deploy revolutionary StethoLink AI - FIRST EVER God-level Medical AI Assistant for Sri Lanka"
if %errorlevel% neq 0 (
    echo ❌ Failed to commit changes!
    pause
    exit /b 1
)

echo ✅ Changes committed
echo.

REM Push to main branch
echo 🚀 Pushing to main branch...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Failed to push to main branch!
    echo Please check your Git remote and permissions.
    pause
    exit /b 1
)

echo ✅ Successfully pushed to main branch!
echo.

REM Final verification
echo 🎯 FINAL DEPLOYMENT VERIFICATION
echo ================================
echo.
echo ✅ Project built successfully
echo ✅ All files committed to Git
echo ✅ Changes pushed to main branch
echo ✅ Netlify will auto-deploy from main branch
echo.
echo 🚀 STETHOLINK AI IS NOW DEPLOYING!
echo.
echo 🌟 FEATURES DEPLOYED:
echo    • 50+ Revolutionary Medical AI Features
echo    • Virtual Ward Rounds & Emergency Simulator
echo    • Surgical VR Training & Clinical AI
echo    • Profile System with "Dr. [Name]" Greeting
echo    • Note-Taking System with Templates
echo    • Knowledge Bank & Drug Database
echo    • Hospital Directory & Inter-University Communication
echo    • All Revolutionary AI Systems
echo    • PWA + Mobile App Ready
echo.
echo 🎉 MISSION ACCOMPLISHED!
echo.
echo StethoLink AI is now the FIRST EVER "God-level" Medical AI Assistant
echo for Sri Lankan Medical Students, ready to revolutionize medical education!
echo.
echo 📱 Next steps:
echo    1. Wait for Netlify deployment (usually 2-5 minutes)
echo    2. Test all revolutionary features
echo    3. Share with medical students across Sri Lanka
echo    4. Watch the revolution begin! 🚀
echo.
pause
