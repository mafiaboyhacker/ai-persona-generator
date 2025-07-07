#!/bin/bash

# GitHub Push Script with Token Authentication
echo "🚀 GitHub Push Script - AI Persona Generator"
echo ""

# Check if token is provided
if [ -z "$1" ]; then
    echo "❌ GitHub Personal Access Token required!"
    echo ""
    echo "📋 Usage:"
    echo "  ./scripts/github-push.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "🔑 How to get a token:"
    echo "  1. Go to GitHub → Settings → Developer settings"
    echo "  2. Personal access tokens → Tokens (classic)"
    echo "  3. Generate new token with 'repo' scope"
    echo "  4. Copy the token and use it here"
    echo ""
    exit 1
fi

GITHUB_TOKEN=$1

echo "📊 Checking repository status..."
git status --porcelain

echo ""
echo "📦 Recent commits:"
git log --oneline -n 3

echo ""
echo "🔄 Pushing to GitHub..."

# Push using token authentication
if git push https://${GITHUB_TOKEN}@github.com/mafiaboyhacker/ai-persona-generator.git master; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Repository: https://github.com/mafiaboyhacker/ai-persona-generator"
    echo ""
    echo "🚀 Next Steps for Deployment:"
    echo "  1. Frontend (Vercel):"
    echo "     - Go to https://vercel.com"
    echo "     - Import GitHub repository"
    echo "     - Select 'persona-frontend' folder"
    echo "     - Deploy automatically"
    echo ""
    echo "  2. Backend (Railway):"
    echo "     - Go to https://railway.app"
    echo "     - New Project → Deploy from GitHub"
    echo "     - Select repository"
    echo "     - Add environment variables:"
    echo "       * OPENAI_API_KEY"
    echo "       * FAL_AI_API_KEY"
    echo "       * FLASK_ENV=production"
    echo "       * CORS_ORIGINS=https://your-vercel-app.vercel.app"
    echo ""
    echo "  3. Update Frontend API URL:"
    echo "     - Edit persona-frontend/src/components/sections/persona-generator-section.tsx"
    echo "     - Change localhost:5000 to your Railway app URL"
    echo ""
else
    echo ""
    echo "❌ Push failed!"
    echo "💡 Possible solutions:"
    echo "  1. Check if token has 'repo' permissions"
    echo "  2. Make sure token hasn't expired"
    echo "  3. Verify repository access"
    echo ""
    exit 1
fi