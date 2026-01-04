import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics, getMonitoringData, logRequest } from '@/lib/monitoring';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  try {
    const analytics = getAnalytics();
    const monitoringData = getMonitoringData();

    // Log this request
    const duration = Date.now() - startTime;
    logRequest('/api/status', 'GET', 200, duration, ip);

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      analytics,
      services: monitoringData.services,
      recentRequests: monitoringData.requests.slice(-50),
      recentVisits: monitoringData.pageVisits.slice(-50),
    });
  } catch (error) {
    console.error('Status endpoint error:', error);
    
    // Log the failed request
    const duration = Date.now() - startTime;
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    logRequest('/api/status', 'GET', 500, duration, ip);
    
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
