import { Pokemon } from '../types/pokemon';

const COLLECTION_KEY = 'pokemon_collection';

export const collectionService = {
  // Get collection from localStorage
  getCollection(): Pokemon[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(COLLECTION_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading collection from localStorage:', error);
      return [];
    }
  },

  // Save collection to localStorage
  saveCollection(collection: Pokemon[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
    } catch (error) {
      console.error('Error saving collection to localStorage:', error);
    }
  },

  // Add Pokemon to collection
  addToCollection(pokemon: Pokemon): Pokemon[] {
    const collection = this.getCollection();
    const exists = collection.find(p => p.id === pokemon.id);
    
    if (!exists) {
      const updatedCollection = [...collection, pokemon];
      this.saveCollection(updatedCollection);
      return updatedCollection;
    }
    
    return collection;
  },

  // Remove Pokemon from collection
  removeFromCollection(pokemonId: number): Pokemon[] {
    const collection = this.getCollection();
    const updatedCollection = collection.filter(p => p.id !== pokemonId);
    this.saveCollection(updatedCollection);
    return updatedCollection;
  },

  // Check if Pokemon is in collection
  isInCollection(pokemonId: number): boolean {
    const collection = this.getCollection();
    return collection.some(p => p.id === pokemonId);
  },

  // Reorder collection
  reorderCollection(startIndex: number, endIndex: number): Pokemon[] {
    const collection = this.getCollection();
    const [removed] = collection.splice(startIndex, 1);
    collection.splice(endIndex, 0, removed);
    this.saveCollection(collection);
    return collection;
  },

  // Get collection count
  getCollectionCount(): number {
    return this.getCollection().length;
  }
}; 