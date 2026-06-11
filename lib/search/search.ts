export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "page" | "document" | "agent" | "prospect" | "workflow";
  url: string;
  tags: string[];
  lastModified: Date;
}

export interface SearchFilters {
  type?: SearchResult["type"];
  tags?: string[];
  dateRange?: { start: Date; end: Date };
}

export const SEARCH_INDEX: SearchResult[] = [
  {
    id: "gen-1",
    title: "Image Generator",
    description: "Generate images with AI",
    type: "page",
    url: "/dashboard/generators",
    tags: ["generators", "images", "ai"],
    lastModified: new Date(),
  },
  {
    id: "crm-1",
    title: "Sales Pipeline",
    description: "Manage your sales prospects",
    type: "page",
    url: "/dashboard/crm",
    tags: ["crm", "sales", "pipeline"],
    lastModified: new Date(),
  },
  {
    id: "agent-1",
    title: "Lead Qualifier Agent",
    description: "Automatically qualify leads",
    type: "agent",
    url: "/dashboard/agents",
    tags: ["agents", "sales", "automation"],
    lastModified: new Date(),
  },
  {
    id: "analytics-1",
    title: "Analytics Dashboard",
    description: "Real-time metrics and insights",
    type: "page",
    url: "/dashboard/analytics",
    tags: ["analytics", "metrics", "reports"],
    lastModified: new Date(),
  },
];

export function searchResults(query: string, filters?: SearchFilters): SearchResult[] {
  let results = SEARCH_INDEX.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));

    if (!matchesQuery) return false;

    if (filters?.type && item.type !== filters.type) return false;
    if (filters?.tags && !filters.tags.some((tag) => item.tags.includes(tag))) return false;

    return true;
  });

  return results.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("recentSearches");
  return stored ? JSON.parse(stored) : [];
}

export function saveSearch(query: string): void {
  if (typeof window === "undefined") return;
  const recent = getRecentSearches();
  const updated = [query, ...recent.filter((q) => q !== query)].slice(0, 5);
  localStorage.setItem("recentSearches", JSON.stringify(updated));
}

export function getAllTags(): string[] {
  const allTags = new Set<string>();
  SEARCH_INDEX.forEach((item) => item.tags.forEach((tag) => allTags.add(tag)));
  return Array.from(allTags).sort();
}
