import { create } from 'zustand';
import api, { bracketApi } from '../services/api';
import groups from '../data/groups';
import {
  isGroupStageComplete,
  areThirdPlaceTeamsReady,
  isBestThirdSelectionValid,
  getAllThirdPlaceTeams,
  getDescendantMatchIds,
  knockoutSchema,
} from '../utils/tournament';

const defaultSelections = {};

groups.forEach((group) => {
  defaultSelections[group.id] = { first: '', second: '', third: '' };
});

const usePredictionStore = create((set, get) => ({
  groupSelections: defaultSelections,
  bestThirdPlaceTeamCodes: [],
  matchWinners: {},
  generated: false,
  champion: null,
  sessionId: null,

  selectGroupTeam: (groupId, teamCode, rank) => {
    set((state) => {
      const current = state.groupSelections[groupId] || { first: '', second: '', third: '' };
      const next = { ...current };

      if (next[rank] === teamCode) {
        next[rank] = '';
      } else {
        next[rank] = teamCode;
        ['first', 'second', 'third']
          .filter((key) => key !== rank)
          .forEach((key) => {
            if (next[key] === teamCode) {
              next[key] = '';
            }
          });
      }

      const nextSelections = {
        ...state.groupSelections,
        [groupId]: next,
      };

      const validThirdCodes = new Set(getAllThirdPlaceTeams(nextSelections).map((entry) => entry.team.code));
      const bestThirdPlaceTeamCodes = state.bestThirdPlaceTeamCodes.filter((code) => validThirdCodes.has(code));

      return {
        groupSelections: nextSelections,
        bestThirdPlaceTeamCodes,
      };
    });
  },

  setBestThirdPlaceTeamCodes: (teamCodes) => {
    set((state) => {
      const unique = Array.from(new Set(teamCodes || []));
      const allThirdCodes = new Set(getAllThirdPlaceTeams(state.groupSelections).map((entry) => entry.team.code));
      const filtered = unique.filter((code) => allThirdCodes.has(code));
      return { bestThirdPlaceTeamCodes: filtered };
    });
  },

  generateKnockout: () => {
    const { groupSelections: selections, bestThirdPlaceTeamCodes } = get();
    if (!isGroupStageComplete(selections)) {
      return false;
    }
    if (!areThirdPlaceTeamsReady(selections)) {
      return false;
    }
    if (!isBestThirdSelectionValid(selections, bestThirdPlaceTeamCodes)) {
      return false;
    }
    // generate bracket on backend and persist sessionId
    (async () => {
      try {
        const sessionId = get().sessionId || crypto?.randomUUID?.() || `s_${Date.now()}`;
        const res = await bracketApi.generate(sessionId);
        if (res?.data?.success) {
          set({ generated: true, matchWinners: {}, champion: null, sessionId: res.data.data.sessionId || sessionId });
        } else {
          set({ generated: true, matchWinners: {}, champion: null, sessionId });
        }
      } catch (err) {
        set({ generated: true, matchWinners: {}, champion: null });
      }
    })();
    return true;
  },

  setMatchWinner: (matchId, teamCode) => {
    set((state) => {
      const existing = state.matchWinners[matchId];
      const nextWinners = { ...state.matchWinners, [matchId]: teamCode };
      if (existing && existing !== teamCode) {
        getDescendantMatchIds(matchId).forEach((descendant) => {
          delete nextWinners[descendant];
        });
      }

      const finalMatchIds = knockoutSchema.filter((match) => match.round === 'Final').map((match) => match.id);
      const champion = finalMatchIds.some((id) => nextWinners[id]) ? nextWinners[finalMatchIds[0]] : null;

      // optimistically update and send to backend
      (async () => {
        try {
          const sessionId = get().sessionId;
          if (sessionId) {
            await bracketApi.updateMatch(sessionId, matchId, teamCode, teamCode);
          }
        } catch (e) {
          // ignore backend errors for now
        }
      })();

      return { matchWinners: nextWinners, champion };
    });
  },

  ensureSession: () => {
    set((state) => {
      if (state.sessionId) return {};
      const sid = crypto?.randomUUID?.() || `s_${Date.now()}`;
      return { sessionId: sid };
    });
  },

  resetPrediction: () => {
    const resetSelections = {};
    groups.forEach((group) => {
      resetSelections[group.id] = { first: '', second: '', third: '' };
    });
    set({
      groupSelections: resetSelections,
      bestThirdPlaceTeamCodes: [],
      matchWinners: {},
      generated: false,
      champion: null,
    });
  },
}));

export default usePredictionStore;
