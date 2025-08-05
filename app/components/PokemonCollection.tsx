'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pokemon } from '../types/pokemon';
import { collectionService } from '../services/collectionService';

interface PokemonCollectionProps {
  onCollectionChange?: () => void;
}

// Sortable Pokemon Card Component
function SortablePokemonCard({ pokemon, index, onRemove }: { pokemon: Pokemon; index: number; onRemove: (id: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pokemon.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    console.log('Delete button clicked for Pokemon:', pokemon.id); // Debug log
    onRemove(pokemon.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`transition-all duration-300 ${
        isDragging ? 'scale-110 rotate-3 z-50 shadow-2xl' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50 overflow-hidden cursor-grab active:cursor-grabbing touch-manipulation">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Pokemon Image Section */}
        <div className="relative h-28 sm:h-32 md:h-40 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-2 sm:p-3 md:p-4 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 bg-pink-400 rounded-full"></div>
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-2 sm:w-3 md:w-4 h-2 sm:h-3 md:h-4 bg-purple-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-1.5 sm:w-2 md:w-3 h-1.5 sm:h-2 md:h-3 bg-indigo-400 rounded-full"></div>
          </div>
          
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/pokemon-placeholder.png';
            }}
          />
          
          {/* Remove Button */}
          <button
            onClick={handleRemoveClick}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            className="absolute top-1.5 sm:top-2 md:top-3 right-1.5 sm:right-2 md:right-3 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white font-bold transition-all duration-300 hover:scale-110 shadow-xl z-30 border-2 border-white shadow-red-500/50 touch-manipulation"
            aria-label="Remove from collection"
          >
            <span className="text-xs sm:text-sm md:text-lg font-bold">×</span>
          </button>

          {/* Drag Handle - Visual indicator only */}
          <div className="absolute top-1.5 sm:top-2 md:top-3 left-1.5 sm:left-2 md:left-3 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-xl z-20 border-2 border-white shadow-gray-500/50 pointer-events-none">
            <span className="text-xs sm:text-sm md:text-lg font-bold">⋮⋮</span>
          </div>

          {/* Pokemon ID Badge */}
          <div className="absolute bottom-1.5 sm:bottom-2 md:bottom-3 left-1.5 sm:left-2 md:left-3 bg-white/80 backdrop-blur-sm rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-bold text-gray-600 shadow-sm pointer-events-none">
            #{pokemon.id.toString().padStart(3, '0')}
          </div>
        </div>

        {/* Pokemon Info Section */}
        <div className="relative p-2 sm:p-3 md:p-4">
          {/* Name */}
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-1.5 sm:mb-2 md:mb-3 text-center group-hover:text-pink-600 transition-colors duration-300 pointer-events-none">
            {pokemon.name}
          </h3>

          {/* Types */}
          <div className="flex flex-wrap gap-1 justify-center mb-2 sm:mb-3 md:mb-4 pointer-events-none">
            {pokemon.types.map((type, typeIndex) => (
              <span
                key={typeIndex}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full text-white flex items-center gap-0.5 sm:gap-1 shadow-lg backdrop-blur-sm"
                style={{ 
                  backgroundColor: type.color,
                  boxShadow: `0 4px 12px ${type.color}40`
                }}
              >
                <span className="text-xs">{getTypeIcon(type.name)}</span>
                <span className="hidden sm:inline">{type.name}</span>
                <span className="sm:hidden">{type.name.slice(0, 3)}</span>
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2 pointer-events-none">
            <div className="text-center group-hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-1.5 sm:p-2 border border-red-200/50">
                <div className="text-xs font-semibold text-red-600 mb-0.5">HP</div>
                <div className="text-xs sm:text-sm font-bold text-red-700">{pokemon.stats.hp}</div>
              </div>
            </div>
            <div className="text-center group-hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-1.5 sm:p-2 border border-orange-200/50">
                <div className="text-xs font-semibold text-orange-600 mb-0.5">ATK</div>
                <div className="text-xs sm:text-sm font-bold text-orange-700">{pokemon.stats.attack}</div>
              </div>
            </div>
            <div className="text-center group-hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-1.5 sm:p-2 border border-blue-200/50">
                <div className="text-xs font-semibold text-blue-600 mb-0.5">DEF</div>
                <div className="text-xs sm:text-sm font-bold text-blue-700">{pokemon.stats.defense}</div>
              </div>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 via-purple-600/0 to-indigo-600/0 group-hover:from-pink-600/5 group-hover:via-purple-600/5 group-hover:to-indigo-600/5 transition-all duration-500 rounded-2xl sm:rounded-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}

export function PokemonCollection({ onCollectionChange }: PokemonCollectionProps) {
  const [collection, setCollection] = useState<Pokemon[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced from 8 to 3 for better mobile responsiveness
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setCollection(collectionService.getCollection());
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = collection.findIndex(p => p.id.toString() === active.id);
      const newIndex = collection.findIndex(p => p.id.toString() === over?.id);

      const newCollection = arrayMove(collection, oldIndex, newIndex);
      collectionService.saveCollection(newCollection);
      setCollection(newCollection);
      onCollectionChange?.();
    }
  };

  const handleRemoveFromCollection = (pokemonId: number) => {
    console.log('Removing Pokemon with ID:', pokemonId); // Debug log
    const newCollection = collectionService.removeFromCollection(pokemonId);
    console.log('New collection:', newCollection); // Debug log
    setCollection(newCollection);
    onCollectionChange?.();
  };

  if (collection.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-6">📦</div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Your Collection is Empty</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
            Start discovering Pokemon and add them to your collection! Your collection will be saved automatically and you can reorder them with drag and drop.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Discover Pokemon
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <div className="relative">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            My Collection
          </h1>
          <div className="absolute -top-2 sm:-top-3 md:-top-4 -left-2 sm:-left-3 md:-left-4 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 -right-2 sm:-right-3 md:-right-4 w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-pulse delay-1000"></div>
        </div>
        <p className="text-sm sm:text-base md:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
          Your personal Pokemon collection! Drag and drop to reorder your Pokemon. Your collection is automatically saved and will persist across browser sessions.
        </p>
        
        {/* Collection Stats */}
        <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 shadow-lg border border-gray-200/50">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">{collection.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Pokemon Collected</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 shadow-lg border border-gray-200/50">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">∞</div>
            <div className="text-xs sm:text-sm text-gray-600">Drag to Reorder</div>
          </div>
        </div>
      </div>

      {/* Collection Grid with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={collection.map(p => p.id.toString())}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {collection.map((pokemon, index) => (
              <SortablePokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                index={index}
                onRemove={handleRemoveFromCollection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Instructions */}
      <div className="text-center py-6 sm:py-8 md:py-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-blue-200/50 max-w-2xl mx-auto mx-4">
          <h4 className="font-semibold text-blue-800 mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">💡 Pro Tips</h4>
          <div className="space-y-1 sm:space-y-2 text-blue-700 text-xs sm:text-sm">
            <p>• Drag and drop Pokemon cards to reorder your collection</p>
            <p>• Your order is automatically saved to localStorage</p>
            <p>• Click the × button to remove Pokemon from your collection</p>
            <p>• Your collection persists across browser sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
} 