"use client";

import Link from "next/link";

const ADMIN_MENU = [
  { name: "Dashboard", path: "/admin" },
  { name: "Users", path: "/admin/users" },
  { name: "Reports", path: "/admin/reports" },
  { name: "Settings", path: "/admin/settings" },
  { name: "Logs", path: "/admin/logs" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 p-6">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-8">Admin Panel</h1>
        <nav className="space-y-2">
          {ADMIN_MENU.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-black dark:text-white font-medium transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
