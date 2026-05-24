import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const groupsApi = {
  getAll: () => api.get('/groups'),
  seed: () => api.post('/groups/seed'),
  update: (groupId, selection) => api.put(`/groups/${groupId}`, { selection }),
};

export const bracketApi = {
  generate: (sessionId) => api.post('/bracket/generate', { sessionId }),
  getBySession: (sessionId) => api.get(`/bracket/${sessionId}`),
  updateMatch: (sessionId, matchId, winnerCode, winnerName) =>
    api.put(`/bracket/${sessionId}/match/${matchId}`, { winnerCode, winnerName }),
};

export const predictionsApi = {
  create: (sessionId, predictorName = '') => api.post('/predictions', { sessionId, predictorName }),
  getShared: (token) => api.get(`/predictions/share/${token}`),
  complete: (sessionId, champion) => api.put(`/predictions/${sessionId}/complete`, { champion }),
};

export default api;
