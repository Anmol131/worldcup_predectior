const Session = require('../models/Session');
const { GROUPS_DATA } = require('../data/teamsData');

function cloneTeams(teams) {
  return teams.map((team) => ({ ...team, position: null }));
}

function createInitialGroups() {
  return GROUPS_DATA.map((group) => ({
    groupId: group.groupId,
    teams: cloneTeams(group.teams),
    isComplete: false,
  }));
}

function summarizeSession(session) {
  const groupsComplete = session.groups.filter((group) => group.isComplete).length;
  return {
    sessionId: session.sessionId,
    currentPhase: session.currentPhase,
    groupsComplete,
    allGroupsDone: Boolean(session.allGroupsDone),
    bestThirdConfirmed: Boolean(session.bestThirdConfirmed),
    hasChampion: Boolean(session.champion),
  };
}

function mapPosition(position) {
  if (!position) {
    return null;
  }

  const normalizedPosition =
    position === 'first' ? '1st'
      : position === 'second' ? '2nd'
      : position === 'third' ? '3rd'
      : position;

  if (normalizedPosition === '1st' || normalizedPosition === '2nd' || normalizedPosition === '3rd') {
    return normalizedPosition;
  }

  return null;
}

exports.initSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    let session = await Session.findOne({ sessionId });

    if (!session) {
      session = await Session.create({
        sessionId,
        groups: createInitialGroups(),
        allGroupsDone: false,
        bestThirdConfirmed: false,
        bestThirdTeams: [],
        currentPhase: 'groups',
        lastUpdated: new Date(),
      });
    }

    return res.status(200).json({ success: true, session });
  } catch (error) {
    return next(error);
  }
};

exports.resetBestThird = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.bestThirdConfirmed = false;
    session.bestThirdTeams = [];
    session.currentPhase = 'groups';
    session.lastUpdated = new Date();
    await session.save();

    return res.status(200).json({ success: true, session });
  } catch (error) {
    return next(error);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    return res.status(200).json({
      success: true,
      ...summarizeSession(session),
      session,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    return res.status(200).json({ success: true, groups: session.groups });
  } catch (error) {
    return next(error);
  }
};

exports.updateGroupPick = async (req, res, next) => {
  try {
    const { sessionId, groupId } = req.params;
    const { teamCode, position } = req.body;
    const normalizedPosition = mapPosition(position);

    if (!normalizedPosition) {
      return res.status(400).json({ success: false, message: 'Invalid position' });
    }

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const group = session.groups.find((entry) => entry.groupId === groupId.toUpperCase());
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    group.teams.forEach((team) => {
      if (team.position === normalizedPosition) {
        team.position = null;
      }
      if (team.code === teamCode) {
        team.position = normalizedPosition;
      }
    });

    group.isComplete = group.teams.filter((team) => team.position).length === 3;
    session.allGroupsDone = session.groups.every((entry) => entry.isComplete);
    session.lastUpdated = new Date();
    await session.save();

    return res.status(200).json({
      success: true,
      group,
      sessionSummary: summarizeSession(session),
    });
  } catch (error) {
    return next(error);
  }
};

exports.confirmBestThird = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { selectedTeamCodes = [] } = req.body;

    if (!Array.isArray(selectedTeamCodes) || selectedTeamCodes.length !== 8) {
      return res.status(400).json({ success: false, message: 'Exactly 8 third-place teams are required' });
    }

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const thirdPlaceTeams = session.groups
      .flatMap((group) => group.teams)
      .filter((team) => team.position === '3rd');

    const validCodes = new Set(thirdPlaceTeams.map((team) => team.code));
    const invalidCode = selectedTeamCodes.find((code) => !validCodes.has(code));
    if (invalidCode) {
      return res.status(400).json({ success: false, message: `Invalid third-place team: ${invalidCode}` });
    }

    session.bestThirdTeams = thirdPlaceTeams.filter((team) => selectedTeamCodes.includes(team.code));
    session.bestThirdConfirmed = true;
    session.currentPhase = 'bracket';
    session.lastUpdated = new Date();
    await session.save();

    return res.status(200).json({ success: true, session });
  } catch (error) {
    return next(error);
  }
};