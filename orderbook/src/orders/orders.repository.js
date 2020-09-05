const mongoose = require('mongoose');
const validator = require('validator');
const BITBOX = require('bitbox-sdk').BITBOX;

const bitbox = new BITBOX();

const OrderState = {
    UNFULFILLED: 'UNFULFILLED',
    FULFILLED: 'FULFILLED',
    REDEEEMED: 'REDEEMED',
    FINISHED: 'FINISHED',
};

const OrderSchema = mongoose.Schema({
    amount: {
        type: Number,
    },
    hedgeAddress: {
        type: String,
    },
    counterpartyAddress: {
        type: String,
    },
    oraclePubKey: {
        type: String,
    },
    contractAddress: {
        type: String,
    },
    contractMetadata: {},
    startPrice: {
        type: Number,
    },
    startBlockHeight: {
        type: Number,
    },
    maturityModifier: {
        type: Number,
    },
    highLiquidationPriceMultiplier: {
        type: Number,
    },
    lowLiquidationPriceMultiplier: {
        type: Number,
    },
});

OrderSchema.methods.toJSON = function () {
    var obj = this.toObject();
    return obj;
};

OrderSchema.methods.toString = function () {
    return JSON.stringify(this.toJSON());
};

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);

module.exports.OrderState = OrderState;
