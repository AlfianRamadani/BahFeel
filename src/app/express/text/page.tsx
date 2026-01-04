'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';

export default function ExpressText() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t, language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/reflect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'text', content: text, language }),
        });

        if (!response.ok) {
          throw new Error('Failed to get reflection');
        }

        const data = await response.json();
        const reflectionData = {
          feeling: data.feeling,
          protection: data.protection,
          action: data.action,
        };
        
        router.push(`/reflection?type=text&content=${encodeURIComponent(JSON.stringify(reflectionData))}`);
      } catch (error) {
        console.error('Error getting reflection:', error);
        alert(language === 'id' ? 'Ada error saat generate reflection. Coba lagi ya.' : 'Error generating reflection. Please try again.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <LanguageSwitcher />
      <motion.main
        key={language}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto w-full"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-bold text-stone-800 mb-8 text-center"
        >
          {t('writeThoughts')}
        </motion.h1>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('writeThoughtsPlaceholder')}
            className="w-full h-64 p-4 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-800 disabled:opacity-50"
            required
            disabled={isLoading}
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="px-6 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('back')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>{language === 'id' ? 'Lagi renungin...' : 'Reflecting...'}</span>
                </>
              ) : (
                t('reflect')
              )}
            </button>
          </div>
        </motion.form>
      </motion.main>
    </div>
  );
}