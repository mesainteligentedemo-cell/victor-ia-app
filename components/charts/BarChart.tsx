"use client";

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
}

export function BarChart({ data, title }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-black dark:text-white mb-4">{title}</h3>}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className="text-sm font-semibold text-black dark:text-white">{item.value}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
              <div
                className="h-full bg-black dark:bg-white transition-all duration-300"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
