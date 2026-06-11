"use client";

import { BarChart, LineChart } from "@/components/charts";

export default function AdminDashboard() {
  const userData = [
    { label: "Active Users", value: 1234 },
    { label: "New Users", value: 89 },
    { label: "Inactive Users", value: 234 },
  ];

  const revenueData = [
    { label: "Jan", value: 45000 },
    { label: "Feb", value: 52000 },
    { label: "Mar", value: 48000 },
    { label: "Apr", value: 61000 },
    { label: "May", value: 55000 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-black dark:text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
          <p className="text-4xl font-bold text-black dark:text-white mt-2">1,557</p>
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-4xl font-bold text-black dark:text-white mt-2">$261k</p>
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</p>
          <p className="text-4xl font-bold text-black dark:text-white mt-2">234</p>
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">System Health</p>
          <p className="text-4xl font-bold text-black dark:text-white mt-2">99.9%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <BarChart data={userData} title="User Statistics" />
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <LineChart data={revenueData} title="Monthly Revenue" />
        </div>
      </div>
    </div>
  );
}
