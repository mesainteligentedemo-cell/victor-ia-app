/**
 * Offline Sync Engine for Mobile
 * Queue operations locally, sync when reconnected
 * Uses same CRDT as web for conflict-free merging
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineOperation {
  id: string;
  type: 'edit' | 'comment' | 'delete' | 'permission';
  documentId: string;
  userId: string;
  payload: any;
  timestamp: number;
  synced: boolean;
  retryCount: number;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: number;
  pendingOperations: number;
  failedOperations: number;
  hasUnsyncedChanges: boolean;
}

class OfflineSyncEngine {
  private queue: OfflineOperation[] = [];
  private syncStatus: SyncStatus = {
    isSyncing: false,
    lastSyncTime: 0,
    pendingOperations: 0,
    failedOperations: 0,
    hasUnsyncedChanges: false,
  };
  private subscribers: Set<(status: SyncStatus) => void> = new Set();
  private maxRetries = 3;
  private readonly STORAGE_KEY = 'victor_offline_queue';

  /**
   * Initialize offline sync engine
   */
  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        this.updateStatus();
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  /**
   * Queue an operation for later sync
   */
  async queueOperation(
    type: OfflineOperation['type'],
    documentId: string,
    userId: string,
    payload: any
  ): Promise<OfflineOperation> {
    const operation: OfflineOperation = {
      id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      documentId,
      userId,
      payload,
      timestamp: Date.now(),
      synced: false,
      retryCount: 0,
    };

    this.queue.push(operation);
    await this.persistQueue();
    this.updateStatus();

    return operation;
  }

  /**
   * Sync pending operations
   */
  async syncPendingOperations(
    syncFn: (operation: OfflineOperation) => Promise<boolean>
  ): Promise<{ synced: number; failed: number }> {
    if (this.syncStatus.isSyncing) {
      return { synced: 0, failed: 0 };
    }

    this.syncStatus.isSyncing = true;
    this.notifySubscribers();

    let synced = 0;
    let failed = 0;

    for (const operation of this.queue) {
      if (operation.synced) continue;

      try {
        const success = await syncFn(operation);

        if (success) {
          operation.synced = true;
          synced++;
        } else {
          operation.retryCount++;

          if (operation.retryCount >= this.maxRetries) {
            failed++;
          }
        }
      } catch (error) {
        operation.retryCount++;

        if (operation.retryCount >= this.maxRetries) {
          failed++;
        }
      }
    }

    // Clean up synced operations
    this.queue = this.queue.filter((op) => !op.synced || op.retryCount < this.maxRetries);

    await this.persistQueue();

    this.syncStatus.isSyncing = false;
    this.syncStatus.lastSyncTime = Date.now();
    this.updateStatus();
    this.notifySubscribers();

    return { synced, failed };
  }

  /**
   * Get pending operations
   */
  getPendingOperations(): OfflineOperation[] {
    return this.queue.filter((op) => !op.synced);
  }

  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Subscribe to sync status changes
   */
  subscribeToStatus(callback: (status: SyncStatus) => void): () => void {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Clear failed operations
   */
  async clearFailedOperations(): Promise<void> {
    this.queue = this.queue.filter((op) => op.retryCount < this.maxRetries);
    await this.persistQueue();
    this.updateStatus();
  }

  /**
   * Get offline cache for document
   */
  async getDocumentCache(documentId: string): Promise<any | null> {
    try {
      const cached = await AsyncStorage.getItem(`doc_cache_${documentId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Failed to get document cache:', error);
      return null;
    }
  }

  /**
   * Set offline cache for document
   */
  async setDocumentCache(documentId: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(`doc_cache_${documentId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to set document cache:', error);
    }
  }

  /**
   * Check connectivity and auto-sync
   */
  async startAutoSync(
    syncFn: (operation: OfflineOperation) => Promise<boolean>,
    checkInterval: number = 5000
  ): Promise<() => void> {
    const interval = setInterval(async () => {
      if (this.queue.some((op) => !op.synced)) {
        await this.syncPendingOperations(syncFn);
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }

  // ==================== PRIVATE METHODS ====================

  private async persistQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to persist queue:', error);
    }
  }

  private updateStatus(): void {
    const pending = this.queue.filter((op) => !op.synced);

    this.syncStatus.pendingOperations = pending.length;
    this.syncStatus.failedOperations = this.queue.filter(
      (op) => op.retryCount >= this.maxRetries
    ).length;
    this.syncStatus.hasUnsyncedChanges = pending.length > 0;
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => {
      callback(this.getSyncStatus());
    });
  }
}

export default new OfflineSyncEngine();