'use client';

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Edit3, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import documentAnalytics from '@/lib/analytics/document-analytics';

interface DocumentAnalyticsDashboardProps {
  documentId: string;
}

export function DocumentAnalyticsDashboard({ documentId }: DocumentAnalyticsDashboardProps) {
  const metrics = documentAnalytics.getMetrics(documentId);
  const stats = documentAnalytics.getStatistics(documentId);
  const contributions = documentAnalytics.getUserContributions(documentId);
  const topContributors = documentAnalytics.getTopContributors(documentId);
  const heatmap = documentAnalytics.getEditHeatmap(documentId);

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No analytics data available yet</p>
      </div>
    );
  }

  // Prepare chart data
  const contributorChartData = topContributors.map((c) => ({
    name: c.userName,
    edits: c.edits,
    comments: c.commentsAdded + c.repliesAdded,
  }));

  const activityByDay = [
    { day: 'Mon', edits: 0, comments: 0 },
    { day: 'Tue', edits: 0, comments: 0 },
    { day: 'Wed', edits: 0, comments: 0 },
    { day: 'Thu', edits: 0, comments: 0 },
    { day: 'Fri', edits: 0, comments: 0 },
    { day: 'Sat', edits: 0, comments: 0 },
    { day: 'Sun', edits: 0, comments: 0 },
  ];

  heatmap.forEach((h) => {
    const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(h.day);
    if (dayIndex >= 0) {
      activityByDay[dayIndex].edits += h.edits;
      activityByDay[dayIndex].comments += h.comments;
    }
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Edit3}
          label="Total Edits"
          value={stats.totalEdits}
          subtext={`${stats.editFrequency} per day`}
        />

        <MetricCard
          icon={MessageSquare}
          label="Comments"
          value={stats.totalComments}
          subtext="Discussions & feedback"
        />

        <MetricCard
          icon={Users}
          label="Collaborators"
          value={stats.totalContributors}
          subtext={stats.mostActiveContributor?.userName || 'No edits yet'}
        />

        <MetricCard
          icon={TrendingUp}
          label="Average Edit Size"
          value={stats.averageEditSize}
          subtext="Words per edit"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity by Day */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Activity by Day</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="edits" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="comments" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Contributors */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Contributors</h3>

          {contributorChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contributorChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="edits" fill="#3B82F6" />
                <Bar dataKey="comments" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No contributor data yet</p>
          )}
        </div>
      </div>

      {/* Detailed Contributions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Detailed Contributions</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">User</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Edits</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Comments</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Words</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">% of Doc</th>
              </tr>
            </thead>

            <tbody>
              {contributions.map((c) => (
                <tr key={c.userId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{c.userName}</td>
                  <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">{c.edits}</td>
                  <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">
                    {c.commentsAdded + c.repliesAdded}
                  </td>
                  <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">{c.wordCount}</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${c.percentageOfDocument}%` }}
                        />
                      </div>
                      <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                        {c.percentageOfDocument.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Created</p>
          <p className="text-lg font-semibold text-blue-900 dark:text-blue-200 mt-1">
            {new Date(metrics.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Last Modified</p>
          <p className="text-lg font-semibold text-green-900 dark:text-green-200 mt-1">
            {new Date(metrics.lastModified).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-4">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Words</p>
          <p className="text-lg font-semibold text-purple-900 dark:text-purple-200 mt-1">
            {Math.round(metrics.totalCharacters / 5)}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Metric Card Component
 */
interface MetricCardProps {
  icon: React.ComponentType<{ className: string }>;
  label: string;
  value: number | string;
  subtext: string;
}

function MetricCard({ icon: Icon, label, value, subtext }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>

      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtext}</p>
    </div>
  );
}