'use client';

import { useState } from 'react';
import Link from 'next/link';

const MODULES = [
  { name: 'Generators', path: '/dashboard/generators', icon: '✨' },
  { name: 'Agents', path: '/dashboard/agents', icon: '🤖' },
  { name: 'CRM', path: '/dashboard/crm', icon: '📊' },
  { name: 'Automation', path: '/dashboard/automation', icon: '⚙️' },
  { name: 'Analytics', path: '/dashboard/analytics', icon: '📈' },
  { name: 'Training', path: '/dashboard/training', icon: '🎓' },
  { name: 'HR', path: '/dashboard/hr', icon: '👥' },
  { name: 'Finance', path: '/dashboard/finance', icon: '💰' },
  { name: 'Integrations', path: '/dashboard/integrations', icon: '🔗' },
  { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' }
];

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white dark:bg-black">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-lg text-black dark:text-white">Victor IA</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded">
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {MODULES.map((module) => (
            <Link
              key={module.path}
              href={module.path}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition text-black dark:text-white"
            >
              <span className="text-xl">{module.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{module.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button className="w-full px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded font-semibold hover:shadow-md transition text-sm">
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
