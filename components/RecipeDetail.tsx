import React, { useState } from 'react';
import { Recipe } from '../types';
import { Clock, Flame, X, Sparkles, ChefHat, Plus, Loader2, Camera } from './Icons';
import { generateRecipeImage } from '../services/geminiService';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onClose }) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateRecipeImage(recipe.name, recipe.description);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
      }
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6">
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-sm transition-opacity duration-500" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-5xl h-full md:h-[90vh] bg-[#FDFBF7] md:shadow-2xl overflow-hidden flex flex-col md:border md:border-rose-gold-200 animate-slide-up rounded-sm">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur px-8 py-6 border-b border-rose-gold-100 flex justify-between items-center shrink-0 sticky top-0 z-20">
           <div className="flex flex-col">
             <span className="font-serif text-xs text-rose-gold-500 tracking-[0.3em] uppercase mb-1">La Cuisine de Rêve</span>
             <h2 className="font-serif text-2xl md:text-3xl text-charcoal playfair italic">{recipe.name}</h2>
           </div>
           <button 
             onClick={onClose}
             className="p-2 hover:bg-rose-gold-50 rounded-full transition-colors text-charcoal group"
           >
             <X className="w-6 h-6 stroke-1 group-hover:rotate-90 transition-transform duration-300" />
           </button>
        </div>

        <div className="overflow-y-auto flex-1 p-0 md:p-0 custom-scrollbar bg-[#FDFBF7]">
          
          {/* Image Generation Section */}
          <div className="w-full h-64 md:h-96 bg-rose-gold-50 relative overflow-hidden group">
            {generatedImage ? (
              <img 
                src={generatedImage} 
                alt={recipe.name} 
                className="w-full h-full object-cover animate-fade-in transition-transform duration-[20s] hover:scale-110" 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-rose-gold-50 to-white">
                {isGeneratingImage ? (
                  <div className="text-center animate-pulse">
                    <Loader2 className="w-8 h-8 text-rose-gold-400 animate-spin mx-auto mb-4" />
                    <span className="font-serif text-rose-gold-500 tracking-widest text-sm">Visualizing Masterpiece...</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-rose-gold-300 mx-auto mb-4 opacity-50" />
                    <button 
                      onClick={handleGenerateImage}
                      className="px-8 py-3 border border-rose-gold-300 text-rose-gold-600 font-serif uppercase tracking-[0.2em] text-xs hover:bg-rose-gold-500 hover:text-white transition-all duration-500"
                    >
                      Visualize this Dish
                    </button>
                    <p className="mt-4 text-dior-gray-400 font-light text-xs italic">
                      "상상 속의 요리를 시각화해보세요"
                    </p>
                  </div>
                )}
              </div>
            )}
             {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none"></div>
          </div>

          <div className="max-w-4xl mx-auto px-8 md:px-12 pb-12 -mt-20 relative z-10">
            
            {/* Intro */}
            <div className="text-center mb-16 relative bg-white/50 backdrop-blur-sm p-8 border border-white shadow-sm rounded-sm">
              <p className="text-xl md:text-2xl text-dior-gray-600 font-serif italic leading-relaxed playfair">
                "{recipe.description}"
              </p>
              <div className="flex justify-center gap-8 mt-8 text-xs font-medium uppercase tracking-[0.15em] text-rose-gold-600">
                <span className="flex items-center gap-2 border-b border-transparent hover:border-rose-gold-300 pb-1 transition-colors">
                  <Clock className="w-3 h-3" /> {recipe.cookingTime}
                </span>
                <span className="flex items-center gap-2 border-b border-transparent hover:border-rose-gold-300 pb-1 transition-colors">
                  <Flame className="w-3 h-3" /> {recipe.calories}
                </span>
                <span className="flex items-center gap-2 border-b border-transparent hover:border-rose-gold-300 pb-1 transition-colors">
                  <ChefHat className="w-3 h-3" /> {recipe.difficulty}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-12">
              
              {/* Ingredients Column */}
              <div className="md:col-span-4 space-y-10">
                <div className="bg-white p-8 border border-rose-gold-100 shadow-[0_4px_20px_rgba(183,110,121,0.05)] relative">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 border border-rose-gold-50">
                     <h3 className="font-serif text-lg text-rose-gold-600 uppercase tracking-widest playfair">Ingrédients</h3>
                   </div>
                   
                   <ul className="space-y-4 mt-4">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-baseline text-dior-gray-600 text-sm font-light border-b border-dotted border-rose-gold-100 pb-2 last:border-0">
                        <span className="w-1.5 h-1.5 bg-rose-gold-300 rotate-45 mr-3 shrink-0"></span>
                        {ing}
                      </li>
                    ))}
                  </ul>

                  {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-rose-gold-100">
                      <p className="text-xs font-bold text-rose-gold-400 uppercase tracking-widest mb-4">Secret Touch</p>
                      <ul className="space-y-2">
                        {recipe.missingIngredients.map((ing, idx) => (
                          <li key={idx} className="text-charcoal text-sm font-medium flex items-center italic">
                            <Plus className="w-3 h-3 mr-2 text-rose-gold-500" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions Column */}
              <div className="md:col-span-8 space-y-12">
                <div>
                  <h3 className="font-serif text-3xl text-charcoal mb-10 playfair border-b border-rose-gold-200 pb-4 inline-block pr-12">
                    Préparation
                  </h3>
                  
                  <div className="space-y-12">
                    {recipe.instructions.map((step, idx) => (
                      <div key={idx} className="group relative pl-16">
                        <span className="absolute left-0 top-0 font-playfair text-5xl text-rose-gold-100 group-hover:text-rose-gold-300 transition-colors italic">
                          {idx + 1}
                        </span>
                        <p className="text-dior-gray-700 leading-8 font-light text-lg group-hover:text-charcoal transition-colors font-garamond">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plating Tip Card */}
                <div className="bg-gradient-to-r from-rose-gold-50 to-white border border-rose-gold-200 p-8 relative overflow-hidden mt-16 rounded-sm">
                  <div className="absolute -right-6 -top-6 text-rose-gold-100 opacity-50">
                    <Sparkles className="w-24 h-24" />
                  </div>
                  <h4 className="font-serif text-xl text-rose-gold-600 mb-4 flex items-center relative z-10 playfair italic">
                    <Sparkles className="w-5 h-5 mr-3" />
                    Art de la Table
                  </h4>
                  <p className="text-dior-gray-600 text-sm leading-relaxed relative z-10 font-light tracking-wide">
                    {recipe.platingTip}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;