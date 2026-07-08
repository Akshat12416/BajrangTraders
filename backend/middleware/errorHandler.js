/**
 * middleware/errorHandler.js
 * ─────────────────────────────────────────────────────────────
 * Centralized error handler — must be registered LAST in server.js
 * (after all routes). Catches anything thrown or passed to next(err)
 * anywhere in the app, including Marg API failures and decryption
 * errors, and returns a consistent JSON error shape to the mobile app.
 */

function errorHandler(err, req, res, next) {
  console.error('❌', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
