const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    flag: { type: String, default: '' },
  },
  { _id: false },
);

const matchSchema = new mongoose.Schema(
  {
    matchId: { type: String, required: true },
    matchIndex: { type: Number, default: 0 },
    teamA: { type: teamSchema, default: () => ({ code: '', name: '', flag: '' }) },
    teamB: { type: teamSchema, default: () => ({ code: '', name: '', flag: '' }) },
    winner: { type: teamSchema, default: null },
    path: { type: String, enum: ['A', 'B'], default: 'A' },
    round: { type: String, enum: ['r32', 'r16', 'qf', 'sf', 'final'], default: 'r32' },
  },
  { _id: false },
);

const bracketSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    rounds: {
      r32: { type: [matchSchema], default: [] },
      r16: { type: [matchSchema], default: [] },
      qf: { type: [matchSchema], default: [] },
      sf: { type: [matchSchema], default: [] },
      final: { type: [matchSchema], default: [] },
    },
    champion: { type: teamSchema, default: null },
    isComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Bracket', bracketSchema);
