import { useState } from 'react';

export function useArray<T>(initialArray: T[]) {
  const [array, setArray] = useState(initialArray);

  return {
    array,
    push: (item: T) => setArray((a) => [...a, item]),
    remove: (index: number) => setArray((a) => a.filter((_, i) => i !== index)),
    clear: () => setArray([]),
    set: setArray
  };
}
