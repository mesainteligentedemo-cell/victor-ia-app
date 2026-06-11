import { useState, useCallback } from "react";
import type { TrendingTopic } from "@/lib/services/trending.service";

interface TrendingState {
  selectedTrend: TrendingTopic | null;
  suggestedPrompt: string | null;
}

export function useTrending() {
  const [trendingState, setTrendingState] = useState<TrendingState>({
    selectedTrend: null,
    suggestedPrompt: null,
  });

  const selectTrend = useCallback((trend: TrendingTopic, suggestedPrompt: string) => {
    setTrendingState({
      selectedTrend: trend,
      suggestedPrompt,
    });
  }, []);

  const clearTrend = useCallback(() => {
    setTrendingState({
      selectedTrend: null,
      suggestedPrompt: null,
    });
  }, []);

  return {
    selectedTrend: trendingState.selectedTrend,
    suggestedPrompt: trendingState.suggestedPrompt,
    selectTrend,
    clearTrend,
  };
}