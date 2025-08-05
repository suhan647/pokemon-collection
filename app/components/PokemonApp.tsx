'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PokemonDiscovery } from './PokemonDiscovery';
import { PokemonCollection } from './PokemonCollection';
import { collectionService } from '../services/collectionService';

type TabType = 'discovery' | 'collection';

export function PokemonApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('discovery');
  const [collectionCount, setCollectionCount] = useState(0);

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab === 'collection' || tab === 'discovery') {
      setActiveTab(tab);
    } else {
      // If no tab parameter, default to discovery and update URL
      router.replace('/?tab=discovery');
    }
  }, [searchParams, router]);

  useEffect(() => {
    setCollectionCount(collectionService.getCollectionCount());
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`/?tab=${tab}`);
  };

  const handleLogoClick = () => {
    setActiveTab('discovery');
    router.push('/?tab=discovery');
  };

  const handleCollectionChange = () => {
    setCollectionCount(collectionService.getCollectionCount());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={handleLogoClick}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <span className="text-lg sm:text-xl md:text-2xl">🎮</span>
                </div>
                <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-800">
                Pokemon Hub
              </h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 sm:space-x-2 bg-slate-100/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-1.5 border border-slate-200/60">
              <button
                onClick={() => handleTabChange('discovery')}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                  activeTab === 'discovery'
                    ? 'bg-white text-slate-800 shadow-lg shadow-slate-200/50'
                    : 'text-slate-800 hover:text-slate-900 hover:bg-white/90'
                }`}
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="text-sm sm:text-lg">🔍</span>
                  <span className="hidden sm:inline text-black">Discover</span>
                  <span className="sm:hidden text-black">Find</span>
                </span>
              </button>
              <button
                onClick={() => handleTabChange('collection')}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                  activeTab === 'collection'
                    ? 'bg-white text-slate-800 shadow-lg shadow-slate-200/50'
                    : 'text-slate-800 hover:text-slate-900 hover:bg-white/90'
                }`}
              >
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="text-sm sm:text-lg">⭐</span>
                  <span className="hidden sm:inline text-black">Collection</span>
                  <span className="sm:hidden">My</span>
                  {collectionCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 min-w-[16px] sm:min-w-[18px] flex items-center justify-center font-bold shadow-lg border-2 border-white">
                      {collectionCount}
                    </span>
                  )}
                </span>
              </button>
            </div>

            {/* Collection Count Badge */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden md:flex items-center space-x-2 lg:space-x-3 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl px-3 sm:px-4 md:px-4 lg:px-4 py-2 sm:py-2.5 md:py-2.5 lg:py-2.5 border border-slate-200/60 shadow-sm">
                <span className="text-xs sm:text-sm text-slate-800 font-semibold">Collection</span>
                <span className="text-green-500 bg-gradient-to-r from-indigo-500 to-purple-600 text- px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-lg">
                  {collectionCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {activeTab === 'discovery' ? (
          <PokemonDiscovery onCollectionChange={handleCollectionChange} />
        ) : (
          <PokemonCollection onCollectionChange={handleCollectionChange} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-slate-200/60 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600 text-sm">
            <p className="font-medium">Pokemon Hub - Discover, collect, and organize your favorite Pokemon!</p>
            <p className="mt-3">
              Data provided by{' '}
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 underline font-medium transition-colors"
              >
                PokeAPI
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 