import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Briefcase, DollarSign, Calendar, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface AnalyticsData {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    userGrowthRate: number;
  };
  projectStats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    projectsByStatus: Record<string, number>;
    averageProjectDuration: number;
  };
  engagementStats: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    averageSessionDuration: number;
    pageViews: number;
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageProjectValue: number;
    revenueGrowthRate: number;
  };
  timeSeriesData: {
    userRegistrations: Array<{ date: string; count: number }>;
    projectCreations: Array<{ date: string; count: number }>;
    revenue: Array<{ date: string; amount: number }>;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'projects' | 'revenue'>('overview');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">Failed to load analytics data</p>
      </div>
    );
  }

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change?: number;
    color: string;
  }> = ({ icon, title, value, change, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const projectStatusData = Object.entries(analytics.projectStats.projectsByStatus).map(([status, count]) => ({
    name: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'projects', label: 'Projects', icon: Briefcase },
            { key: 'revenue', label: 'Revenue', icon: DollarSign }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as any)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeView === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeView === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Users className="w-6 h-6 text-white" />}
              title="Total Users"
              value={analytics.userStats.totalUsers}
              change={analytics.userStats.userGrowthRate}
              color="bg-blue-500"
            />
            <StatCard
              icon={<Briefcase className="w-6 h-6 text-white" />}
              title="Active Projects"
              value={analytics.projectStats.activeProjects}
              color="bg-green-500"
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6 text-white" />}
              title="Monthly Revenue"
              value={formatCurrency(analytics.revenueStats.monthlyRevenue)}
              change={analytics.revenueStats.revenueGrowthRate}
              color="bg-purple-500"
            />
            <StatCard
              icon={<Activity className="w-6 h-6 text-white" />}
              title="Daily Active Users"
              value={analytics.engagementStats.dailyActiveUsers}
              color="bg-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Registrations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.timeSeriesData.userRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeView === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Users className="w-6 h-6 text-white" />}
              title="Total Users"
              value={analytics.userStats.totalUsers}
              color="bg-blue-500"
            />
            <StatCard
              icon={<Activity className="w-6 h-6 text-white" />}
              title="Active Users"
              value={analytics.userStats.activeUsers}
              color="bg-green-500"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="New This Month"
              value={analytics.userStats.newUsersThisMonth}
              color="bg-purple-500"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analytics.timeSeriesData.userRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeView === 'projects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={<Briefcase className="w-6 h-6 text-white" />}
              title="Total Projects"
              value={analytics.projectStats.totalProjects}
              color="bg-blue-500"
            />
            <StatCard
              icon={<Activity className="w-6 h-6 text-white" />}
              title="Active Projects"
              value={analytics.projectStats.activeProjects}
              color="bg-green-500"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="Completed"
              value={analytics.projectStats.completedProjects}
              color="bg-purple-500"
            />
            <StatCard
              icon={<Calendar className="w-6 h-6 text-white" />}
              title="Avg Duration"
              value={`${analytics.projectStats.averageProjectDuration.toFixed(1)} days`}
              color="bg-orange-500"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Creation Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.timeSeriesData.projectCreations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeView === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<DollarSign className="w-6 h-6 text-white" />}
              title="Total Revenue"
              value={formatCurrency(analytics.revenueStats.totalRevenue)}
              color="bg-green-500"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="Monthly Revenue"
              value={formatCurrency(analytics.revenueStats.monthlyRevenue)}
              change={analytics.revenueStats.revenueGrowthRate}
              color="bg-blue-500"
            />
            <StatCard
              icon={<BarChart3 className="w-6 h-6 text-white" />}
              title="Avg Project Value"
              value={formatCurrency(analytics.revenueStats.averageProjectValue)}
              color="bg-purple-500"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analytics.timeSeriesData.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area type="monotone" dataKey="amount" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;