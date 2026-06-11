import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  GeneratedAsset,
  VideoGenerationParams,
  ImageGenerationParams,
  CreditsAccount,
} from "@/lib/prospeccion-types";

export interface ProspeccionState {
  // Generations
  generations: GeneratedAsset[];
  selectedGenerationId?: string;

  // Queue
  queue: string[];
  queueProgress: { total: number; completed: number };

  // Analytics
  creditsAccount: CreditsAccount;
  analyticsData: {
    avgTime: number;
    successRate: number;
    totalGenerated: number;
  };

  // Trending
  trendingNow: Array<{ id: string; topic: string; momentum: number }>;

  // Actions
  addGeneration: (asset: GeneratedAsset) => void;
  deleteGeneration: (id: string) => void;
  selectGeneration: (id: string | undefined) => void;
  addToQueue: (jobId: string) => void;
  completeQueueJob: (jobId: string) => void;
  updateCredits: (amount: number) => void;
  updateAnalytics: (data: Partial<any>) => void;
  setTrending: (trends: any[]) => void;
  clearGenerations: () => void;
}

export const useProspeccionStore = create<ProspeccionState>()(
  persist(
    (set) => ({
      generations: [],
      queue: [],
      queueProgress: { total: 0, completed: 0 },
      creditsAccount: {
        balance: 1000,
        tier: "pro",
        spent: 0,
        resetDate: new Date(),
      },
      analyticsData: {
        avgTime: 45,
        successRate: 94,
        totalGenerated: 0,
      },
      trendingNow: [],

      addGeneration: (asset) =>
        set((state) => ({
          generations: [asset, ...state.generations],
        })),

      deleteGeneration: (id) =>
        set((state) => ({
          generations: state.generations.filter((g) => g.id !== id),
        })),

      selectGeneration: (id) => set({ selectedGenerationId: id }),

      addToQueue: (jobId) =>
        set((state) => ({
          queue: [...state.queue, jobId],
          queueProgress: {
            ...state.queueProgress,
            total: state.queueProgress.total + 1,
          },
        })),

      completeQueueJob: (jobId) =>
        set((state) => ({
          queue: state.queue.filter((j) => j !== jobId),
          queueProgress: {
            ...state.queueProgress,
            completed: state.queueProgress.completed + 1,
          },
        })),

      updateCredits: (amount) =>
        set((state) => ({
          creditsAccount: {
            ...state.creditsAccount,
            balance: Math.max(0, state.creditsAccount.balance + amount),
            spent: state.creditsAccount.spent + Math.abs(amount),
          },
        })),

      updateAnalytics: (data) =>
        set((state) => ({
          analyticsData: { ...state.analyticsData, ...data },
        })),

      setTrending: (trends) => set({ trendingNow: trends }),

      clearGenerations: () => set({ generations: [] }),
    }),
    {
      name: "prospeccion-storage",
      version: 1,
    }
  )
);
