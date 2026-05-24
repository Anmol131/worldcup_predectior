const { randomUUID } = require('crypto');
const Bracket = require('../models/Bracket');
const Group = require('../models/Group');

const MATCH_SOURCES = {
  'r32-m01': { home: { group: 'A', rank: '1st' }, away: { group: 'B', rank: '2nd' } },
  'r32-m02': { home: { group: 'C', rank: '1st' }, away: { group: 'D', rank: '2nd' } },
  'r32-m03': { home: { group: 'E', rank: '1st' }, away: { group: 'F', rank: '2nd' } },
  'r32-m04': { home: { group: 'G', rank: '1st' }, away: { group: 'H', rank: '2nd' } },
  'r32-m05': { home: { group: 'I', rank: '1st' }, away: { group: 'J', rank: '2nd' } },
  'r32-m06': { home: { group: 'K', rank: '1st' }, away: { group: 'L', rank: '2nd' } },
  'r32-m07': { home: { group: 'B', rank: '1st' }, away: { group: 'A', rank: '2nd' } },
  'r32-m08': { home: { group: 'D', rank: '1st' }, away: { group: 'C', rank: '2nd' } },
  'r32-m09': { home: { group: 'F', rank: '1st' }, away: { group: 'E', rank: '2nd' } },
  'r32-m10': { home: { group: 'H', rank: '1st' }, away: { group: 'G', rank: '2nd' } },
  'r32-m11': { home: { group: 'J', rank: '1st' }, away: { group: 'I', rank: '2nd' } },
  'r32-m12': { home: { group: 'L', rank: '1st' }, away: { group: 'K', rank: '2nd' } },
  'r32-m13': { home: { group: 'A', rank: '3rd' }, away: { group: 'B', rank: '3rd' } },
  'r32-m14': { home: { group: 'C', rank: '3rd' }, away: { group: 'D', rank: '3rd' } },
  'r32-m15': { home: { group: 'E', rank: '3rd' }, away: { group: 'F', rank: '3rd' } },
  'r32-m16': { home: { group: 'G', rank: '3rd' }, away: { group: 'H', rank: '3rd' } },
};

function toTeamLite(team) {
  if (!team) return { code: '', name: 'TBD' };
  return { code: team.code, name: team.name };
}

function findTeamByGroupRank(groupsMap, groupId, rank) {
  const group = groupsMap.get(groupId);
  if (!group) return null;
  return group.teams.find((team) => team.position === rank) || null;
}

function buildEmptyRounds() {
  return {
    r16: Array.from({ length: 8 }, (_, index) => ({
      matchId: `r16-m${String(index + 1).padStart(2, '0')}`,
      teamA: { code: '', name: 'TBD' },
      teamB: { code: '', name: 'TBD' },
      winner: null,
      path: index < 4 ? 'A' : 'B',
    })),
    qf: Array.from({ length: 4 }, (_, index) => ({
      matchId: `qf-m${String(index + 1).padStart(2, '0')}`,
      teamA: { code: '', name: 'TBD' },
      teamB: { code: '', name: 'TBD' },
      winner: null,
      path: index < 2 ? 'A' : 'B',
    })),
    sf: Array.from({ length: 2 }, (_, index) => ({
      matchId: `sf-m${String(index + 1).padStart(2, '0')}`,
      teamA: { code: '', name: 'TBD' },
      teamB: { code: '', name: 'TBD' },
      winner: null,
      path: index === 0 ? 'A' : 'B',
    })),
    final: [
      {
        matchId: 'final-m01',
        teamA: { code: '', name: 'TBD' },
        teamB: { code: '', name: 'TBD' },
        winner: null,
        path: 'A',
      },
    ],
  };
}

exports.generateBracket = async (req, res, next) => {
  try {
    const sessionId = req.body.sessionId || randomUUID();

    const groups = await Group.find().sort({ groupId: 1 });
    const groupsMap = new Map(groups.map((group) => [group.groupId, group]));

    const r32 = Object.keys(MATCH_SOURCES).map((matchId) => {
      const source = MATCH_SOURCES[matchId];
      const teamA = findTeamByGroupRank(groupsMap, source.home.group, source.home.rank);
      const teamB = findTeamByGroupRank(groupsMap, source.away.group, source.away.rank);

      return {
        matchId,
        teamA: toTeamLite(teamA),
        teamB: toTeamLite(teamB),
        winner: null,
        path: 'A',
      };
    });

    const rounds = {
      r32,
      ...buildEmptyRounds(),
    };

    const bracket = await Bracket.findOneAndUpdate(
      { sessionId },
      { sessionId, rounds, champion: '' },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({ success: true, data: bracket });
  } catch (error) {
    return next(error);
  }
};

exports.getBracketBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const bracket = await Bracket.findOne({ sessionId });

    if (!bracket) {
      return res.status(404).json({ success: false, message: 'Bracket not found' });
    }

    return res.status(200).json({ success: true, data: bracket });
  } catch (error) {
    return next(error);
  }
};

exports.updateMatchWinner = async (req, res, next) => {
  try {
    const { sessionId, matchId } = req.params;
    const { winnerCode, winnerName } = req.body;

    const bracket = await Bracket.findOne({ sessionId });
    if (!bracket) {
      return res.status(404).json({ success: false, message: 'Bracket not found' });
    }

    const roundKeys = ['r32', 'r16', 'qf', 'sf', 'final'];
    let found = false;

    roundKeys.forEach((key) => {
      const matches = bracket.rounds[key] || [];
      const index = matches.findIndex((match) => match.matchId === matchId);
      if (index !== -1) {
        matches[index].winner = { code: winnerCode || '', name: winnerName || winnerCode || '' };
        found = true;
      }
    });

    if (!found) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const finalWinner = bracket.rounds.final?.[0]?.winner;
    bracket.champion = finalWinner?.name || '';

    await bracket.save();

    return res.status(200).json({ success: true, data: bracket });
  } catch (error) {
    return next(error);
  }
};
