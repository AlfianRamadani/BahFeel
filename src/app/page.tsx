'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 relative">
      <LanguageSwitcher />
      <motion.main
        key={language}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl font-bold text-stone-800 mb-6"
        >
          {t('appName')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-stone-700 mb-8"
        >
          {t('tagline')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg text-stone-700 mb-10 leading-relaxed"
        >
          {t('problem')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-6"
        >
          <Link
            href="/dashboard"
            className="inline-block bg-stone-700 text-white px-10 py-4 rounded-lg hover:bg-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t('startExpressing')}
          </Link>
          <p className="text-sm text-stone-600">
            {t('privacy')}
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
}
