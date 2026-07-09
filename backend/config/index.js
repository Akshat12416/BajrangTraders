/**
 * config/index.js
 * ─────────────────────────────────────────────────────────────
 * Single place where environment variables are read and validated.
 * Every other file imports FROM here — nothing else should touch
 * process.env directly. This makes it obvious what the backend
 * needs to run, and makes swapping demo → production credentials
 * a one-file change.
 */

require('dotenv').config();

function required(name) {
  const val = process.env[name];
  if (!val) {
    throw new Error(
      `Missing required env var: ${name}.\n` +
      `  → Check that backend/.env exists (not just .env.example) and is populated.\n` +
      `  → Common cause: .env is a hidden dotfile — confirm your file explorer/zip tool ` +
      `didn't skip it when copying the project.`
    );
  }
  return val;
}

module.exports = {
  port: process.env.PORT || 3000,

  // Mobile App Solution — primary API (products, customers, orders)
  // These are REQUIRED — the server refuses to start without them, rather
  // than silently sending malformed requests to Marg (which is what happens
  // if you `undefined` them: axios strips undefined keys from the JSON body).
  marg: {
    baseUrl: 'https://corporate.margerp.com/api/eOnlineData',
    companyCode: required('MARG_COMPANY_CODE'),
    margId: required('MARG_ID'),
    decryptionKey: required('MARG_DECRYPTION_KEY'),
    // Stype records are a generic lookup table (categories, companies, areas,
    // routes, groups — all mixed together, distinguished by Sgcode). Marg's
    // own docs are inconsistent about the exact Sgcode string that means
    // "category" (candidates seen across their PDFs: "CATEGO", "CATGO").
    // BEST GUESS below — MUST be confirmed against live Stype data before
    // trusting GET /categories. See MARG_API_GUIDE.md Section 9.
    categorySgcode: process.env.MARG_CATEGORY_SGCODE || 'CATEGO',
  },

  // Corporate Collaboration EDE — secondary API (detailed ledger history).
  // Left OPTIONAL (not required()) since /api/products and /api/orders don't
  // need it — only /api/ledger does. So the server can still boot and serve
  // most endpoints even if this secondary integration isn't configured yet.
  margEde: {
    url: 'https://corporate.margerp.com/api/eOnlineData/MargCorporateEDE',
    companyCode: process.env.MARG_EDE_COMPANY_CODE,
    syncKey: process.env.MARG_EDE_SYNC_KEY,
    companyId: process.env.MARG_EDE_COMPANY_ID,
    decryptionKey: process.env.MARG_EDE_DECRYPTION_KEY,
  },

  // In-memory cache TTL for master data (products/customers) — avoids
  // hammering Marg's API on every single screen load
  masterDataCacheTtlMs: 5 * 60 * 1000, // 5 minutes
};
