"use client";

export default function AutomationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black dark:text-white">Automation</h1>
      <p className="text-gray-600 dark:text-gray-400">Connect and manage n8n workflows</p>
      <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-semibold hover:shadow-md">
        Create Workflow
      </button>
    </div>
  );
}
