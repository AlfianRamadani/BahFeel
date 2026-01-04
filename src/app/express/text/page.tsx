'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';

export default function ExpressText() {
  const [text, setText] = useState('');
  const router = useRouter();
  const { t, language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      router.push(`/reflection?type=text&content=${encodeURIComponent(text)}`);
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
            className="w-full h-64 p-4 border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-800"
            required
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
            >
              {t('back')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              {t('reflect')}
            </button>
          </div>
        </motion.form>
      </motion.main>
    </div>
  );
}