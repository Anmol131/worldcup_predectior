function clearDownstreamWinners(bracket, round, matchIndex) {
  const roundOrder = ['r32', 'r16', 'qf', 'sf', 'final'];
  const currentIdx = roundOrder.indexOf(round);

  if (currentIdx >= roundOrder.length - 1) {
    return bracket;
  }

  const nextRound = roundOrder[currentIdx + 1];
  const nextMatchIndex = Math.floor(matchIndex / 2);
  const nextMatch = bracket.rounds[nextRound]?.[nextMatchIndex];

  if (!nextMatch) {
    return bracket;
  }

  const slot = matchIndex % 2 === 0 ? 'teamA' : 'teamB';
  nextMatch[slot] = { code: 'TBD', name: 'TBD', flag: '' };

  if (nextMatch.winner && nextMatch.winner.code !== 'TBD') {
    nextMatch.winner = null;
    bracket = clearDownstreamWinners(bracket, nextRound, nextMatchIndex);
  }

  return bracket;
}

function propagateWinner(bracket, round, matchIndex, winner) {
  const roundOrder = ['r32', 'r16', 'qf', 'sf', 'final'];
  const currentIdx = roundOrder.indexOf(round);

  if (currentIdx === roundOrder.length - 1) {
    return bracket;
  }

  const nextRound = roundOrder[currentIdx + 1];
  const nextMatchIndex = Math.floor(matchIndex / 2);
  const slot = matchIndex % 2 === 0 ? 'teamA' : 'teamB';
  const nextMatch = bracket.rounds[nextRound]?.[nextMatchIndex];

  if (!nextMatch) {
    return bracket;
  }

  if (!winner) {
    nextMatch[slot] = { code: 'TBD', name: 'TBD', flag: '' };

    if (nextMatch.winner) {
      nextMatch.winner = null;
      clearDownstreamWinners(bracket, nextRound, nextMatchIndex);
    }

    return bracket;
  }

  nextMatch[slot] = winner;

  if (nextMatch.winner && nextMatch.winner.code && nextMatch.winner.code !== nextMatch.teamA?.code && nextMatch.winner.code !== nextMatch.teamB?.code) {
    nextMatch.winner = null;
    clearDownstreamWinners(bracket, nextRound, nextMatchIndex);
  }

  return bracket;
}

module.exports = { propagateWinner, clearDownstreamWinners };