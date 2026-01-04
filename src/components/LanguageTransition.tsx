'use client';

import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';

export function LanguageTransition({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [displayLanguage, setDisplayLanguage] = useState(language);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (displayLanguage !== language) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayLanguage(language);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [language, displayLanguage]);

  return (
    <div
      className={`transition-all duration-300 ${
        isTransitioning ? 'opacity-50 scale-98' : 'opacity-100 scale-100'
      }`}
    >
      {children}
    </div>
  );
}
