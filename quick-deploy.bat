@echo off
echo.
echo ========================================
echo 🚀 STETHOLINK AI - QUICK DEPLOYMENT
echo ========================================
echo.

echo 📁 Checking current directory...
if not exist "public" (
    echo ❌ ERROR: public folder not found!
    echo Please run 'npm run build' first
    pause
    exit /b 1
)

echo ✅ Public folder found
echo.

echo 🔧 Setting up Git repository...
if exist ".git" (
    echo ℹ️  Git repository already exists
) else (
    git init
    echo ✅ Git repository initialized
)

echo.
echo 📝 Adding all files to Git...
git add .
echo ✅ Files added to Git

echo.
echo 💾 Creating initial commit...
git commit -m "🚀 StethoLink AI - Production Ready Medical AI System"
echo ✅ Initial commit created

echo.
echo ========================================
echo 🎯 NEXT STEPS:
echo ========================================
echo.
echo 1. Go to https://github.com
echo 2. Create new repository: stetholink-ai
echo 3. Make it PUBLIC
echo 4. Don't initialize with README
echo 5. Copy the repository URL
echo.
echo 6. Run these commands (replace YOUR_USERNAME):
echo    git remote add origin https://github.com/YOUR_USERNAME/stetholink-ai.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 7. Deploy to Netlify:
echo    - Go to https://netlify.com
echo    - New site from Git
echo    - Choose GitHub + stetholink-ai
echo    - Build: npm run build
echo    - Publish: public
echo.
echo ========================================
echo 🎉 Your medical AI will be live in 10 minutes!
echo ========================================
echo.
pause
