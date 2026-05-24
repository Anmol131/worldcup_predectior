const express = require('express');
const { body, param } = require('express-validator');
const { getGroups, seedGroups, updateGroup } = require('../controllers/groupController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', getGroups);
router.post('/seed', seedGroups);
router.put(
  '/:groupId',
  [
    param('groupId').isLength({ min: 1, max: 1 }).withMessage('Invalid group id'),
    body('selection').isObject().withMessage('selection is required'),
    body('selection.first').optional({ values: 'falsy' }).isString(),
    body('selection.second').optional({ values: 'falsy' }).isString(),
    body('selection.third').optional({ values: 'falsy' }).isString(),
    validateRequest,
  ],
  updateGroup,
);

module.exports = router;
