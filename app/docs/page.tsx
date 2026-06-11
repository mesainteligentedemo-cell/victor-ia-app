export default function DocsPage() {
  const endpoints = [
    { method: "POST", path: "/api/generate", description: "Generate content (images, videos, etc)" },
    { method: "GET", path: "/api/agents", description: "List available agents" },
    { method: "POST", path: "/api/agents", description: "Execute an agent" },
    { method: "GET", path: "/api/crm", description: "Get CRM metrics" },
    { method: "POST", path: "/api/crm", description: "Create or update prospect" },
    { method: "GET", path: "/api/analytics", description: "Get analytics dashboard" },
    { method: "POST", path: "/api/analytics", description: "Track event" },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-black dark:text-white mb-4">API Documentation</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">Complete reference for Victor IA SaaS API</p>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Authentication</h2>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All requests require Clerk authentication. Include your session token in the Authorization header.
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm font-mono text-black dark:text-white overflow-x-auto">
              {`Authorization: Bearer YOUR_TOKEN`}
            </pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Endpoints</h2>
          <div className="space-y-4">
            {endpoints.map((endpoint, i) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
                <div className="flex items-center gap-4 mb-2">
                  <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded font-semibold text-sm">
                    {endpoint.method}
                  </span>
                  <code className="font-mono text-black dark:text-white">{endpoint.path}</code>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{endpoint.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Rate Limiting</h2>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Free plan: 100 requests/minute</li>
              <li>• Pro plan: 1,000 requests/minute</li>
              <li>• Enterprise: Custom limits</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Error Handling</h2>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            <p className="text-gray-700 dark:text-gray-300 mb-4">All errors return standard JSON response:</p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm font-mono text-black dark:text-white overflow-x-auto">
              {`{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00Z"
}`}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
