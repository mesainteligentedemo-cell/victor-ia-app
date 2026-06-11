"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/shared/Input";
import { searchResults, saveSearch, getRecentSearches } from "@/lib/search/search";
import { useClickOutside } from "@/lib/hooks";
import Link from "next/link";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const found = searchResults(query);
      setResults(found);
      setIsOpen(true);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (resultQuery: string) => {
    saveSearch(resultQuery);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <Input
        placeholder="Search pages, agents, documents..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full"
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="space-y-1 p-2">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  onClick={() => handleSelect(query)}
                  className="block p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <p className="font-semibold text-black dark:text-white">{result.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{result.description}</p>
                  <div className="flex gap-1 mt-1">
                    {result.tags.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-400">No results found</div>
          ) : (
            <div className="p-4">
              {recent.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Recent Searches</p>
                  <div className="space-y-1">
                    {recent.map((search) => (
                      <button
                        key={search}
                        onClick={() => {
                          setQuery(search);
                          handleSelect(search);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
