const validator = require('validator');
const axios = require('axios');
const vm = require('vm');
const BITBOX = require('bitbox-sdk').BITBOX;
const bitcore = require('bitcore-lib-cash');
const Order = require('./order.repository');

const bitbox = new BITBOX();

const MIN_ORACLE_BALANCE = 0.001;

class orderService {
    create = async (rawPayment) => {
        try {
            const payment = PaymentProtocol.Payment.decode(rawPayment);
            return payment;
        } catch (err) {
            return Promise.reject({
                statusCode: 400,
                message: 'Invalid payment protocol object. Cause: ' + err.message,
            });
        }
    };

    list = () => {
        return Order.find();
    };
}

module.exports = new orderService();
