// Contoh penggunaan monitoring system di berbagai file

// ============================================================================
// 1. MONITOR SERVICE HEALTH - Contoh di reflect route
// ============================================================================

// File: src/app/api/reflect/route.ts
import { updateServiceStatus } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // ... your code ...
    const completion = await openai.chat.completions.create({
      // ... config ...
    });

    const responseTime = Date.now() - startTime;
    
    // Update service status ke monitoring
    updateServiceStatus('OpenAI API', 'up', responseTime);
    
    // ... rest of code ...
  } catch (error) {
    // Mark service as down if error
    updateServiceStatus('OpenAI API', 'down', 0);
    throw error;
  }
}

// ============================================================================
// 2. FETCH STATUS DATA PROGRAMMATICALLY
// ============================================================================

// Di any component atau file:
async function getAppStatus() {
  const response = await fetch('/api/status');
  const data = await response.json();
  
  console.log('Total visits:', data.analytics.totalPageVisits);
  console.log('Total requests:', data.analytics.totalRequests);
  console.log('Avg response time:', data.analytics.avgResponseTime);
  console.log('Healthy services:', data.analytics.uptime, '/', data.analytics.totalServices);
  
  return data;
}

// ============================================================================
// 3. CREATE DASHBOARD WITH STATUS DATA
// ============================================================================

// Component yang menampilkan status ringkas
'use client';
import { useEffect, useState } from 'react';

export function StatusWidget() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStats(data.analytics);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Refresh per menit
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <p>✨ Visitors: {stats.totalPageVisits}</p>
      <p>📊 API Calls: {stats.totalRequests}</p>
      <p>⚡ Response: {stats.avgResponseTime}ms</p>
      <p>🟢 Services: {stats.uptime}/{stats.totalServices}</p>
    </div>
  );
}

// ============================================================================
// 4. SETUP SERVICE HEALTH CHECKS
// ============================================================================

// File: src/lib/serviceMonitor.ts - Setup background checks
import { updateServiceStatus } from './monitoring';

export async function checkServiceHealth() {
  // Check OpenAI API
  try {
    const start = Date.now();
    // Make a simple test request
    const duration = Date.now() - start;
    updateServiceStatus('OpenAI API', 'up', duration);
  } catch {
    updateServiceStatus('OpenAI API', 'down', 0);
  }

  // Check Database
  try {
    const start = Date.now();
    // Your database health check
    const duration = Date.now() - start;
    updateServiceStatus('Database', 'up', duration);
  } catch {
    updateServiceStatus('Database', 'down', 0);
  }
}

// Call this dari layout atau startup function
// Misalnya: setInterval(() => checkServiceHealth(), 60000); // Every minute

// ============================================================================
// 5. FILTER/EXPORT ANALYTICS DATA
// ============================================================================

// Get specific analytics untuk report
async function getAnalyticsReport(options: {
  pageFilter?: string;
  timeRange?: 'today' | '7days' | '30days';
}) {
  const response = await fetch('/api/status');
  const data = await response.json();
  
  const { pageStats, methodStats, endpointStats } = data.analytics;
  
  // Filter by page if provided
  if (options.pageFilter) {
    const filtered = Object.fromEntries(
      Object.entries(pageStats).filter(([page]) => page.includes(options.pageFilter!))
    );
    return { ...data.analytics, pageStats: filtered };
  }
  
  return data.analytics;
}

// Usage:
// const report = await getAnalyticsReport({ pageFilter: '/express' });

// ============================================================================
// 6. REALTIME MONITORING WITH WEBSOCKET (Optional Enhancement)
// ============================================================================

// Jika ingin realtime updates, bisa tambahkan:
'use client';
export function RealtimeStatusMonitor() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Poll every 5 seconds untuk realtime feel
    const interval = setInterval(async () => {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Or use WebSocket untuk true realtime:
  // const ws = new WebSocket('ws://localhost:3001/status');
  // ws.onmessage = (event) => setStatus(JSON.parse(event.data));
}

// ============================================================================
// 7. SETUP IN PRODUCTION
// ============================================================================

// Environment variables (untuk .env.local atau deployment):
// NODE_ENV=production (automatic use /tmp/bahfeel)

// Directory permissions:
// - Development: data/ folder auto-created di project root
// - Production: /tmp/bahfeel/ auto-created (writable)

// For Docker:
// - Mount volume: -v /tmp:/tmp (to persist data)
// - Or: -v app-data:/tmp/bahfeel (named volume)

// ============================================================================
// 8. MONITORING DATA CLEANUP (Optional)
// ============================================================================

// Jika ingin manual cleanup data lama:
import * as fs from 'fs';
import * as path from 'path';

export function cleanupOldData(daysToKeep: number = 7) {
  const DATA_DIR = 'data';
  const MONITORING_FILE = path.join(DATA_DIR, 'monitoring.json');
  
  const data = JSON.parse(fs.readFileSync(MONITORING_FILE, 'utf-8'));
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - daysToKeep * 24 * 60 * 60 * 1000);
  
  // Filter data older than cutoff
  data.pageVisits = data.pageVisits.filter(
    (v: any) => new Date(v.timestamp) > cutoffDate
  );
  
  data.requests = data.requests.filter(
    (r: any) => new Date(r.timestamp) > cutoffDate
  );
  
  fs.writeFileSync(MONITORING_FILE, JSON.stringify(data, null, 2));
}

// ============================================================================
// QUICK START CHECKLIST
// ============================================================================

/*
1. Files sudah dibuat? ✓
2. Build berhasil? → npm run build
3. Test page visit:
   - Buka http://localhost:3000/
   - Lihat data/monitoring.json auto-created
4. Test API call:
   - Ketik sesuatu dan klik "Reflect"
   - Check monitoring.json ada request baru
5. View status dashboard:
   - Buka http://localhost:3000/status
   - Lihat analytics dan requests
6. Customize:
   - Tambah service checks di route yang perlu
   - Customize stat cards styling di status/page.tsx
   - Adjust refresh interval sesuai kebutuhan
*/
