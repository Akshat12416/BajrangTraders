const axios = require('axios');
const { decryptMargResponseToJson } = require('./utils/margCrypto');
async function test() {
  const res = await axios.post('https://corporate.margerp.com/api/eOnlineData/MargMST2017', {
    CompanyCode: "Praveentest2",
    MargID: "230965",
    Datetime: "2020-01-01",
    index: "0"
  });
  console.log("Response:", typeof res.data, res.data.length);
  try {
    const parsed = decryptMargResponseToJson(res.data, "LGWSIDNMXJ2Q");
    console.log("Decrypted successfully!", parsed.Details?.pro_N?.length, "products");
  } catch (e) {
    console.log("Error decrypting:", e.message, res.data);
  }
}
test();
