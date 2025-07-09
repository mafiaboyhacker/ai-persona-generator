# Render.com 배포 가이드

## 🚀 배포 준비사항

### GitHub 저장소
- **Repository**: `https://github.com/mafiaboyhacker/ai-persona-generator`
- **Branch**: `master`
- **Root Directory**: `persona-frontend`

### 환경 변수
```bash
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_api_token_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 실제 API 키 값 (Render.com 설정 시 사용)
- OpenAI API Key: `.env` 파일에서 확인
- Replicate API Token: `.env` 파일에서 확인
- HuggingFace API Key: `.env` 파일에서 확인

## 📋 배포 단계

### 1. Render.com 계정 생성
1. https://render.com 접속
2. "Get Started" 클릭
3. GitHub 계정으로 로그인
4. 권한 승인

### 2. 웹 서비스 생성
1. 대시보드에서 "New +" 클릭
2. "Web Service" 선택
3. "Build and deploy from a Git repository" 선택
4. GitHub 저장소 연결

### 3. 서비스 설정
```
Name: persona-frontend-ai
Region: Oregon (US West)
Branch: master
Root Directory: persona-frontend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Plan: Free
```

### 4. 환경 변수 설정
위의 환경 변수들을 하나씩 추가

### 5. 배포 시작
"Create Web Service" 클릭

## 🔍 배포 후 확인사항

### 테스트 URL
- **메인 페이지**: `https://persona-frontend-ai.onrender.com`
- **API 테스트**: `https://persona-frontend-ai.onrender.com/api/test`
- **페르소나 생성**: `https://persona-frontend-ai.onrender.com/api/generate-complete-persona`

### 예상 응답
```json
{
  "message": "API is working",
  "timestamp": "2025-07-09T17:30:00.000Z",
  "env": {
    "hasOpenAI": true,
    "hasReplicate": true,
    "hasHuggingFace": true
  }
}
```

## 🎯 장점

- ✅ **무제한 실행 시간**: 이미지 생성 문제 해결
- ✅ **자동 HTTPS**: SSL 인증서 자동 설정
- ✅ **무료 플랜**: 500시간/월 무료
- ✅ **자동 배포**: GitHub 푸시 시 자동 배포
- ✅ **실시간 로그**: 배포 및 런타임 로그 확인