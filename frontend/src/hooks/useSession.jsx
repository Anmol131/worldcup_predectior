import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { sessionAPI } from '../services/api';

const SessionContext = createContext(null);

function generateSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `session-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem('wc2026-sessionId');
    const id = storedId || generateSessionId();

    if (!storedId) {
      localStorage.setItem('wc2026-sessionId', id);
    }

    sessionAPI.getOrCreate(id)
      .then(() => setSessionId(id))
      .catch(() => setSessionId(id))
      .finally(() => setIsReady(true));
  }, []);

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