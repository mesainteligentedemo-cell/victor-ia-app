import { useState, useEffect } from 'react';

export function useTimer(initialSeconds: number = 0, onComplete?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      onComplete?.();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onComplete]);

  return { seconds, isActive, setIsActive, reset: () => setSeconds(initialSeconds) };
}
