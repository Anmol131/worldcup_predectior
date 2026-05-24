import { create } from 'zustand';
import groups from '../data/groups';
import { isGroupStageComplete, areThirdPlaceTeamsReady, getDescendantMatchIds, knockoutSchema } from '../utils/tournament';

const defaultSelections = {};

groups.forEach((group) => {
  defaultSelections[group.id] = { first: '', second: '' };
});

const usePredictionStore = create((set, get) => ({
  groupSelections: defaultSelections,
  matchWinners: {},
  generated: false,
  champion: null,

  selectGroupTeam: (groupId, teamCode, rank) => {
    set((state) => {
      const current = state.groupSelections[groupId] || { first: '', second: '' };
      const next = { ...current };
      const oppositeRank = rank === 'first' ? 'second' : 'first';

      if (next[rank] === teamCode) {
        next[rank] = '';
      } else {
        next[rank] = teamCode;
        if (next[oppositeRank] === teamCode) {
          next[oppositeRank] = '';
        }
      }

      return {
        groupSelections: {
          ...state.groupSelections,
          [groupId]: next,
        },
      };
    });
  },

  generateKnockout: () => {
    const selections = get().groupSelections;
    if (!isGroupStageComplete(selections)) {
      return false;
    }
    if (!areThirdPlaceTeamsReady(selections)) {
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
      resetSelections[group.id] = { first: '', second: '' };
    });
    set({
      groupSelections: resetSelections,
      matchWinners: {},
      generated: false,
      champion: null,
    });
  },
}));

export default usePredictionStore;
