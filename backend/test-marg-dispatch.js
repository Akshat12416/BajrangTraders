const axios = require('axios');
async function test() {
  const res = await axios.post('https://corporate.margerp.com/api/eOnlineData/LiveOrderDispatchStatus2017', {
    CompanyCode: "Praveentest2",
    MargID: "230965",
    SalesmanID: "001",
    Type: "S",
    Datetime: "",
    index: "0"
  });
  console.log(res.data);
}
test();
