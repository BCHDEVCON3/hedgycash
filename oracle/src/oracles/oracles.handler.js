const middy = require("@middy/core");
const cors = require("@middy/http-cors");
const httpErrorHandler = require("@middy/http-error-handler");
const db = require("../config/db");
const oraclesService = require("./oracles.service");

db.connect();

const createHandler = (func) => middy(func).use(httpErrorHandler()).use(cors());

module.exports.create = createHandler((event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { code, description } = JSON.parse(event.body) || {};

  oraclesService
    .create({ code, description })
    .then((oracle) => {
      callback(null, { statusCode: 200, body: JSON.stringify(oracle) });
    })
    .catch((err) =>
      callback(null, {
        statusCode: err.statusCode || 500,
        body: JSON.stringify(err),
      })
    );
});

module.exports.list = createHandler((event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  oraclesService
    .list()
    .then((oracles) => {
      callback(null, { statusCode: 200, body: JSON.stringify(oracles) });
    })
    .catch((err) =>
      callback(null, {
        statusCode: err.statusCode || 500,
        body: JSON.stringify(err),
      })
    );
});
