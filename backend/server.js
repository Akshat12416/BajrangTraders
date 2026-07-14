/**
 * server.js
 * ─────────────────────────────────────────────────────────────
 * Entry point. Run with: npm run dev (or: node server.js)
 */

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const routes = require('./routes');
const { warmupCache } = require('./services/marg/masterSyncService');

const app = express();

// Middlewares
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// All Marg-backed endpoints live under /api — see routes/index.js
app.use('/api', routes);

// Must be registered LAST — catches errors from every route above
app.use(errorHandler);

const { warmupCache } = require('./services/marg/masterSyncService');

app.listen(config.port, () => {
  console.log(`Backend running on http://localhost:${config.port}`);
  console.log(`Try:    http://localhost:${config.port}/api/products`);
  
  // Start fetching data from Marg in the background immediately
  warmupCache();
});
