/**
 * services/marg/masterSyncService.js
 * ─────────────────────────────────────────────────────────────
 * Wraps MargMST2017 — the "give me all products, customers, and
 * categories" endpoint. Powers Product List / Categories / Search
 * and Customer Profile / Outstanding balance.
 *
 * Includes a simple in-memory cache (getMasterData) so controllers
 * don't need to worry about hammering Marg's API — swap this for
 * Redis or a DB table when you move past a single backend instance.
 */

const { margPost } = require('./margClient');
const { decryptMargResponseToJson } = require('../../utils/margCrypto');
const config = require('../../config');

let cache = { products: [], customers: [], lastSyncedAt: null };
let lastSyncTime = 0;

/**
 * Fetches ALL master data (products, customers, categories) from Marg.
 * Pass a `since` ISO datetime string for incremental sync — leave
 * blank/undefined for a full sync.
 */
async function fetchRawMasterData(since = '') {
  const body = {
    CompanyCode: config.marg.companyCode,
    MargID: config.marg.margId,
    Datetime: since,
    index: '0',
  };

  const rawResponse = await margPost('MargMST2017', body);

  const cipherText = typeof rawResponse === 'string' ? rawResponse : JSON.stringify(rawResponse);
  return decryptMargResponseToJson(cipherText.replace(/^"|"$/g, ''), config.marg.decryptionKey);
}

/** Converts Marg's raw product record into the shape our app screens expect. */
function mapProduct(margProduct) {
  return {
    id: margProduct.code?.trim(),
    name: margProduct.name?.trim(),
    company: margProduct.company?.trim(),
    pricePerPiece: parseFloat(margProduct.Rate) || 0,
    // NOTE: box price = per-piece rate × Conversion (pack size). CONFIRM this
    // assumption with your client — some accounts price boxes separately.
    pricePerBox: (parseFloat(margProduct.Rate) || 0) * (parseFloat(margProduct.Conversion) || 1),
    piecesPerBox: parseFloat(margProduct.Conversion) || 1,
    stock: parseFloat(margProduct.stock) || 0,
    mrp: parseFloat(margProduct.MRP) || 0,
    unit: 'PCS', // Marg's unit info is buried in per-account `remarks` format — confirm
    image: null, // Marg does not return product images — see MARG_API_GUIDE.md
    scheme: margProduct.Deal && margProduct.Deal !== '0'
      ? `Buy ${margProduct.Deal} Get ${margProduct.Free} Free`
      : null,
    isDeleted: margProduct.Is_Deleted === '1',
  };
}

/** Converts Marg's raw Party (customer/ledger) record into our app's shape. */
function mapCustomer(margParty) {
  return {
    id: margParty.code?.trim() || margParty.LedgerCode?.trim(),
    name: margParty.name?.trim(),
    address: margParty.address?.trim(),
    // Single running balance — NOT itemized. For transaction history, see
    // corporateEdeService.js (MDis records).
    outstandingBalance: parseFloat(margParty.balance) || 0,
    creditLimit: null, // Not returned here — check Corporate EDE (Party.Credit)
    phone: margParty.phone1?.trim() || margParty.phone2?.trim() || '',
    email: margParty.email1?.trim() || '',
    gstNo: margParty.GSTIN?.trim() || '',
    isDeleted: margParty.Is_Deleted === '1',
  };
}

/** Full sync — returns clean, app-shaped data. */
async function syncMasterData(since = '') {
  const raw = await fetchRawMasterData(since);
  const details = raw.Details || raw; // structure may vary slightly by account/version

  const products = [
    ...(details.pro_N || []).map(mapProduct),
    ...(details.pro_U || []).map(mapProduct),
  ].filter(p => !p.isDeleted);

  const customers = (details.Party || []).map(mapCustomer).filter(c => !c.isDeleted);

  return {
    products,
    customers,
    lastSyncedAt: raw.DateTime || new Date().toISOString(),
    status: raw.Status,
  };
}

/**
 * Returns cached master data, refreshing from Marg only if the cache
 * has expired. This is what controllers should call — not syncMasterData
 * directly — so every screen load doesn't trigger a fresh Marg API call.
 */
async function getMasterData() {
  const now = Date.now();
  if (now - lastSyncTime > config.masterDataCacheTtlMs) {
    cache = await syncMasterData();
    lastSyncTime = now;
  }
  return cache;
}

module.exports = { getMasterData, syncMasterData, fetchRawMasterData, mapProduct, mapCustomer };
