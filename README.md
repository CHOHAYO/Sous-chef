<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Ka2siyNwaESDtwmGo-lC4CTTzWbGNU72

## Prerequisites
- Node.js (v16 이상)
- Gemini API Key (Google AI Studio에서 발급)

## Run Locally

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일에서 `GEMINI_API_KEY`를 설정하세요:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 백엔드 서버 실행 (필수)

**새로운 터미널 창에서:**
```bash
npm run server
```
또는 개발 모드 (자동 재시작):
```bash
npm run server:dev
```

서버는 `http://localhost:8080`에서 실행됩니다.

### 4. 프론트엔드 개발 서버 실행 (다른 터미널 창에서)

```bash
npm run dev
```

그 후 브라우저에서 제시된 주소(일반적으로 `http://localhost:5173`)를 열면 됩니다.

## 프로젝트 구조

### Backend (Express Server)
- `server.js` - 메인 백엔드 서버
- `services/backendLogic.ts` - 비즈니스 로직 (서버 환경용)
- API 엔드포인트:
  - `POST /api/ingredients/analyze` - 이미지에서 식재료 추출
  - `POST /api/recipes/generate` - 레시피 생성
  - `POST /api/recipes/image` - 레시피 이미지 생성

### Frontend (React + Vite)
- `App.tsx` - 메인 애플리케이션 컴포넌트
- `services/apiService.ts` - 백엔드 API 호출 관리
- `services/config.ts` - API 설정 (USE_MOCK_SERVER: false)
- `types.ts` - TypeScript 타입 정의

## 개발 워크플로우

### 로컬 개발 모드
1. 백엔드 서버 실행: `npm run server:dev`
2. 프론트엔드 개발 서버 실행: `npm run dev`
3. 코드 수정 시 자동으로 반영됨

### API 모드 전환

**로컬 Gemini API 직접 호출** (USE_MOCK_SERVER: true):
```typescript
// services/config.ts에서 변경
USE_MOCK_SERVER: true
```
이 경우 백엔드 서버를 실행할 필요가 없습니다.

**백엔드 서버를 통한 API 호출** (USE_MOCK_SERVER: false):
```typescript
// services/config.ts에서 변경
USE_MOCK_SERVER: false
```
백엔드 서버가 반드시 실행되어야 합니다.

## API 문서

### 1. 이미지 분석 API
```
POST /api/ingredients/analyze

Request:
{
  "image": "base64_encoded_image_string"
}

Response:
{
  "ingredients": ["계란", "양파", "파프리카"]
}
```

### 2. 레시피 생성 API
```
POST /api/recipes/generate

Request:
{
  "ingredients": ["계란", "양파", "파프리카"],
  "difficulty": "Prêt-à-Porter" | "Atelier" | "Haute Couture"
}

Response:
{
  "recipes": [
    {
      "name": "요리명",
      "description": "설명",
      "cookingTime": "30분",
      "difficulty": "Prêt-à-Porter",
      "calories": "300kcal",
      "ingredients": ["계란", "양파"],
      "missingIngredients": ["소금"],
      "instructions": ["단계1", "단계2"],
      "platingTip": "플레이팅 팁"
    }
  ]
}
```

### 3. 이미지 생성 API
```
POST /api/recipes/image

Request:
{
  "recipeName": "요리명",
  "description": "요리 설명"
}

Response:
{
  "imageUrl": "data:image/png;base64,..."
}
```

## 배포

### Vercel (프론트엔드)
```bash
npm run build
```

### Render/Heroku (백엔드)
환경 변수에서 `GEMINI_API_KEY` 설정 후 배포

## 문제 해결

### CORS 오류
백엔드 서버가 실행 중인지 확인하세요. (`http://localhost:8080`)

### API_KEY 오류
`.env.local` 파일의 `GEMINI_API_KEY`가 올바르게 설정되었는지 확인하세요.

### 포트 충돌
기본 포트 변경: 
```bash
PORT=3000 npm run server
```

## 라이선스

MIT
