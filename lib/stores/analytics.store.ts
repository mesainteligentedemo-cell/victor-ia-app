import { create } from 'zustand';
import { ActivityLog, AnalyticsDashboard } from '@/lib/types';

interface AnalyticsState {
  dashboard: AnalyticsDashboard | null;
  activities: ActivityLog[];
  isLoading: boolean;
  setDashboard: (dashboard: AnalyticsDashboard) => void;
  setActivities: (activities: ActivityLog[]) => void;
  addActivity: (activity: ActivityLog) => void;
  setLoading: (loading: boolean) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  dashboard: null,
  activities: [],
  isLoading: false,
  setDashboard: (dashboard) => set({ dashboard }),
  setActivities: (activities) => set({ activities }),
  addActivity: (activity) => set((state) => ({ activities: [activity, ...state.activities] })),
  setLoading: (loading) => set({ isLoading: loading })
}));
