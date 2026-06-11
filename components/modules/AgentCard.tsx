"use client";

import { Agent } from "@/lib/types";
import { Button } from "@/components/shared/Button";
import { useState } from "react";

interface AgentCardProps {
  agent: Agent;
  onExecute?: (agentId: string) => void;
}

export function AgentCard({ agent, onExecute }: AgentCardProps) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          userId: "user-id",
          params: {}
        })
      });
      if (res.ok) {
        onExecute?.(agent.id);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900 hover:shadow-md transition">
      <h4 className="font-semibold text-black dark:text-white mb-2">{agent.name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{agent.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {agent.skills.map((skill) => (
          <span key={skill} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-800">
        <span className="text-xs text-gray-600 dark:text-gray-400">${agent.costPerExecution}/exec</span>
        <Button onClick={handleExecute} isLoading={isExecuting} variant="primary" size="sm">
          Ejecutar
        </Button>
      </div>
    </div>
  );
}
