const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const httpErrorHandler = require('@middy/http-error-handler');
const ordersService = require('./orders.service');

const createHandler = (func) => middy(func).use(httpErrorHandler()).use(cors());

module.exports.create = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    ordersService
        .create(event.body)
        .then((result) => {
            callback(null, { statusCode: 200, body: JSON.stringify(result) });
        })
        .catch((err) =>
            callback(null, {
                statusCode: err.statusCode || 500,
                body: JSON.stringify(err),
            }),
        );
});

module.exports.fund = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    callback(null, { statusCode: 200, body: 'Hello!' });
});

module.exports.list = createHandler((event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    callback(null, { statusCode: 200, body: 'Hello!' });
});
