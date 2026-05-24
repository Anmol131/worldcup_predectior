const Group = require('../models/Group');
const defaultGroups = require('../utils/defaultGroups');

function mapSelectionToTeams(teams, selection) {
  const nextTeams = teams.map((team) => ({ ...team.toObject?.() || team, position: null }));

  ['first', 'second', 'third'].forEach((rank, index) => {
    const code = selection?.[rank];
    if (!code) return;

    const teamIndex = nextTeams.findIndex((team) => team.code === code);
    if (teamIndex !== -1) {
      nextTeams[teamIndex].position = `${index + 1}st`.replace('1st', '1st').replace('2st', '2nd').replace('3st', '3rd');
    }
  });

  return nextTeams;
}

exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find().sort({ groupId: 1 });
    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    return next(error);
  }
};

exports.seedGroups = async (req, res, next) => {
  try {
    const count = await Group.countDocuments();
    if (count > 0) {
      return res.status(200).json({ success: true, message: 'Groups already seeded' });
    }

    const seeded = await Group.insertMany(defaultGroups);
    return res.status(201).json({ success: true, data: seeded });
  } catch (error) {
    return next(error);
  }
};

exports.updateGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { selection } = req.body;

    const group = await Group.findOne({ groupId: groupId.toUpperCase() });
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const teams = mapSelectionToTeams(group.teams, selection);
    const positions = teams.map((team) => team.position).filter(Boolean);
    group.teams = teams;
    group.isComplete = positions.length === 3 && new Set(positions).size === 3;

    await group.save();

    return res.status(200).json({ success: true, data: group });
  } catch (error) {
    return next(error);
  }
};
