'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

export default function Dashboard() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <LanguageSwitcher />
      <motion.main
        key={language}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto w-full text-center"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-bold text-stone-800 mb-10"
        >
          {t('dashboardTitle')}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/express/text"
              className="block bg-white border border-stone-200 rounded-lg p-8 hover:border-stone-300 hover:shadow-lg transition-all duration-300 text-stone-800"
            >
              <h2 className="text-xl font-semibold mb-2">{t('writeThoughts')}</h2>
              <p className="text-stone-600">{t('writeDesc')}</p>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/express/image"
              className="block bg-white border border-stone-200 rounded-lg p-8 hover:border-stone-300 hover:shadow-lg transition-all duration-300 text-stone-800"
            >
              <h2 className="text-xl font-semibold mb-2">{t('uploadImage')}</h2>
              <p className="text-stone-600">{t('uploadDesc')}</p>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
        >
          <Link
            href="/timeline"
            className="text-stone-700 hover:text-stone-800 underline transition-colors"
          >
            {t('viewTimeline')}
          </Link>
        </motion.div>
      </motion.main>
    </div>
  );
}