'use client';

import { useRef, useEffect, useState } from 'react';
import { useCollaborativeDocument } from '@/hooks/useCollaborativeDocument';
import { CursorPosition } from '@/lib/collab/crdt-document';
import { Save, Undo2, Users, Clock } from 'lucide-react';

interface CollaborativeEditorProps {
  documentId: string;
  userId: string;
  initialContent?: string;
  readOnly?: boolean;
}

export function CollaborativeEditor({
  documentId,
  userId,
  initialContent = '',
  readOnly = false,
}: CollaborativeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { document: docState, text, insertText, deleteAt, updateCursor, undo, cursors } =
    useCollaborativeDocument({
      documentId,
      userId,
      initialContent,
    });

  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [lastSaved, setLastSaved] = useState<number>(Date.now());

  // Handle text input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.currentTarget.value;
    const oldText = text;

    // Detect changes
    if (newText.length > oldText.length) {
      // Insert
      const diff = newText.length - oldText.length;
      let insertPos = 0;

      for (let i = 0; i < Math.min(oldText.length, newText.length); i++) {
        if (oldText[i] !== newText[i]) {
          insertPos = i;
          break;
        }
      }

      if (insertPos === oldText.length) {
        insertPos = oldText.length;
      }

      insertText(insertPos, newText.substring(insertPos, insertPos + diff));
    } else if (newText.length < oldText.length) {
      // Delete
      const diff = oldText.length - newText.length;
      const deletePos = newText.length;
      for (let i = 0; i < diff; i++) {
        deleteAt(deletePos);
      }
    }
  };

  // Handle selection/cursor
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    setSelection({ start: selectionStart, end: selectionEnd });

    // Calculate line and column
    const beforeCursor = value.substring(0, selectionStart);
    const lines = beforeCursor.split('\n');
    const line = lines.length - 1;
    const column = lines[lines.length - 1].length;

    // Broadcast cursor position
    updateCursor(line, column, { start: selectionStart, end: selectionEnd });
  };

  // Keep textarea in sync
  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== text) {
      const cursorPos = textareaRef.current.selectionStart;
      textareaRef.current.value = text;
      try {
        textareaRef.current.setSelectionRange(cursorPos, cursorPos);
      } catch (e) {
        // Handle edge cases
      }
    }
  }, [text]);

  // Render remote cursors
  const renderRemoteCursors = () => {
    if (!textareaRef.current) return null;

    return cursors.map((cursor) => (
      <RemoteCursor key={cursor.userId} cursor={cursor} textareaRef={textareaRef} />
    ));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {docState?.title || 'Document'}
          </h2>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              v{docState?.version || 0} · {new Date(lastSaved).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Collaborators */}
          <div className="flex -space-x-2 mr-4">
            {docState?.collaborators.slice(0, 3).map((collab) => (
              <div
                key={collab}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-slate-950"
                title={collab}
              >
                {collab.charAt(0).toUpperCase()}
              </div>
            ))}
            {docState && docState.collaborators.length > 3 && (
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                +{docState.collaborators.length - 3}
              </span>
            )}
          </div>

          {/* Actions */}
          <button
            onClick={() => {
              undo();
              setLastSaved(Date.now());
            }}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition"
            title="Undo"
          >
            <Undo2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => setLastSaved(Date.now())}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition"
            title="Save (auto-saved)"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative flex-1 overflow-hidden" ref={editorRef}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onSelect={handleSelect}
          onKeyDown={handleSelect}
          readOnly={readOnly}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm resize-none bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 border-none outline-none focus:ring-0 focus:border-0 z-10"
          placeholder="Start typing..."
          spellCheck="false"
        />

        {/* Remote Cursors */}
        <div className="absolute inset-0 pointer-events-none z-20">{renderRemoteCursors()}</div>

        {/* Line Numbers (optional) */}
        <div className="absolute left-0 top-0 h-full w-12 bg-gray-100 dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-600 p-2 overflow-hidden pointer-events-none">
          {text.split('\n').map((_, idx) => (
            <div key={idx} className="h-6 flex items-center justify-end pr-2">
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-xs text-gray-600 dark:text-gray-400 flex justify-between">
        <span>
          {text.length} characters · {text.split('\n').length} lines
        </span>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{(docState?.collaborators.length || 0) + 1} collaborators</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Remote Cursor Component
 * Renders remote user's cursor and selection
 */
interface RemoteCursorProps {
  cursor: CursorPosition;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

function RemoteCursor({ cursor, textareaRef }: RemoteCursorProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const text = textarea.value;
    const beforeCursor = text.substring(0, cursor.selection?.start || 0);

    // Get pixel position
    const lines = beforeCursor.split('\n');
    const line = lines.length - 1;
    const column = lines[lines.length - 1].length;

    // Calculate approximate pixel position
    const lineHeight = 24; // Matches line-height in editor
    const charWidth = 8.4; // Approximate monospace char width

    setPosition({
      top: line * lineHeight + 16, // 16px padding
      left: 48 + column * charWidth + 16, // 48px for line numbers, 16px padding
    });
  }, [cursor, textareaRef]);

  return (
    <div
      className="absolute w-0.5 h-6 animate-pulse pointer-events-none"
      style={{
        backgroundColor: cursor.color,
        top: `${position.top}px`,
        left: `${position.left}px`,
        transition: 'all 100ms ease-out',
      }}
    >
      {/* User label */}
      <div
        className="absolute top-full mt-1 px-2 py-1 text-xs font-semibold text-white rounded whitespace-nowrap"
        style={{
          backgroundColor: cursor.color,
          boxShadow: `0 2px 4px rgba(0, 0, 0, 0.2)`,
        }}
      >
        {cursor.name}
      </div>
    </div>
  );
}