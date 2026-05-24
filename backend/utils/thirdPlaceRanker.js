function rankThirdPlaceTeams(thirdPlaceTeams = []) {
  return [...thirdPlaceTeams];
}

module.exports = rankThirdPlaceTeams;function rankThirdPlaceTeams(teams) {
  if (!Array.isArray(teams)) {
    return [];
  }

  return [...teams].sort((a, b) => {
    const pointsDiff = (b.points || 0) - (a.points || 0);
    if (pointsDiff !== 0) return pointsDiff;

    const gdDiff = (b.goalDifference || 0) - (a.goalDifference || 0);
    if (gdDiff !== 0) return gdDiff;

    const gfDiff = (b.goalsFor || 0) - (a.goalsFor || 0);
    if (gfDiff !== 0) return gfDiff;

    return String(a.name || '').localeCompare(String(b.name || ''));
  });
}

module.exports = { rankThirdPlaceTeams };
