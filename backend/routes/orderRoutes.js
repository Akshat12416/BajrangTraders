const router = require('express').Router();
const { createOrder, getOrderHistory } = require('../controllers/orderController');

// POST /api/orders
router.post('/', createOrder);

// GET /api/orders/GQ (customer code) — order history
router.get('/:customerCode', getOrderHistory);

module.exports = router;
