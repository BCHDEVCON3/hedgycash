const AnyHedgeLibrary = require('@generalprotocols/anyhedge');
const validator = require('validator');
const Big = require('big.js');
const axios = require('axios');
const vm = require('vm');
const BITBOX = require('bitbox-sdk').BITBOX;
const bitcore = require('bitcore-lib-cash');
const Order = require('./orders.repository');
const fundContract = require('./utils/fund-contract');

const bitbox = new BITBOX();
const anyHedgeManager = new AnyHedgeLibrary();

class orderService {
    create = async ({
        contractUnits,
        isHedge,
        address,
        oraclePubKey,
        maturityModifier,
        highLiquidationPriceMultiplier,
        lowLiquidationPriceMultiplier,
    } = {}) => {
        try {
            const hedgePk = new bitcore.PrivateKey();
            const longPk = new bitcore.PrivateKey();
            const fakeHedgePk = new bitcore.PrivateKey();
            const fakeLongPk = new bitcore.PrivateKey();

            const { data: oracle } = await axios.get(
                // `${process.env.ORACLE_PRICES_URL}/pubKey/${oraclePubKey}`,
                `${process.env.ORACLE_PRICES_URL}/pubKey/0297da1d525801bb4cc9ec860a3fff60c166bd47c2b17ee52cedf0380f53df6fb7`,
            );
            // const { data: prices } = await axios.get(
            //     // `${process.env.ORACLE_PRICES_URL}/pubKey/${oraclePubKey}/prices`,
            //     `${process.env.ORACLE_PRICES_URL}/pubKey/0297da1d525801bb4cc9ec860a3fff60c166bd47c2b17ee52cedf0380f53df6fb7/prices`,
            // );
            // const currentPrice = prices[0].price;
            // const blockHeight = prices[0].blockHeight;

            const { data: bitpayData } = await axios('https://bitpay.com/api/rates/BCH/USD');

            // Set the starting price of the contract in US cents.
            const currentPrice = Number(bitpayData.rate * 100);

            // Set the starting contract height to the current blockheight.
            const blockHeight = await bitbox.Blockchain.getBlockCount();

            const contractParameters = [
                Buffer.from(oraclePubKey, 'hex'),
                fakeHedgePk.toPublicKey().toBuffer(), // just for fee calculation
                fakeLongPk.toPublicKey().toBuffer(), // just for fee calculation
                contractUnits,
                currentPrice,
                blockHeight,
                0,
                maturityModifier,
                highLiquidationPriceMultiplier,
                lowLiquidationPriceMultiplier,
            ];
            await anyHedgeManager.load();
            const contractData = await anyHedgeManager.register(...contractParameters);

            const hedgeContractAmount = contractData.metadata.hedgeInputSats;
            const longContractAmount =
                contractData.metadata.longInputSats +
                contractData.metadata.minerCost +
                contractData.metadata.dustCost;
            const hedgeFee = 1500;
            const longFee = 1500;
            const hedgeSendAmount = hedgeContractAmount + hedgeFee;
            const longSendAmount = longContractAmount + longFee;

            const order = new Order({
                contractUnits,
                oraclePubKey,
                maturityModifier,
                highLiquidationPriceMultiplier,
                lowLiquidationPriceMultiplier,
                description: oracle.description,
                hedge: {
                    wif: hedgePk.toWIF().toString(),
                    address: hedgePk.toAddress().toString(),
                    amount: hedgeSendAmount,
                    creator: isHedge ? address : null,
                },
                long: {
                    wif: longPk.toWIF().toString(),
                    address: longPk.toAddress().toString(),
                    amount: longSendAmount,
                    creator: !isHedge ? address : null,
                },
            });
            const errors = order.validateSync();
            if (errors) {
                throw new Error(errors.message);
            }

            return order.save();
        } catch (err) {
            console.error(err.stack, err.message);
            return Promise.reject({
                statusCode: 400,
                message: 'Invalid order parameters. Root cause: ' + (err.error || err.message),
            });
        }
    };

    confirmPaymentMock = async ({ id, address }) => {
        try {
            const order = await Order.findById(id);

            if (!order) {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Invalid order id',
                });
            }

            const orderJSON = order.toJSON();
            const isHedge = orderJSON.hedge.address === address;
            const self = isHedge ? order.hedge : order.long;
            const counterParty = !isHedge ? order.hedge : order.long;

            self.amount = 1000;
            order.amount = order.amount || self.amount;

            if (self.amount && counterParty.amount) {
                order.state = Order.OrderState.FULFILLED;
            }

            return order.save();
        } catch (err) {
            console.error(err.stack, err.message);
            return Promise.reject({
                statusCode: 400,
                message: 'Invalid order parameters. Root cause: ' + (err.error || err.message),
            });
        }
    };

    confirmPayment = async ({ id, address }) => {
        try {
            const order = await Order.findById(id);

            if (!order) {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Invalid order id',
                });
            }

            const orderJSON = order.toJSON();
            const isHedge = orderJSON.hedge.address === address;
            const self = isHedge ? order.hedge : order.long;
            const counterParty = !isHedge ? order.hedge : order.long;

            const details = await bitbox.Address.details(address);
            const balance = details.unconfirmedBalanceSat + details.balanceSat;
            self.funded = balance >= self.amount;

            if (!self.funded) {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Not yet funded',
                });
            }

            if (self.funded && counterParty.funded) {
                const { data: prices } = await axios.get(
                    `${process.env.ORACLE_PRICES_URL}/pubKey/${order.oraclePubKey}/prices`,
                );
                prices.reverse();
                const currentPrice = prices[0].price;
                const blockHeight = prices[0].blockHeight;

                const contractParameters = [
                    Buffer.from(order.oraclePubKey, 'hex'),
                    new bitcore.PrivateKey(order.hedge.wif).toPublicKey().toBuffer(),
                    new bitcore.PrivateKey(order.long.wif).toPublicKey().toBuffer(),
                    order.contractUnits,
                    currentPrice,
                    blockHeight,
                    0,
                    order.maturityModifier,
                    order.highLiquidationPriceMultiplier,
                    order.lowLiquidationPriceMultiplier,
                ];
                await anyHedgeManager.load();
                const contractData = await anyHedgeManager.register(...contractParameters);
                console.info(contractData);
                order.startBlockHeight = blockHeight;
                order.startPrice = currentPrice;
                order.contractUnits = order.contractUnits;
                order.state = Order.OrderState.FULFILLED;
                order.contractData = contractData;
                await fundContract(order.hedge, order.long, contractData);
            }

            return order.save();
        } catch (err) {
            console.error(err.stack, err.message);
            return Promise.reject({
                statusCode: 400,
                message: 'Invalid order parameters. Root cause: ' + (err.error || err.message),
            });
        }
    };

    list = () => {
        try {
            return Order.find();
        } catch (err) {
            console.error(err.stack, err.message);
            return Promise.reject({
                statusCode: 500,
                message: 'Cannot find orders. Root cause: ' + (err.error || err.message),
            });
        }
    };
}

module.exports = new orderService();
