import { useEffect, useState } from 'react';
import { adminApi } from '../../api/apiClient';
import Sidebar from '../../components/Sidebar';
import { Link } from 'react-router-dom';

interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  totalEvents: number;
  recentBookings: number;
  eventStats: Array<{
    title: string;
    ticketsSold: number;
    revenue: number;
    availableSeats: number;
  }>;
  revenueByDate: Array<{
    date: string;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const res = await adminApi().get('/analytics/dashboard');
      setAnalytics(res.data.data || res.data);
    } catch (e: any) {
      console.error('Failed to load analytics', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-30">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm"
            >
              Back to Home
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-gray-400 text-lg">Loading analytics...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm font-medium">Total Revenue</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        ₹{analytics?.totalRevenue?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="bg-purple-500/30 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Total Bookings</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {analytics?.totalBookings || 0}
                      </p>
                    </div>
                    <div className="bg-blue-500/30 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm font-medium">Total Events</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {analytics?.totalEvents || 0}
                      </p>
                    </div>
                    <div className="bg-green-500/30 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-200 text-sm font-medium">Recent Bookings</p>
                      <p className="text-3xl font-bold text-white mt-2">
                        {analytics?.recentBookings || 0}
                      </p>
                      <p className="text-xs text-pink-200 mt-1">Last 7 days</p>
                    </div>
                    <div className="bg-pink-500/30 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Statistics */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700 p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-6">Event Performance</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Event</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Tickets Sold</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Available</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.eventStats?.map((event, idx) => (
                        <tr key={idx} className="border-b border-gray-800 hover:bg-gray-700/30">
                          <td className="py-4 px-4 text-white">{event.title}</td>
                          <td className="py-4 px-4 text-right text-blue-400 font-semibold">
                            {event.ticketsSold}
                          </td>
                          <td className="py-4 px-4 text-right text-green-400">
                            {event.availableSeats}
                          </td>
                          <td className="py-4 px-4 text-right text-purple-400 font-semibold">
                            ₹{event.revenue.toFixed(2)}
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-500">
                            No event data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Revenue Chart (Simple Bar Chart) */}
              {analytics?.revenueByDate && analytics.revenueByDate.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Revenue Trend (Last 7 Days)</h2>
                  <div className="space-y-4">
                    {analytics.revenueByDate.map((item, idx) => {
                      const maxRevenue = Math.max(...analytics.revenueByDate.map(d => d.revenue));
                      const widthPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                      
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-24 text-sm text-gray-400">
                            {new Date(item.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="flex-1 bg-gray-700/50 rounded-full h-8 relative overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full flex items-center justify-end px-3"
                              style={{ width: `${Math.max(widthPercent, 5)}%` }}
                            >
                              <span className="text-white text-sm font-semibold">
                                ₹{item.revenue.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
