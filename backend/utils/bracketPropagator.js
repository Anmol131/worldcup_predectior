function propagateWinner(bracket, round, matchIndex, winner) {
  const roundOrder = ['r32', 'r16', 'qf', 'sf', 'final'];
  const currentIdx = roundOrder.indexOf(round);

  if (currentIdx === roundOrder.length - 1) {
    return bracket;
  }

  const nextRound = roundOrder[currentIdx + 1];
  const nextMatchIndex = Math.floor(matchIndex / 2);
  const slot = matchIndex % 2 === 0 ? 'teamA' : 'teamB';

  bracket.rounds[nextRound][nextMatchIndex][slot] = winner;
  return bracket;
}

module.exports = { propagateWinner };