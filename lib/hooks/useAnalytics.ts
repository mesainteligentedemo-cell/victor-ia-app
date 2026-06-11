import { useCallback } from 'react';

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, eventData?: Record<string, any>) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ eventName, eventData, timestamp: new Date() })
    }).catch(console.error);
  }, []);

  return { trackEvent };
}
