'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import CRDTDocument, { DocumentState, CursorPosition, DocumentChange } from '@/lib/collab/crdt-document';
import { useRealtimeManager } from '@/lib/realtime/websocket-manager';

interface UseCollaborativeDocumentOptions {
  documentId: string;
  userId: string;
  initialContent?: string;
}

export function useCollaborativeDocument({
  documentId,
  userId,
  initialContent = '',
}: UseCollaborativeDocumentOptions) {
  const manager = useRealtimeManager();
  const documentRef = useRef<CRDTDocument | null>(null);
  const [state, setState] = useState<DocumentState | null>(null);
  const [cursors, setCursors] = useState<CursorPosition[]>([]);
  const [history, setHistory] = useState<DocumentState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Initialize CRDT document
  useEffect(() => {
    if (!documentRef.current) {
      documentRef.current = new CRDTDocument(documentId, userId, initialContent);

      // Subscribe to document changes
      const unsubscribe = documentRef.current.subscribe((newState) => {
        setState(newState);
        setHistory(documentRef.current!.getHistory());
        setHistoryIndex(documentRef.current!.getHistory().length - 1);
      });

      // Subscribe to cursor updates
      const unsubscribeCursors = documentRef.current.subscribeToCursors((cursorMap) => {
        const remoteCursors = Array.from(cursorMap.values()).filter((c) => c.userId !== userId);
        setCursors(remoteCursors);
      });

      // Set initial state
      setState(documentRef.current.getState());
      setHistory(documentRef.current.getHistory());

      return () => {
        unsubscribe();
        unsubscribeCursors();
      };
    }
  }, [documentId, userId, initialContent]);

  // Subscribe to remote changes
  useEffect(() => {
    const unsubscribe = manager.subscribe('document_change', (message: any) => {
      if (message.data.documentId === documentId && documentRef.current) {
        const change: DocumentChange = message.data;
        documentRef.current.applyRemoteChange(change);
      }
    });

    return unsubscribe;
  }, [manager, documentId]);

  // Subscribe to remote cursor updates
  useEffect(() => {
    const unsubscribe = manager.subscribe('document_cursor', (message: any) => {
      if (message.data.documentId === documentId && documentRef.current) {
        const { userId: remoteUserId, line, column, selection } = message.data;
        if (remoteUserId !== userId) {
          documentRef.current.updateCursor(remoteUserId, line, column, selection);
        }
      }
    });

    return unsubscribe;
  }, [manager, documentId, userId]);

  const insertText = useCallback((position: number, text: string) => {
    if (!documentRef.current) return;

    const changes = documentRef.current.insertText(position, text);

    // Broadcast changes to other users
    changes.forEach((change) => {
      manager.publish('document_change', {
        documentId,
        ...change,
      });
    });
  }, [documentId, manager]);

  const deleteAt = useCallback((position: number) => {
    if (!documentRef.current) return;

    const change = documentRef.current.deleteAt(position);

    if (change) {
      manager.publish('document_change', {
        documentId,
        ...change,
      });
    }
  }, [documentId, manager]);

  const updateCursor = useCallback((line: number, column: number, selection?: { start: number; end: number }) => {
    if (!documentRef.current) return;

    documentRef.current.updateCursor(userId, line, column, selection);

    manager.publish('document_cursor', {
      documentId,
      userId,
      line,
      column,
      selection,
    });
  }, [documentId, userId, manager]);

  const getText = useCallback((): string => {
    return documentRef.current?.getText() || '';
  }, []);

  const undo = useCallback((): boolean => {
    if (!documentRef.current) return false;
    return documentRef.current.undo();
  }, []);

  const getHistory = useCallback((): DocumentState[] => {
    return documentRef.current?.getHistory() || [];
  }, []);

  return {
    // State
    document: state,
    text: getText(),
    cursors,
    history,
    historyIndex,

    // Methods
    insertText,
    deleteAt,
    updateCursor,
    undo,
    getHistory,
  };
}