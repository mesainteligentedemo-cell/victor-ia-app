'use client';

import { useEffect, useState } from 'react';
import { useRealtimeManager } from '@/lib/realtime/websocket-manager';
import { Play, Pause, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number; // 0-100
  startTime: number;
  endTime?: number;
  steps: ExecutionStep[];
  logs: string[];
}

export interface ExecutionStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  error?: string;
  output?: any;
}

interface LiveWorkflowMonitorProps {
  userId: string;
  workflowId?: string;
}

export function LiveWorkflowMonitor({ userId, workflowId }: LiveWorkflowMonitorProps) {
  const manager = useRealtimeManager();
  const [executions, setExecutions] = useState<Map<string, WorkflowExecution>>(new Map());
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    const unsubscribe = manager.subscribe('workflow_execution', (message: any) => {
      const execution: WorkflowExecution = message.data;

      // Filter by workflowId if provided
      if (workflowId && execution.workflowId !== workflowId) {
        return;
      }

      setExecutions((prev) => {
        const newMap = new Map(prev);
        newMap.set(execution.id, execution);
        return newMap;
      });

      // Auto-select latest execution
      if (!selectedExecution) {
        setSelectedExecution(execution.id);
      }
    });

    return unsubscribe;
  }, [manager, workflowId, selectedExecution]);

  const selected = selectedExecution ? executions.get(selectedExecution) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'running':
        return 'text-blue-600 dark:text-blue-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'paused':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'running':
        return <Zap className="w-5 h-5 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5" />;
      case 'paused':
        return <Pause className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getDuration = (exec: WorkflowExecution) => {
    const end = exec.endTime || Date.now();
    const seconds = (end - exec.startTime) / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Execution List */}
      <div className="lg:col-span-1">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
          Executions ({executions.size})
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {Array.from(executions.values())
            .sort((a, b) => b.startTime - a.startTime)
            .map((exec) => (
              <button
                key={exec.id}
                onClick={() => setSelectedExecution(exec.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  selectedExecution === exec.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {exec.workflowName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {getDuration(exec)}
                    </p>
                  </div>

                  <div className={`flex-shrink-0 ${getStatusColor(exec.status)}`}>
                    {getStatusIcon(exec.status)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      exec.status === 'completed'
                        ? 'bg-green-500'
                        : exec.status === 'failed'
                          ? 'bg-red-500'
                          : exec.status === 'paused'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                    }`}
                    style={{ width: `${exec.progress}%` }}
                  />
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Execution Details */}
      {selected && (
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {selected.workflowName}
              </h3>
              <div className={`flex items-center gap-2 ${getStatusColor(selected.status)}`}>
                {getStatusIcon(selected.status)}
                <span className="text-sm font-medium capitalize">{selected.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Progress</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.progress}%</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Duration</p>
                <p className="font-semibold text-gray-900 dark:text-white">{getDuration(selected)}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Steps</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selected.steps.filter((s) => s.status === 'completed').length}/{selected.steps.length}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${selected.progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Steps</h4>
            {selected.steps.map((step, idx) => (
              <div
                key={step.id}
                className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {idx + 1}. {step.name}
                  </span>
                  <span className="text-xs">
                    {step.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {step.status === 'running' && (
                      <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
                    )}
                    {step.status === 'failed' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </span>
                </div>

                {step.duration && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {(step.duration / 1000).toFixed(2)}s
                  </p>
                )}

                {step.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{step.error}</p>
                )}
              </div>
            ))}
          </div>

          {/* Logs Toggle */}
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showLogs ? 'Hide' : 'Show'} Logs ({selected.logs.length})
          </button>

          {/* Logs */}
          {showLogs && (
            <div className="p-3 bg-gray-900 dark:bg-black rounded-lg max-h-48 overflow-y-auto">
              <code className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-words">
                {selected.logs.join('\n')}
              </code>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selected && executions.size === 0 && (
        <div className="lg:col-span-2 flex items-center justify-center py-12 text-center">
          <div>
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
            <p className="text-gray-600 dark:text-gray-400">No workflows running</p>
          </div>
        </div>
      )}
    </div>
  );
}