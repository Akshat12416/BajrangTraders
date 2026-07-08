/**
 * controllers/orderController.js
 * ─────────────────────────────────────────────────────────────
 * Handles:
 *   POST /api/orders               → Checkout screen "Place Order"
 *   GET  /api/orders/status/:id    → Order History screen
 */

const asyncHandler = require('../middleware/asyncHandler');
const { placeOrder, getOrderDispatchStatus } = require('../services/marg/orderService');

const createOrder = asyncHandler(async (req, res) => {
  const { customerId, customerName, customerMobile, salesmanId, items, meta } = req.body;

  if (!customerId || !items?.length) {
    const err = new Error('customerId and items are required');
    err.statusCode = 400;
    throw err;
  }

  const results = await placeOrder({ customerId, customerName, customerMobile, salesmanId, items, meta });
  res.json({ success: true, data: results });
});

const getOrderStatus = asyncHandler(async (req, res) => {
  const result = await getOrderDispatchStatus(req.params.salesmanId);
  res.json({ success: true, data: result.orders });
});

module.exports = { createOrder, getOrderStatus };
