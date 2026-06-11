import React from 'react';

interface Column {
  header: string;
  accessor: string;
  render?: (value: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  striped?: boolean;
}

const Table: React.FC<TableProps> = ({ columns, data, striped = true }) => {
  return (
    <div className="overflow-x-auto border border-gray-300 dark:border-gray-700 rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
            {columns.map((col) => (
              <th key={col.accessor} className="px-4 py-3 text-left font-semibold text-black dark:text-white">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-gray-300 dark:border-gray-700 ${
                striped && i % 2 === 1 ? 'bg-gray-50 dark:bg-gray-950' : ''
              }`}
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-3 text-black dark:text-white">
                  {col.render ? col.render(row[col.accessor]) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { Table };