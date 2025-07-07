#!/bin/bash

# AI Persona Generator 서버 시작 스크립트

echo "🚀 AI Persona Generator 서버 시작 중..."

# 기존 프로세스 종료
echo "📋 기존 서버 프로세스 확인 및 종료..."
ps aux | grep -E "(server.py|next.*dev)" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null

# 잠시 대기
sleep 2

# 현재 디렉토리 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📁 작업 디렉토리: $SCRIPT_DIR"

# Flask 서버 시작 (포트 5000)
echo "🐍 Flask 서버 시작 중... (포트 5000)"
cd "$SCRIPT_DIR"
nohup python3 server.py > flask-server.log 2>&1 &
FLASK_PID=$!
echo "✅ Flask 서버 PID: $FLASK_PID"

# Next.js 서버 시작 (포트 3000 고정)
echo "⚛️ Next.js 서버 시작 중... (포트 3000)"
cd "$SCRIPT_DIR/persona-frontend"
nohup npm run dev -- --port 3000 > ../nextjs-server.log 2>&1 &
NEXTJS_PID=$!
echo "✅ Next.js 서버 PID: $NEXTJS_PID"

# 서버 시작 확인
echo "⏳ 서버 시작 대기 중..."
sleep 5

# 포트 확인
echo "🔍 서버 상태 확인..."
FLASK_PORT=$(lsof -i :5000 2>/dev/null | grep LISTEN | wc -l)
NEXTJS_PORT=$(ps aux | grep "next.*dev" | grep -v grep | wc -l)

if [ $FLASK_PORT -gt 0 ]; then
    echo "✅ Flask 서버: http://localhost:5000 - 실행 중"
else
    echo "❌ Flask 서버 시작 실패"
fi

if [ $NEXTJS_PORT -gt 0 ]; then
    # Next.js 포트 번호 확인
    NEXT_PORT=$(tail -n 20 ../nextjs-server.log | grep "Local:" | grep -o ":[0-9]*" | sed 's/://')
    if [ ! -z "$NEXT_PORT" ]; then
        echo "✅ Next.js 서버: http://localhost:$NEXT_PORT - 실행 중"
    else
        echo "✅ Next.js 서버: 포트 확인 중... (로그를 확인하세요)"
    fi
else
    echo "❌ Next.js 서버 시작 실패"
fi

# 로그 파일 안내
echo ""
echo "📋 로그 파일 위치:"
echo "   Flask: $SCRIPT_DIR/flask-server.log"
echo "   Next.js: $SCRIPT_DIR/nextjs-server.log"
echo ""
echo "📊 실시간 로그 보기:"
echo "   Flask: tail -f $SCRIPT_DIR/flask-server.log"
echo "   Next.js: tail -f $SCRIPT_DIR/nextjs-server.log"
echo ""
echo "🔄 서버 재시작: $SCRIPT_DIR/start-servers.sh"
echo "⏹️ 서버 종료: $SCRIPT_DIR/stop-servers.sh"
echo ""
echo "🎉 서버 시작 완료!"