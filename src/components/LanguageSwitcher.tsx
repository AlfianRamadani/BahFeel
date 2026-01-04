'use client';

import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLanguageChange = () => {
    setIsAnimating(true);
    setLanguage(language === 'id' ? 'en' : 'id');
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleLanguageChange}
      disabled={isAnimating}
      className={`fixed top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm text-stone-800 border border-stone-200 hover:bg-stone-50 transition-all z-50 font-medium ${isAnimating
        ? 'scale-95 opacity-50'
        : 'scale-100 opacity-100 hover:shadow-lg'
        } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block transition-all duration-300 ${isAnimating ? 'rotate-180 scale-0' : 'rotate-0 scale-100'
          }`}
      >
        {language === 'en' ? '🇮🇩 ID' : '🇬🇧 EN'}
      </span>
    </button>
  );
}
