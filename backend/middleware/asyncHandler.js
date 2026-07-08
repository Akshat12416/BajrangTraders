/**
 * middleware/asyncHandler.js
 * ─────────────────────────────────────────────────────────────
 * Wraps async route handlers so thrown errors (or rejected promises)
 * automatically flow into Express's error-handling middleware instead
 * of crashing the server or needing try/catch in every controller.
 *
 * Usage: router.get('/x', asyncHandler(async (req, res) => { ... }))
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
