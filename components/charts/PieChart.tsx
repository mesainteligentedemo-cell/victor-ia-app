"use client";

interface PieChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title?: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colors = ["bg-black", "bg-gray-400", "bg-gray-600", "bg-gray-800"];

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-black dark:text-white mb-4">{title}</h3>}
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
            <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
            <span className="text-sm font-semibold text-black dark:text-white ml-auto">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
