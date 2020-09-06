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
    bchAmount: {
        type: Number,
        numberValidator,
    },
    hedge: {
        wif: String,
        funded: Boolean,
    },
    long: {
        wif: String,
        funded: Boolean,
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
        numberValidator,
    },
    startBlockHeight: {
        type: Number,
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
    delete obj.hedge.wif;
    delete obj.long.wif;
    return obj;
};

OrderSchema.methods.toString = function () {
    return JSON.stringify(this.toJSON());
};

OracleSchema.virtual('hedge.address').get(function () {
    return bitbox.ECPair.toCashAddress(bitbox.ECPair.fromWIF(this.hedge.wif));
});

OracleSchema.virtual('long.address').get(function () {
    return bitbox.ECPair.toCashAddress(bitbox.ECPair.fromWIF(this.long.wif));
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);

module.exports.OrderState = OrderState;
