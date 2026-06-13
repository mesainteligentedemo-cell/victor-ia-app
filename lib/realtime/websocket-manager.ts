/**
 * WebSocket Manager — Centralized real-time connection handling
 * Handles all WebSocket subscriptions, message routing, and cleanup
 */

export type RealtimeEvent =
  | 'presence_update'
  | 'workflow_execution'
  | 'notification'
  | 'collaboration_cursor'
  | 'activity_feed'
  | 'api_usage'
  | 'skill_progress';

export interface RealtimeMessage {
  event: RealtimeEvent;
  userId: string;
  data: any;
  timestamp: number;
}

export interface PresenceData {
  userId: string;
  status: 'online' | 'idle' | 'offline';
  lastActive: number;
  currentPage: string;
  cursorX?: number;
  cursorY?: number;
}

export class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private subscriptions: Map<RealtimeEvent, Set<(msg: RealtimeMessage) => void>> = new Map();
  private presenceData: Map<string, PresenceData> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private presenceInterval: NodeJS.Timeout | null = null;
  private idleTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  /**
   * Connect to WebSocket server
   */
  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      const protocol = typeof window !== 'undefined' ?
        (window.location.protocol === 'https:' ? 'wss:' : 'ws:') : 'ws:';
      const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
      const wsUrl = `${protocol}//${host}/api/realtime?userId=${userId}`;

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.reconnectAttempts = 0;
          this.startPresenceTracking(userId);
          this.startIdleDetection();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: RealtimeMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket closed, attempting reconnect...');
          this.attemptReconnect(userId);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Subscribe to real-time events
   */
  subscribe(event: RealtimeEvent, callback: (msg: RealtimeMessage) => void): () => void {
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, new Set());
    }

    this.subscriptions.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  /**
   * Publish a message to the server
   */
  publish(event: RealtimeEvent, data: any): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, message not sent');
      return;
    }

    const message: RealtimeMessage = {
      event,
      userId: this.getCurrentUserId(),
      data,
      timestamp: Date.now(),
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Update user presence
   */
  updatePresence(status: 'online' | 'idle' | 'offline', currentPage?: string): void {
    const userId = this.getCurrentUserId();

    const presence: PresenceData = {
      userId,
      status,
      lastActive: Date.now(),
      currentPage: currentPage || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    };

    this.presenceData.set(userId, presence);
    this.publish('presence_update', presence);
  }

  /**
   * Get current user's presence data
   */
  getPresence(userId?: string): PresenceData | undefined {
    const id = userId || this.getCurrentUserId();
    return this.presenceData.get(id);
  }

  /**
   * Get all active users' presence data
   */
  getAllPresence(): PresenceData[] {
    return Array.from(this.presenceData.values());
  }

  /**
   * Update cursor position for collaboration
   */
  updateCursor(cursorX: number, cursorY: number): void {
    const presence = this.getPresence();
    if (presence) {
      presence.cursorX = cursorX;
      presence.cursorY = cursorY;
      this.publish('collaboration_cursor', {
        userId: presence.userId,
        cursorX,
        cursorY,
        page: presence.currentPage,
      });
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.presenceInterval) clearInterval(this.presenceInterval);
    if (this.idleTimeout) clearTimeout(this.idleTimeout);

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.presenceData.clear();
    this.subscriptions.clear();
  }

  // ==================== PRIVATE METHODS ====================

  private handleMessage(message: RealtimeMessage): void {
    const callbacks = this.subscriptions.get(message.event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(message));
    }

    // Update local presence data if it's a presence update
    if (message.event === 'presence_update') {
      const presence = message.data as PresenceData;
      this.presenceData.set(presence.userId, presence);
    }
  }

  private startPresenceTracking(userId: string): void {
    // Send presence update every 30 seconds
    this.presenceInterval = setInterval(() => {
      const presence = this.getPresence(userId);
      if (presence) {
        this.publish('presence_update', presence);
      }
    }, 30000);
  }

  private startIdleDetection(): void {
    const resetIdleTimeout = () => {
      if (this.idleTimeout) clearTimeout(this.idleTimeout);

      this.idleTimeout = setTimeout(() => {
        this.updatePresence('idle');
      }, 300000); // 5 minutes
    };

    // Listen for user activity
    if (typeof window !== 'undefined') {
      ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
        window.addEventListener(event, () => {
          const presence = this.getPresence();
          if (presence?.status === 'idle') {
            this.updatePresence('online');
          }
          resetIdleTimeout();
        });
      });
    }

    resetIdleTimeout();
  }

  private attemptReconnect(userId: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect(userId).catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  private getCurrentUserId(): string {
    if (typeof window !== 'undefined') {
      // In real app, get from Clerk or session
      return localStorage.getItem('userId') || 'unknown';
    }
    return 'unknown';
  }
}

/**
 * Hook for React components
 */
export function useRealtimeManager() {
  const manager = WebSocketManager.getInstance();

  return {
    subscribe: manager.subscribe.bind(manager),
    publish: manager.publish.bind(manager),
    updatePresence: manager.updatePresence.bind(manager),
    getPresence: manager.getPresence.bind(manager),
    getAllPresence: manager.getAllPresence.bind(manager),
    updateCursor: manager.updateCursor.bind(manager),
    connect: manager.connect.bind(manager),
    disconnect: manager.disconnect.bind(manager),
  };
}