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