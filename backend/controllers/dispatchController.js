/**
 * controllers/dispatchController.js
 * ─────────────────────────────────────────────────────────────
 * Handles GET /api/dispatch/:salesmanId
 *
 * Renamed from the earlier GET /orders/status/:salesmanId — same
 * underlying service call (LiveOrderDispatchStatus2017, salesman-keyed),
 * just exposed as its own resource to match the client-facing API design.
 * This route was already tested and confirmed working under its old name;
 * only the route/controller location changed, not the logic.
 */

const asyncHandler = require('../middleware/asyncHandler');
const { getOrderDispatchStatus } = require('../services/marg/orderService');

const getDispatchStatus = asyncHandler(async (req, res) => {
  const result = await getOrderDispatchStatus(req.params.salesmanId);
  res.json({ success: true, data: result.orders });
});

module.exports = { getDispatchStatus };
