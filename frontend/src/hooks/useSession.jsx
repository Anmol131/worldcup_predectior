import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { sessionAPI } from '../services/api';

const SessionContext = createContext(null);

function generateSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `session-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

export function SessionProvider({ children }) {
  const [sessionId] = useState(() => {
    const storedId = localStorage.getItem('wc2026-session') || localStorage.getItem('wc2026-sessionId');

    if (storedId) {
      return storedId;
    }

    const id = generateSessionId();
    localStorage.setItem('wc2026-session', id);
    localStorage.setItem('wc2026-sessionId', id);
    return id;
  });
  const [isReady, setIsReady] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    sessionAPI.getOrCreate(sessionId)
      .then((result) => {
        if (result?.isNew) {
          localStorage.removeItem('wc2026-groups-confirmed');
          queryClient.clear();
        }
      })
      .catch(() => null)
      .finally(() => setIsReady(true));
  }, [queryClient, sessionId]);

  const value = useMemo(() => ({ sessionId, isReady }), [sessionId, isReady]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}