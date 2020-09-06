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
        oraclePubKey,
        maturityModifier,
        highLiquidationPriceMultiplier,
        lowLiquidationPriceMultiplier,
    } = {}) => {
        try {
            const hedgePk = new bitcore.PrivateKey();
            const longPk = new bitcore.PrivateKey();
            // const fakeHedgePk = new bitcore.PrivateKey();
            // const fakeLongPk = new bitcore.PrivateKey();

            // const { data: prices } = await axios.get(
            //     `${process.env.ORACLE_PRICES_URL}/pubKey/${oraclePubKey}/prices`,
            // );
            // const currentPrice = prices[0].price;
            // const blockHeight = prices[0].blockHeight;

            // const contractParameters = [
            //     oraclePubKey,
            //     fakeHedgePk.toPublicKey().toString(), // just for fee calculation
            //     fakeLongPk.toPublicKey().toString(), // just for fee calculation
            //     contractUnits,
            //     currentPrice,
            //     blockHeight,
            //     0,
            //     maturityModifier,
            //     highLiquidationPriceMultiplier,
            //     lowLiquidationPriceMultiplier,
            // ];
            // const contractData = await anyHedgeManager.register(...contractParameters);

            // const hedgeContractAmount = contractData.metadata.hedgeInputSats;
            // const longContractAmount =
            //     contractData.metadata.longInputSats +
            //     contractData.metadata.minerCost +
            //     contractData.metadata.dustCost;
            // const hedgeFee = 950;
            // const longFee = 950;
            // const hedgeSendAmount = hedgeContractAmount + hedgeFee;
            // const longSendAmount = longContractAmount + longFee;

            const order = new Order({
                oraclePubKey,
                maturityModifier,
                highLiquidationPriceMultiplier,
                lowLiquidationPriceMultiplier,
                hedge: {
                    wif: hedgePk.toWIF().toString(),
                    address: hedgePk.toAddress().toString(),
                    // amount: hedgeSendAmount,
                },
                long: {
                    wif: longPk.toWIF().toString(),
                    address: longPk.toAddress().toString(),
                    // amount: longSendAmount,
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
            self.amount = balance;
            order.amount = order.amount || balance;

            const { data: prices } = await axios.get(
                `${process.env.ORACLE_PRICES_URL}/pubKey/${order.oraclePubKey}/prices`,
            );
            prices.reverse();
            const currentPrice = prices[0].price;
            const blockHeight = prices[0].blockHeight;
            // const contractUnits = Number(new Big(order.amount).div(currentPriceSat).toFixed(0));
            const contractUnits = 60; // TODO: refactor this shit!

            const minimumSatoshiAmount = parseInt((50 * currentPrice) / 10 ** 4);

            if (order.amount < minimumSatoshiAmount) {
                return Promise.reject({
                    statusCode: 400,
                    message: `This order requires at least ${minimumSatoshiAmount} satoshis`,
                });
            }

            if (self.amount && counterParty.amount) {
                if (contractUnits < 50) {
                    return Promise.reject({
                        statusCode: 400,
                        message: `Insufficient amount. The minimum amount for the current price of ${
                            currentPrice / 10 ** 8
                        } is ${minimumSatoshiAmount}`,
                    });
                }

                const contractParameters = [
                    Buffer.from(order.oraclePubKey, 'hex'),
                    new bitcore.PrivateKey(order.hedge.wif).toPublicKey().toBuffer(),
                    new bitcore.PrivateKey(order.long.wif).toPublicKey().toBuffer(),
                    contractUnits,
                    currentPrice,
                    blockHeight,
                    0,
                    order.maturityModifier,
                    order.highLiquidationPriceMultiplier,
                    order.lowLiquidationPriceMultiplier,
                ];
                await anyHedgeManager.load();
                const contractData = await anyHedgeManager.register(...contractParameters);
                order.startBlockHeight = blockHeight;
                order.startPrice = currentPrice;
                order.contractUnits = contractUnits;
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
