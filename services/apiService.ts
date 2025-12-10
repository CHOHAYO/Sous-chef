import { API_CONFIG } from './config';
import * as BackendLogic from './backendLogic';
import { 
  DifficultyLevel, 
  GeneratedRecipes, 
  GenerateRecipesRequest, 
  GenerateRecipesResponse,
  AnalyzeImageRequest,
  AnalyzeImageResponse,
  GenerateImageRequest,
  GenerateImageResponse
} from '../types';

/**
 * [Frontend Developer Note]
 * UI 컴포넌트는 이 파일의 함수들을 호출하여 데이터를 가져옵니다.
 * API_CONFIG.USE_MOCK_SERVER 값에 따라 실제 백엔드 API를 호출하거나
 * 내부 로직(BackendLogic)을 실행하여 모의 응답을 받습니다.
 */

// 1. 이미지 분석 서비스
export const analyzeImage = async (base64Image: string): Promise<string[]> => {
  if (API_CONFIG.USE_MOCK_SERVER) {
    // Mock Mode: 직접 로직 수행
    return BackendLogic.extractIngredientsFromImageLogic(base64Image);
  } else {
    // Real API Mode
    const requestBody: AnalyzeImageRequest = { image: base64Image };
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE_IMAGE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) throw new Error('API Error');
    const data: AnalyzeImageResponse = await response.json();
    return data.ingredients;
  }
};

// 2. 레시피 생성 서비스
export const getRecipes = async (ingredients: string[], difficulty: DifficultyLevel): Promise<GeneratedRecipes> => {
  if (API_CONFIG.USE_MOCK_SERVER) {
    // Mock Mode
    return BackendLogic.generateRecipesLogic(ingredients, difficulty);
  } else {
    // Real API Mode
    const requestBody: GenerateRecipesRequest = { ingredients, difficulty };
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE_RECIPES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error('API Error');
    const data: GenerateRecipesResponse = await response.json();
    return { recipes: data.recipes };
  }
};

// 3. 요리 이미지 생성 서비스
export const getRecipeImage = async (recipeName: string, description: string): Promise<string | null> => {
  if (API_CONFIG.USE_MOCK_SERVER) {
    // Mock Mode
    return BackendLogic.generateRecipeImageLogic(recipeName, description);
  } else {
    // Real API Mode
    const requestBody: GenerateImageRequest = { recipeName, description };
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE_IMAGE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error('API Error');
    const data: GenerateImageResponse = await response.json();
    return data.imageUrl;
  }
};