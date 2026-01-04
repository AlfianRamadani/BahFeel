import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

interface PageVisit {
  page: string;
  timestamp: string;
  userAgent: string;
  ip: string;
}

interface RequestLog {
  endpoint: string;
  method: string;
  timestamp: string;
  statusCode: number;
  duration: number;
  ip: string;
}

interface ServiceStatus {
  name: string;
  status: 'up' | 'down';
  lastChecked: string;
  responseTime: number;
}

interface MonitoringData {
  pageVisits: PageVisit[];
  requests: RequestLog[];
  services: ServiceStatus[];
  lastUpdated: string;
}

// Get data directory path
function getDataDir(): string {
  if (process.env.NODE_ENV === 'production') {
    return '/tmp/bahfeel';
  }
  
  // In development, use relative path from project root
  return 'data';
}

const MONITORING_FILE = 'monitoring.json';

// Ensure directory exists
function ensureDataDir(): string {
  const dir = getDataDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// Get full path to monitoring file
function getMonitoringPath(): string {
  const dir = ensureDataDir();
  return `${dir}/${MONITORING_FILE}`;
}

// Load monitoring data
function loadMonitoringData(): MonitoringData {
  ensureDataDir();
  try {
    const filePath = getMonitoringPath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading monitoring data:', error);
  }
  
  return {
    pageVisits: [],
    requests: [],
    services: [],
    lastUpdated: new Date().toISOString(),
  };
}

// Save monitoring data
function saveMonitoringData(data: MonitoringData): void {
  ensureDataDir();
  try {
    const filePath = getMonitoringPath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving monitoring data:', error);
  }
}

// Log page visit
export function logPageVisit(page: string, userAgent: string, ip: string): void {
  const data = loadMonitoringData();
  
  data.pageVisits.push({
    page,
    timestamp: new Date().toISOString(),
    userAgent: userAgent.substring(0, 200),
    ip,
  });

  // Keep only last 10000 visits to avoid file getting too large
  if (data.pageVisits.length > 10000) {
    data.pageVisits = data.pageVisits.slice(-10000);
  }

  data.lastUpdated = new Date().toISOString();
  saveMonitoringData(data);
}

// Log API request
export function logRequest(
  endpoint: string,
  method: string,
  statusCode: number,
  duration: number,
  ip: string
): void {
  const data = loadMonitoringData();
  
  data.requests.push({
    endpoint,
    method,
    timestamp: new Date().toISOString(),
    statusCode,
    duration,
    ip,
  });

  // Keep only last 10000 requests
  if (data.requests.length > 10000) {
    data.requests = data.requests.slice(-10000);
  }

  data.lastUpdated = new Date().toISOString();
  saveMonitoringData(data);
}

// Update service status
export function updateServiceStatus(
  name: string,
  status: 'up' | 'down',
  responseTime: number
): void {
  const data = loadMonitoringData();
  
  const serviceIndex = data.services.findIndex(s => s.name === name);
  
  if (serviceIndex !== -1) {
    data.services[serviceIndex] = {
      name,
      status,
      lastChecked: new Date().toISOString(),
      responseTime,
    };
  } else {
    data.services.push({
      name,
      status,
      lastChecked: new Date().toISOString(),
      responseTime,
    });
  }

  data.lastUpdated = new Date().toISOString();
  saveMonitoringData(data);
}

// Get monitoring data
export function getMonitoringData(): MonitoringData {
  return loadMonitoringData();
}

// Get analytics
export function getAnalytics() {
  const data = loadMonitoringData();

  // Page visits stats
  const pageStats: Record<string, number> = {};
  data.pageVisits.forEach(visit => {
    pageStats[visit.page] = (pageStats[visit.page] || 0) + 1;
  });

  // Request stats
  const methodStats: Record<string, number> = {};
  const endpointStats: Record<string, number> = {};
  let avgResponseTime = 0;
  let totalResponseTime = 0;

  data.requests.forEach(req => {
    methodStats[req.method] = (methodStats[req.method] || 0) + 1;
    endpointStats[req.endpoint] = (endpointStats[req.endpoint] || 0) + 1;
    totalResponseTime += req.duration;
  });

  if (data.requests.length > 0) {
    avgResponseTime = totalResponseTime / data.requests.length;
  }

  // Get last 24h stats
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const visits24h = data.pageVisits.filter(
    v => new Date(v.timestamp) > twentyFourHoursAgo
  ).length;

  const requests24h = data.requests.filter(
    r => new Date(r.timestamp) > twentyFourHoursAgo
  ).length;

  return {
    totalPageVisits: data.pageVisits.length,
    totalRequests: data.requests.length,
    pageStats,
    methodStats,
    endpointStats,
    avgResponseTime: Math.round(avgResponseTime * 100) / 100,
    visits24h,
    requests24h,
    uptime: data.services.filter(s => s.status === 'up').length,
    totalServices: data.services.length,
  };
}
