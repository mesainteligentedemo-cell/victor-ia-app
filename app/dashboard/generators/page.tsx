"use client";

import { useGeneratorsStore } from "@/lib/stores";

export default function GeneratorsPage() {
  const { generations, isLoading } = useGeneratorsStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Generators</h1>
        <p className="text-gray-600 dark:text-gray-400">Create AI-powered content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Image", "Video", "Presentation", "Email"].map((type) => (
          <div key={type} className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-black dark:text-white">{type}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
