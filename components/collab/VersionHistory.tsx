'use client';

import { useState } from 'react';
import { DocumentState } from '@/lib/collab/crdt-document';
import { Clock, RotateCcw, Eye } from 'lucide-react';

interface VersionHistoryProps {
  history: DocumentState[];
  onRestore: (versionIndex: number) => void;
  currentVersion: number;
}

export function VersionHistory({ history, onRestore, currentVersion }: VersionHistoryProps) {
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null);
  const [previewVersion, setPreviewVersion] = useState<number | null>(null);

  const handleRestore = (versionIndex: number) => {
    if (window.confirm(`Restore version ${versionIndex + 1}?`)) {
      onRestore(versionIndex);
    }
  };

  return (
    <div className="w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Version History
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {history.length} versions
        </p>
      </div>

      {/* Versions List */}
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-4 text-center">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">No versions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((version, idx) => (
              <div
                key={`${version.id}_${idx}`}
                className={`p-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer ${
                  idx === currentVersion
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
              >
                {/* Version Header */}
                <button
                  onClick={() =>
                    setExpandedVersion(expandedVersion === idx ? null : idx)
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        v{version.version}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {new Date(version.lastModified).toLocaleString()}
                      </p>
                    </div>

                    {idx === currentVersion && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>
                </button>

                {/* Version Details */}
                {expandedVersion === idx && (
                  <div className="mt-3 space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded p-2">
                        <p className="text-gray-600 dark:text-gray-400">Characters</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {version.content.filter((c) => !c.deleted).length}
                        </p>
                      </div>

                      <div className="bg-gray-100 dark:bg-gray-800 rounded p-2">
                        <p className="text-gray-600 dark:text-gray-400">Edits</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {version.version}
                        </p>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 max-h-24 overflow-hidden">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap break-words">
                        {version.content
                          .filter((c) => !c.deleted)
                          .map((c) => c.value)
                          .join('')
                          .substring(0, 100)}
                        {version.content.filter((c) => !c.deleted).length > 100 && '...'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {idx !== currentVersion && (
                        <button
                          onClick={() => handleRestore(idx)}
                          className="flex-1 px-2 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition flex items-center justify-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Restore
                        </button>
                      )}

                      <button
                        onClick={() =>
                          setPreviewVersion(previewVersion === idx ? null : idx)
                        }
                        className="flex-1 px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                    </div>
                  </div>
                )}

                {/* Preview Modal */}
                {previewVersion === idx && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full mx-4 max-h-96 flex flex-col">
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Version {history[idx]?.version} Preview
                        </h3>
                      </div>

                      <div className="flex-1 overflow-auto p-6 font-mono text-sm bg-gray-50 dark:bg-slate-800">
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                          {history[idx]?.content
                            .filter((c: any) => !c.deleted)
                            .map((c: any) => c.value)
                            .join('')}
                        </p>
                      </div>

                      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setPreviewVersion(null)}
                          className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}