export type DifficultyLevel = 'Prêt-à-Porter' | 'Atelier' | 'Haute Couture';

export interface Recipe {
  name: string;
  description: string;
  cookingTime: string;
  difficulty: DifficultyLevel;
  calories: string;
  ingredients: string[];
  missingIngredients: string[];
  instructions: string[];
  platingTip: string;
}

export interface GeneratedRecipes {
  recipes: Recipe[];
}

// --- API DTOs (Data Transfer Objects) ---

// 1. 이미지 분석 요청/응답
export interface AnalyzeImageRequest {
  image: string; // Base64 encoded string
}

export interface AnalyzeImageResponse {
  ingredients: string[];
}

// 2. 레시피 생성 요청/응답
export interface GenerateRecipesRequest {
  ingredients: string[];
  difficulty: DifficultyLevel;
}

export interface GenerateRecipesResponse {
  recipes: Recipe[];
}

// 3. 요리 이미지 생성 요청/응답
export interface GenerateImageRequest {
  recipeName: string;
  description: string;
}

export interface GenerateImageResponse {
  imageUrl: string | null;
}