const router = require('express').Router();
const { getCustomer } = require('../controllers/customerController');

// GET /api/customer/GQ (Marg party code)
router.get('/:code', getCustomer);

module.exports = router;
