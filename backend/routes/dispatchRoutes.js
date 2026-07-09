const router = require('express').Router();
const { getDispatchStatus } = require('../controllers/dispatchController');

// GET /api/dispatch/001 (salesman ID)
router.get('/:salesmanId', getDispatchStatus);

module.exports = router;
