const middy = require("@middy/core");
const cors = require("@middy/http-cors");
const httpErrorHandler = require("@middy/http-error-handler");

const createHandler = (func) => middy(func).use(httpErrorHandler()).use(cors());

module.exports.createContract = createHandler((event, context, callback) => {
  callback(null, { statusCode: 200, body: "Hello!" });
});

module.exports.fundContract = createHandler((event, context, callback) => {
  callback(null, { statusCode: 200, body: "Hello!" });
});

module.exports.listOrders = createHandler((event, context, callback) => {
  callback(null, { statusCode: 200, body: "Hello!" });
});

