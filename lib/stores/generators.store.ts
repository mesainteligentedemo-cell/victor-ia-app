import { create } from 'zustand';
import { GenerationResult, GeneratorType } from '@/lib/types';

interface GeneratorsState {
  generations: GenerationResult[];
  isLoading: boolean;
  error: string | null;
  addGeneration: (generation: GenerationResult) => void;
  removeGeneration: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearGenerations: () => void;
}

export const useGeneratorsStore = create<GeneratorsState>((set) => ({
  generations: [],
  isLoading: false,
  error: null,
  addGeneration: (generation) => set((state) => ({ generations: [generation, ...state.generations] })),
  removeGeneration: (id) => set((state) => ({ generations: state.generations.filter((g) => g.id !== id) })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearGenerations: () => set({ generations: [] })
}));
