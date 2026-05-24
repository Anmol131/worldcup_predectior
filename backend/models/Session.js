const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    flag: { type: String, default: '' },
    position: { type: String, default: null },
  },
  { _id: false },
);

const groupSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true },
    teams: { type: [teamSchema], default: [] },
    isComplete: { type: Boolean, default: false },
  },
  { _id: false },
);

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    groups: { type: [groupSchema], default: [] },
    allGroupsDone: { type: Boolean, default: false },
    bestThirdConfirmed: { type: Boolean, default: false },
    bestThirdTeams: { type: [teamSchema], default: [] },
    currentPhase: { type: String, enum: ['groups', 'bracket', 'champion'], default: 'groups' },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Session', sessionSchema);