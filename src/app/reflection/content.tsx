'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

interface Reflection {
  feeling: string;
  protection: string;
  action: string;
}

export function ReflectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [loading, setLoading] = useState(true);

  const type = searchParams.get('type');
  const content = searchParams.get('content');

  useEffect(() => {
    if (!type || !content) {
      router.push('/dashboard');
      return;
    }

    const setReflectionData = async () => {
      try {
        // Jika content dari image (sudah refleksi dari API)
        if (type === 'image') {
          try {
            const parsedContent = JSON.parse(decodeURIComponent(content));
            setReflection(parsedContent);
            setLoading(false);
            return;
          } catch (e) {
            // Fallback jika parsing gagal
          }
        }

        // Untuk text type atau fallback image
        const response = await fetch('/api/reflect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type, content }),
        });

        if (!response.ok) {
          throw new Error('Failed to get reflection');
        }

        const data = await response.json();
        setReflection(data);
      } catch (error) {
        console.error('Error fetching reflection:', error);
        const mockReflection: Reflection = {
          feeling: "This sounds like standing in a crowded room while feeling invisible. It often appears when your needs have been postponed for too long.",
          protection: "This emotion may be protecting you from further disappointment by keeping expectations low.",
          action: "Take a small step: Write down one need you've been ignoring and consider how to address it gently."
        };
        setReflection(mockReflection);
      } finally {
        setLoading(false);
      }
    };

    setReflectionData();
  }, [type, content, router]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-700 mx-auto mb-4"></div>
        <p className="text-stone-600">{t('reflectingExpression')}</p>
      </div>
    );
  }

  if (!reflection) return null;

  return (
    <motion.main
      key={language}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto"
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-3xl font-bold text-stone-800 mb-8 text-center"
      >
        {t('yourReflection')}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-3">{t('whatYouFeeling')}</h2>
          <p className="text-stone-700 leading-relaxed">{reflection.feeling}</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-3">{t('whatProtecting')}</h2>
          <p className="text-stone-700 leading-relaxed">{reflection.protection}</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-3">{t('gentleStep')}</h2>
          <p className="text-stone-700 leading-relaxed">{reflection.action}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 flex justify-center gap-4"
      >
        <button
          onClick={() => {
            const saved = JSON.parse(localStorage.getItem('bahfeel_reflections') || '[]');
            saved.push({
              id: Date.now(),
              type,
              content,
              reflection,
              date: new Date().toISOString()
            });
            localStorage.setItem('bahfeel_reflections', JSON.stringify(saved));
            alert(t('reflectionSaved'));
          }}
          className="px-6 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          {t('saveReflection')}
        </button>
        <Link
          href="/dashboard"
          className="px-6 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
        >
          {t('expressMore')}
        </Link>
      </motion.div>
    </motion.main>
  );
}
