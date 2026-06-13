'use client';

import { Bold, Italic, Code, Link2, Strikethrough, Highlighter, List, Link, Users } from 'lucide-react';
import RichTextFormatter from '@/lib/collab/rich-text';

interface RichTextToolbarProps {
  onFormat: (type: 'bold' | 'italic' | 'code' | 'link' | 'strikethrough' | 'highlight', data?: any) => void;
  onShare: () => void;
  selection?: { start: number; end: number };
  disabled?: boolean;
}

export function RichTextToolbar({
  onFormat,
  onShare,
  selection,
  disabled = false,
}: RichTextToolbarProps) {
  const hasSelection = selection && selection.end > selection.start;

  const formatButtons = [
    {
      icon: Bold,
      tooltip: 'Bold',
      onClick: () => onFormat('bold'),
      shortcut: '⌘B',
    },
    {
      icon: Italic,
      tooltip: 'Italic',
      onClick: () => onFormat('italic'),
      shortcut: '⌘I',
    },
    {
      icon: Code,
      tooltip: 'Code',
      onClick: () => onFormat('code'),
      shortcut: '⌘`',
    },
    {
      icon: Strikethrough,
      tooltip: 'Strikethrough',
      onClick: () => onFormat('strikethrough'),
      shortcut: '⌘⇧X',
    },
    {
      icon: Highlighter,
      tooltip: 'Highlight',
      onClick: () => onFormat('highlight', { color: '#FFFF00' }),
      shortcut: '⌘⇧H',
    },
    {
      icon: Link2,
      tooltip: 'Link',
      onClick: () => {
        const url = prompt('Enter URL:');
        if (url) onFormat('link', { url });
      },
      shortcut: '⌘K',
    },
  ];

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 flex-wrap">
      {/* Format Buttons */}
      <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
        {formatButtons.map((btn) => (
          <button
            key={btn.tooltip}
            onClick={btn.onClick}
            disabled={!hasSelection || disabled}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition"
            title={`${btn.tooltip} (${btn.shortcut})`}
          >
            <btn.icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Share Button */}
      <button
        onClick={onShare}
        disabled={disabled}
        className="ml-auto flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
      >
        <Users className="w-4 h-4" />
        Share
      </button>

      {/* Help Text */}
      {!hasSelection && (
        <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          Select text to format
        </div>
      )}
    </div>
  );
}

/**
 * Formatting Shortcuts Component
 * Display keyboard shortcuts
 */
export function FormattingShortcuts() {
  const shortcuts = [
    { key: '⌘B', action: 'Bold' },
    { key: '⌘I', action: 'Italic' },
    { key: '⌘`', action: 'Code' },
    { key: '⌘K', action: 'Link' },
    { key: '⌘⇧H', action: 'Highlight' },
    { key: '@', action: 'Mention user' },
  ];

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
      <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
        💡 Formatting Tips
      </p>

      <div className="grid grid-cols-2 gap-2">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.key} className="flex items-center gap-2 text-xs">
            <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded font-mono text-blue-700 dark:text-blue-300">
              {shortcut.key}
            </code>
            <span className="text-gray-600 dark:text-gray-400">{shortcut.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}