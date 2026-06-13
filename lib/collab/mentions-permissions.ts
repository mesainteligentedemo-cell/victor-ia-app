/**
 * Mentions & Permissions System
 * Handle @mentions and granular document access control
 */

export type PermissionLevel = 'owner' | 'editor' | 'commenter' | 'viewer';

export interface DocumentPermission {
  userId: string;
  level: PermissionLevel;
  grantedAt: number;
  grantedBy: string;
  expiresAt?: number;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  token: string;
  permissionLevel: PermissionLevel;
  createdAt: number;
  expiresAt: number;
  maxUses?: number;
  usedCount: number;
  createdBy: string;
  viewerEmails?: string[];
}

export interface Mention {
  id: string;
  userId: string;
  userName: string;
  position: number;
  context: string;
  read: boolean;
  createdAt: number;
}

/**
 * Permissions Manager
 */
export class PermissionsManager {
  private permissions: Map<string, DocumentPermission[]> = new Map();

  /**
   * Grant permission to user
   */
  grantPermission(
    documentId: string,
    userId: string,
    level: PermissionLevel,
    grantedBy: string,
    expiresAt?: number
  ): DocumentPermission {
    const permission: DocumentPermission = {
      userId,
      level,
      grantedAt: Date.now(),
      grantedBy,
      expiresAt,
    };

    if (!this.permissions.has(documentId)) {
      this.permissions.set(documentId, []);
    }

    const docPermissions = this.permissions.get(documentId)!;
    const existing = docPermissions.findIndex((p) => p.userId === userId);

    if (existing !== -1) {
      docPermissions[existing] = permission;
    } else {
      docPermissions.push(permission);
    }

    return permission;
  }

  /**
   * Revoke permission
   */
  revokePermission(documentId: string, userId: string): boolean {
    const permissions = this.permissions.get(documentId);
    if (!permissions) return false;

    const index = permissions.findIndex((p) => p.userId === userId);
    if (index !== -1) {
      permissions.splice(index, 1);
      return true;
    }

    return false;
  }

  /**
   * Check permission
   */
  hasPermission(
    documentId: string,
    userId: string,
    requiredLevel: PermissionLevel
  ): boolean {
    const permissions = this.permissions.get(documentId);
    if (!permissions) return false;

    const permission = permissions.find((p) => p.userId === userId);
    if (!permission) return false;

    // Check expiration
    if (permission.expiresAt && permission.expiresAt < Date.now()) {
      return false;
    }

    // Check permission hierarchy
    const hierarchy: PermissionLevel[] = ['owner', 'editor', 'commenter', 'viewer'];
    const userIndex = hierarchy.indexOf(permission.level);
    const requiredIndex = hierarchy.indexOf(requiredLevel);

    return userIndex <= requiredIndex;
  }

  /**
   * Get user's permission level
   */
  getPermissionLevel(documentId: string, userId: string): PermissionLevel | null {
    const permissions = this.permissions.get(documentId);
    if (!permissions) return null;

    const permission = permissions.find((p) => p.userId === userId);
    if (!permission) return null;

    // Check expiration
    if (permission.expiresAt && permission.expiresAt < Date.now()) {
      return null;
    }

    return permission.level;
  }

  /**
   * Get all users with access
   */
  getDocumentCollaborators(documentId: string): DocumentPermission[] {
    const permissions = this.permissions.get(documentId);
    if (!permissions) return [];

    return permissions.filter((p) => !p.expiresAt || p.expiresAt > Date.now());
  }
}

/**
 * Mentions Manager
 */
export class MentionsManager {
  private mentions: Map<string, Mention[]> = new Map();
  private subscribers: Set<(mentions: Mention[]) => void> = new Set();

  /**
   * Create mention
   */
  createMention(
    documentId: string,
    userId: string,
    userName: string,
    position: number,
    context: string
  ): Mention {
    const mention: Mention = {
      id: `mention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      position,
      context,
      read: false,
      createdAt: Date.now(),
    };

    if (!this.mentions.has(documentId)) {
      this.mentions.set(documentId, []);
    }

    this.mentions.get(documentId)!.push(mention);
    this.notifySubscribers(documentId);

    return mention;
  }

  /**
   * Mark mention as read
   */
  markMentionAsRead(documentId: string, mentionId: string): void {
    const mentions = this.mentions.get(documentId);
    if (!mentions) return;

    const mention = mentions.find((m) => m.id === mentionId);
    if (mention) {
      mention.read = true;
      this.notifySubscribers(documentId);
    }
  }

  /**
   * Get mentions for user
   */
  getUserMentions(documentId: string, userId: string): Mention[] {
    const mentions = this.mentions.get(documentId);
    if (!mentions) return [];

    return mentions.filter((m) => m.userId === userId);
  }

  /**
   * Get unread mention count
   */
  getUnreadMentionCount(documentId: string, userId: string): number {
    const mentions = this.getUserMentions(documentId, userId);
    return mentions.filter((m) => !m.read).length;
  }

  /**
   * Subscribe to mention updates
   */
  subscribe(documentId: string, callback: (mentions: Mention[]) => void): () => void {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(documentId: string): void {
    const mentions = this.mentions.get(documentId) || [];
    this.subscribers.forEach((callback) => {
      callback(mentions);
    });
  }
}

/**
 * Document Share Manager
 */
export class DocumentShareManager {
  private shares: Map<string, DocumentShare> = new Map();

  /**
   * Create share link
   */
  createShareLink(
    documentId: string,
    permissionLevel: PermissionLevel,
    createdBy: string,
    expiresIn: number = 7 * 24 * 60 * 60 * 1000 // 7 days
  ): DocumentShare {
    const token = this.generateToken();

    const share: DocumentShare = {
      id: `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documentId,
      token,
      permissionLevel,
      createdAt: Date.now(),
      expiresAt: Date.now() + expiresIn,
      usedCount: 0,
      createdBy,
    };

    this.shares.set(token, share);
    return share;
  }

  /**
   * Validate share link
   */
  validateShareLink(token: string): DocumentShare | null {
    const share = this.shares.get(token);

    if (!share) return null;

    // Check expiration
    if (share.expiresAt < Date.now()) {
      this.shares.delete(token);
      return null;
    }

    // Check max uses
    if (share.maxUses && share.usedCount >= share.maxUses) {
      this.shares.delete(token);
      return null;
    }

    return share;
  }

  /**
   * Use share link (increment counter)
   */
  useShareLink(token: string): boolean {
    const share = this.shares.get(token);

    if (!share) return false;

    if (share.expiresAt < Date.now()) {
      this.shares.delete(token);
      return false;
    }

    share.usedCount++;

    if (share.maxUses && share.usedCount >= share.maxUses) {
      this.shares.delete(token);
    }

    return true;
  }

  /**
   * Revoke share link
   */
  revokeShareLink(token: string): boolean {
    return this.shares.delete(token);
  }

  /**
   * Get all shares for document
   */
  getDocumentShares(documentId: string): DocumentShare[] {
    return Array.from(this.shares.values()).filter((s) => s.documentId === documentId);
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  }
}

export const permissionsManager = new PermissionsManager();
export const mentionsManager = new MentionsManager();
export const documentShareManager = new DocumentShareManager();