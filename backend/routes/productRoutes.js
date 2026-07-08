const router = require('express').Router();
const { listProducts } = require('../controllers/productController');

// GET /api/products?search=paracetamol
router.get('/', listProducts);

module.exports = router;
