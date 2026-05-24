const express = require('express');
const { body, param } = require('express-validator');
const { generateBracket, getBracketBySession, updateMatchWinner } = require('../controllers/bracketController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/generate',
  [body('sessionId').optional().isString(), validateRequest],
  generateBracket,
);
router.get(
  '/:sessionId',
  [param('sessionId').isString(), validateRequest],
  getBracketBySession,
);
router.put(
  '/:sessionId/match/:matchId',
  [
    param('sessionId').isString(),
    param('matchId').isString(),
    body('winnerCode').isString().withMessage('winnerCode is required'),
    body('winnerName').optional().isString(),
    validateRequest,
  ],
  updateMatchWinner,
);

module.exports = router;
