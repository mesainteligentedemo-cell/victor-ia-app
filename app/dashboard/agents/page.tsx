"use client";

import { useAgentsStore } from "@/lib/stores";
import { AgentCard } from "@/components/modules";
import { useEffect } from "react";

export default function AgentsPage() {
  const { agents, executions, setAgents } = useAgentsStore();

  useEffect(() => {
    const fetchAgents = async () => {
      const res = await fetch("/api/agents");
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    };
    fetchAgents();
  }, [setAgents]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Agentes IA</h1>
        <p className="text-gray-600 dark:text-gray-400">Despliega agentes inteligentes para automatizar tareas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Agentes Disponibles</p>
          <p className="text-3xl font-bold text-black dark:text-white">{agents.length}</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Ejecuciones</p>
          <p className="text-3xl font-bold text-black dark:text-white">{executions.length}</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Costo Promedio</p>
          <p className="text-3xl font-bold text-black dark:text-white">$4.50</p>
        </div>
      </div>

      {/* Agents Grid */}
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Agentes Disponibles</h2>
        {agents.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Cargando agentes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* Executions History */}
      {executions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Historial de Ejecuciones</h2>
          <div className="space-y-2">
            {executions.map((exec) => (
              <div key={exec.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-black dark:text-white">{exec.agentId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tiempo: {exec.executionTime}ms</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded">
                    {exec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
