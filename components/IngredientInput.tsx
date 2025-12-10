import React, { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { Plus, X, Search, Camera, Loader2, Sparkles, ChefHat } from './Icons';
import { extractIngredientsFromImage } from '../services/geminiService';
import { DifficultyLevel } from '../types';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
  onAdd: (ingredient: string) => void;
  onRemove: (ingredient: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ 
  ingredients, 
  setIngredients,
  difficulty,
  setDifficulty,
  onAdd, 
  onRemove, 
  onGenerate,
  isLoading 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        
        try {
          const extractedIngredients = await extractIngredientsFromImage(base64Data);
          const newIngredients = Array.from(new Set([...ingredients, ...extractedIngredients]));
          setIngredients(newIngredients);
        } catch (error) {
          alert("사진을 분석하는 데 실패했습니다. 다시 시도해주세요.");
        } finally {
          setIsAnalyzingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setIsAnalyzingImage(false);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const levels: { id: DifficultyLevel; label: string; desc: string }[] = [
    { id: 'Prêt-à-Porter', label: 'Prêt-à-Porter', desc: 'Casual Elegance' },
    { id: 'Atelier', label: 'Atelier', desc: 'Artisan Craft' },
    { id: 'Haute Couture', label: 'Haute Couture', desc: 'The Masterpiece' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-sm shadow-[0_20px_50px_rgba(183,110,121,0.1)] border border-rose-gold-100 relative overflow-hidden group hover:shadow-[0_20px_60px_rgba(183,110,121,0.15)] transition-shadow duration-700">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-gold-300 to-transparent opacity-60"></div>
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-rose-gold-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl font-serif text-charcoal mb-4 playfair italic">Vos Ingrédients</h2>
          <div className="w-16 h-px bg-rose-gold-300 mx-auto mb-5"></div>
          <p className="text-rose-gold-500 font-light text-xs uppercase tracking-[0.2em]">
            Capturez l'essence de votre cuisine
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5 mb-10 relative z-10">
          {/* Text Input */}
          <div className="relative flex-grow group/input">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-dior-gray-300 group-focus-within/input:text-rose-gold-500 transition-colors" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예: 트러플 오일, 샤인머스켓, 그릭요거트..."
              className="w-full pl-12 pr-12 py-5 bg-[#F9F9F9] border border-transparent text-charcoal placeholder-dior-gray-300 focus:outline-none focus:bg-white focus:border-rose-gold-200 focus:shadow-[0_4px_20px_rgba(183,110,121,0.05)] transition-all duration-300 font-light tracking-wide text-sm"
              disabled={isLoading || isAnalyzingImage}
            />
            <button
              onClick={handleAddClick}
              disabled={!inputValue.trim() || isLoading}
              className="absolute inset-y-2 right-2 p-3 text-dior-gray-300 hover:text-rose-gold-500 transition-colors disabled:opacity-30"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Camera Button */}
          <div className="relative">
             <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <button
              onClick={handleCameraClick}
              disabled={isLoading || isAnalyzingImage}
              className={`
                h-full w-full md:w-auto px-8 py-5 flex items-center justify-center gap-3
                border border-rose-gold-100 bg-white text-rose-gold-600 hover:bg-rose-gold-50 hover:border-rose-gold-300
                transition-all duration-300 uppercase text-[10px] font-bold tracking-[0.2em]
                disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md
              `}
            >
              {isAnalyzingImage ? (
                <Loader2 className="h-4 w-4 animate-spin text-rose-gold-500" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              <span className="md:hidden lg:inline">Photo Analysis</span>
            </button>
          </div>
        </div>

        {/* Ingredients Tags */}
        <div className="min-h-[80px] flex flex-wrap gap-4 mb-12 justify-center content-start relative z-10">
          {ingredients.length === 0 && !isAnalyzingImage && (
            <div className="text-center py-6 text-dior-gray-300 font-light text-sm italic font-serif">
              "냉장고 사진을 업로드하거나 재료를 입력하여<br/>당신만의 미식 여행을 시작하세요"
            </div>
          )}
          {isAnalyzingImage && (
             <div className="flex items-center gap-3 text-rose-gold-500 py-4 animate-pulse">
               <Sparkles className="w-5 h-5" />
               <span className="text-sm font-medium tracking-wide">이미지 속 재료를 확인하고 있습니다...</span>
             </div>
          )}
          {ingredients.map((ing, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-5 py-2.5 bg-white text-charcoal border border-rose-gold-100 text-sm font-light tracking-wide animate-fade-in hover:border-rose-gold-300 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            >
              {ing}
              <button
                onClick={() => onRemove(ing)}
                className="ml-3 p-0.5 text-dior-gray-300 hover:text-rose-gold-400 transition-colors"
                disabled={isLoading}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Difficulty Selector */}
        <div className="mb-14 relative z-10">
          <div className="text-center mb-6">
            <span className="font-serif text-[10px] text-dior-gray-400 tracking-[0.2em] uppercase">Sélectionnez le Niveau</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setDifficulty(level.id)}
                disabled={isLoading}
                className={`
                  relative py-4 px-2 border transition-all duration-500 group overflow-hidden
                  ${difficulty === level.id 
                    ? 'bg-rose-gold-50 border-rose-gold-400 shadow-[0_4px_15px_rgba(183,110,121,0.15)]' 
                    : 'bg-white border-rose-gold-100 hover:border-rose-gold-300 text-dior-gray-400 hover:bg-[#FDFBF7]'
                  }
                `}
              >
                <div className={`
                  font-serif text-lg mb-1 playfair italic transition-colors duration-300
                  ${difficulty === level.id ? 'text-charcoal' : 'text-dior-gray-400 group-hover:text-charcoal'}
                `}>
                  {level.label}
                </div>
                <div className={`
                  text-[9px] uppercase tracking-[0.2em] font-medium transition-colors duration-300
                  ${difficulty === level.id ? 'text-rose-gold-600' : 'text-dior-gray-300 group-hover:text-rose-gold-400'}
                `}>
                  {level.desc}
                </div>
                
                {/* Active Indicator */}
                {difficulty === level.id && (
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-rose-gold-400"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center relative z-10">
          <button
            onClick={onGenerate}
            disabled={ingredients.length === 0 || isLoading || isAnalyzingImage}
            className={`
              relative px-16 py-5 bg-charcoal text-white font-serif text-lg tracking-[0.2em] uppercase
              transition-all duration-500 hover:bg-rose-gold-500 hover:shadow-[0_10px_30px_rgba(183,110,121,0.3)]
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-charcoal disabled:hover:shadow-none
              overflow-hidden group w-full md:w-auto
            `}
          >
             <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Creating Masterpiece...
                </>
              ) : (
                "Recommander le Menu"
              )}
             </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientInput;