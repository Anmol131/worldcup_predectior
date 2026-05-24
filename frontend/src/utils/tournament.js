import groups from '../data/groups';

const roundOf32 = [
  { id: 'r32-m01', round: 'Round of 32', home: { type: 'group', group: 'A', rank: 'first' }, away: { type: 'group', group: 'B', rank: 'second' } },
  { id: 'r32-m02', round: 'Round of 32', home: { type: 'group', group: 'C', rank: 'first' }, away: { type: 'group', group: 'D', rank: 'second' } },
  { id: 'r32-m03', round: 'Round of 32', home: { type: 'group', group: 'E', rank: 'first' }, away: { type: 'group', group: 'F', rank: 'second' } },
  { id: 'r32-m04', round: 'Round of 32', home: { type: 'group', group: 'G', rank: 'first' }, away: { type: 'group', group: 'H', rank: 'second' } },
  { id: 'r32-m05', round: 'Round of 32', home: { type: 'group', group: 'I', rank: 'first' }, away: { type: 'group', group: 'J', rank: 'second' } },
  { id: 'r32-m06', round: 'Round of 32', home: { type: 'group', group: 'K', rank: 'first' }, away: { type: 'group', group: 'L', rank: 'second' } },
  { id: 'r32-m07', round: 'Round of 32', home: { type: 'group', group: 'B', rank: 'first' }, away: { type: 'group', group: 'A', rank: 'second' } },
  { id: 'r32-m08', round: 'Round of 32', home: { type: 'group', group: 'D', rank: 'first' }, away: { type: 'group', group: 'C', rank: 'second' } },
  { id: 'r32-m09', round: 'Round of 32', home: { type: 'group', group: 'F', rank: 'first' }, away: { type: 'group', group: 'E', rank: 'second' } },
  { id: 'r32-m10', round: 'Round of 32', home: { type: 'group', group: 'H', rank: 'first' }, away: { type: 'group', group: 'G', rank: 'second' } },
  { id: 'r32-m11', round: 'Round of 32', home: { type: 'group', group: 'J', rank: 'first' }, away: { type: 'group', group: 'I', rank: 'second' } },
  { id: 'r32-m12', round: 'Round of 32', home: { type: 'group', group: 'L', rank: 'first' }, away: { type: 'group', group: 'K', rank: 'second' } },
  { id: 'r32-m13', round: 'Round of 32', home: { type: 'group', group: 'A', rank: 'third' }, away: { type: 'group', group: 'B', rank: 'third' } },
  { id: 'r32-m14', round: 'Round of 32', home: { type: 'group', group: 'C', rank: 'third' }, away: { type: 'group', group: 'D', rank: 'third' } },
  { id: 'r32-m15', round: 'Round of 32', home: { type: 'group', group: 'E', rank: 'third' }, away: { type: 'group', group: 'F', rank: 'third' } },
  { id: 'r32-m16', round: 'Round of 32', home: { type: 'group', group: 'G', rank: 'third' }, away: { type: 'group', group: 'H', rank: 'third' } },
];

const roundOf16 = [
  { id: 'r16-m01', round: 'Round of 16', home: { type: 'match', matchId: 'r32-m01' }, away: { type: 'match', matchId: 'r32-m02' } },
  { id: 'r16-m02', round: 'Round of 16', home: { type: 'match', matchId: 'r32-m03' }, away: { type: 'match', matchId: 'r32-m04' } },
  { id: 'r16-m03', round: 'Round of 16', home: { type: 'match', matchId: 'r32-m05' }, away: { type: 'match', matchId: 'r32-m06' } },
  { id: 'r16-m04', round: 'Round of 16', home: { type: 'match', matchId: 'r32-m07' }, away: { type: 'match', matchId: 'r32-m08' } },
  { id: 'r16-m05', round: 'Round of 16', home: { type: 'match', matchId: 'r32-m09' }, away: { type: 'match', matchId: 'r32-m10' } },
  { id: 'r16-m06', round: 'Round of 16', home: { type: 'match', matchId: 'r32-m11' }, away: { type: 'match', matchId: 'r32-m12' } },
  { id: 'r16-m07', round: 'Round of 16', home: { type: 'match', matchId: 'r32-m13' }, away: { type: 'match', matchId: 'r32-m14' } },
  { id: 'r16-m08', round: 'Round of 16', home: { type: 'match', matchId: 'r32-m15' }, away: { type: 'match', matchId: 'r32-m16' } },
];

const quarterFinals = [
  { id: 'qf-m01', round: 'Quarter Finals', home: { type: 'match', matchId: 'r16-m01' }, away: { type: 'match', matchId: 'r16-m02' } },
  { id: 'qf-m02', round: 'Quarter Finals', home: { type: 'match', matchId: 'r16-m03' }, away: { type: 'match', matchId: 'r16-m04' } },
  { id: 'qf-m03', round: 'Quarter Finals', home: { type: 'match', matchId: 'r16-m05' }, away: { type: 'match', matchId: 'r16-m06' } },
  { id: 'qf-m04', round: 'Quarter Finals', home: { type: 'match', matchId: 'r16-m07' }, away: { type: 'match', matchId: 'r16-m08' } },
];

const semiFinals = [
  { id: 'sf-m01', round: 'Semi Finals', home: { type: 'match', matchId: 'qf-m01' }, away: { type: 'match', matchId: 'qf-m02' } },
  { id: 'sf-m02', round: 'Semi Finals', home: { type: 'match', matchId: 'qf-m03' }, away: { type: 'match', matchId: 'qf-m04' } },
];

const finalStage = [
  { id: 'final-m01', round: 'Final', home: { type: 'match', matchId: 'sf-m01' }, away: { type: 'match', matchId: 'sf-m02' } },
];

export const knockoutSchema = [...roundOf32, ...roundOf16, ...quarterFinals, ...semiFinals, ...finalStage];

const roundOrder = ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];

export function getGroupById(id) {
  return groups.find((group) => group.id === id);
}

export function getGroupSelectionTeam(groupId, selection, rank) {
  const group = getGroupById(groupId);
  if (!group) return createPlaceholder(rank);

  const chosenCode = selection?.[rank];
  if (chosenCode) {
    return group.teams.find((team) => team.code === chosenCode) || createPlaceholder(rank);
  }

  return createPlaceholder(rank);
}

export function createPlaceholder(label) {
  return {
    code: '',
    name: label === 'third' ? '3rd Place TBD' : 'TBD',
    flag: '⛳',
    placeholder: true,
  };
}

export function resolveParticipant(source, selections, results, thirdPlaceSlots) {
  if (!source) return createPlaceholder('TBD');
  if (source.type === 'group') {
    if (source.rank === 'third' && thirdPlaceSlots?.[source.group]) {
      return thirdPlaceSlots[source.group];
    }
    return getGroupSelectionTeam(source.group, selections?.[source.group], source.rank);
  }

  if (source.type === 'match') {
    const winnerCode = results?.[source.matchId];
    if (!winnerCode) {
      const match = knockoutSchema.find((item) => item.id === source.matchId);
      return createPlaceholder(source.matchId);
    }

    const team = groups
      .flatMap((group) => group.teams)
      .find((teamItem) => teamItem.code === winnerCode);

    return team || { code: winnerCode, name: winnerCode, flag: '🏆' };
  }

  return createPlaceholder('TBD');
}

export function buildKnockoutRounds(selections, results, bestThirdPlaceTeamCodes = []) {
  const thirdPlaceSlots = buildBestThirdPlaceSlots(selections, bestThirdPlaceTeamCodes);
  const rounds = roundOrder.map((round) => ({
    title: round,
    matches: knockoutSchema
      .filter((match) => match.round === round)
      .map((match) => ({
        ...match,
        home: resolveParticipant(match.home, selections, results, thirdPlaceSlots),
        away: resolveParticipant(match.away, selections, results, thirdPlaceSlots),
        winner: results?.[match.id] || null,
      })),
  }));
  const finalMatch = rounds.find((round) => round.title === 'Final')?.matches?.[0];
  const champion = finalMatch?.winner ? resolveParticipant({ type: 'match', matchId: finalMatch.id }, selections, results) : null;

  return { rounds, champion };
}

export function isGroupStageComplete(selections) {
  return groups.every((group) => {
    const selection = selections[group.id] || {};
    const chosen = [selection.first, selection.second, selection.third].filter(Boolean);
    return selection.first && selection.second && selection.third && new Set(chosen).size === 3;
  });
}

export function getGroupProgress(selections) {
  const complete = groups.filter((group) => {
    const selection = selections[group.id] || {};
    const chosen = [selection.first, selection.second, selection.third].filter(Boolean);
    return selection.first && selection.second && selection.third && new Set(chosen).size === 3;
  }).length;
  return { complete, total: groups.length };
}

export function getDependentMatches() {
  const tree = {};
  knockoutSchema.forEach((match) => {
    [match.home, match.away].forEach((source) => {
      if (source.type === 'match') {
        tree[source.matchId] = tree[source.matchId] || new Set();
        tree[source.matchId].add(match.id);
      }
    });
  });
  return tree;
}

export function getDescendantMatchIds(matchId) {
  const tree = getDependentMatches();
  const queue = [matchId];
  const descendants = new Set();

  while (queue.length) {
    const current = queue.shift();
    const children = tree[current];
    if (children) {
      children.forEach((childId) => {
        if (!descendants.has(childId)) {
          descendants.add(childId);
          queue.push(childId);
        }
      });
    }
  }

  return Array.from(descendants);
}

/**
 * Get all 12 third-place teams from group selections
 */
export function getAllThirdPlaceTeams(selections) {
  return groups.map((group) => ({
    groupId: group.id,
    team: getGroupSelectionTeam(group.id, selections[group.id], 'third'),
  })).filter((entry) => entry.team?.code);
}

/**
 * Get the 8 third-place teams that qualify for knockout (groups A through H)
 * In 2026 World Cup, the 8 best third-place teams advance - these are selected from groups A-H
 */
export function getQualifyingThirdPlaceTeams(selections) {
  return getAllThirdPlaceTeams(selections).slice(0, 8);
}

/**
 * Check if all 3rd place selections are available (teams are determined from group selections)
 */
export function areThirdPlaceTeamsReady(selections) {
  if (!isGroupStageComplete(selections)) {
    return false;
  }
  return getAllThirdPlaceTeams(selections).length === groups.length;
}

export function isBestThirdSelectionValid(selections, bestThirdPlaceTeamCodes) {
  const allThirdCodes = new Set(getAllThirdPlaceTeams(selections).map((entry) => entry.team.code));
  if (!Array.isArray(bestThirdPlaceTeamCodes) || bestThirdPlaceTeamCodes.length !== 8) {
    return false;
  }
  if (new Set(bestThirdPlaceTeamCodes).size !== 8) {
    return false;
  }

  return bestThirdPlaceTeamCodes.every((code) => allThirdCodes.has(code));
}

export function buildBestThirdPlaceSlots(selections, bestThirdPlaceTeamCodes) {
  const thirdTeams = getAllThirdPlaceTeams(selections);
  const selectedCodes = new Set(bestThirdPlaceTeamCodes || []);
  const selectedTeams = thirdTeams.filter((entry) => selectedCodes.has(entry.team.code)).map((entry) => entry.team);
  const slotGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return slotGroups.reduce((acc, groupId, index) => {
    acc[groupId] = selectedTeams[index] || createPlaceholder('third');
    return acc;
  }, {});
}
