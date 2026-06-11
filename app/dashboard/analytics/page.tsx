"use client";

import { useAnalyticsStore } from "@/lib/stores";
import { BarChart, LineChart, PieChart } from "@/components/charts";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/shared/Button";
import { useEffect } from "react";

export default function AnalyticsPage() {
  const { dashboard, activities, setDashboard, setActivities } = useAnalyticsStore();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/analytics?userId=user-id");
        if (res.ok) {
          const data = await res.json();
          setDashboard(data);
        }
      } catch (error) {
        console.error("Failed to fetch metrics", error);
      }
    };
    fetchMetrics();
  }, [setDashboard]);

  const sampleData = [
    { label: "Monday", value: 45 },
    { label: "Tuesday", value: 62 },
    { label: "Wednesday", value: 58 },
    { label: "Thursday", value: 71 },
    { label: "Friday", value: 89 },
  ];

  const chartData = [
    { label: "Generators", value: 234 },
    { label: "Agents", value: 189 },
    { label: "CRM", value: 156 },
    { label: "Analytics", value: 98 },
  ];

  const tableData = [
    { id: 1, name: "Content Generated", count: 234, status: "Success" },
    { id: 2, name: "Agents Executed", count: 189, status: "Success" },
    { id: 3, name: "Prospects Created", count: 45, status: "Success" },
    { id: 4, name: "Workflows Triggered", count: 12, status: "Success" },
  ];

  const tableColumns = [
    { key: "name", header: "Activity" },
    { key: "count", header: "Count" },
    { key: "status", header: "Status", render: (val: string) => (
      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded">
        {val}
      </span>
    )},
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time metrics and insights</p>
        </div>
        <Button variant="primary">Export Report</Button>
      </div>

      {/* KPI Cards */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Events</p>
            <p className="text-4xl font-bold text-black dark:text-white">{dashboard.totalEvents}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">+12% from yesterday</p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Time Invested</p>
            <p className="text-4xl font-bold text-black dark:text-white">{(dashboard.totalTimeSpent / 3600).toFixed(1)}h</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">+2.5h from yesterday</p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Session</p>
            <p className="text-4xl font-bold text-black dark:text-white">18m</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">-2m from yesterday</p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Conversion</p>
            <p className="text-4xl font-bold text-black dark:text-white">24.5%</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">+1.3% from yesterday</p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
          <LineChart data={sampleData} title="Events Over Time" />
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
          <BarChart data={chartData} title="Events by Module" />
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
          <PieChart data={chartData} title="Distribution" />
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
          <div>
            <h3 className="font-semibold text-black dark:text-white mb-4">Top Events</h3>
            <div className="space-y-2">
              {[
                { name: "Page View", count: 1250 },
                { name: "Button Click", count: 890 },
                { name: "Form Submit", count: 456 },
                { name: "File Download", count: 234 },
              ].map((event, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{event.name}</span>
                  <span className="text-sm font-semibold text-black dark:text-white">{event.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Activity Summary</h2>
        <DataTable data={tableData} columns={tableColumns} searchable paginated pageSize={5} />
      </div>
    </div>
  );
}
