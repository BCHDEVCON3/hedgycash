const validator = require('validator');
const axios = require('axios');
const vm = require('vm');
const BITBOX = require('bitbox-sdk').BITBOX;
const bitcore = require('bitcore-lib-cash');
const Order = require('./order.repository');
const PaymentProtocol= require('bitcore-payment-protocol')
const { TransactionBuilder } = require('bitcoincashjs-lib')

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

    createContract = async () => {
        const txBuilder = new TransactionBuilder();
        txBuilder.addOutput('bitcoincash:qq8clyytuyvsfnta06x45cmckdsyk8m6mgq9mvrxcx', 10000)
        const outputs = new PaymentProtocol().makeOutput();
        outputs.set('amount', 10000)
        outputs.set('script',  Buffer.from(txBuilder.buildIncomplete().outs[0].script))

        const paymentDetails = new PaymentProtocol.makePaymentDetails()
        paymentDetails.set('outputs', outputs)
        paymentDetails.set('time', 0)
        paymentDetails.set('merchant_data', Buffer.from(JSON.stringify({ testData: 'teste '})))
        paymentDetails.set('payment_url', 'test.com/test')

        const paymentRequest = new PaymentProtocol.makePaymentRequest();
    
        paymentRequest.set('serialized_payment_details', paymentDetails.serialize())
        return paymentRequest;
    }
    list = () => {
        return Order.find();
    };
}

module.exports = new orderService();
