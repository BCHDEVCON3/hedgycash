const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const httpErrorHandler = require('@middy/http-error-handler');
const db = require('../config/db');
const oraclesService = require('./oracles.service');

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
            }),
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
            }),
        );
});

module.exports.run = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    oraclesService
        .run(rawOracle)
        .then((oracle) => {
            callback(null, { statusCode: 200, body: JSON.stringify(oracle) });
        })
        .catch((err) =>
            callback(null, {
                statusCode: err.statusCode || 500,
                body: JSON.stringify(err),
            }),
        );
});

module.exports.findByPubKey = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    oraclesService
        .findByPubKey(event.pathParameters.pubKey)
        .then((oracle) => {
            if (oracle) {
                callback(null, { statusCode: 200, body: JSON.stringify(oracle) });
            } else {
                callback(null, {
                    statusCode: 404,
                });
            }
        })
        .catch((err) =>
            callback(null, {
                statusCode: err.statusCode || 500,
                body: JSON.stringify(err),
            }),
        );
});

module.exports.testCode = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    oraclesService
        .testCode(event.body)
        .then((result) => callback(null, { statusCode: 200, body: JSON.stringify(result) }))
        .catch((err) =>
            callback(null, {
                statusCode: err.statusCode || 500,
                body: JSON.stringify(err.stack || err.message),
            }),
        );
});

module.exports.publishPrice = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    oraclesService
        .publishPrice(event)
        .then((result) => callback(null, { statusCode: 200, body: JSON.stringify(result) }))
        .catch((err) => {
            console.error(err.stack, err.message);
            callback(err, {
                statusCode: err.statusCode || 500,
                body: JSON.stringify(err.stack || err.message),
            });
        });
};

module.exports.getOraclePrices = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    oraclesService
        .getOraclePrices(event.pathParameters.pubKey)
        .then((result) => callback(null, { statusCode: 200, body: JSON.stringify(result) }))
        .catch((err) =>
            callback(null, {
                statusCode: err.statusCode || 500,
                body: JSON.stringify(err.stack || err.message),
            }),
        );
});
