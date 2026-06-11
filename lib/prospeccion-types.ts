export type VideoStyle = "cinematic" | "animated" | "realistic" | "abstract" | "luxury" | "minimal";
export type VideoQuality = "draft" | "standard" | "premium";
export type VideoAspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "3:4";
export type ImageStyle = "photorealistic" | "illustration" | "digital-art" | "concept-art" | "luxury" | "minimal";
export type ImageQuality = "standard" | "premium" | "ultra";
export type ImageAspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "3:1" | "2:1";
export type GenerationStatus = "idle" | "generating" | "completed" | "failed" | "saved";

export interface VideoGenerationParams {
  prompt: string;
  duration: 5 | 10 | 15 | 20 | 25 | 30;
  aspectRatio: VideoAspectRatio;
  style: VideoStyle;
  fps: 24 | 30 | 60;
  quality: VideoQuality;
  includeAudio: boolean;
  musicStyle?: string;
  preset?: string;
  tags?: string[];
}

export interface ImageGenerationParams {
  prompt: string;
  aspectRatio: ImageAspectRatio;
  style: ImageStyle;
  quality: ImageQuality;
  quantity: 1 | 2 | 4;
  preset?: string;
  tags?: string[];
}

export interface GeneratedAsset {
  id: string;
  type: "video" | "image";
  url: string;
  thumbnailUrl?: string;
  params: VideoGenerationParams | ImageGenerationParams;
  status: GenerationStatus;
  createdAt: Date;
  savedAt?: Date;
  duration?: number;
  fileSize?: number;
  error?: string;
}

export interface Preset {
  id: string;
  name: string;
  type: "video" | "image";
  config: VideoGenerationParams | ImageGenerationParams;
  createdAt: Date;
  icon?: string;
}

export interface QuickPreset {
  id: string;
  label: string;
  icon: string;
  type: "video" | "image";
  config: Partial<VideoGenerationParams | ImageGenerationParams>;
}

export const QUICK_PRESETS_VIDEO: QuickPreset[] = [
  {
    id: "instagram-reel",
    label: "Instagram Reel",
    icon: "📱",
    type: "video",
    config: {
      duration: 15,
      aspectRatio: "9:16",
      quality: "premium",
    },
  },
  {
    id: "tiktok",
    label: "TikTok Trend",
    icon: "🎭",
    type: "video",
    config: {
      duration: 10,
      aspectRatio: "9:16",
      style: "animated",
      quality: "standard",
    },
  },
  {
    id: "linkedin-post",
    label: "LinkedIn Post",
    icon: "💼",
    type: "video",
    config: {
      duration: 20,
      aspectRatio: "16:9",
      style: "cinematic",
      quality: "premium",
    },
  },
  {
    id: "youtube-short",
    label: "YouTube Short",
    icon: "▶️",
    type: "video",
    config: {
      duration: 30,
      aspectRatio: "9:16",
      quality: "premium",
    },
  },
  {
    id: "web-hero",
    label: "Web Hero",
    icon: "🌐",
    type: "video",
    config: {
      duration: 25,
      aspectRatio: "16:9",
      style: "luxury",
      quality: "premium",
    },
  },
];

export const QUICK_PRESETS_IMAGE: QuickPreset[] = [
  {
    id: "social-square",
    label: "Social Square",
    icon: "📸",
    type: "image",
    config: {
      aspectRatio: "1:1",
      quality: "premium",
      quantity: 1,
    },
  },
  {
    id: "og-image",
    label: "OG Image",
    icon: "🔗",
    type: "image",
    config: {
      aspectRatio: "16:9",
      quality: "premium",
      quantity: 1,
    },
  },
  {
    id: "hero-image",
    label: "Hero Banner",
    icon: "🎨",
    type: "image",
    config: {
      aspectRatio: "16:9",
      quality: "ultra",
      style: "luxury",
      quantity: 1,
    },
  },
  {
    id: "product-showcase",
    label: "Product Showcase",
    icon: "📦",
    type: "image",
    config: {
      aspectRatio: "4:3",
      quality: "premium",
      quantity: 4,
    },
  },
  {
    id: "concept-art",
    label: "Concept Art",
    icon: "🎭",
    type: "image",
    config: {
      aspectRatio: "1:1",
      style: "concept-art",
      quality: "ultra",
      quantity: 2,
    },
  },
];