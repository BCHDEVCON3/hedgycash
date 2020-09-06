const validator = require('validator');
const axios = require('axios');
const vm = require('vm');
const BITBOX = require('bitbox-sdk').BITBOX;
const { TransactionBuilder, Transaction } = require('bitcoincashjs-lib');
const PaymentProtocol = require('bitcore-payment-protocol');
const Order = require('./orders.repository');

const bitbox = new BITBOX();

class orderService {
    create = async (rawPayment) => {
        try {
            const payment = PaymentProtocol.Payment.decodeHex(rawPayment);
            const merchantData = JSON.parse(payment.merchant_data.buffer.toString());

            const order = new Order({ ...merchantData });
            const errors = oracle.validateSync();
            if (errors) {
                throw new Error(errors.message);
            }

            const transactionId = await bitbox.RawTransactions.sendRawTransaction(
                payment.transactions[0].toString('hex'),
            );

            await order.save();

            const memo = `Transaction Broadcasted: https://explorer.bitcoin.com/bch/tx/${transactionId}`;
            const paymentAck = paymentProtocol.makePaymentACK({ payment, memo }, 'BCH');
            return paymentAck;
        } catch (err) {
            return Promise.reject({
                statusCode: 400,
                message: 'Invalid payment protocol object. Cause: ' + (err.error || err.message),
            });
        }
    };

    create2 = async (rawPayment) => {
        try {
            const payment = PaymentProtocol.Payment.decodeHex(rawPayment);
            return payment;
        } catch (err) {
            return Promise.reject({
                statusCode: 400,
                message: 'Invalid payment protocol object. Cause: ' + err.message,
            });
        }
    };

    createPaymentRequest = async () => {
        try {
            const txBuilder = new TransactionBuilder();
            txBuilder.addOutput('1BBuf6Ng4SpgXzNcATPkG1mMAHaWEEo6TA', 10000);
            const outputs = new PaymentProtocol('BCH').makeOutput();
            outputs.set('amount', 10000);
            outputs.set('script', Buffer.from(txBuilder.buildIncomplete().outs[0].script));
            // outputs.set('refund_to', outputs.message)
            const paymentDetails = new PaymentProtocol().makePaymentDetails();
            paymentDetails.set('outputs', outputs.message);
            paymentDetails.set('time', 0);
            paymentDetails.set(
                'merchant_data',
                Buffer.from(JSON.stringify({ testData: 'teste' })),
            );
            paymentDetails.set('payment_url', 'test.com/test');

            const paymentRequest = new PaymentProtocol().makePaymentRequest();

            paymentRequest.set('serialized_payment_details', paymentDetails.serialize());
            return paymentRequest;
        } catch (err) {
            return Promise.reject({
                statusCode: 500,
                message: err.error || err.message,
            });
        }
    };

    list = () => {
        return Order.find();
    };
}

module.exports = new orderService();
