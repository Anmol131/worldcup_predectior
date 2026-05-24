const express = require('express');
const { body, param } = require('express-validator');
const { createPrediction, getPredictionByToken, completePrediction } = require('../controllers/predictionController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/',
  [
    body('sessionId').isString().withMessage('sessionId is required'),
    body('predictorName').optional().isString(),
    validateRequest,
  ],
  createPrediction,
);

router.get(
  '/share/:token',
  [param('token').isString(), validateRequest],
  getPredictionByToken,
);

router.put(
  '/:sessionId/complete',
  [
    param('sessionId').isString(),
    body('champion').isString().withMessage('champion is required'),
    validateRequest,
  ],
  completePrediction,
);

module.exports = router;
