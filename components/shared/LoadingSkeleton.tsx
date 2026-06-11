"use client";

export function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-1/3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2 animate-pulse" />
          <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
