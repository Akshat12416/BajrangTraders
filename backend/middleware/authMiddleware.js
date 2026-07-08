/**
 * middleware/authMiddleware.js
 * ─────────────────────────────────────────────────────────────
 * PLACEHOLDER — not wired in yet.
 *
 * This is where JWT verification will live once OTP login (Step 6
 * of the roadmap) is built. Every /api/* route should eventually
 * require a valid JWT before reaching a controller, so only logged-in
 * customers can pull product/ledger/order data.
 *
 * For now, all routes in routes/index.js are UNPROTECTED — fine for
 * local development against Marg's demo account, but this must be
 * wired in before any real customer data goes through this backend.
 */

function requireAuth(req, res, next) {
  // TODO (OTP phase): verify JWT from Authorization header, attach
  // req.customer = { id, phone } and reject with 401 if invalid/missing.
  next();
}

module.exports = { requireAuth };
