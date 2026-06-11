"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";

const MODULES = [
  { name: "Generators", path: "/dashboard/generators", icon: "✨" },
  { name: "Agents", path: "/dashboard/agents", icon: "🤖" },
  { name: "CRM", path: "/dashboard/crm", icon: "📊" },
  { name: "Automation", path: "/dashboard/automation", icon: "⚙️" },
  { name: "Analytics", path: "/dashboard/analytics", icon: "📈" },
  { name: "Training", path: "/dashboard/training", icon: "🎓" },
  { name: "HR", path: "/dashboard/hr", icon: "👥" },
  { name: "Finance", path: "/dashboard/finance", icon: "💰" },
];

const TOOLS = [
  { name: "Team", path: "/dashboard/team", icon: "🤝" },
  { name: "Templates", path: "/dashboard/templates", icon: "📋" },
  { name: "Activity", path: "/dashboard/activity", icon: "📝" },
  { name: "Billing", path: "/dashboard/billing", icon: "💳" },
  { name: "Integrations", path: "/dashboard/integrations", icon: "🔗" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-lg text-black dark:text-white">Victor IA</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded">
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            {sidebarOpen && <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2 px-2">Modules</h3>}
            <div className="space-y-1">
              {MODULES.map((module) => (
                <Link
                  key={module.path}
                  href={module.path}
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition text-black dark:text-white"
                >
                  <span className="text-lg">{module.icon}</span>
                  {sidebarOpen && <span className="text-sm">{module.name}</span>}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            {sidebarOpen && <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2 px-2">Tools</h3>}
            <div className="space-y-1">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition text-black dark:text-white"
                >
                  <span className="text-lg">{tool.icon}</span>
                  {sidebarOpen && <span className="text-sm">{tool.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <button className="w-full px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-semibold hover:shadow-md transition text-sm">
            {sidebarOpen ? "Logout" : "🚪"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between bg-white dark:bg-gray-900">
          <SearchBar />
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded">🔔</button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded">👤</button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}
