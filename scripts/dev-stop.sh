#!/bin/bash

# AI Persona Generator - Development Stop Script
echo "🛑 Stopping AI Persona Generator Development Environment..."

# Stop Flask backend
echo "🐍 Stopping Flask backend..."
pkill -f "python.*server.py" && echo "✅ Flask backend stopped" || echo "❌ Flask backend not running"

# Stop Next.js frontend
echo "⚡ Stopping Next.js frontend..."
pkill -f "next dev" && echo "✅ Next.js frontend stopped" || echo "❌ Next.js frontend not running"

# Stop any remaining Node processes
pkill -f "node.*next" 2>/dev/null || true

echo ""
echo "🏁 Development environment stopped!"
echo "All servers have been terminated."