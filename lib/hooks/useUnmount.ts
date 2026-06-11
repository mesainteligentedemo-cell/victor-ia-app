import { useEffect } from 'react';

export function useUnmount(callback: () => void) {
  useEffect(() => callback, []);
}
