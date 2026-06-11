"use client";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">Agents</h1>
      <p className="text-gray-600 dark:text-gray-400">Deploy AI agents for automation</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Lead Qualifier", "Content Strategist", "SEO Expert"].map((agent) => (
          <div key={agent} className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-black dark:text-white">{agent}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
