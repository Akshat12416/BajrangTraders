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

let cache = { products: [], customers: [], categories: [], lastSyncedAt: null };
let lastSyncTime = 0;

/**
 * Fetches ALL master data (products, customers, categories) from Marg.
 * Pass a `since` ISO datetime string for incremental sync — leave
 * blank/undefined for a full sync.
 */
async function fetchRawMasterData(since = '2000-01-01') {
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

/**
 * Converts Marg's raw Stype record into a lookup entry.
 * Stype is a GENERIC lookup table shared by categories, companies, areas,
 * routes, and groups all at once, distinguished by `sgcode`. Field casing
 * here is a best guess based on the doc's table headers (we haven't seen a
 * live Stype record yet, unlike pro_N/Party which were confirmed against
 * real data) — hence the fallback chains on every field. Once you've seen
 * one real record (log it — see MARG_API_GUIDE.md Section 9), simplify this
 * to match exactly and delete the unused fallback.
 */
function mapStype(margStype) {
  const sgcode = margStype.Sgcode ?? margStype.sgcode;
  const code = margStype.Scode ?? margStype.scode;
  const name = margStype.Name ?? margStype.name;
  const isDeleted = margStype.Is_Deleted ?? margStype.is_deleted;

  return {
    sgcode: sgcode?.toString().trim(),
    code: code?.toString().trim(),
    name: name?.toString().trim(),
    isDeleted: isDeleted === '1' || isDeleted === 1,
  };
}

/**
 * Converts Marg's raw product record into the shape our app screens expect.
 * @param {object} margProduct - raw Marg product record
 * @param {object} categoryLookup - map of categoryCode -> categoryName, built
 *   from Stype records in syncMasterData(). Pass {} if categories aren't
 *   available yet — `category` will just come back null.
 */
function mapProduct(margProduct, categoryLookup = {}) {
  const catCode = margProduct.catcode?.trim();

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
    categoryCode: catCode || null,
    // Will be null until config.marg.categorySgcode is confirmed to match
    // this account's real Stype data — see the config/index.js comment.
    category: (catCode && categoryLookup[catCode]) || null,
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
async function syncMasterData(since = '2000-01-01') {
  const raw = await fetchRawMasterData(since);
  const details = raw.Details || raw; // structure may vary slightly by account/version

  const lookups = (details.Stype || []).map(mapStype).filter((l) => !l.isDeleted);

  // Categories are just the subset of Stype whose sgcode matches the
  // configured "this means category" marker (config.marg.categorySgcode).
  const categories = lookups.filter((l) => l.sgcode === config.marg.categorySgcode);
  const categoryLookup = {};
  categories.forEach((c) => {
    categoryLookup[c.code] = c.name;
  });

  const products = [
    ...(details.pro_N || []).map((p) => mapProduct(p, categoryLookup)),
    ...(details.pro_U || []).map((p) => mapProduct(p, categoryLookup)),
  ].filter((p) => !p.isDeleted);

  const customers = (details.Party || []).map(mapCustomer).filter((c) => !c.isDeleted);

  return {
    products,
    customers,
    categories,
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

module.exports = { getMasterData, syncMasterData, fetchRawMasterData, mapProduct, mapCustomer, mapStype };
