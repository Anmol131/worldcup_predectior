import { create } from 'zustand';
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
    set({ generated: true, matchWinners: {}, champion: null });
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

      return { matchWinners: nextWinners, champion };
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
