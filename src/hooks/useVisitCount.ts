import { useEffect, useState } from 'react';

const STORAGE_KEY = 'visitCount';

export default function useVisitCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY) || '0');
    const updated = stored + 1;
    localStorage.setItem(STORAGE_KEY, String(updated));
    setCount(updated);
  }, []);

  return count;
}
