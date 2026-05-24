const mongoose = require('mongoose');

const teamLiteSchema = new mongoose.Schema(
  {
    code: { type: String, default: '' },
    name: { type: String, default: '' },
  },
  { _id: false },
);

const matchSchema = new mongoose.Schema(
  {
    matchId: { type: String, required: true },
    teamA: { type: teamLiteSchema, default: () => ({ code: '', name: '' }) },
    teamB: { type: teamLiteSchema, default: () => ({ code: '', name: '' }) },
    winner: { type: teamLiteSchema, default: null },
    path: { type: String, enum: ['A', 'B'], default: 'A' },
  },
  { _id: false },
);

const bracketSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    rounds: {
      r32: { type: [matchSchema], default: [] },
      r16: { type: [matchSchema], default: [] },
      qf: { type: [matchSchema], default: [] },
      sf: { type: [matchSchema], default: [] },
      final: { type: [matchSchema], default: [] },
    },
    champion: { type: String, default: '' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Bracket', bracketSchema);
