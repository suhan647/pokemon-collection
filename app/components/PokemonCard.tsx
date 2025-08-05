'use client';

import { Pokemon } from '../types/pokemon';
import { collectionService } from '../services/collectionService';
import { useState } from 'react';

interface PokemonCardProps {
  pokemon: Pokemon;
  onCollectionChange?: () => void;
}

export function PokemonCard({ pokemon, onCollectionChange }: PokemonCardProps) {
  const [isInCollection, setIsInCollection] = useState(() => 
    collectionService.isInCollection(pokemon.id)
  );

  const handleToggleCollection = () => {
    if (isInCollection) {
      collectionService.removeFromCollection(pokemon.id);
    } else {
      collectionService.addToCollection(pokemon);
    }
    
    setIsInCollection(!isInCollection);
    onCollectionChange?.();
  };

  const getTypeIcon = (typeName: string) => {
    const icons: Record<string, string> = {
      FIRE: '🔥',
      WATER: '💧',
      GRASS: '🌿',
      ELECTRIC: '⚡',
      PSYCHIC: '🧠',
      ICE: '❄️',
      FIGHTING: '👊',
      POISON: '☠️',
      GROUND: '🌍',
      FLYING: '🦅',
      BUG: '🐛',
      ROCK: '🪨',
      GHOST: '👻',
      DRAGON: '🐉',
      DARK: '🌑',
      STEEL: '⚙️',
      FAIRY: '🧚',
      NORMAL: '📄'
    };
    return icons[typeName] || '❓';
  };

  return (
    <div className="group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/60 overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Pokemon Image Section */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-8 h-8 bg-indigo-400 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 bg-purple-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-blue-400 rounded-full"></div>
        </div>
        
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="relative h-24 w-24 sm:h-32 sm:w-32 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/pokemon-placeholder.png';
          }}
        />
        
        {/* Add/Remove Button - Always visible */}
        <button
          onClick={handleToggleCollection}
          className={`absolute top-3 right-3 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold transition-all duration-300 hover:scale-110 shadow-xl z-10 border-2 border-white ${
            isInCollection 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/50' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/50'
          }`}
          aria-label={isInCollection ? 'Remove from collection' : 'Add to collection'}
        >
          <span className="text-xl sm:text-2xl font-bold">{isInCollection ? '×' : '+'}</span>
        </button>

        {/* Pokemon ID Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-slate-600 shadow-lg border border-slate-200/60">
          #{pokemon.id.toString().padStart(3, '0')}
        </div>
      </div>

      {/* Pokemon Info Section */}
      <div className="relative p-4 sm:p-6">
        {/* Name */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 text-center group-hover:text-indigo-600 transition-colors duration-300">
          {pokemon.name}
        </h3>

        {/* Types */}
        <div className="flex flex-wrap gap-2 justify-center mb-4 sm:mb-6">
          {pokemon.types.map((type, index) => (
            <span
              key={index}
              className="px-3 py-1.5 text-xs font-semibold rounded-full text-white flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-white/20"
              style={{ 
                backgroundColor: type.color,
                boxShadow: `0 4px 12px ${type.color}40`
              }}
            >
              <span className="text-sm">{getTypeIcon(type.name)}</span>
              {type.name}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center group-hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200/60">
              <div className="text-xs font-semibold text-red-600 mb-1">HP</div>
              <div className="text-sm font-bold text-red-700">{pokemon.stats.hp}</div>
            </div>
          </div>
          <div className="text-center group-hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200/60">
              <div className="text-xs font-semibold text-orange-600 mb-1">Attack</div>
              <div className="text-sm font-bold text-orange-700">{pokemon.stats.attack}</div>
            </div>
          </div>
          <div className="text-center group-hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200/60">
              <div className="text-xs font-semibold text-blue-600 mb-1">Defense</div>
              <div className="text-sm font-bold text-blue-700">{pokemon.stats.defense}</div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 rounded-3xl"></div>
      </div>
    </div>
  );
} 