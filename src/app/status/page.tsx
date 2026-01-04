'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface Analytics {
  totalPageVisits: number;
  totalRequests: number;
  pageStats: Record<string, number>;
  methodStats: Record<string, number>;
  endpointStats: Record<string, number>;
  avgResponseTime: number;
  visits24h: number;
  requests24h: number;
  uptime: number;
  totalServices: number;
}

interface Service {
  name: string;
  status: 'up' | 'down';
  lastChecked: string;
  responseTime: number;
}

interface Request {
  endpoint: string;
  method: string;
  timestamp: string;
  statusCode: number;
  duration: number;
  ip: string;
}

interface StatusData {
  status: string;
  timestamp: string;
  analytics: Analytics;
  services: Service[];
  recentRequests: Request[];
  recentVisits: Array<{
    page: string;
    timestamp: string;
    userAgent: string;
    ip: string;
  }>;
}

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'services'>('overview');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/status');
      if (!response.ok) throw new Error('Failed to fetch status');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-700 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading status...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-lg p-8 shadow">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'Failed to load status'}</p>
          <button
            onClick={fetchStatus}
            className="px-6 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { analytics, services, recentRequests, recentVisits } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-stone-800">Status</h1>
            <p className="text-stone-600 mt-1">Service monitoring & analytics</p>
          </div>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50 border border-stone-200"
          >
            <RefreshCw className={`w-5 h-5 text-stone-700 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            title="Total Visits"
            value={analytics.totalPageVisits}
            subtitle={`${analytics.visits24h} in 24h`}
          />
          <StatCard
            title="Total Requests"
            value={analytics.totalRequests}
            subtitle={`${analytics.requests24h} in 24h`}
          />
          <StatCard
            title="Avg Response"
            value={`${analytics.avgResponseTime.toFixed(2)}ms`}
            subtitle="API performance"
          />
          <StatCard
            title="Services"
            value={`${analytics.uptime}/${analytics.totalServices}`}
            subtitle="Healthy services"
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow"
        >
          {/* Tab Navigation */}
          <div className="flex border-b border-stone-200">
            {(['overview', 'requests', 'services'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-stone-800 border-b-2 border-stone-800'
                    : 'text-stone-600 hover:text-stone-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab analytics={analytics} />
            )}
            {activeTab === 'requests' && <RequestsTab requests={recentRequests} />}
            {activeTab === 'services' && <ServicesTab services={services} />}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center text-stone-600 text-sm">
          Last updated: {new Date(data.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg p-6 shadow border border-stone-200 hover:border-stone-300 transition-colors"
    >
      <p className="text-sm text-stone-600 mb-2">{title}</p>
      <p className="text-3xl font-bold text-stone-800 mb-1">{value}</p>
      <p className="text-xs text-stone-500">{subtitle}</p>
    </motion.div>
  );
}

function OverviewTab({ analytics }: { analytics: Analytics }) {
  return (
    <div className="space-y-8">
      {/* Page Stats */}
      <div>
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Top Pages</h3>
        <div className="space-y-2">
          {Object.entries(analytics.pageStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([page, count]) => (
              <div key={page} className="flex items-center justify-between bg-stone-50 p-3 rounded border border-stone-100">
                <span className="text-stone-700 text-sm">{page}</span>
                <span className="font-semibold text-stone-800">{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Method Stats */}
      <div>
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Request Methods</h3>
        <div className="space-y-2">
          {Object.entries(analytics.methodStats).map(([method, count]) => (
            <div key={method} className="flex items-center justify-between bg-stone-50 p-3 rounded border border-stone-100">
              <span className="text-stone-700 font-mono text-sm">{method}</span>
              <span className="font-semibold text-stone-800">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RequestsTab({ requests }: { requests: Request[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">Recent Requests</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="text-left py-3 px-3 text-stone-700 font-semibold">Endpoint</th>
              <th className="text-left py-3 px-3 text-stone-700 font-semibold">Method</th>
              <th className="text-left py-3 px-3 text-stone-700 font-semibold">Status</th>
              <th className="text-left py-3 px-3 text-stone-700 font-semibold">Time</th>
              <th className="text-left py-3 px-3 text-stone-700 font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, idx) => (
              <tr key={idx} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="py-3 px-3 text-stone-600 font-mono text-xs">{req.endpoint}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-stone-100 text-stone-700">
                    {req.method}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    req.statusCode === 200
                      ? 'bg-green-100 text-green-700'
                      : req.statusCode >= 400
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {req.statusCode}
                  </span>
                </td>
                <td className="py-3 px-3 text-stone-600 text-xs">
                  {new Date(req.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-3 px-3 text-stone-600 text-xs font-mono">
                  {req.duration.toFixed(2)}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServicesTab({ services }: { services: Service[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">Service Status</h3>
      <div className="space-y-3">
        {services.length === 0 ? (
          <p className="text-stone-600">No services registered yet</p>
        ) : (
          services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between bg-stone-50 p-4 rounded border border-stone-100"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    service.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{service.name}</p>
                  <p className="text-xs text-stone-500">
                    {new Date(service.lastChecked).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-stone-800 text-sm">{service.status.toUpperCase()}</p>
                <p className="text-xs text-stone-600">{service.responseTime.toFixed(2)}ms</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
