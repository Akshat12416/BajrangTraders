const router = require('express').Router();
const { listProducts, getProductById } = require('../controllers/productController');

// GET /api/products?search=paracetamol
router.get('/', listProducts);

// GET /api/products/1030344
router.get('/:id', getProductById);

module.exports = router;
