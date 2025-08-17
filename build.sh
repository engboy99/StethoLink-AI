#!/bin/bash

echo "🚀 Building StethoLink AI for production..."

# Ensure public directory exists
if [ ! -d "public" ]; then
    echo "❌ Public directory not found!"
    exit 1
fi

# List contents of public directory
echo "📁 Public directory contents:"
ls -la public/

# Verify key files exist
echo "🔍 Verifying key files..."
if [ -f "public/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing"
    exit 1
fi

if [ -f "public/manifest.json" ]; then
    echo "✅ manifest.json found"
else
    echo "❌ manifest.json missing"
    exit 1
fi

if [ -f "public/sw.js" ]; then
    echo "✅ service worker found"
else
    echo "❌ service worker missing"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📱 StethoLink AI is ready for deployment!" 