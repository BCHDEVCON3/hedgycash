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

const numberValidator = {
    validate: {
        validator(sequence) {
            return validator.isNumeric(`${sequence}`);
        },
    },
};

const OrderSchema = mongoose.Schema({
    state: {
        type: String,
        enum: Object.values(OrderState),
        required: true,
        default: OrderState.UNFULFILLED,
        validate: {
            validator(state) {
                return !!Object.values(OrderState).includes(state);
            },
        },
    },
    amount: {
        type: Number,
        required: true,
        numberValidator,
    },
    hedgeAddress: {
        type: String,
    },
    counterpartyAddress: {
        type: String,
    },
    oraclePubKey: {
        type: String,
        required: true,
    },
    contractAddress: {
        type: String,
    },
    contractMetadata: {},
    startPrice: {
        type: Number,
        required: true,
        numberValidator,
    },
    startBlockHeight: {
        type: Number,
        required: true,
        numberValidator,
    },
    maturityModifier: {
        type: Number,
        required: true,
        numberValidator,
    },
    highLiquidationPriceMultiplier: {
        type: Number,
        required: true,
        numberValidator,
    },
    lowLiquidationPriceMultiplier: {
        type: Number,
        required: true,
        numberValidator,
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
