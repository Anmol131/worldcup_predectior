const Session = require('../models/Session');
const Bracket = require('../models/Bracket');
const { generateR32Matchups, createEmptyBracketRounds } = require('../utils/bracketGenerator');
const { propagateWinner, clearDownstreamWinners } = require('../utils/bracketPropagator');

function toTeam(team) {
  if (!team) {
    return { code: '', name: '', flag: '' };
  }

  return {
    code: team.code || '',
    name: team.name || '',
    flag: team.flag || '',
  };
}

function roundToKey(round) {
  return ({
    'Round of 32': 'r32',
    'Round of 16': 'r16',
    'Quarter Finals': 'qf',
    'Semi Finals': 'sf',
    Final: 'final',
    r32: 'r32',
    r16: 'r16',
    qf: 'qf',
    sf: 'sf',
    final: 'final',
  })[round] || null;
}

exports.generateBracket = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (!session.allGroupsDone || !session.bestThirdConfirmed) {
      return res.status(400).json({ success: false, message: 'Complete groups and confirm best third-place teams first' });
    }

    const rounds = {
      r32: generateR32Matchups(session.groups, session.bestThirdTeams.map(toTeam)),
      ...createEmptyBracketRounds(),
    };

    const bracket = await Bracket.findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        rounds,
        champion: null,
        isComplete: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    session.currentPhase = 'bracket';
    session.lastUpdated = new Date();
    await session.save();

    return res.status(200).json({ success: true, bracket });
  } catch (error) {
    return next(error);
  }
};

exports.getBracket = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const bracket = await Bracket.findOne({ sessionId });

    return res.status(200).json({ success: true, bracket: bracket || null });
  } catch (error) {
    return next(error);
  }
};

exports.pickWinner = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { round, matchId, winnerCode } = req.body;
    const roundKey = roundToKey(round);
    const isClearing = winnerCode === undefined || winnerCode === '' || winnerCode === null;

    if (!roundKey) {
      return res.status(400).json({ success: false, message: 'Invalid round' });
    }

    const bracket = await Bracket.findOne({ sessionId });
    if (!bracket) {
      return res.status(404).json({ success: false, message: 'Bracket not found' });
    }

    const matches = bracket.rounds[roundKey] || [];
    const matchIndex = matches.findIndex((match) => match.matchId === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const match = matches[matchIndex];
    const matchReady = match.teamA && match.teamA.code && match.teamA.code !== 'TBD' && match.teamB && match.teamB.code && match.teamB.code !== 'TBD';

    if (!isClearing && !matchReady) {
      return res.status(400).json({
        success: false,
        message: 'Both teams must be decided before picking a winner',
      });
    }

    const winningTeam = isClearing ? null : [match.teamA, match.teamB].find((team) => team?.code === winnerCode);
    if (!isClearing && !winningTeam) {
      return res.status(400).json({ success: false, message: 'Winner must be one of the match teams' });
    }

    const existingWinner = match.winner ? match.winner.code : null;
    const winner = isClearing ? null : toTeam(winningTeam);

    if (isClearing) {
      match.winner = null;
      clearDownstreamWinners(bracket, roundKey, matchIndex);
    } else {
      if (existingWinner && existingWinner !== winnerCode) {
        clearDownstreamWinners(bracket, roundKey, matchIndex);
      }
      match.winner = winner;
      if (roundKey !== 'final') {
        propagateWinner(bracket, roundKey, matchIndex, winner);
      }
    }

    if (roundKey !== 'final') {
      const finalMatch = bracket.rounds.final?.[0];
      if (!finalMatch?.winner) {
        bracket.champion = null;
        bracket.isComplete = false;

        const session = await Session.findOne({ sessionId });
        if (session && session.currentPhase === 'champion') {
          session.currentPhase = 'bracket';
          session.lastUpdated = new Date();
          await session.save();
        }
      }
    } else {
      if (isClearing) {
        bracket.champion = null;
        bracket.isComplete = false;

        const session = await Session.findOne({ sessionId });
        if (session) {
          session.currentPhase = 'bracket';
          session.lastUpdated = new Date();
          await session.save();
        }
      } else {
        bracket.champion = winner;
        bracket.isComplete = true;

        const session = await Session.findOne({ sessionId });
        if (session) {
          session.currentPhase = 'champion';
          session.lastUpdated = new Date();
          await session.save();
        }
      }
    }

    await bracket.save();
    return res.status(200).json({ success: true, bracket });
  } catch (error) {
    return next(error);
  }
};

exports.setChampion = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { teamCode } = req.body;

    const bracket = await Bracket.findOne({ sessionId });
    if (!bracket) {
      return res.status(404).json({ success: false, message: 'Bracket not found' });
    }

    const allTeams = Object.values(bracket.rounds).flatMap((round) => round.flatMap((match) => [match.teamA, match.teamB]));
    const champion = allTeams.find((team) => team?.code === teamCode);

    if (!champion) {
      return res.status(400).json({ success: false, message: 'Invalid champion team' });
    }

    bracket.champion = toTeam(champion);
    bracket.isComplete = true;
    await bracket.save();

    const session = await Session.findOne({ sessionId });
    if (session) {
      session.currentPhase = 'champion';
      session.lastUpdated = new Date();
      await session.save();
    }

    return res.status(200).json({ success: true, bracket });
  } catch (error) {
    return next(error);
  }
};
