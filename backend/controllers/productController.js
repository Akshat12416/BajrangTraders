/**
 * controllers/productController.js
 * ─────────────────────────────────────────────────────────────
 * Handles:
 *   GET /api/products         → Product List / Categories / Search screens
 *   GET /api/products/:id     → Product Detail screen
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

const getProductById = asyncHandler(async (req, res) => {
  const { products } = await getMasterData();
  const product = products.find((p) => p.id === req.params.id);

  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, data: product });
});

module.exports = { listProducts, getProductById };
