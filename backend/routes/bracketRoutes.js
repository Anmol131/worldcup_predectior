const express = require('express');
const { body, param } = require('express-validator');
const { generateBracket, getBracket, pickWinner, setChampion } = require('../controllers/bracketController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/:sessionId/bracket/generate',
  [param('sessionId').isString().withMessage('sessionId is required'), validateRequest],
  generateBracket,
);

router.get(
  '/:sessionId/bracket',
  [param('sessionId').isString(), validateRequest],
  getBracket,
);

router.patch(
  '/:sessionId/bracket/match',
  [
    param('sessionId').isString(),
    body('round').isString().withMessage('round is required'),
    body('matchId').isString().withMessage('matchId is required'),
    body('winnerCode').optional().isString().withMessage('winnerCode must be a string'),
    validateRequest,
  ],
  pickWinner,
);

router.patch(
  '/:sessionId/bracket/champion',
  [
    param('sessionId').isString(),
    body('teamCode').isString().withMessage('teamCode is required'),
    validateRequest,
  ],
  setChampion,
);

module.exports = router;
