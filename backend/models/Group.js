const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    flag: { type: String, default: '' },
    position: {
      type: String,
      enum: ['1st', '2nd', '3rd'],
      default: null,
    },
  },
  { _id: false },
);

const groupSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    teams: { type: [teamSchema], default: [] },
    thirdPlaceAdvances: { type: Boolean, default: false },
    isComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Group', groupSchema);
