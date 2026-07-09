const router = require('express').Router();
const { listCategories } = require('../controllers/categoryController');

// GET /api/categories
router.get('/', listCategories);

module.exports = router;
