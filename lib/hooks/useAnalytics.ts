'use client';

import { useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

export function useAnalytics() {
  const { user } = useUser();

  const track = useCallback(
    async (eventType: string, eventData?: Record<string, any>) => {
      if (!user?.id) return;

      try {
        await fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            eventType,
            eventData,
          }),
        });
      } catch (error) {
        console.error('Failed to track event:', error);
      }
    },
    [user?.id]
  );

  return { track };
}

export const ANALYTICS_EVENTS = {
  CHAT_SENT: 'chat_sent',
  AGENT_EXECUTED: 'agent_executed',
  PROJECT_CREATED: 'project_created',
  CLIENT_ADDED: 'client_added',
  ASSET_DOWNLOADED: 'asset_downloaded',
  ASSET_FAVORITED: 'asset_favorited',
  GENERATOR_USED: 'generator_used',
  PAYMENT_INITIATED: 'payment_initiated',
  PLAN_UPGRADED: 'plan_upgraded',
  PLAN_DOWNGRADED: 'plan_downgraded',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  VOICE_INPUT_USED: 'voice_input_used',
} as const;
