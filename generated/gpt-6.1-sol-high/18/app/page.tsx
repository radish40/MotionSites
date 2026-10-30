'use client';

import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';

export default function AppWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasExited, setHasExited] = useState(false);
  return <>
    <AnimatePresence mode="wait" onExitComplete={() => setHasExited(true)}>
      {isLoading && <LoadingScreen key="loading-screen" onComplete={() => setIsLoading(false)} />}
    </AnimatePresence>
    <main className="portfolio-page" aria-hidden={!hasExited} style={{ opacity: !isLoading && hasExited ? 1 : 0, transition: 'opacity 0.5s ease-out' }}>
      <div className="portfolio-label">Portfolio</div>
      <h1 className="revealed-word">Inspire</h1>
    </main>
  </>;
}
