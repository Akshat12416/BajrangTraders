const axios = require('axios');
async function test() {
  const res = await axios.post('https://corporate.margerp.com/api/eOnlineData/MargMST2017', {
    CompanyCode: "Praveentest2",
    MargID: "230965",
    Datetime: "",
    index: "0"
  });
  console.log(res.data);
}
test();
