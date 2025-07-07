#!/bin/bash

# AI Persona Generator 서버 종료 스크립트

echo "⏹️ AI Persona Generator 서버 종료 중..."

# 실행 중인 서버 프로세스 확인
FLASK_PROCESSES=$(ps aux | grep -E "python3.*server.py" | grep -v grep)
NEXTJS_PROCESSES=$(ps aux | grep -E "next.*dev" | grep -v grep)

if [ ! -z "$FLASK_PROCESSES" ]; then
    echo "🐍 Flask 서버 프로세스 종료 중..."
    echo "$FLASK_PROCESSES"
    ps aux | grep -E "python3.*server.py" | grep -v grep | awk '{print $2}' | xargs kill -9
    echo "✅ Flask 서버 종료 완료"
else
    echo "ℹ️ Flask 서버가 실행 중이 아닙니다"
fi

if [ ! -z "$NEXTJS_PROCESSES" ]; then
    echo "⚛️ Next.js 서버 프로세스 종료 중..."
    echo "$NEXTJS_PROCESSES"
    ps aux | grep -E "next.*dev" | grep -v grep | awk '{print $2}' | xargs kill -9
    echo "✅ Next.js 서버 종료 완료"
else
    echo "ℹ️ Next.js 서버가 실행 중이 아닙니다"
fi

# 포트 확인
sleep 2
REMAINING_PROCESSES=$(ps aux | grep -E "(server.py|next.*dev)" | grep -v grep)

if [ -z "$REMAINING_PROCESSES" ]; then
    echo "🎉 모든 서버가 성공적으로 종료되었습니다"
else
    echo "⚠️ 일부 프로세스가 여전히 실행 중입니다:"
    echo "$REMAINING_PROCESSES"
fi

echo ""
echo "🔄 서버 재시작: ./start-servers.sh"