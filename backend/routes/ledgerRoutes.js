const router = require('express').Router();
const { getLedger } = require('../controllers/ledgerController');

// GET /api/ledger/GQ (Marg party code)
router.get('/:customerCode', getLedger);

module.exports = router;
