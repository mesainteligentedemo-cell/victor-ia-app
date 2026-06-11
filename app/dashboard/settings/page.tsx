"use client";

import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-black dark:text-white">Settings</h1>

      <div className="space-y-6">
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">Profile</h2>
          <div className="space-y-4">
            <Input placeholder="Full Name" defaultValue="User" />
            <Input type="email" placeholder="Email" defaultValue="user@example.com" />
            <Input placeholder="Company" />
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>

        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">Preferences</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm text-black dark:text-white">Email notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm text-black dark:text-white">Weekly digest</span>
            </label>
          </div>
        </div>

        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">Danger Zone</h2>
          <Button variant="danger" className="w-full">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
