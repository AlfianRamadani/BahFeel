'use client';

import { Suspense } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { ReflectionContent } from './content';

export default function ReflectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <LanguageSwitcher />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-700 mx-auto mb-4"></div>
            <p className="text-stone-600">Loading...</p>
          </div>
        </div>
      }>
        <ReflectionContent />
      </Suspense>
    </div>
  );
}