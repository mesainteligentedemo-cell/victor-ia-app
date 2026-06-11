"use client";

import { Prospect } from "@/lib/types";
import { Badge } from "@/components/shared/Badge";

interface ProspectCardProps {
  prospect: Prospect;
  onMove?: (stage: string) => void;
}

export function ProspectCard({ prospect, onMove }: ProspectCardProps) {
  const stageColors: Record<string, string> = {
    lead: "default",
    contacted: "info",
    qualified: "success",
    proposal: "warning",
    negotiation: "info",
    won: "success",
    lost: "error"
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-black dark:text-white">{prospect.name}</h4>
        <Badge variant={stageColors[prospect.stage] as any}>{prospect.stage}</Badge>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <p><span className="font-medium">Empresa:</span> {prospect.company}</p>
        <p><span className="font-medium">Email:</span> {prospect.email}</p>
        <p><span className="font-medium">Valor:</span> ${prospect.value}</p>
      </div>

      {prospect.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-500 italic">{prospect.notes}</p>
        </div>
      )}
    </div>
  );
}
