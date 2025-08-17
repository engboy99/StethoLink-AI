@echo off
echo 🚀 Building StethoLink AI for production...

REM Ensure public directory exists
if not exist "public" (
    echo ❌ Public directory not found!
    exit /b 1
)

REM List contents of public directory
echo 📁 Public directory contents:
dir public

REM Verify key files exist
echo 🔍 Verifying key files...
if exist "public\index.html" (
    echo ✅ index.html found
) else (
    echo ❌ index.html missing
    exit /b 1
)

if exist "public\manifest.json" (
    echo ✅ manifest.json found
) else (
    echo ❌ manifest.json missing
    exit /b 1
)

if exist "public\sw.js" (
    echo ✅ service worker found
) else (
    echo ❌ service worker missing
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📱 StethoLink AI is ready for deployment! 