"use client";

import { useAutomationStore } from "@/lib/stores";
import { useModal } from "@/lib/hooks";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";

export default function AutomationPage() {
  const { workflows } = useAutomationStore();
  const { isOpen, open, close } = useModal();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Automation</h1>
          <p className="text-gray-600 dark:text-gray-400">Connect n8n workflows</p>
        </div>
        <Button onClick={open} variant="primary">
          + New Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-3xl font-bold text-black dark:text-white">{workflows.length}</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Executions</p>
          <p className="text-3xl font-bold text-black dark:text-white">0</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
          <p className="text-3xl font-bold text-black dark:text-white">100%</p>
        </div>
      </div>

      {workflows.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No workflows yet</p>
          <Button onClick={open} variant="primary">
            Create one
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {workflows.map((wf) => (
            <div key={wf.id} className="p-4 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
              <p className="font-semibold text-black dark:text-white">{wf.id}</p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={close} title="New Workflow">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Create a new n8n workflow</p>
      </Modal>
    </div>
  );
}
