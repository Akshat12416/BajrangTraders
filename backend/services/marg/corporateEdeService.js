/**
 * services/marg/corporateEdeService.js
 * ─────────────────────────────────────────────────────────────
 * Wraps the Corporate Collaboration EDE API (MargCorporateEDE) —
 * used for detailed, itemized ledger/transaction history.
 *
 * ⚠️ The credentials for this API (CompanyCode "RAKESHCORPORATE3")
 * are a DIFFERENT demo account than the Mobile App Solution
 * ("Praveentest2") — confirm with your client whether they actually
 * have this product enabled before relying on it in production.
 * See MARG_API_GUIDE.md for full context.
 */

const axios = require('axios');
const { decryptMargResponseToJson } = require('../../utils/margCrypto');
const config = require('../../config');

/**
 * Pulls bulk transactional + master data (products, ledger transactions,
 * stock, party/customer master).
 * @param {string} since - ISO datetime; blank = ALL data (use sparingly, first sync only)
 */
async function fetchCorporateData(since = '') {
  const body = {
    CompanyCode: config.margEde.companyCode,
    Datetime: since,
    MargKey: config.margEde.syncKey,
    Index: '0',
    CompanyID: config.margEde.companyId,
    APIType: '2',
  };

  const response = await axios.post(config.margEde.url, body, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  const cipherText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  return decryptMargResponseToJson(cipherText.replace(/^"|"$/g, ''), config.margEde.decryptionKey);
}

/** Maps Marg's MDis (bill-wise detail) record into a ledger transaction row. */
function mapLedgerTransaction(mdis) {
  return {
    id: `${mdis.Vouchar}`,
    date: mdis.Date,
    description: `Invoice #${mdis.VCN?.trim()}`,
    voucherType: mdis.Type, // 'S' = Sale, 'P' = Purchase, 'R' = Sale Return
    // Sale ('S') increases what the customer owes → debit. Sale Return ('R')
    // reduces it → credit. CONFIRM against real data — some accounts flip this.
    amount: parseFloat(mdis.Final) || 0,
    partyCode: mdis.CID?.trim(),
    salesmanCode: mdis.MR?.trim(),
    route: mdis.Rout?.trim(),
    area: mdis.Area?.trim(),
  };
}

/** Gets the full ledger (all bills) for a customer, sorted newest first. */
async function getCustomerLedger(customerCode, since = '') {
  const raw = await fetchCorporateData(since);
  const details = raw.Details || raw;
  const allBills = details.MDis || [];

  return allBills
    .filter(b => b.CID?.trim() === customerCode)
    .map(mapLedgerTransaction)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

module.exports = { fetchCorporateData, getCustomerLedger, mapLedgerTransaction };
