import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

http.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data || { message: err.message }),
);

export const sessionAPI = {
  getOrCreate: (sessionId) => http.post('/sessions/init', { sessionId }),
  getSession: (sessionId) => http.get(`/sessions/${sessionId}`),
};

const formatGroupPosition = (position) => {
  if (position === 'first') return '1st';
  if (position === 'second') return '2nd';
  if (position === 'third') return '3rd';
  return position;
};

export const groupsAPI = {
  getGroups: (sessionId) => http.get(`/sessions/${sessionId}/groups`),
  updateGroupPick: (sessionId, groupId, teamCode, position) =>
    http.patch(`/sessions/${sessionId}/groups/${groupId}`, { teamCode, position: formatGroupPosition(position) }),
  confirmBestThird: (sessionId, selectedTeamCodes) =>
    http.post(`/sessions/${sessionId}/best-third`, { selectedTeamCodes }),
};

export const bracketAPI = {
  generateBracket: (sessionId) => http.post(`/sessions/${sessionId}/bracket/generate`),
  getBracket: (sessionId) => http.get(`/sessions/${sessionId}/bracket`),
  pickWinner: (sessionId, round, matchId, winnerCode) =>
    http.patch(`/sessions/${sessionId}/bracket/match`, { round, matchId, winnerCode }),
  setChampion: (sessionId, teamCode) =>
    http.patch(`/sessions/${sessionId}/bracket/champion`, { teamCode }),
};

export const shareAPI = {
  createShare: (sessionId, predictorName) => http.post('/predictions/share', { sessionId, predictorName }),
  getShared: (shareToken) => http.get(`/predictions/${shareToken}`),
};

export default http;
