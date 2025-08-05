'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { pokemonApi } from '../services/pokemonApi';
import { PokemonCard } from './PokemonCard';
import { Pokemon } from '../types/pokemon';
import { collectionService } from '../services/collectionService';
import { useState } from 'react';

interface PokemonDiscoveryProps {
  onCollectionChange?: () => void;
}

export function PokemonDiscovery({ onCollectionChange }: PokemonDiscoveryProps) {
  const [collectionCount, setCollectionCount] = useState(() => 
    collectionService.getCollectionCount()
  );

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['pokemon-list'],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const response = await pokemonApi.getPokemonList(pageParam, 6);
        const pokemonNames = response.results.map((p: { name: string }) => p.name);
        const pokemonData = await pokemonApi.getPokemonBatch(pokemonNames);
        return {
          pokemon: pokemonData,
          nextOffset: response.next ? pageParam + 6 : undefined,
        };
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        throw new Error('Failed to fetch Pokémon data. Please try again later.');
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes before data becomes stale
    gcTime: 30 * 60 * 1000, // Keep unused/inactive data in cache for 30 minutes
    retry: 2, // Retry failed requests 2 times
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Simplified effect to prevent infinite calls
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const handleCollectionChange = () => {
    setCollectionCount(collectionService.getCollectionCount());
    onCollectionChange?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-indigo-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-slate-200 border-t-purple-500 mx-auto"></div>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Discovering Pokemon...</h3>
          <p className="text-slate-600">Loading amazing Pokemon for you to explore!</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Oops! Something went wrong</h3>
          <p className="text-slate-600 mb-6 leading-relaxed">
            {error?.message || 'We encountered an issue while loading Pokemon. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allPokemon = data?.pages.flatMap(page => page.pokemon) || [];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="relative">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
            Discover Pokemon
          </h1>
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full animate-pulse delay-1000 shadow-lg"></div>
        </div>
        <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Explore the amazing world of Pokemon! Scroll through an infinite collection of Pokemon, 
          each with unique abilities and characteristics. Add your favorites to your personal collection.
        </p>
        
        {/* Stats Cards */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border border-slate-200/60">
            <div className="text-3xl font-bold text-indigo-600">{allPokemon.length}</div>
            <div className="text-sm text-slate-600">Pokemon Loaded</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border border-slate-200/60">
            <div className="text-3xl font-bold text-emerald-600">{collectionCount}</div>
            <div className="text-sm text-slate-600">In Collection</div>
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPokemon.map((pokemon: Pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onCollectionChange={handleCollectionChange}
          />
        ))}
      </div>

      {/* Loading More Indicator */}
      {(isFetchingNextPage || hasNextPage) && (
        <div ref={ref} className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-500 mx-auto"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-slate-200 border-t-purple-500 mx-auto"></div>
            </div>
            <p className="text-slate-600 font-medium">Loading more amazing Pokemon...</p>
          </div>
        </div>
      )}

      {/* No More Pokemon */}
      {!hasNextPage && allPokemon.length > 0 && (
        <div className="text-center py-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 max-w-2xl mx-auto shadow-xl">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">You've reached the end!</h3>
            <p className="text-slate-600">All available Pokemon have been loaded. Start building your collection!</p>
          </div>
        </div>
      )}
    </div>
  );
} 