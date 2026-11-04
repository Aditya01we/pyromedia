'use client';

import { useState, useEffect, createContext } from 'react';
import IntroLoader from './IntroLoader';

export const LoadingContext = createContext(true);

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on the client after hydration
    setIsReady(true);
  }, []);

  return (
    <LoadingContext.Provider value={!isReady || loading}>
      {isReady && loading && <IntroLoader onComplete={() => setLoading(false)} />}
      <div
        className={`transition-opacity duration-1000 ease-in-out min-h-full flex flex-col flex-grow w-full ${
          !isReady || loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  );
}
