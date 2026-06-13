'use client';

import { useState } from 'react';
import { Copy, Trash2, Share2, Lock, Edit, MessageSquare, Eye } from 'lucide-react';
import { DocumentShare, PermissionLevel } from '@/lib/collab/mentions-permissions';

interface DocumentSharingProps {
  documentId: string;
  shares: DocumentShare[];
  collaborators: any[];
  onCreateShare: (level: PermissionLevel, expiresIn: number) => void;
  onRevokeShare: (token: string) => void;
  onGrantPermission: (userId: string, level: PermissionLevel) => void;
  onRevokePermission: (userId: string) => void;
}

const PERMISSION_LEVELS: { level: PermissionLevel; label: string; description: string; icon: any }[] = [
  { level: 'owner', label: 'Owner', description: 'Full control', icon: Lock },
  { level: 'editor', label: 'Editor', description: 'Can edit & comment', icon: Edit },
  { level: 'commenter', label: 'Commenter', description: 'Can comment only', icon: MessageSquare },
  { level: 'viewer', label: 'Viewer', description: 'Read-only access', icon: Eye },
];

const EXPIRATION_OPTIONS = [
  { label: '1 day', value: 24 * 60 * 60 * 1000 },
  { label: '7 days', value: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 days', value: 30 * 24 * 60 * 60 * 1000 },
  { label: 'Never', value: 365 * 24 * 60 * 60 * 1000 },
];

export function DocumentSharing({
  documentId,
  shares,
  collaborators,
  onCreateShare,
  onRevokeShare,
  onGrantPermission,
  onRevokePermission,
}: DocumentSharingProps) {
  const [selectedLevel, setSelectedLevel] = useState<PermissionLevel>('viewer');
  const [selectedExpiration, setSelectedExpiration] = useState(7 * 24 * 60 * 60 * 1000);
  const [showNewShare, setShowNewShare] = useState(false);

  return (
    <div className="space-y-6">
      {/* Collaborators Section */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          👥 Collaborators ({collaborators.length})
        </h3>

        <div className="space-y-2">
          {collaborators.map((collab) => (
            <div
              key={collab.userId}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={collab.avatar}
                  alt={collab.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {collab.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {collab.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={collab.level}
                  onChange={(e) => onGrantPermission(collab.userId, e.currentTarget.value as PermissionLevel)}
                  className="text-sm border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  {PERMISSION_LEVELS.map((perm) => (
                    <option key={perm.level} value={perm.level}>
                      {perm.label}
                    </option>
                  ))}
                </select>

                {collab.level !== 'owner' && (
                  <button
                    onClick={() => onRevokePermission(collab.userId)}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                    title="Remove access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Links Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            🔗 Share Links
          </h3>
          <button
            onClick={() => setShowNewShare(!showNewShare)}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Create Link
          </button>
        </div>

        {/* New Share Form */}
        {showNewShare && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4 space-y-4">
            {/* Permission Level */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Permission Level
              </label>

              <div className="grid grid-cols-2 gap-2">
                {PERMISSION_LEVELS.map((perm) => (
                  <button
                    key={perm.level}
                    onClick={() => setSelectedLevel(perm.level)}
                    className={`p-3 rounded-lg border transition text-left ${
                      selectedLevel === perm.level
                        ? 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-700'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <perm.icon className="w-4 h-4" />
                      <p className="font-medium text-gray-900 dark:text-white">{perm.label}</p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{perm.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Expiration */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Expires In
              </label>

              <select
                value={selectedExpiration}
                onChange={(e) => setSelectedExpiration(Number(e.currentTarget.value))}
                className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                {EXPIRATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onCreateShare(selectedLevel, selectedExpiration);
                  setShowNewShare(false);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition"
              >
                Create Share Link
              </button>

              <button
                onClick={() => setShowNewShare(false)}
                className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Existing Share Links */}
        <div className="space-y-2">
          {shares.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-900/20 rounded">
              No share links yet. Create one to share with others.
            </p>
          ) : (
            shares.map((share) => (
              <div
                key={share.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {PERMISSION_LEVELS.find((p) => p.level === share.permissionLevel)?.label ||
                        'Unknown'}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      • {share.usedCount} uses
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Expires {new Date(share.expiresAt).toLocaleDateString()}
                  </p>

                  <code className="text-xs text-gray-700 dark:text-gray-300 font-mono break-all mt-1">
                    {`${window.location.origin}/shared/${share.token}`}
                  </code>
                </div>

                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/shared/${share.token}`);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRevokeShare(share.token)}
                    className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                    title="Revoke link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
          <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Privacy:</strong> Only people with access can view this document. Link access is
            revoked automatically after expiration.
          </span>
        </p>
      </div>
    </div>
  );
}