/**
 * services/marg/margClient.js
 * ─────────────────────────────────────────────────────────────
 * Thin HTTP wrapper around Marg ERP's REST endpoints.
 * Every Marg API is POST + application/json, per their docs.
 */

const axios = require('axios');
const config = require('../../config');

const margHttp = axios.create({
  baseURL: config.marg.baseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/**
 * POSTs a JSON body to a Marg endpoint and returns the raw response.
 * Decryption is handled by the calling service, not here, since
 * different endpoints behave slightly differently.
 *
 * @param {string} endpoint - e.g. 'MargMST2017', 'InsertOrderDetail'
 * @param {object} body - the JSON payload (never encrypted on the request side)
 */
async function margPost(endpoint, body) {
  try {
    console.log(`[margClient] -> POST /${endpoint}`);
    console.log(`[margClient] Request body:`, JSON.stringify(body));
    const response = await margHttp.post(`/${endpoint}`, body);
    console.log(`[margClient] <- Raw Response:`, typeof response.data === 'string' ? response.data.slice(0, 200) + '...' : JSON.stringify(response.data).slice(0, 200) + '...');
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Marg API [${endpoint}] returned ${error.response.status}: ${JSON.stringify(error.response.data)}`
      );
    } else if (error.request) {
      throw new Error(`Marg API [${endpoint}] did not respond (network/timeout issue)`);
    } else {
      throw new Error(`Marg API [${endpoint}] request setup failed: ${error.message}`);
    }
  }
}

module.exports = { margPost };
