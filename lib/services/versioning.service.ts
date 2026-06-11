export interface GenerationVersion {
  id: string;
  generationId: string;
  timestamp: Date;
  author: string;
  name: string;
  metadata?: Record<string, any>;
}

export class VersioningService {
  private versions: Map<string, GenerationVersion[]> = new Map();

  async saveVersion(generationId: string, name: string, author: string): Promise<GenerationVersion> {
    const version: GenerationVersion = {
      id: `v-${Date.now()}`,
      generationId,
      timestamp: new Date(),
      author,
      name,
    };

    if (!this.versions.has(generationId)) {
      this.versions.set(generationId, []);
    }
    this.versions.get(generationId)!.push(version);

    return version;
  }

  async getVersionHistory(generationId: string): Promise<GenerationVersion[]> {
    return this.versions.get(generationId) || [];
  }

  async rollback(generationId: string, versionIndex: number): Promise<GenerationVersion | null> {
    const versions = this.versions.get(generationId);
    return versions && versionIndex < versions.length ? versions[versionIndex] : null;
  }
}
