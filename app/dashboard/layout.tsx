"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useAuthUser } from "@/lib/hooks/useAuthUser";

const MODULES = [
  { name: "Generators", path: "/dashboard/generators", icon: "✨" },
  { name: "Agents", path: "/dashboard/agents", icon: "🤖" },
  { name: "CRM", path: "/dashboard/crm", icon: "📊" },
  { name: "Automation", path: "/dashboard/automation", icon: "⚙️" },
  { name: "Analytics", path: "/dashboard/analytics", icon: "📈" },
];

const TOOLS = [
  { name: "Team", path: "/dashboard/team", icon: "🤝" },
  { name: "Templates", path: "/dashboard/templates", icon: "📋" },
  { name: "Billing", path: "/dashboard/billing", icon: "💳" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useRequireAuth();
  const { user } = useAuthUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col overflow-hidden ${
          mobileMenuOpen ? "fixed inset-0 z-40 w-64" : "hidden lg:flex"
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {(sidebarOpen || mobileMenuOpen) && (
            <h1 className="font-bold text-lg text-black dark:text-white">Victor IA</h1>
          )}
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setMobileMenuOpen(false);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
          >
            {sidebarOpen || mobileMenuOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {MODULES.map((module) => (
            <Link
              key={module.path}
              href={module.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition text-black dark:text-white text-sm"
            >
              <span className="text-lg min-w-6">{module.icon}</span>
              {(sidebarOpen || mobileMenuOpen) && <span>{module.name}</span>}
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            {(sidebarOpen || mobileMenuOpen) && (
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2 px-2">
                Tools
              </h3>
            )}
            {TOOLS.map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition text-black dark:text-white text-sm"
              >
                <span className="text-lg min-w-6">{tool.icon}</span>
                {(sidebarOpen || mobileMenuOpen) && <span>{tool.name}</span>}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {user && (
            <div className={`text-xs text-gray-600 dark:text-gray-400 mb-2 ${sidebarOpen || mobileMenuOpen ? "" : "hidden"}`}>
              <p className="truncate font-semibold text-black dark:text-white">{user.name}</p>
              <p className="truncate">💎 {user.credits} credits</p>
            </div>
          )}
          <button className="w-full px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-semibold hover:shadow-md transition text-sm">
            {sidebarOpen || mobileMenuOpen ? "Logout" : "🚪"}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-gray-200 dark:border-gray-800 p-3 md:p-4 flex items-center justify-between gap-4 bg-white dark:bg-gray-900">
          <div className="hidden md:flex flex-1 max-w-md">
            <SearchBar />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded">🔔</button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded">👤</button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-3 py-2 border-b border-gray-200 dark:border-gray-800">
          <SearchBar />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-3 md:p-8 w-full">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
