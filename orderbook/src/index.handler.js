const middy = require("@middy/core");
const cors = require("@middy/http-cors");
const httpErrorHandler = require("@middy/http-error-handler");

const createHandler = (func) => middy(func).use(httpErrorHandler()).use(cors());

module.exports.hello = createHandler((event, context, callback) => {
  callback(null, { statusCode: 200, body: "Hello!" });
});
