/**
 * routes/index.js
 * ─────────────────────────────────────────────────────────────
 * Mounts every route module under /api. server.js only needs to
 * know about this one file.
 */

const router = require('express').Router();

router.use('/products', require('./productRoutes'));
router.use('/customer', require('./customerRoutes'));
router.use('/ledger', require('./ledgerRoutes'));
router.use('/orders', require('./orderRoutes'));

module.exports = router;
