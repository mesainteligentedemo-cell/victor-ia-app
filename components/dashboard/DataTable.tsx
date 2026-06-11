"use client";

import { useState } from "react";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";

interface Column {
  key: string;
  header: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchable?: boolean;
  paginated?: boolean;
  pageSize?: number;
}

export function DataTable({ data, columns, searchable, paginated, pageSize = 10 }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = data.filter((row) =>
    columns.some((col) => String(row[col.key]).toLowerCase().includes(search.toLowerCase()))
  );

  const paged = paginated ? filtered.slice(page * pageSize, (page + 1) * pageSize) : filtered;
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="space-y-4">
      {searchable && (
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      )}

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold text-black dark:text-white">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {col.render ? col.render(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paged.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">No data found</div>
      )}

      {paginated && totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
