/**
 * Simple CRDT-based Document for Collaborative Editing
 * Based on Conflict-free Replicated Data Types
 * Supports multiple users editing simultaneously without conflicts
 */

export interface Character {
  id: string; // Unique identifier (userId + timestamp + seq)
  value: string;
  deleted: boolean;
  timestamp: number;
  userId: string;
}

export interface DocumentChange {
  id: string;
  type: 'insert' | 'delete';
  position: number;
  character?: Character;
  timestamp: number;
  userId: string;
}

export interface DocumentState {
  id: string;
  title: string;
  content: Character[];
  version: number;
  lastModified: number;
  collaborators: string[];
}

export interface CursorPosition {
  userId: string;
  line: number;
  column: number;
  selection?: { start: number; end: number };
  color: string;
  name: string;
}

class CRDTDocument {
  private state: DocumentState;
  private changes: DocumentChange[] = [];
  private cursors: Map<string, CursorPosition> = new Map();
  private history: DocumentState[] = [];
  private subscribers: Set<(state: DocumentState) => void> = new Set();
  private cursorSubscribers: Set<(cursors: Map<string, CursorPosition>) => void> = new Set();

  private sequenceNumber = 0;
  private readonly userId: string;
  private readonly documentId: string;

  constructor(documentId: string, userId: string, initialContent: string = '') {
    this.documentId = documentId;
    this.userId = userId;

    this.state = {
      id: documentId,
      title: 'Untitled Document',
      content: this.stringToCharacters(initialContent),
      version: 0,
      lastModified: Date.now(),
      collaborators: [userId],
    };

    this.history.push(JSON.parse(JSON.stringify(this.state)));
  }

  /**
   * Insert text at position
   */
  insertText(position: number, text: string): DocumentChange[] {
    const changes: DocumentChange[] = [];

    for (let i = 0; i < text.length; i++) {
      const change = this.insertCharacter(position + i, text[i]);
      if (change) changes.push(change);
    }

    this.notifySubscribers();
    return changes;
  }

  /**
   * Delete character at position
   */
  deleteAt(position: number): DocumentChange | null {
    if (position < 0 || position >= this.state.content.length) {
      return null;
    }

    const character = this.state.content[position];

    if (!character.deleted) {
      character.deleted = true;

      const change: DocumentChange = {
        id: `change_${Date.now()}_${this.sequenceNumber++}`,
        type: 'delete',
        position,
        timestamp: Date.now(),
        userId: this.userId,
      };

      this.changes.push(change);
      this.state.version++;
      this.state.lastModified = Date.now();

      this.notifySubscribers();
      return change;
    }

    return null;
  }

  /**
   * Apply remote change
   */
  applyRemoteChange(change: DocumentChange): void {
    if (change.type === 'insert' && change.character) {
      // Insert at correct position based on CRDT rules
      const position = this.findInsertPosition(change.character);
      this.state.content.splice(position, 0, change.character);
    } else if (change.type === 'delete') {
      // Find and mark character as deleted
      const char = this.state.content.find((c) => c.id === change.character?.id);
      if (char) {
        char.deleted = true;
      }
    }

    this.changes.push(change);
    this.state.version++;
    this.state.lastModified = Date.now();

    this.notifySubscribers();
  }

  /**
   * Get current text (excluding deleted characters)
   */
  getText(): string {
    return this.state.content
      .filter((c) => !c.deleted)
      .map((c) => c.value)
      .join('');
  }

  /**
   * Update cursor position
   */
  updateCursor(userId: string, line: number, column: number, selection?: { start: number; end: number }): void {
    const cursor: CursorPosition = {
      userId,
      line,
      column,
      selection,
      color: this.generateColorForUser(userId),
      name: userId.substring(0, 8),
    };

    this.cursors.set(userId, cursor);
    this.notifyCursorSubscribers();
  }

  /**
   * Get all cursors
   */
  getCursors(): CursorPosition[] {
    return Array.from(this.cursors.values());
  }

  /**
   * Subscribe to document changes
   */
  subscribe(callback: (state: DocumentState) => void): () => void {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Subscribe to cursor updates
   */
  subscribeToCursors(callback: (cursors: Map<string, CursorPosition>) => void): () => void {
    this.cursorSubscribers.add(callback);

    return () => {
      this.cursorSubscribers.delete(callback);
    };
  }

  /**
   * Get document state
   */
  getState(): DocumentState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Get document history
   */
  getHistory(): DocumentState[] {
    return this.history;
  }

  /**
   * Undo last change
   */
  undo(): boolean {
    if (this.history.length <= 1) return false;

    this.history.pop();
    this.state = JSON.parse(JSON.stringify(this.history[this.history.length - 1]));
    this.notifySubscribers();

    return true;
  }

  /**
   * Get all changes since version
   */
  getChangesSince(version: number): DocumentChange[] {
    return this.changes.filter((c) => {
      // Estimate version from timestamp and sequence
      return true;
    });
  }

  // ==================== PRIVATE METHODS ====================

  private insertCharacter(position: number, character: string): DocumentChange | null {
    const id = `${this.userId}_${Date.now()}_${this.sequenceNumber++}`;

    const char: Character = {
      id,
      value: character,
      deleted: false,
      timestamp: Date.now(),
      userId: this.userId,
    };

    // Insert at position
    this.state.content.splice(position, 0, char);

    const change: DocumentChange = {
      id: `change_${Date.now()}_${this.sequenceNumber}`,
      type: 'insert',
      position,
      character: char,
      timestamp: Date.now(),
      userId: this.userId,
    };

    this.changes.push(change);
    this.state.version++;
    this.state.lastModified = Date.now();

    return change;
  }

  private findInsertPosition(character: Character): number {
    // Simple insertion position based on character ID
    let position = 0;

    for (let i = 0; i < this.state.content.length; i++) {
      if (this.compareCharacterIds(character.id, this.state.content[i].id) < 0) {
        position = i;
        break;
      }
      position = i + 1;
    }

    return position;
  }

  private compareCharacterIds(id1: string, id2: string): number {
    // Compare by timestamp, then by userId
    const [user1, time1] = id1.split('_');
    const [user2, time2] = id2.split('_');

    const timeCompare = parseInt(time1) - parseInt(time2);
    if (timeCompare !== 0) return timeCompare;

    return user1.localeCompare(user2);
  }

  private stringToCharacters(text: string): Character[] {
    return text.split('').map((value, idx) => ({
      id: `${this.userId}_${Date.now()}_${idx}`,
      value,
      deleted: false,
      timestamp: Date.now(),
      userId: this.userId,
    }));
  }

  private generateColorForUser(userId: string): string {
    const colors = [
      '#EF4444', '#F97316', '#EAB308', '#22C55E',
      '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899',
    ];

    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash += userId.charCodeAt(i);
    }

    return colors[hash % colors.length];
  }

  private notifySubscribers(): void {
    // Save to history
    if (this.history[this.history.length - 1].version !== this.state.version) {
      this.history.push(JSON.parse(JSON.stringify(this.state)));
    }

    this.subscribers.forEach((callback) => {
      callback(this.getState());
    });
  }

  private notifyCursorSubscribers(): void {
    this.cursorSubscribers.forEach((callback) => {
      callback(new Map(this.cursors));
    });
  }
}

export default CRDTDocument;