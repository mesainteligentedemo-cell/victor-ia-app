"use client";

export default function CRMPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">CRM</h1>
      <p className="text-gray-600 dark:text-gray-400">Manage your sales pipeline</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Total", "Contacted", "Qualified", "Won"].map((stage) => (
          <div key={stage} className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">{stage}</p>
            <p className="text-2xl font-bold text-black dark:text-white">0</p>
          </div>
        ))}
      </div>
    </div>
  );
}
