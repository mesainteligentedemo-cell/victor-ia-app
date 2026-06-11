"use client";

export default function FinancePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-black dark:text-white">Finance</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
          <p className="text-4xl font-bold text-black dark:text-white">$0</p>
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Expenses</p>
          <p className="text-4xl font-bold text-black dark:text-white">$0</p>
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Profit</p>
          <p className="text-4xl font-bold text-black dark:text-white">$0</p>
        </div>
      </div>
    </div>
  );
}
