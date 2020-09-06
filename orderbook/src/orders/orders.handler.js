const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const httpErrorHandler = require('@middy/http-error-handler');
const ordersService = require('./orders.service');
const db = require('../config/db');

db.connect();

const createHandler = (func) => middy(func).use(httpErrorHandler()).use(cors());

module.exports.create = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    ordersService
        .create(JSON.parse(event.body))
        .then((result) => {
            callback(null, { statusCode: 200, body: JSON.stringify(result) });
        })
        .catch((err) =>
            callback(null, {
                statusCode: err.statusCode || 500,
                body: JSON.stringify(err.message),
            }),
        );
});

module.exports.confirmPaymentMock = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    ordersService
        .confirmPaymentMock(JSON.parse(event.body))
        .then((result) => {
            callback(null, { statusCode: 200, body: JSON.stringify(result) });
        })
        .catch((err) =>
            callback(null, {
                statusCode: err.statusCode || 500,
                body: JSON.stringify(err.message),
            }),
        );
});

module.exports.confirmPayment = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    ordersService
        .confirmPayment(JSON.parse(event.body))
        .then((result) => {
            callback(null, { statusCode: 200, body: JSON.stringify(result) });
        })
        .catch((err) =>
            callback(null, {
                statusCode: err.statusCode || 500,
                body: JSON.stringify(err.message),
            }),
        );
});

module.exports.list = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    ordersService
        .list()
        .then((result) => {
            callback(null, { statusCode: 200, body: JSON.stringify(result) });
        })
        .catch((err) =>
            callback(null, {
                statusCode: err.statusCode || 500,
                body: JSON.stringify(err.message),
            }),
        );
});

module.exports.createPaymentRequest = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    ordersService
        .createPaymentRequest(event.queryStringParameters)
        .then((result) => {
            callback(null, {
                statusCode: 200,
                body: result.toString('base64'),
                headers: {
                    'Content-Type': 'application/bitcoincash-paymentrequest',
                },
                isBase64Encoded: true,
            });
        })
        .catch((err) =>
            callback(null, {
                statusCode: err.statusCode || 500,
                body: err.message,
            }),
        );
});
