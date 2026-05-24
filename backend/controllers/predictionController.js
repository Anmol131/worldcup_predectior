const { randomUUID } = require('crypto');
const Prediction = require('../models/Prediction');

exports.createPrediction = async (req, res, next) => {
  try {
    const { sessionId, predictorName = '' } = req.body;

    const prediction = await Prediction.findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        predictorName,
        shareToken: randomUUID(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.status(201).json({ success: true, data: prediction });
  } catch (error) {
    return next(error);
  }
};

exports.getPredictionByToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    const prediction = await Prediction.findOne({ shareToken: token }).populate('groups').populate('bracket');
    if (!prediction) {
      return res.status(404).json({ success: false, message: 'Prediction not found' });
    }

    return res.status(200).json({ success: true, data: prediction });
  } catch (error) {
    return next(error);
  }
};

exports.completePrediction = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { champion } = req.body;

    const prediction = await Prediction.findOneAndUpdate(
      { sessionId },
      { champion, isComplete: true },
      { new: true },
    );

    if (!prediction) {
      return res.status(404).json({ success: false, message: 'Prediction not found' });
    }

    return res.status(200).json({ success: true, data: prediction });
  } catch (error) {
    return next(error);
  }
};
