"use client";

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  title?: string;
}

export function LineChart({ data, title }: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.value / maxValue) * 100
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-black dark:text-white mb-4">{title}</h3>}
      <svg viewBox="0 0 100 100" className="w-full h-48 border border-gray-200 dark:border-gray-800 rounded p-2">
        <path d={pathD} stroke="currentColor" strokeWidth="2" fill="none" className="text-black dark:text-white" />
      </svg>
    </div>
  );
}
