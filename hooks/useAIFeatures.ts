'use client';

import { useState, useCallback } from 'react';
import AIFeaturesService, {
  AICompletionResult,
  AISummaryResult,
  AITranslationResult,
  AIGrammarResult,
  AISuggestion,
} from '@/lib/ai/ai-features';

interface UseAIFeaturesOptions {
  apiKey: string;
}

export function useAIFeatures({ apiKey }: UseAIFeaturesOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const service = new AIFeaturesService(apiKey);

  const autoComplete = useCallback(
    async (context: string, maxSuggestions?: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await service.autoComplete(context, maxSuggestions);
        return results;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auto-complete failed');
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const summarize = useCallback(
    async (text: string, style?: 'bullet' | 'paragraph') => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await service.summarize(text, style);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Summarization failed');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const translate = useCallback(
    async (text: string, targetLanguage: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await service.translate(text, targetLanguage);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Translation failed');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const checkGrammar = useCallback(
    async (text: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await service.checkGrammar(text);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Grammar check failed');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const getSuggestions = useCallback(
    async (text: string, type?: 'tone' | 'clarity' | 'expansion') => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await service.getSuggestions(text, type);
        return results;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Suggestions failed');
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const generateTitle = useCallback(
    async (content: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const title = await service.generateTitle(content);
        return title;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Title generation failed');
        return '';
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const explainConcept = useCallback(
    async (concept: string, context?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const explanation = await service.explainConcept(concept, context);
        return explanation;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Explanation failed');
        return '';
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  return {
    autoComplete,
    summarize,
    translate,
    checkGrammar,
    getSuggestions,
    generateTitle,
    explainConcept,
    isLoading,
    error,
  };
}