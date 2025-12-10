export const API_CONFIG = {
  // 백엔드 개발시 이곳에 실제 서버 주소를 입력하세요.
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  
  // API 엔드포인트 경로
  ENDPOINTS: {
    ANALYZE_IMAGE: '/ingredients/analyze',
    GENERATE_RECIPES: '/recipes/generate',
    GENERATE_IMAGE: '/recipes/image'
  },

  // true일 경우: 브라우저 내부에서 Gemini API를 직접 호출 (데모/개발용)
  // false일 경우: 위 BASE_URL로 실제 HTTP 요청 전송 (배포/연동용)
  USE_MOCK_SERVER: true 
};