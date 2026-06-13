/**
 * Document Analytics Service
 * Tracks usage, contributions, and activity patterns
 */

export interface DocumentMetrics {
  documentId: string;
  totalEdits: number;
  totalComments: number;
  totalWords: number;
  totalCharacters: number;
  createdAt: number;
  lastModified: number;
  totalCollaborators: number;
  averageEditLength: number;
  editFrequency: number; // edits per day
  mostActiveHour: number;
  mostActiveDay: string;
}

export interface UserContribution {
  userId: string;
  userName: string;
  edits: number;
  commentsAdded: number;
  repliesAdded: number;
  wordCount: number;
  percentageOfDocument: number;
  lastContributedAt: number;
  averageEditSize: number;
}

export interface EditActivity {
  id: string;
  userId: string;
  userName: string;
  timestamp: number;
  changeType: 'insert' | 'delete';
  changeSize: number; // characters added/removed
  lineNumber?: number;
  context?: string;
}

export interface HeatmapData {
  hour: number; // 0-23
  day: string; // Monday, Tuesday, etc.
  edits: number;
  comments: number;
}

class DocumentAnalyticsService {
  private metrics: Map<string, DocumentMetrics> = new Map();
  private activities: Map<string, EditActivity[]> = new Map();
  private contributions: Map<string, UserContribution[]> = new Map();
  private heatmap: Map<string, HeatmapData[]> = new Map();

  /**
   * Record an edit activity
   */
  recordEdit(
    documentId: string,
    userId: string,
    userName: string,
    changeSize: number,
    lineNumber?: number,
    context?: string
  ): EditActivity {
    const activity: EditActivity = {
      id: `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      timestamp: Date.now(),
      changeType: changeSize > 0 ? 'insert' : 'delete',
      changeSize: Math.abs(changeSize),
      lineNumber,
      context,
    };

    if (!this.activities.has(documentId)) {
      this.activities.set(documentId, []);
    }

    this.activities.get(documentId)!.push(activity);

    // Update metrics
    this.updateMetrics(documentId, { totalEdits: 1, totalCharacters: changeSize });

    // Update user contribution
    this.updateUserContribution(documentId, userId, userName, {
      edits: 1,
      changeSize,
    });

    // Update heatmap
    this.updateHeatmap(documentId, 'edit');

    return activity;
  }

  /**
   * Record a comment
   */
  recordComment(
    documentId: string,
    userId: string,
    userName: string,
    isReply: boolean = false
  ): void {
    this.updateMetrics(documentId, {
      totalComments: 1,
    });

    this.updateUserContribution(documentId, userId, userName, {
      commentsAdded: isReply ? 0 : 1,
      repliesAdded: isReply ? 1 : 0,
    });

    this.updateHeatmap(documentId, 'comment');
  }

  /**
   * Get document metrics
   */
  getMetrics(documentId: string): DocumentMetrics | null {
    return this.metrics.get(documentId) || null;
  }

  /**
   * Get user contributions
   */
  getUserContributions(documentId: string): UserContribution[] {
    return this.contributions.get(documentId) || [];
  }

  /**
   * Get activity feed
   */
  getActivityFeed(documentId: string, limit: number = 50): EditActivity[] {
    const activities = this.activities.get(documentId) || [];
    return activities.slice(-limit).reverse();
  }

  /**
   * Get edit heatmap (when most edits happen)
   */
  getEditHeatmap(documentId: string): HeatmapData[] {
    return this.heatmap.get(documentId) || [];
  }

  /**
   * Get top contributors
   */
  getTopContributors(documentId: string, limit: number = 5): UserContribution[] {
    const contributions = this.contributions.get(documentId) || [];
    return contributions
      .sort((a, b) => b.edits - a.edits)
      .slice(0, limit);
  }

  /**
   * Get document statistics
   */
  getStatistics(documentId: string): {
    totalEdits: number;
    totalComments: number;
    totalContributors: number;
    mostActiveContributor: UserContribution | null;
    averageEditSize: number;
    editFrequency: number; // per day
  } {
    const metrics = this.metrics.get(documentId);
    const contributions = this.contributions.get(documentId) || [];

    if (!metrics) {
      return {
        totalEdits: 0,
        totalComments: 0,
        totalContributors: 0,
        mostActiveContributor: null,
        averageEditSize: 0,
        editFrequency: 0,
      };
    }

    const daysSinceCreation = (Date.now() - metrics.createdAt) / (1000 * 60 * 60 * 24);
    const editFrequency = daysSinceCreation > 0 ? metrics.totalEdits / daysSinceCreation : 0;

    return {
      totalEdits: metrics.totalEdits,
      totalComments: metrics.totalComments,
      totalContributors: contributions.length,
      mostActiveContributor: contributions.length > 0 ? contributions[0] : null,
      averageEditSize: metrics.averageEditLength,
      editFrequency: Math.round(editFrequency * 10) / 10,
    };
  }

  /**
   * Export analytics as CSV
   */
  exportAsCSV(documentId: string): string {
    const activities = this.activities.get(documentId) || [];
    const contributions = this.contributions.get(documentId) || [];

    let csv = 'User,Edits,Comments,Words,Percentage\n';

    contributions.forEach((c) => {
      csv += `"${c.userName}",${c.edits},${c.commentsAdded},${c.wordCount},${c.percentageOfDocument.toFixed(2)}%\n`;
    });

    return csv;
  }

  // ==================== PRIVATE METHODS ====================

  private updateMetrics(
    documentId: string,
    updates: Partial<DocumentMetrics>
  ): void {
    let metrics = this.metrics.get(documentId);

    if (!metrics) {
      metrics = {
        documentId,
        totalEdits: 0,
        totalComments: 0,
        totalWords: 0,
        totalCharacters: 0,
        createdAt: Date.now(),
        lastModified: Date.now(),
        totalCollaborators: 0,
        averageEditLength: 0,
        editFrequency: 0,
        mostActiveHour: 0,
        mostActiveDay: 'Monday',
      };
    }

    if (updates.totalEdits) {
      metrics.totalEdits += updates.totalEdits;
    }
    if (updates.totalComments) {
      metrics.totalComments += updates.totalComments;
    }
    if (updates.totalCharacters) {
      metrics.totalCharacters += updates.totalCharacters;
    }

    metrics.lastModified = Date.now();

    this.metrics.set(documentId, metrics);
  }

  private updateUserContribution(
    documentId: string,
    userId: string,
    userName: string,
    updates: { edits?: number; changeSize?: number; commentsAdded?: number; repliesAdded?: number }
  ): void {
    let contributions = this.contributions.get(documentId);

    if (!contributions) {
      contributions = [];
      this.contributions.set(documentId, contributions);
    }

    let contribution = contributions.find((c) => c.userId === userId);

    if (!contribution) {
      contribution = {
        userId,
        userName,
        edits: 0,
        commentsAdded: 0,
        repliesAdded: 0,
        wordCount: 0,
        percentageOfDocument: 0,
        lastContributedAt: Date.now(),
        averageEditSize: 0,
      };
      contributions.push(contribution);
    }

    if (updates.edits) {
      contribution.edits += updates.edits;
    }
    if (updates.changeSize) {
      contribution.wordCount += Math.ceil(updates.changeSize / 5); // estimate words
      contribution.averageEditSize = contribution.wordCount / contribution.edits;
    }
    if (updates.commentsAdded) {
      contribution.commentsAdded += updates.commentsAdded;
    }
    if (updates.repliesAdded) {
      contribution.repliesAdded += updates.repliesAdded;
    }

    contribution.lastContributedAt = Date.now();

    // Sort by edits
    contributions.sort((a, b) => b.edits - a.edits);
  }

  private updateHeatmap(documentId: string, type: 'edit' | 'comment'): void {
    const now = new Date();
    const hour = now.getHours();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });

    let heatmaps = this.heatmap.get(documentId);

    if (!heatmaps) {
      heatmaps = this.initializeHeatmap();
      this.heatmap.set(documentId, heatmaps);
    }

    const key = `${day}_${hour}`;
    let data = heatmaps.find((h) => h.day === day && h.hour === hour);

    if (!data) {
      data = { hour, day, edits: 0, comments: 0 };
      heatmaps.push(data);
    }

    if (type === 'edit') {
      data.edits++;
    } else {
      data.comments++;
    }
  }

  private initializeHeatmap(): HeatmapData[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const heatmap: HeatmapData[] = [];

    days.forEach((day) => {
      for (let hour = 0; hour < 24; hour++) {
        heatmap.push({ hour, day, edits: 0, comments: 0 });
      }
    });

    return heatmap;
  }
}

export default new DocumentAnalyticsService();