const express = require('express');
const { body, param } = require('express-validator');
const {
  initSession,
  getSession,
  getGroups,
  updateGroupPick,
  confirmBestThird,
  resetBestThird,
} = require('../controllers/sessionController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/init',
  [
    body('sessionId').isString().withMessage('sessionId is required'),
    validateRequest,
  ],
  initSession,
);

router.get(
  '/:sessionId',
  [param('sessionId').isString().withMessage('sessionId is required'), validateRequest],
  getSession,
);

router.get(
  '/:sessionId/groups',
  [param('sessionId').isString().withMessage('sessionId is required'), validateRequest],
  getGroups,
);

router.patch(
  '/:sessionId/groups/:groupId',
  [
    param('sessionId').isString().withMessage('sessionId is required'),
    param('groupId').isLength({ min: 1, max: 1 }).withMessage('Invalid group id'),
    body('teamCode').isString().withMessage('teamCode is required'),
    body('position').isString().withMessage('position is required'),
    validateRequest,
  ],
  updateGroupPick,
);

router.post(
  '/:sessionId/best-third',
  [
    param('sessionId').isString().withMessage('sessionId is required'),
    body('selectedTeamCodes').isArray({ min: 8, max: 8 }).withMessage('8 selectedTeamCodes are required'),
    validateRequest,
  ],
  confirmBestThird,
);

router.post(
  '/:sessionId/best-third/reset',
  [
    param('sessionId').isString().withMessage('sessionId is required'),
    validateRequest,
  ],
  resetBestThird,
);

module.exports = router;