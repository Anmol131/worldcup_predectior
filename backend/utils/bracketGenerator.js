const roundOrder = ['r32', 'r16', 'qf', 'sf', 'final'];

const round32Slots = [
  { matchId: 'R32-M01', teamA: { type: 'group', groupId: 'A', rank: '1st' }, teamB: { type: 'third' } },
  { matchId: 'R32-M02', teamA: { type: 'group', groupId: 'C', rank: '1st' }, teamB: { type: 'group', groupId: 'D', rank: '2nd' } },
  { matchId: 'R32-M03', teamA: { type: 'group', groupId: 'B', rank: '1st' }, teamB: { type: 'group', groupId: 'A', rank: '2nd' } },
  { matchId: 'R32-M04', teamA: { type: 'group', groupId: 'D', rank: '1st' }, teamB: { type: 'group', groupId: 'C', rank: '2nd' } },
  { matchId: 'R32-M05', teamA: { type: 'group', groupId: 'E', rank: '1st' }, teamB: { type: 'third' } },
  { matchId: 'R32-M06', teamA: { type: 'group', groupId: 'G', rank: '1st' }, teamB: { type: 'group', groupId: 'H', rank: '2nd' } },
  { matchId: 'R32-M07', teamA: { type: 'group', groupId: 'F', rank: '1st' }, teamB: { type: 'group', groupId: 'E', rank: '2nd' } },
  { matchId: 'R32-M08', teamA: { type: 'group', groupId: 'H', rank: '1st' }, teamB: { type: 'group', groupId: 'G', rank: '2nd' } },
  { matchId: 'R32-M09', teamA: { type: 'group', groupId: 'I', rank: '1st' }, teamB: { type: 'third' } },
  { matchId: 'R32-M10', teamA: { type: 'group', groupId: 'K', rank: '1st' }, teamB: { type: 'group', groupId: 'L', rank: '2nd' } },
  { matchId: 'R32-M11', teamA: { type: 'group', groupId: 'J', rank: '1st' }, teamB: { type: 'group', groupId: 'I', rank: '2nd' } },
  { matchId: 'R32-M12', teamA: { type: 'group', groupId: 'L', rank: '1st' }, teamB: { type: 'group', groupId: 'K', rank: '2nd' } },
  { matchId: 'R32-M13', teamA: { type: 'third' }, teamB: { type: 'third' } },
  { matchId: 'R32-M14', teamA: { type: 'third' }, teamB: { type: 'third' } },
  { matchId: 'R32-M15', teamA: { type: 'third' }, teamB: { type: 'group', groupId: 'F', rank: '2nd' } },
  { matchId: 'R32-M16', teamA: { type: 'group', groupId: 'J', rank: '2nd' }, teamB: { type: 'group', groupId: 'C', rank: '3rd' } },
];

// TODO: Update with official FIFA 2026 bracket seeding
// when published at fifa.com

function normalizeGroups(groups) {
  if (Array.isArray(groups)) {
    return groups;
  }

  if (groups && typeof groups === 'object') {
    return Object.values(groups);
  }

  return [];
}

function getTeamByPosition(group, position) {
  if (!group || !Array.isArray(group.teams)) {
    return null;
  }

  return group.teams.find((team) => team.position === position) || null;
}

function toTeam(team) {
  if (!team) {
    return { code: '', name: 'TBD', flag: '' };
  }

  return {
    code: team.code || '',
    name: team.name || 'TBD',
    flag: team.flag || '',
  };
}

function resolveSource(source, groups, bestThirdTeams, thirdPointer) {
  if (source.type === 'group') {
    const group = groups.find((entry) => entry.groupId === source.groupId);
    return toTeam(getTeamByPosition(group, source.rank));
  }

  if (source.type === 'third') {
    const team = bestThirdTeams[thirdPointer.current];
    thirdPointer.current += 1;
    return toTeam(team);
  }

  return toTeam(null);
}

function generateR32Matchups(groups, bestThirdTeams) {
  const normalizedGroups = normalizeGroups(groups);
  const rankedThirds = Array.isArray(bestThirdTeams) ? bestThirdTeams : [];
  const thirdPointer = { current: 0 };

  return round32Slots.map((slot, index) => ({
    matchId: slot.matchId,
    teamA: resolveSource(slot.teamA, normalizedGroups, rankedThirds, thirdPointer),
    teamB: resolveSource(slot.teamB, normalizedGroups, rankedThirds, thirdPointer),
    winner: null,
    matchIndex: index,
    path: index < 8 ? 'A' : 'B',
    round: 'r32',
  }));
}

function createEmptyBracketRounds() {
  const buildRound = (prefix, count) => Array.from({ length: count }, (_, index) => ({
    matchId: `${prefix.toUpperCase()}-M${String(index + 1).padStart(2, '0')}`,
    matchIndex: index,
    teamA: { code: '', name: 'TBD', flag: '' },
    teamB: { code: '', name: 'TBD', flag: '' },
    winner: null,
    path: index < Math.ceil(count / 2) ? 'A' : 'B',
    round: prefix,
  }));

  return {
    r16: buildRound('r16', 8),
    qf: buildRound('qf', 4),
    sf: buildRound('sf', 2),
    final: buildRound('final', 1),
  };
}

function propagateWinner(rounds, roundKey, matchIndex, winner) {
  const nextRoundIndex = roundOrder.indexOf(roundKey) + 1;

  if (nextRoundIndex >= roundOrder.length) {
    return;
  }

  const nextRoundKey = roundOrder[nextRoundIndex];
  const nextMatchIndex = Math.floor(matchIndex / 2);
  const nextMatch = rounds[nextRoundKey]?.[nextMatchIndex];

  if (!nextMatch) {
    return;
  }

  if (matchIndex % 2 === 0) {
    nextMatch.teamA = winner;
  } else {
    nextMatch.teamB = winner;
  }

  nextMatch.winner = null;
  propagateWinner(rounds, nextRoundKey, nextMatchIndex, winner);
}

module.exports = {
  generateR32Matchups,
  createEmptyBracketRounds,
  propagateWinner,
};