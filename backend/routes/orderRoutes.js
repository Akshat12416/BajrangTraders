const router = require('express').Router();
const { createOrder, getOrderStatus } = require('../controllers/orderController');

// POST /api/orders
router.post('/', createOrder);

// GET /api/orders/status/:salesmanId
router.get('/status/:salesmanId', getOrderStatus);

module.exports = router;
