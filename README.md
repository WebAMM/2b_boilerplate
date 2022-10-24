## Used Packages
_Two main packages are used in this project.
  - axios
  - csv-parse

The csv-parse package is a parser converting CSV text input into arrays or objects.
Axios is a simple promise based HTTP client for the browser and node.js. This package is used to execute the API from cryptocompare.


## Code Summary
In below three lines , i am just getting the packages and wrap it in a variable
```
const fs = require("fs");
const axios = require("axios");
const { parse } = require("csv-parse");
```

Then we called the crypto compare API to get the current exchange rates of BTC, ETH, XRP with the help of axios.
```
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
```
And then i created the stream to read the transactions.csv file to read the data and convert it into the JSON object and store them into the "const data = []".
```
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
```
While storing the data i checked the token from the object that either it's BTC or ETH or XRP to calculate it's value in USD and then store that value into the object with the name of "usd_amount" and then just sort the array on the basis of timestamp.