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

  marg: {
    baseUrl: 'https://corporate.margerp.com/api/eOnlineData',
    companyCode: required('MARG_COMPANY_CODE'),
    margId: required('MARG_ID'),
    decryptionKey: required('MARG_DECRYPTION_KEY'),
  },

  margEde: {
    url: 'https://corporate.margerp.com/api/eOnlineData/MargCorporateEDE',
    companyCode: process.env.MARG_EDE_COMPANY_CODE,
    syncKey: process.env.MARG_EDE_SYNC_KEY,
    companyId: process.env.MARG_EDE_COMPANY_ID,
    decryptionKey: process.env.MARG_EDE_DECRYPTION_KEY,
  },

  masterDataCacheTtlMs: 5 * 60 * 1000,
};
