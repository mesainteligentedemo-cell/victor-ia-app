import { useState } from 'react';
import { useAsync } from './useAsync';

export function useCredits() {
  const { data: credits, execute: refresh } = useAsync(async () => {
    const res = await fetch('/api/credits/balance');
    if (!res.ok) throw new Error('Failed to fetch credits');
    return res.json();
  });

  const deductCredits = async (amount: number) => {
    const res = await fetch('/api/credits/deduct', { method: 'POST', body: JSON.stringify({ amount }) });
    if (!res.ok) throw new Error('Failed to deduct credits');
    await refresh();
    return res.json();
  };

  return { credits, deductCredits, refresh };
}
