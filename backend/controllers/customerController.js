/**
 * controllers/customerController.js
 * ─────────────────────────────────────────────────────────────
 * Handles GET /api/customer/:code
 * Powers the Profile / Outstanding balance screens.
 */

const asyncHandler = require('../middleware/asyncHandler');
const { getMasterData } = require('../services/marg/masterSyncService');

const getCustomer = asyncHandler(async (req, res) => {
  const { customers } = await getMasterData();
  const customer = customers.find((c) => c.id === req.params.code);

  if (!customer) {
    const err = new Error('Customer not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, data: customer });
});

module.exports = { getCustomer };
