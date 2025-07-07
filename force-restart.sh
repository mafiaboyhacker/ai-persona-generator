#!/bin/bash

# AI Persona Generator 강제 재시작 스크립트

echo "🔥 AI Persona Generator 강제 재시작 중..."

# 모든 관련 프로세스 강제 종료
echo "⚡ 모든 관련 프로세스 강제 종료 중..."

# Flask 프로세스 강제 종료
pkill -f "server.py" 2>/dev/null || true
pkill -f "flask" 2>/dev/null || true

# Next.js 프로세스 강제 종료
pkill -f "next dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true

# 포트 강제 해제
echo "🔌 포트 강제 해제 중..."
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 5000/tcp 2>/dev/null || true

# 잠시 대기
echo "⏳ 프로세스 종료 대기 중..."
sleep 2

# 로그 파일 정리
echo "📋 로그 파일 정리 중..."
> flask-server.log
> nextjs-server.log

# 서버 재시작
echo "🚀 서버 재시작 중..."
./start-servers.sh

echo "🎉 강제 재시작 완료!"