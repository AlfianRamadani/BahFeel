'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Log page visit
    const trackPage = async () => {
      try {
        await fetch('/api/track-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: pathname }),
        });
      } catch (error) {
        console.error('Failed to track page:', error);
      }
    };

    trackPage();
  }, [pathname]);

  return null;
}
