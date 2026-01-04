import { NextRequest, NextResponse } from 'next/server';
import { logPageVisit, logRequest } from '@/lib/monitoring';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  try {
    const { page } = await request.json();
    const userAgent = request.headers.get('user-agent') || 'unknown';

    logPageVisit(page, userAgent, ip);

    // Log the API request itself
    const duration = Date.now() - startTime;
    logRequest('/api/track-page', 'POST', 200, duration, ip);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Page tracking error:', error);
    
    // Log the failed request
    const duration = Date.now() - startTime;
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    logRequest('/api/track-page', 'POST', 500, duration, ip);
    
    return NextResponse.json(
      { error: 'Failed to track page' },
      { status: 500 }
    );
  }
}
