import { useEffect, useState } from 'react';

export function useSession() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem('wc2026-session');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('wc2026-session', id);
    }
    setSessionId(id);
  }, []);

  return sessionId;
}