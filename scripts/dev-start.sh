#!/bin/bash

# AI Persona Generator - Development Start Script
echo "🚀 Starting AI Persona Generator Development Environment..."

# Kill existing processes
echo "🔄 Stopping existing servers..."
pkill -f "python.*server.py" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Wait for processes to stop
sleep 2

# Start Flask backend in background
echo "🐍 Starting Flask backend server..."
cd "$(dirname "$0")/.."
nohup python3 server.py > logs/flask.log 2>&1 &
FLASK_PID=$!

# Start Next.js frontend in background  
echo "⚡ Starting Next.js frontend server..."
cd persona-frontend
nohup npm run dev > ../logs/nextjs.log 2>&1 &
NEXTJS_PID=$!

# Create logs directory if it doesn't exist
mkdir -p ../logs

# Wait for servers to start
echo "⏳ Waiting for servers to initialize..."
sleep 5

# Check if servers are running
if curl -s http://localhost:5000/ > /dev/null; then
    echo "✅ Flask backend running on http://localhost:5000"
else
    echo "❌ Flask backend failed to start"
fi

if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Next.js frontend running on http://localhost:3000"  
else
    echo "❌ Next.js frontend failed to start"
fi

echo ""
echo "🎯 Development environment ready!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo ""
echo "📋 Process IDs:"
echo "Flask: $FLASK_PID"
echo "Next.js: $NEXTJS_PID"
echo ""
echo "📜 Logs:"
echo "Flask: tail -f logs/flask.log"
echo "Next.js: tail -f logs/nextjs.log"
echo ""
echo "🛑 To stop all servers: ./scripts/dev-stop.sh"