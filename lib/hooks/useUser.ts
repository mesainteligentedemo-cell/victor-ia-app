import { useAsync } from './useAsync';

export function useUser() {
  const { data: user, error, status } = useAsync(async () => {
    const res = await fetch('/api/user');
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  });

  return { user, error, isLoading: status === 'pending' };
}
