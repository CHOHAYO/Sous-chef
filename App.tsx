import React, { useState } from 'react';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import { getRecipes } from './services/apiService';
import { Recipe, DifficultyLevel } from './types';
import { ChefHat, Sparkles } from './components/Icons';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Prêt-à-Porter');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    try {
      const result = await getRecipes(ingredients, difficulty);
      setRecipes(result.recipes);
    } catch (e) {
      console.error(e);
      setError("죄송합니다. 레시피를 구상하는 중에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-rose-gold-200 selection:text-charcoal">
      {/* Background Decor - Refined Dior Style */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-rose-gold-50/50 via-white to-transparent opacity-80"></div>
         <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-rose-gold-100/30 rounded-full blur-[120px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gold-50/40 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col min-h-screen">
        
        {/* Header - More Elegant & Feminine */}
        <header className="text-center mb-24 animate-fade-in relative">
          <div className="inline-block mb-8 relative">
             <div className="absolute inset-0 bg-rose-gold-200 blur-xl opacity-20 rounded-full"></div>
             <div className="border border-charcoal/80 p-4 rounded-sm rotate-45 mb-4 mx-auto w-14 h-14 flex items-center justify-center bg-white relative z-10 shadow-sm">
                <ChefHat className="w-7 h-7 text-charcoal -rotate-45" />
             </div>
          </div>
          
          <h1 className="playfair text-6xl md:text-9xl text-charcoal mb-4 tracking-tight leading-none drop-shadow-sm">
            La Cuisine <br />
            <span className="text-rose-gold-500 italic font-serif text-5xl md:text-8xl block mt-4 bg-clip-text text-transparent bg-gradient-to-r from-rose-gold-400 to-rose-gold-600">
              de Rêve
            </span>
          </h1>
          
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-rose-gold-400 to-transparent mx-auto my-10"></div>
          
          <p className="text-dior-gray-500 font-garamond text-xl md:text-2xl italic max-w-2xl mx-auto leading-relaxed tracking-wide">
            "당신의 냉장고 속 재료로 펼쳐지는<br className="hidden md:block"/>
            <span className="text-rose-gold-600 font-medium">가장 우아하고 창의적인</span> 미식의 향연"
          </p>
        </header>

        {/* Input Section */}
        <div className="mb-24 relative z-20">
          <IngredientInput
            ingredients={ingredients}
            setIngredients={setIngredients}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onAdd={handleAddIngredient}
            onRemove={handleRemoveIngredient}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center p-6 mb-16 bg-white border border-rose-gold-200 shadow-sm max-w-lg mx-auto animate-fade-in rounded-sm">
            <p className="font-serif text-rose-gold-600 text-sm tracking-wide">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && recipes.length === 0 && (
          <div className="text-center py-32 animate-fade-in">
            <div className="inline-block relative mb-10">
               <div className="absolute inset-0 border border-rose-gold-200 rounded-full animate-ping opacity-30"></div>
               <div className="w-20 h-20 border border-rose-gold-300 rounded-full flex items-center justify-center bg-white shadow-lg">
                  <Sparkles className="w-8 h-8 text-rose-gold-500 animate-pulse" />
               </div>
            </div>
            <p className="text-charcoal font-playfair italic text-2xl tracking-wider mb-3">
              Designing Your Masterpiece
            </p>
            <p className="text-dior-gray-400 font-light text-sm tracking-widest uppercase">
              Création en cours...
            </p>
          </div>
        )}

        {/* Results Grid */}
        {recipes.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-20 relative">
              <span className="font-serif text-xs text-rose-gold-500 tracking-[0.4em] uppercase block mb-4">Collection Exclusive</span>
              <h2 className="playfair text-4xl md:text-5xl text-charcoal italic">Pour Votre Table</h2>
              <div className="absolute top-1/2 left-0 w-full h-px bg-rose-gold-100 -z-10 transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FDFBF7] px-8 w-64 h-full -z-10"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={recipe}
                  index={index}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
        
        {/* Footer */}
        <footer className="mt-auto text-center pt-24 pb-12 border-t border-rose-gold-100">
           <div className="flex justify-center items-center space-x-3 text-rose-gold-400 text-[10px] tracking-[0.3em] uppercase font-medium">
             <span>Est. 2024</span>
             <span className="text-lg leading-none">·</span>
             <span>La Cuisine de Rêve</span>
             <span className="text-lg leading-none">·</span>
             <span>Paris • Seoul</span>
           </div>
        </footer>

      </div>
    </div>
  );
};

export default App;