function generateR32Matchups(groups, bestThirdTeams) {
  const getTeam = (groupId, position) => {
    const group = groups.find((entry) => entry.groupId === groupId);
    return group?.teams?.find((team) => team.position === position) || null;
  };

  return [
    { matchId: 'R32-M01', path: 'A', teamA: getTeam('A', '1st'), teamB: bestThirdTeams[0] || null },
    { matchId: 'R32-M02', path: 'A', teamA: getTeam('C', '1st'), teamB: getTeam('D', '2nd') },
    { matchId: 'R32-M03', path: 'A', teamA: getTeam('B', '1st'), teamB: getTeam('A', '2nd') },
    { matchId: 'R32-M04', path: 'A', teamA: getTeam('D', '1st'), teamB: getTeam('C', '2nd') },
    { matchId: 'R32-M05', path: 'A', teamA: getTeam('E', '1st'), teamB: bestThirdTeams[1] || null },
    { matchId: 'R32-M06', path: 'A', teamA: getTeam('G', '1st'), teamB: getTeam('H', '2nd') },
    { matchId: 'R32-M07', path: 'A', teamA: getTeam('F', '1st'), teamB: getTeam('E', '2nd') },
    { matchId: 'R32-M08', path: 'A', teamA: getTeam('H', '1st'), teamB: getTeam('G', '2nd') },
    { matchId: 'R32-M09', path: 'B', teamA: getTeam('I', '1st'), teamB: bestThirdTeams[2] || null },
    { matchId: 'R32-M10', path: 'B', teamA: getTeam('K', '1st'), teamB: getTeam('L', '2nd') },
    { matchId: 'R32-M11', path: 'B', teamA: getTeam('J', '1st'), teamB: getTeam('I', '2nd') },
    { matchId: 'R32-M12', path: 'B', teamA: getTeam('L', '1st'), teamB: getTeam('K', '2nd') },
    { matchId: 'R32-M13', path: 'B', teamA: bestThirdTeams[3] || null, teamB: bestThirdTeams[4] || null },
    { matchId: 'R32-M14', path: 'B', teamA: bestThirdTeams[5] || null, teamB: bestThirdTeams[6] || null },
    { matchId: 'R32-M15', path: 'B', teamA: bestThirdTeams[7] || null, teamB: getTeam('F', '2nd') },
    { matchId: 'R32-M16', path: 'B', teamA: getTeam('J', '2nd'), teamB: getTeam('C', '3rd') },
  ].map((match, index) => ({ ...match, winner: null, matchIndex: index, round: 'r32' }));
}

function createEmptyBracketRounds() {
  const createRound = (round, count) => Array.from({ length: count }, (_, index) => ({
    matchId: `${round.toUpperCase()}-M${String(index + 1).padStart(2, '0')}`,
    matchIndex: index,
    teamA: { code: '', name: 'TBD', flag: '' },
    teamB: { code: '', name: 'TBD', flag: '' },
    winner: null,
    path: index < Math.ceil(count / 2) ? 'A' : 'B',
    round,
  }));

  return {
    r16: createRound('r16', 8),
    qf: createRound('qf', 4),
    sf: createRound('sf', 2),
    final: createRound('final', 1),
  };
}

module.exports = { generateR32Matchups, createEmptyBracketRounds };const roundOrder = ['r32', 'r16', 'qf', 'sf', 'final'];

const round32Slots = [
  { matchId: 'R32-M01', teamA: { type: 'group', groupId: 'A', rank: '1st' }, teamB: { type: 'third', groups: ['B', 'C', 'D', 'E', 'F'] } },
  { matchId: 'R32-M02', teamA: { type: 'group', groupId: 'C', rank: '1st' }, teamB: { type: 'group', groupId: 'D', rank: '2nd' } },
  { matchId: 'R32-M03', teamA: { type: 'group', groupId: 'B', rank: '1st' }, teamB: { type: 'group', groupId: 'A', rank: '2nd' } },
  { matchId: 'R32-M04', teamA: { type: 'group', groupId: 'D', rank: '1st' }, teamB: { type: 'group', groupId: 'C', rank: '2nd' } },
  { matchId: 'R32-M05', teamA: { type: 'group', groupId: 'E', rank: '1st' }, teamB: { type: 'third', groups: ['A', 'B', 'C', 'D'] } },
  { matchId: 'R32-M06', teamA: { type: 'group', groupId: 'G', rank: '1st' }, teamB: { type: 'group', groupId: 'H', rank: '2nd' } },
  { matchId: 'R32-M07', teamA: { type: 'group', groupId: 'F', rank: '1st' }, teamB: { type: 'group', groupId: 'E', rank: '2nd' } },
  { matchId: 'R32-M08', teamA: { type: 'group', groupId: 'H', rank: '1st' }, teamB: { type: 'group', groupId: 'G', rank: '2nd' } },
  { matchId: 'R32-M09', teamA: { type: 'group', groupId: 'I', rank: '1st' }, teamB: { type: 'third', groups: ['G', 'H', 'J', 'K', 'L'] } },
  { matchId: 'R32-M10', teamA: { type: 'group', groupId: 'K', rank: '1st' }, teamB: { type: 'group', groupId: 'L', rank: '2nd' } },
  { matchId: 'R32-M11', teamA: { type: 'group', groupId: 'J', rank: '1st' }, teamB: { type: 'group', groupId: 'I', rank: '2nd' } },
  { matchId: 'R32-M12', teamA: { type: 'group', groupId: 'L', rank: '1st' }, teamB: { type: 'group', groupId: 'K', rank: '2nd' } },
  { matchId: 'R32-M13', teamA: { type: 'third', groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] }, teamB: { type: 'third', groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] } },
  { matchId: 'R32-M14', teamA: { type: 'third', groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] }, teamB: { type: 'third', groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] } },
  { matchId: 'R32-M15', teamA: { type: 'third', groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] }, teamB: { type: 'third', groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] } },
  { matchId: 'R32-M16', teamA: { type: 'third', groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] }, teamB: { type: 'third', groups: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] } },
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
    path: index < 8 ? 'A' : 'B',
    round: 'r32',
  }));
}

function createEmptyBracketRounds() {
  const buildRound = (prefix, count) => Array.from({ length: count }, (_, index) => ({
    matchId: `${prefix.toUpperCase()}-M${String(index + 1).padStart(2, '0')}`,
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