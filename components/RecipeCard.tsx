import React from 'react';
import { Recipe } from '../types';
import { Clock, ArrowRight } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  index: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, index }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-white p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-transparent hover:border-rose-gold-200 transition-all duration-700 hover:-translate-y-2 relative overflow-hidden animate-slide-up flex flex-col h-full rounded-sm hover:shadow-[0_15px_40px_rgba(183,110,121,0.1)]"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-rose-gold-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
          <span className="font-serif text-[10px] text-rose-gold-500 tracking-[0.3em] uppercase border-b border-rose-gold-100 pb-1">
             Nº {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center text-dior-gray-400 text-[10px] uppercase tracking-widest border border-dior-gray-100 px-2 py-1">
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        <h3 className="text-3xl font-serif text-charcoal mb-5 leading-tight group-hover:text-rose-gold-600 transition-colors duration-500 playfair italic">
          {recipe.name}
        </h3>
        
        <p className="text-dior-gray-500 text-sm font-light leading-7 mb-10 flex-grow line-clamp-3 font-serif">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-dotted border-rose-gold-100 mt-auto">
          <div className="flex items-center text-dior-gray-400 text-xs font-medium uppercase tracking-widest">
            <Clock className="w-3 h-3 mr-2 text-rose-gold-300" />
            {recipe.cookingTime}
          </div>
          
          <div className="flex items-center text-rose-gold-500 text-[10px] font-bold uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform duration-500">
            View Recipe <ArrowRight className="w-3 h-3 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;