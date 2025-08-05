import { Pokemon, PokemonListResponse, PokemonApiResponse, PokemonType } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Pokemon type colors mapping
const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const pokemonApi = {
  // Get Pokemon list with pagination
  async getPokemonList(offset: number = 0, limit: number = 20): Promise<PokemonListResponse> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon list: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      throw new Error('Failed to fetch Pokemon list. Please try again.');
    }
  },

  // Get individual Pokemon data
  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    try {
      const response = await fetchWithTimeout(`${BASE_URL}/pokemon/${nameOrId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon ${nameOrId}: ${response.status} ${response.statusText}`);
      }
      
      const data: PokemonApiResponse = await response.json();
      
      return {
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
        types: data.types.map(type => ({
          name: type.type.name.toUpperCase(),
          color: TYPE_COLORS[type.type.name] || '#777777'
        })),
        stats: {
          hp: data.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
          attack: data.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
          defense: data.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0,
          specialAttack: data.stats.find(stat => stat.stat.name === 'special-attack')?.base_stat || 0,
          specialDefense: data.stats.find(stat => stat.stat.name === 'special-defense')?.base_stat || 0,
          speed: data.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0,
        }
      };
    } catch (error) {
      console.error(`Error fetching Pokemon ${nameOrId}:`, error);
      throw new Error(`Failed to fetch Pokemon ${nameOrId}. Please try again.`);
    }
  },

  // Get multiple Pokemon data
  async getPokemonBatch(names: string[]): Promise<Pokemon[]> {
    try {
      const promises = names.map(name => this.getPokemon(name));
      return Promise.all(promises);
    } catch (error) {
      console.error('Error fetching Pokemon batch:', error);
      throw new Error('Failed to fetch Pokemon batch. Please try again.');
    }
  }
}; 