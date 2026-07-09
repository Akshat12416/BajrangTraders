/**
 * controllers/orderController.js
 * ─────────────────────────────────────────────────────────────
 * Handles:
 *   POST /api/orders               → Checkout screen "Place Order"
 *   GET  /api/orders/:customerCode → Order History screen
 *
 * Dispatch/live tracking status now lives at GET /api/dispatch/:salesmanId
 * (see controllers/dispatchController.js) — kept separate since it's a
 * different Marg data source (LiveOrderDispatchStatus2017, salesman-keyed)
 * from order history (Corporate EDE, customer-keyed).
 */

const asyncHandler = require('../middleware/asyncHandler');
const { placeOrder } = require('../services/marg/orderService');
const { getCustomerOrderHistory } = require('../services/marg/corporateEdeService');

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

const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await getCustomerOrderHistory(req.params.customerCode);
  res.json({ success: true, data: orders });
});

module.exports = { createOrder, getOrderHistory };
