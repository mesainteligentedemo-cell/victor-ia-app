export type ExportTarget = "instagram" | "tiktok" | "linkedin" | "youtube" | "email";

export interface ExportedAsset {
  url: string;
  platform: ExportTarget;
  caption?: string;
  hashtags?: string[];
  scheduledFor?: Date;
}

export class ExportService {
  async exportTo(assetUrl: string, platform: ExportTarget, prompt: string): Promise<ExportedAsset> {
    const hashtags = this.generateHashtags(platform, prompt);
    const caption = this.generateCaption(platform, prompt);

    return {
      url: assetUrl,
      platform,
      caption,
      hashtags,
    };
  }

  private generateHashtags(platform: ExportTarget, prompt: string): string[] {
    const base = ["#creative", "#ai", "#media"];
    if (platform === "tiktok") return [...base, "#foryou", "#viral", "#trending"];
    if (platform === "instagram") return [...base, "#instagood", "#photooftheday"];
    if (platform === "linkedin") return [...base, "#professional", "#business"];
    return base;
  }

  private generateCaption(platform: ExportTarget, prompt: string): string {
    if (platform === "tiktok") return `Check this out! 🎬 #FYP #Viral`;
    if (platform === "instagram") return `Created with AI 🎨 Link in bio`;
    if (platform === "linkedin") return `Innovative content creation with AI technology`;
    return prompt.substring(0, 100) + "...";
  }

  async schedulePublish(assetUrl: string, platform: ExportTarget, datetime: Date): Promise<void> {
    console.log(`Scheduled ${platform} post for ${datetime}`);
  }
}
