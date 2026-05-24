const express = require('express');
const { body, param } = require('express-validator');
const { createShare, getShared } = require('../controllers/predictionController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/share',
  [
    body('sessionId').isString().withMessage('sessionId is required'),
    body('predictorName').optional().isString(),
    validateRequest,
  ],
  createShare,
);

router.get(
  '/:shareToken',
  [param('shareToken').isString(), validateRequest],
  getShared,
);

module.exports = router;
