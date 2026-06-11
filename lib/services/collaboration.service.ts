export interface SharedAsset {
  assetId: string;
  sharedWith: string[];
  sharedAt: Date;
  approvalStatus: "pending" | "approved" | "rejected";
  comments: Array<{ author: string; text: string; timestamp: Date }>;
}

export class CollaborationService {
  private sharedAssets: Map<string, SharedAsset> = new Map();

  async shareAsset(assetId: string, userEmails: string[]): Promise<void> {
    this.sharedAssets.set(assetId, {
      assetId,
      sharedWith: userEmails,
      sharedAt: new Date(),
      approvalStatus: "pending",
      comments: [],
    });
  }

  async addComment(assetId: string, author: string, text: string): Promise<void> {
    const asset = this.sharedAssets.get(assetId);
    if (asset) {
      asset.comments.push({ author, text, timestamp: new Date() });
    }
  }

  async approveAsset(assetId: string): Promise<void> {
    const asset = this.sharedAssets.get(assetId);
    if (asset) {
      asset.approvalStatus = "approved";
    }
  }

  async getSharedWithMe(userEmail: string): Promise<SharedAsset[]> {
    return Array.from(this.sharedAssets.values()).filter((a) => a.sharedWith.includes(userEmail));
  }
}
