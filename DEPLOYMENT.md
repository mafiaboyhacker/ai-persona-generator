# 🚀 AI Persona Generator 배포 가이드

## 📋 배포 순서

### 1. GitHub에 코드 푸시

```bash
# Personal Access Token 생성 후
./scripts/github-push.sh YOUR_GITHUB_TOKEN
```

### 2. 프론트엔드 배포 (Vercel)

1. **Vercel 계정 생성/로그인**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 생성**
   - "New Project" 클릭
   - GitHub 저장소 선택: `ai-persona-generator`
   - **Root Directory 설정**: `persona-frontend` 선택
   - Framework Preset: Next.js (자동 감지)

3. **환경 변수 설정**
   - 프로젝트 설정 → Environment Variables
   - 필요시 추가 (현재는 클라이언트 사이드만)

4. **배포**
   - "Deploy" 클릭
   - 자동 빌드 및 배포
   - 도메인 확인: `https://your-app.vercel.app`

### 3. 백엔드 배포 (Railway)

1. **Railway 계정 생성/로그인**
   - https://railway.app 접속
   - GitHub 계정으로 로그인

2. **프로젝트 생성**
   - "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - `ai-persona-generator` 저장소 선택

3. **환경 변수 설정** (중요!)
   ```
   OPENAI_API_KEY=your_openai_api_key
   FAL_AI_API_KEY=your_fal_ai_api_key
   FLASK_ENV=production
   PORT=5000
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```

4. **배포 설정**
   - Start Command: `python server.py`
   - Railway가 자동으로 requirements.txt 설치
   - 도메인 확인: `https://your-app.railway.app`

### 4. 프론트엔드-백엔드 연결

1. **API URL 업데이트**
   ```bash
   # persona-frontend/src/components/sections/persona-generator-section.tsx 수정
   # localhost:5000 → https://your-railway-app.railway.app
   ```

2. **Vercel 재배포**
   - 변경사항 푸시하면 자동 재배포

## 🔧 환경별 설정

### 개발 환경
```bash
# 로컬 서버 시작
./scripts/dev-start.sh

# 접속
Frontend: http://localhost:3000
Backend: http://localhost:5000
```

### 프로덕션 환경
```bash
# 환경 변수 확인
Frontend: https://your-app.vercel.app
Backend: https://your-app.railway.app
```

## 🔑 필수 API 키

### OpenAI API
- https://platform.openai.com/api-keys
- GPT-4 모델 접근 권한 필요

### Fal.ai API  
- https://fal.ai/dashboard
- FLUX 이미지 생성 모델 사용

## 📝 배포 체크리스트

- [ ] GitHub Personal Access Token 생성
- [ ] 코드 GitHub에 푸시 완료
- [ ] Vercel 프론트엔드 배포 완료
- [ ] Railway 백엔드 배포 완료
- [ ] 환경 변수 모두 설정 완료
- [ ] API URL 프로덕션으로 변경 완료
- [ ] CORS 설정 프로덕션 도메인 추가 완료
- [ ] 전체 기능 테스트 완료

## 🚨 문제 해결

### CORS 오류
```bash
# Railway 환경 변수에 추가
CORS_ORIGINS=https://your-vercel-app.vercel.app,https://custom-domain.com
```

### API 키 오류
```bash
# Railway 환경 변수 확인
OPENAI_API_KEY=sk-...
FAL_AI_API_KEY=...
```

### 빌드 실패
```bash
# Next.js 빌드 오류 시
npm run build --verbose

# Python 의존성 오류 시  
pip install -r requirements.txt
```

## 📞 지원

- 개발 문서: README.md
- 문제 신고: GitHub Issues
- 로그 확인: Railway/Vercel 대시보드