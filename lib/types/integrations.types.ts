// Integrations: MCP and external service connections

export type IntegrationType = 'figma' | 'after_effects' | 'google_drive' | 'hubspot' | 'github' | 'slack' | 'notion';
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface Integration {
  id: string;
  userId: string;
  type: IntegrationType;
  name: string;
  description?: string;
  credentials: {
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
    refreshToken?: string;
    webhookUrl?: string;
  };
  config: Record<string, unknown>;
  active: boolean;
  lastSyncAt?: Date;
  syncStatus: SyncStatus;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncLog {
  id: string;
  integrationId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  itemsProcessed: number;
  itemsErrored: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface FigmaAsset {
  id: string;
  figmaFileId: string;
  name: string;
  type: 'component' | 'frame' | 'image';
  exportUrl: string;
  lastSyncedAt: Date;
}

export interface AEProject {
  id: string;
  aeProjectId: string;
  name: string;
  compositions: string[];
  templateUrl: string;
  lastSyncedAt: Date;
}

export interface GoogleDriveFile {
  id: string;
  driveFileId: string;
  name: string;
  type: 'document' | 'spreadsheet' | 'presentation' | 'folder';
  url: string;
  lastSyncedAt: Date;
}

export interface HubSpotContact {
  id: string;
  hsContactId: string;
  email: string;
  name: string;
  properties: Record<string, unknown>;
  lastSyncedAt: Date;
}