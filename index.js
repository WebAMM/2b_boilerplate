// Write your answer here
const fs = require("fs");
const axios = require("axios");
const { parse } = require("csv-parse");

var api_response = {};
axios
  .get(
    "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH,BTC,XRP"
  )
  .then(function (response) {
    api_response = response.data;
    console.log(api_response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
  });

const data = [];

fs.createReadStream("./data/transactions.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {
    data.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    for (let i = 0; i < data.length; i++) {
        data[i].timestamp_data = new Date(data[i].timestamp * 1000)
      if (data[i].token === "BTC") {
        const value = data[i].amount * api_response.BTC;
        data[i].usd_amount = value;
      } else if (data[i].token === "ETH") {
        const value = data[i].amount * api_response.ETH;
        data[i].usd_amount = value;
      } else if (data[i].token === "XRP") {
        const value = data[i].amount * api_response.XRP;
        data[i].usd_amount = value;
      }
    }
    // console.log(data)
    const sortedArray = data.sort(function (x, y) {
        return x.timestamp - y.timestamp;
      });
      console.log(sortedArray);
  });


