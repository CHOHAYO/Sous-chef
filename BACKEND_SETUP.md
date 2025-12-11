# SousChef 백엔드 구성 완료 가이드

## ✨ 프로젝트 구조 업데이트

### 새로 추가된 파일들:
- ✅ `server.js` - Express 백엔드 서버 (포트 8080)
- ✅ `.env.local` - 환경 변수 설정
- ✅ `README.md` - 업데이트된 프로젝트 문서

### 업데이트된 파일들:
- ✅ `package.json` - 백엔드 의존성 추가 (express, cors, dotenv)
- ✅ `services/config.ts` - `USE_MOCK_SERVER: false` (백엔드 API 사용)
- ✅ `services/geminiService.ts` - 주석 추가 및 정리

### 유지된 파일들:
- ✅ `App.tsx` - 모든 프론트엔드 로직 유지
- ✅ `types.ts` - 타입 정의 유지
- ✅ `services/apiService.ts` - 유연한 API 호출 로직
- ✅ `services/backendLogic.ts` - 비즈니스 로직 보존
- ✅ 모든 컴포넌트 파일 유지

---

## 🚀 빠른 시작

### 1단계: 의존성 설치
```bash
npm install
```

### 2단계: Gemini API Key 설정
`.env.local` 파일 수정:
```
GEMINI_API_KEY=your_actual_gemini_api_key
```

### 3단계: 백엔드 서버 실행 (필수)
```bash
# 새로운 터미널에서:
npm run server
```
✅ 서버가 `http://localhost:8080` 에서 실행됨

### 4단계: 프론트엔드 개발 서버 실행
```bash
# 다른 터미널에서:
npm run dev
```
✅ 브라우저에서 주소 열기 (보통 `http://localhost:5173`)

---

## 🏗️ 아키텍처 설명

```
┌─────────────────────────────────────────────────────────┐
│ 브라우저 (React + Vite 프론트엔드)                     │
│ ├─ App.tsx (UI 로직)                                   │
│ ├─ components/ (컴포넌트들)                            │
│ └─ services/apiService.ts (API 호출)                  │
└──────────────┬──────────────────────────────────────────┘
               │ HTTP/JSON
               ▼
┌─────────────────────────────────────────────────────────┐
│ Node.js 백엔드 (Express 서버 @ localhost:8080)         │
│ ├─ server.js (메인 서버)                               │
│ ├─ POST /api/ingredients/analyze (이미지 분석)        │
│ ├─ POST /api/recipes/generate (레시피 생성)           │
│ └─ POST /api/recipes/image (이미지 생성)              │
└──────────────┬──────────────────────────────────────────┘
               │ API Call
               ▼
┌─────────────────────────────────────────────────────────┐
│ Google Gemini API                                       │
│ (AI 모델을 통한 요청 처리)                             │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 API 엔드포인트 목록

### 1️⃣ 이미지 분석
```
POST http://localhost:8080/api/ingredients/analyze

요청:
{
  "image": "base64_encoded_image_string"
}

응답:
{
  "ingredients": ["계란", "양파", "파프리카", "우유"]
}
```

### 2️⃣ 레시피 생성
```
POST http://localhost:8080/api/recipes/generate

요청:
{
  "ingredients": ["계란", "양파", "파프리카"],
  "difficulty": "Prêt-à-Porter"
}

응답:
{
  "recipes": [
    {
      "name": "크리미한 계란 파프리카 전골",
      "description": "부드러운 계란과 아삭한 파프리카의 조화",
      "cookingTime": "20분",
      "difficulty": "Prêt-à-Porter",
      "calories": "280kcal",
      "ingredients": ["계란 2개", "파프리카 1개", "양파 반개", "버터 1큰술"],
      "missingIngredients": ["크림", "화이트 와인"],
      "instructions": [
        "파프리카와 양파를 곱게 채썬다",
        "버터에 파프리카를 2분 볶는다",
        "계란을 풀어 넣고 부드럽게 저어준다"
      ],
      "platingTip": "흰 접시에 계란을 중앙에 모아 높이감을 주고, 파프리카로 옆면을 장식한다"
    }
  ]
}
```

### 3️⃣ 이미지 생성
```
POST http://localhost:8080/api/recipes/image

요청:
{
  "recipeName": "크리미한 계란 파프리카 전골",
  "description": "부드러운 계란과 아삭한 파프리카의 조화"
}

응답:
{
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA..."
}
```

---

## 🔧 개발 모드 전환

### 로컬 테스트 (Gemini API 직접 호출)
`services/config.ts`:
```typescript
USE_MOCK_SERVER: true  // 백엔드 없이 브라우저에서 직접 처리
```

### 프로덕션/API 연동 (권장)
`services/config.ts`:
```typescript
USE_MOCK_SERVER: false  // 백엔드 서버를 통해 처리
```

---

## 📦 패키지 설명

### 프론트엔드 의존성
- `react`: UI 라이브러리
- `vite`: 번들러 및 개발 서버
- `typescript`: 타입 안정성
- `lucide-react`: 아이콘 라이브러리
- `@google/genai`: Gemini API 클라이언트 (로컬 모드에서만 사용)

### 백엔드 의존성
- `express`: 웹 서버 프레임워크
- `cors`: 크로스 오리진 리소스 공유
- `dotenv`: 환경 변수 관리
- `@google/genai`: Gemini API 클라이언트 (서버에서 사용)

### 개발 의존성
- `nodemon`: 파일 변경 시 자동 재시작
- `@types/express`: Express TypeScript 타입

---

## ⚙️ 환경 변수 설정

`.env.local` 파일:
```
# 프론트엔드 API 주소
VITE_API_URL=http://localhost:8080/api

# Gemini API Key (서버에서만 사용)
GEMINI_API_KEY=your_actual_key_here

# 서버 포트 (선택사항, 기본값: 8080)
PORT=8080
```

⚠️ **보안 주의:**
- `.env.local` 파일은 **Git에 커밋하지 마세요**
- 프로덕션에서는 서버 환경 변수로 API Key를 설정하세요
- 클라이언트 측에서 API Key를 노출하지 마세요

---

## 🐛 문제 해결

### ❌ "Cannot GET /api/recipes/generate"
**원인:** 백엔드 서버가 실행되지 않음
**해결:** `npm run server` 또는 `npm run server:dev` 실행

### ❌ "CORS 오류"
**원인:** 백엔드에서 CORS 설정 미흡
**해결:** 백엔드의 `cors()` 미들웨어 확인 및 재시작

### ❌ "API_KEY is not defined"
**원인:** `.env.local`에 `GEMINI_API_KEY` 미설정
**해결:** `.env.local` 파일에 실제 API Key 입력

### ❌ "Port 8080 is already in use"
**원인:** 다른 프로세스가 포트 사용 중
**해결:** `PORT=3000 npm run server` (다른 포트로 실행)

---

## ✅ 구성 완료 체크리스트

- [x] Express 백엔드 서버 생성
- [x] 3개 API 엔드포인트 구현
- [x] Gemini API 연동
- [x] CORS 설정
- [x] 환경 변수 관리
- [x] 프론트엔드 API 설정 업데이트
- [x] 문서 작성
- [x] 기존 프론트엔드 코드 100% 유지

---

## 📝 라이선스

MIT

---

## 🤝 기여

프로젝트 개선 사항이 있으면 이슈를 등록해주세요!

---

**2024년 준비 완료** ✨
