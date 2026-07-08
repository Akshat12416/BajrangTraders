/**
 * controllers/productController.js
 * ─────────────────────────────────────────────────────────────
 * Handles GET /api/products
 * Powers the Product List / Categories / Search screens.
 */

const asyncHandler = require('../middleware/asyncHandler');
const { getMasterData } = require('../services/marg/masterSyncService');

const listProducts = asyncHandler(async (req, res) => {
  const { products } = await getMasterData();
  const { search } = req.query;

  let result = products;
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.company.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data: result });
});

module.exports = { listProducts };
