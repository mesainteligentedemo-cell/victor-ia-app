"use client";

import { Button } from "@/components/shared/Button";
import { useState } from "react";

export default function TemplatesPage() {
  const [templates] = useState([
    { id: 1, name: "Sales Email", category: "Email", usage: 45, rating: 4.8 },
    { id: 2, name: "Product Launch", category: "Presentation", usage: 23, rating: 4.9 },
    { id: 3, name: "Lead Qualification", category: "Form", usage: 67, rating: 4.7 },
    { id: 4, name: "Blog Post Outline", category: "Content", usage: 89, rating: 4.6 },
  ]);

  const categories = ["All", "Email", "Presentation", "Form", "Content"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filtered = selectedCategory === "All" ? templates : templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">Ready-to-use templates</p>
        </div>
        <Button variant="primary">+ Create</Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded whitespace-nowrap font-semibold transition ${
              selectedCategory === cat
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <div key={template.id} className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-black dark:text-white">{template.name}</h3>
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">★ {template.rating}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">{template.usage} uses</p>
            <Button variant="primary" size="sm" className="w-full">
              Use Template
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
