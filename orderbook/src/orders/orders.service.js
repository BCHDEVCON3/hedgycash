const validator = require('validator');
const axios = require('axios');
const vm = require('vm');
const BITBOX = require('bitbox-sdk').BITBOX;
const { TransactionBuilder, Transaction } = require('bitcoincashjs-lib');
const bitcore = require('bitcore-lib-cash');
const PaymentProtocol = require('bitcore-payment-protocol');
const Order = require('./orders.repository');

const bitbox = new BITBOX();

class orderService {
    create = async (rawPayment) => {
        try {
            const payment = PaymentProtocol.Payment.decodeHex(rawPayment);
            // const merchantData = JSON.parse(payment.merchant_data.buffer.toString());
            const merchantData = {
                amount: 0.0001,
                hedge: true,
                oraclePubKey: '028331ef89be9bc970c170998474385163cf68dfc0e69c865db2ecf79cec70d487',
                maturityModifier: 3,
                highLiquidationPriceMultiplier: 0.01,
                lowLiquidationPriceMultiplier: 1.01,
            };

            const order = new Order({ ...merchantData });
            const errors = order.validateSync();
            if (errors) {
                throw new Error(errors.message);
            }

            const incomingTransaction = Transaction.fromHex(
                payment.transactions[0].toString('hex'),
            );

            // const transactionId = await bitbox.RawTransactions.sendRawTransaction(
            //     payment.transactions[0].toString('hex'),
            // );

            // await order.save();

            console.info(
                bitbox.Script.fromASM(Buffer.from(incomingTransaction.ins[0].script, 'hex')),
            );

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

    fund = async (rawPayment) => {
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

    createPaymentRequest = async ({
        amount,
        hedge = true,
        oraclePubKey,
        maturityModifier,
        highLiquidationPriceMultiplier,
        lowLiquidationPriceMultiplier,
    } = {}) => {
        try {
            const ecpair = bitbox.ECPair.fromWIF(
                hedge ? process.env.HEDGE_WIF : process.env.LONG_WIF,
            );
            const ouputAddr = bitbox.ECPair.toLegacyAddress(ecpair);

            const satoshisAmount = Number(Number(amount).toFixed(0));

            const txBuilder = new TransactionBuilder();
            txBuilder.addOutput(ouputAddr, satoshisAmount);
            const outputs = new PaymentProtocol('BCH').makeOutput();
            outputs.set('amount', satoshisAmount);
            outputs.set('script', Buffer.from(txBuilder.buildIncomplete().outs[0].script));
            // outputs.set('refund_to', outputs.message)
            const paymentDetails = new PaymentProtocol().makePaymentDetails();
            paymentDetails.set('outputs', outputs.message);
            paymentDetails.set('time', 0);
            paymentDetails.set(
                'merchant_data',
                Buffer.from(
                    JSON.stringify({
                        amount,
                        hedge,
                        oraclePubKey,
                        maturityModifier,
                        highLiquidationPriceMultiplier,
                        lowLiquidationPriceMultiplier,
                    }),
                ),
            );
            paymentDetails.set(
                'payment_url',
                process.env.IS_OFFLINE
                    ? 'http://1a4adcc7a8ec.ngrok.io/dev/api/rest/orders'
                    : process.env.PAYMENT_URL,
            );

            const paymentRequest = new PaymentProtocol().makePaymentRequest();

            paymentRequest.set('serialized_payment_details', paymentDetails.serialize());
            // paymentRequest.set('pki_type', 'x509+sha256');
            paymentRequest.set('pki_type', 'none');
            const certificates = new PaymentProtocol().makeX509Certificates();
            // paymentRequest.set('pki_data', certificates.message);
            paymentRequest.hex = paymentRequest.serialize().toString('hex');
            return paymentRequest.serialize();
        } catch (err) {
            console.error(err.stack, err.message);
            return Promise.reject({
                statusCode: 500,
                message: err.error || err.message,
            });
        }
    };

    createPaymentRequestForFund = async ({
        amount,
        hedge = true,
        oraclePubKey,
        maturityModifier,
        highLiquidationPriceMultiplier,
        lowLiquidationPriceMultiplier,
    } = {}) => {
        try {
            const ecpair = bitbox.ECPair.fromWIF(
                hedge ? process.env.HEDGE_WIF : process.env.LONG_WIF,
            );
            const ouputAddr = bitbox.ECPair.toLegacyAddress(ecpair);
            const pubKey = bitbox.ECPair.toPublicKey(ecpair);
            const satoshisAmount = Number(Number(amount).toFixed(0));

            const prices = await axios.get(`${process.env.ORACLE_PRICES_URL}/${oraclePubKey}`);
            const currentPrice = prices[0].currentPrice;
            const blockHeight = prices[0].blockHeight;

            const contractParameters = [
                oraclePubKey,
                pubKey,
                pubKey,
                amount,
                currentPrice,
                blockHeight,
                0,
                maturityModifier,
                highLiquidationPriceMultiplier,
                lowLiquidationPriceMultiplier,
            ];
            const contractData = await AnyHedgeLibrary.register(...contractParameters);

            const txBuilder = new TransactionBuilder();
            txBuilder.addOutput(ouputAddr, satoshisAmount);
            const outputs = new PaymentProtocol('BCH').makeOutput();
            outputs.set('amount', satoshisAmount);
            outputs.set('script', Buffer.from(txBuilder.buildIncomplete().outs[0].script));
            // outputs.set('refund_to', outputs.message)
            const paymentDetails = new PaymentProtocol().makePaymentDetails();
            paymentDetails.set('outputs', outputs.message);
            paymentDetails.set('time', 0);
            paymentDetails.set(
                'merchant_data',
                Buffer.from(
                    JSON.stringify({
                        amount,
                        hedge,
                        oraclePubKey,
                        maturityModifier,
                        highLiquidationPriceMultiplier,
                        lowLiquidationPriceMultiplier,
                    }),
                ),
            );
            paymentDetails.set(
                'payment_url',
                process.env.IS_OFFLINE
                    ? 'http://1a4adcc7a8ec.ngrok.io/dev/api/rest/orders'
                    : process.env.PAYMENT_URL,
            );

            const paymentRequest = new PaymentProtocol().makePaymentRequest();

            paymentRequest.set('serialized_payment_details', paymentDetails.serialize());
            paymentRequest.hex = paymentRequest.serialize().toString('hex');
            return paymentRequest.serialize();
        } catch (err) {
            return Promise.reject({
                statusCode: 500,
                message: err.error || err.message,
            });
        }
    };

    alternativeCreate = async ({
        amount,
        oraclePubKey,
        maturityModifier,
        highLiquidationPriceMultiplier,
        lowLiquidationPriceMultiplier,
    } = {}) => {
        const hedgePk = new bitcore.PrivateKey();
        const longPk = new bitcore.PrivateKey();

        const order = new Order({
            amount,
            oraclePubKey,
            maturityModifier,
            highLiquidationPriceMultiplier,
            lowLiquidationPriceMultiplier,
            hedge: {
                wif: hedgePk,
            },
            long: {
                wif: longPk,
            },
        });
        const errors = order.validateSync();
        if (errors) {
            throw new Error(errors.message);
        }

        return order.save();
    };

    list = () => {
        return Order.find();
    };
}

module.exports = new orderService();
