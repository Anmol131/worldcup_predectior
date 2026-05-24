const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    code: { type: String, default: '' },
    name: { type: String, default: '' },
    flag: { type: String, default: '' },
  },
  { _id: false },
);

const predictionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    shareToken: { type: String, unique: true, index: true },
    predictorName: { type: String, default: 'Anonymous' },
    champion: { type: teamSchema, default: null },
    bracketSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
    groupsSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Prediction', predictionSchema);
