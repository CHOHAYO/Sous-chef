# SousChef 배포용 프로젝트 설명서

요청하신 배포 관점 설명서입니다. 로컬에서는 동작 확인되었다고 하셨으니, 실제 배포 시 체크해야 할 구조와 보완점 위주로 정리했습니다.

## 1. 프로젝트 개요
- 역할: 사진에서 재료를 추출하고(Gemini Vision), 난이도별로 코스를 추천하며, 완성 이미지도 생성하는 풀스택 앱.
- 프레임워크: React + Vite(프론트), Express(백엔드).
- 주요 의존성: @google/genai, lucide-react(아이콘), tailwindcss v4, TypeScript.

## 2. 디렉터리 / 주요 파일
- `App.tsx`: 전체 UI 조립.
- `components/`: 입력/카드/모달 컴포넌트.
- `services/apiService.ts`: 프론트 → 백엔드 HTTP 호출.
- `services/config.ts`: API 베이스 URL 및 USE_MOCK_SERVER 플래그.
- `services/geminiService.ts`: 프론트가 직접 Gemini를 호출할 때 사용(현재 기본 경로는 백엔드).
- `services/backendLogic.ts`: 백엔드 로직 모듈(비즈니스 로직 분리용).
- `server.js`: Express 서버, `/api/ingredients/analyze`, `/api/recipes/generate`, `/api/recipes/image`.
- `types.ts`: 공용 타입. *(난이도 문자열이 깨진 상태라 수정 필요)*
- `vite.config.ts`: 5173 개발 서버 + `/api` 프록시, env 매핑.
- `.env.local`: 로컬 환경 변수(프론트 `VITE_API_URL`, 백엔드 `GEMINI_API_KEY`, `PORT`).

## 3. 실행 흐름 (배포 기준)
- 프론트: Vite로 빌드 → 정적 자산(`dist/`). 현재 Express가 정적 파일을 서빙하지 않으므로 별도 호스팅(S3+CloudFront, Vercel 등) 또는 Express에 정적 서빙 추가 필요.
- 백엔드: `server.js` 단독 실행. `.env.local`에서 `GEMINI_API_KEY`, `PORT` 사용. `@google/genai`로 Gemini 호출.
- 통신: 프론트는 `API_CONFIG.BASE_URL`(기본 `http://localhost:8080/api`)로 백엔드 REST 호출.

## 4. 환경 변수 (민감정보는 .env에만)
```
# 프론트
VITE_API_URL=<백엔드 API 베이스 예: https://your-domain/api>
# 프론트에서 직접 Gemini를 호출할 경우에만 필요
VITE_GEMINI_API_KEY=<필요 시 별도 선언>

# 백엔드
GEMINI_API_KEY=<실제 키>
PORT=8080
```
- git에 .env를 올리지 않도록 유지.
- `services/backendLogic.ts`는 `process.env.API_KEY`를 참조하고 있어 실제 키(`GEMINI_API_KEY`)와 불일치. 백엔드 로직 통합 시 변수명 정리 필요.
- 프론트 `geminiService.ts`는 `VITE_GEMINI_API_KEY`를 기대하지만 현재 .env에는 없음(백엔드 경유만 쓸 경우 영향 없음).

## 5. 로컬 실행 절차(확인 완료된 흐름)
```
npm install
npm run server      # 백엔드(8080)
npm run dev         # 프론트(5173, /api 프록시)
```
빌드:
```
npm run build       # Vite 정적 빌드(dist/)
npm run preview     # 정적 미리보기
```

## 6. 배포 체크리스트
- 프론트 배포
  - `npm run build` 후 `dist/`를 정적 호스팅.
  - 또는 Express에 `app.use(express.static('dist'))`와 SPA용 `/*` 핸들러 추가해서 단일 서버로 배포.
  - `VITE_API_URL`을 배포 도메인에 맞게 설정.
- 백엔드 배포
  - `npm run server` 실행을 위한 프로세스 매니저(pm2 등) 적용 권장.
  - `GEMINI_API_KEY`를 배포 환경 변수에 등록.
  - CORS: 현재 `cors()` 기본 허용. 배포 시 허용 도메인 화이트리스트로 좁히는 것 권장.
- 네트워크/보안
  - 이미지 업로드가 base64 대용량일 수 있으니 리버스 프록시/로드밸런서의 바디 사이즈 제한 확인.
  - 로그에 키/개인정보가 남지 않도록 확인.

## 7. 현재 발견된 보완/주의 사항
- 문자열 인코딩 깨짐: 여러 파일(README, server.js 콘솔 출력, 텍스트 상수 등)이 UTF-8이 아닌 상태로 깨져 있음. 배포 전 UTF-8 재저장 필요(특히 사용자 메시지/응답).
- 환경 변수 불일치:
  - `backendLogic.ts` → `process.env.API_KEY` 사용: `.env`의 `GEMINI_API_KEY`와 다름.
  - `types.ts`, 컴포넌트 내 난이도 문자열이 깨져 있어 API 응답 검증/프론트 state와 불일치 위험.
  - 프론트 `geminiService.ts`는 `VITE_GEMINI_API_KEY`를 기대하지만 `.env.local`에는 없음(향후 직접 호출 시 추가 필요).
- 배포 스크립트 부재: Express가 정적 자산을 서빙하지 않아 프론트/백엔드 분리 배포가 기본 전제. 단일 서버 배포를 원하면 정적 서빙 라우트 추가 필요.
- 테스트/모니터링 없음: 최소한의 헬스체크(`/api/health` 외) 및 오류 로깅/알림 체계 필요.
- 모델명/요청 스키마 하드코딩: `gemini-2.5-flash` 문자열 반복. 설정화하거나 버전 업 대비 추상화 필요.

## 8. 권장 다음 작업
1) 인코딩을 UTF-8로 통일하고 깨진 한글/프랑스어 문자열 수정.
2) 환경 변수 키 통일(`GEMINI_API_KEY` 하나로) 및 타입/상수의 난이도 문자열 수정.
3) 단일 서버 배포 시 Express에 정적 서빙 라우트 추가(또는 프론트 전용 호스팅 선택).
4) CORS 허용 도메인 제한 및 로그/키 마스킹 검토.
5) 간단한 통합 테스트(재료 → 레시피 → 이미지 흐름)와 헬스체크 추가.

이 문서를 기준으로 배포 준비를 하면 됩니다. 추가 세부 가이드가 필요하면 알려주세요.
