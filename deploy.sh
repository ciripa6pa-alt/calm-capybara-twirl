#!/bin/bash

echo "🚀 DEPLOYMENT SCRIPT - NEXT.JS APP"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
    echo "✅ Git repository initialized"
else
    echo "📦 Git repository already exists"
fi

# Check build
echo "🔨 Testing build..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Check if .env exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local with your Supabase credentials"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - NEXTAUTH_SECRET"
    echo "   - NEXTAUTH_URL"
fi

echo ""
echo "🎯 DEPLOYMENT OPTIONS:"
echo "====================="
echo ""
echo "1️⃣  VERCEL (Recommended - Free & Easy):"
echo "   • Push to GitHub: git push origin main"
echo "   • Connect to Vercel: https://vercel.com"
echo "   • Auto-deploy on every push"
echo ""
echo "2️⃣  RAILWAY (Alternative - Free):"
echo "   • Install: npm install -g @railway/cli"
echo "   • Login: railway login"
echo "   • Deploy: railway up"
echo ""
echo "3️⃣  DOCKER (For VPS):"
echo "   • Build: docker build -t finance-app ."
echo "   • Run: docker run -p 3000:3000 finance-app"
echo ""
echo "📋 NEXT STEPS:"
echo "=============="
echo "1. Setup Supabase project (see SUPABASE_SETUP.md)"
echo "2. Add environment variables to your hosting platform"
echo "3. Deploy using your preferred method"
echo "4. Test API: /api/health"
echo ""
echo "✅ Your app is ready for deployment!"
echo "🚀 Good luck!"