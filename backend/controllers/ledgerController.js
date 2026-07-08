/**
 * controllers/ledgerController.js
 * ─────────────────────────────────────────────────────────────
 * Handles GET /api/ledger/:customerCode
 * Powers the Ledger screen (itemized transaction history).
 */

const asyncHandler = require('../middleware/asyncHandler');
const { getCustomerLedger } = require('../services/marg/corporateEdeService');

const getLedger = asyncHandler(async (req, res) => {
  const transactions = await getCustomerLedger(req.params.customerCode);
  res.json({ success: true, data: transactions });
});

module.exports = { getLedger };
