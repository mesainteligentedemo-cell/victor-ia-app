import { useAsync } from './useAsync';

export function useAuth() {
  const { data: session, status } = useAsync(async () => {
    const res = await fetch('/api/auth/session');
    if (!res.ok) throw new Error('No session');
    return res.json();
  });

  return { session, isAuthenticated: !!session, isLoading: status === 'pending' };
}
