const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    predictorName: { type: String, default: '' },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    bracket: { type: mongoose.Schema.Types.ObjectId, ref: 'Bracket', default: null },
    champion: { type: String, default: '' },
    isComplete: { type: Boolean, default: false },
    shareToken: { type: String, unique: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Prediction', predictionSchema);
