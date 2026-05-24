const Prediction = require('../models/Prediction');
const Session = require('../models/Session');
const Bracket = require('../models/Bracket');
const { nanoid } = require('nanoid');

exports.createShare = async (req, res, next) => {
  try {
    const { sessionId, predictorName = 'Anonymous' } = req.body;

    const [session, bracket] = await Promise.all([
      Session.findOne({ sessionId }),
      Bracket.findOne({ sessionId }),
    ]);

    if (!session || !bracket) {
      return res.status(404).json({ success: false, message: 'Prediction data not found' });
    }

    const shareToken = nanoid(8);
    const prediction = await Prediction.create({
      sessionId,
      shareToken,
      predictorName,
      champion: bracket.champion || null,
      bracketSnapshot: bracket.toObject(),
      groupsSnapshot: session.toObject(),
    });

    return res.status(201).json({
      success: true,
      shareToken,
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/p/${shareToken}`,
      prediction,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getShared = async (req, res, next) => {
  try {
    const { shareToken } = req.params;
    const prediction = await Prediction.findOneAndUpdate(
      { shareToken },
      { $inc: { viewCount: 1 } },
      { new: true },
    );

    if (!prediction) {
      return res.status(404).json({ success: false, message: 'Prediction not found' });
    }

    return res.status(200).json({ success: true, prediction });
  } catch (error) {
    return next(error);
  }
};
