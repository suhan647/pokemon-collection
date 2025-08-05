import { Suspense } from 'react';
import { PokemonApp } from './components/PokemonApp';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PokemonApp />
    </Suspense>
  );
}
