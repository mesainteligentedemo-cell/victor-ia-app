export interface TrendingTopic {
  id: string;
  topic: string;
  momentum: number;
  platform: string;
  relatedHashtags: string[];
}

export class TrendingService {
  async getTrendingTopics(): Promise<TrendingTopic[]> {
    return [
      { id: "1", topic: "Cinematic Videos", momentum: 87, platform: "TikTok", relatedHashtags: ["#cinematic", "#4K"] },
      { id: "2", topic: "Minimalist Design", momentum: 72, platform: "Instagram", relatedHashtags: ["#minimal", "#design"] },
      { id: "3", topic: "AI Generated Art", momentum: 95, platform: "YouTube", relatedHashtags: ["#AIart", "#generated"] },
    ];
  }

  async getTrendingForIntent(intent: string): Promise<TrendingTopic[]> {
    const topics = await this.getTrendingTopics();
    return topics.filter((t) => t.momentum > 50);
  }

  async analyzeTrendMatch(prompt: string): Promise<{ score: number; trends: TrendingTopic[] }> {
    const topics = await this.getTrendingTopics();
    const matchingTrends = topics.filter((t) => prompt.toLowerCase().includes(t.topic.toLowerCase()));
    return { score: matchingTrends.length > 0 ? 75 : 40, trends: matchingTrends };
  }
}
