'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

interface SavedReflection {
  id: number;
  type: string;
  content: string;
  reflection: {
    feeling: string;
    protection: string;
    action: string;
  };
  date: string;
}

export default function Timeline() {
  const { t, language } = useLanguage();
  const [reflections, setReflections] = useState<SavedReflection[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bahfeel_reflections') || '[]');
    setReflections(saved.reverse());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <LanguageSwitcher />
      <motion.main
        key={language}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-stone-800">
            {t('yourEmotionalTimeline')}
          </h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            {t('expressMore')}
          </Link>
        </motion.div>

        {reflections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-12"
          >
            <p className="text-stone-600 mb-4">{t('noReflectionsSaved')}</p>
            <Link
              href="/dashboard"
              className="text-stone-700 hover:text-stone-800 underline"
            >
              {t('startFirstReflection')}
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {reflections.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-stone-200 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-stone-500">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm bg-stone-100 px-2 py-1 rounded text-stone-700">
                      {item.type === 'text' ? t('written') : t('image')}
                    </span>
                  </div>
                  <span className="text-sm text-stone-500">#{reflections.length - index}</span>
                </div>
                {item.type === 'text' ? (
                  <p className="text-stone-700 mb-4 italic">&ldquo;{item.content}&rdquo;</p>
                ) : (
                  <Image
                    src={item.content}
                    alt="Reflection"
                    width={500}
                    height={128}
                    className="max-w-full h-32 object-cover rounded mb-4"
                  />
                )}


                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-stone-800 text-sm">{t('whatWasFeeling')}</h3>
                    <p className="text-stone-700 text-sm">{item.reflection.feeling}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800 text-sm">{t('whatProtected')}</h3>
                    <p className="text-stone-700 text-sm">{item.reflection.protection}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800 text-sm">{t('gentleStepTook')}</h3>
                    <p className="text-stone-700 text-sm">{item.reflection.action}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}