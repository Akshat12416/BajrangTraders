/**
 * controllers/categoryController.js
 * ─────────────────────────────────────────────────────────────
 * Handles GET /api/categories
 * Powers the Categories screen.
 *
 * ⚠️ See MARG_API_GUIDE.md Section 9 before trusting this in production —
 * the Sgcode value that means "category" (config.marg.categorySgcode) is a
 * best guess from Marg's docs, not yet confirmed against live Stype data.
 */

const asyncHandler = require('../middleware/asyncHandler');
const { getMasterData } = require('../services/marg/masterSyncService');

const listCategories = asyncHandler(async (req, res) => {
  const { categories } = await getMasterData();
  res.json({ success: true, data: categories });
});

module.exports = { listCategories };
