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
    contractUnits: {
        type: Number,
        numberValidator,
    },
    hedge: {
        wif: String,
        address: String,
        creator: String,
        amount: {
            type: Number,
            default: 0,
        },
        funded: {
            type: Boolean,
            default: false,
        },
    },
    long: {
        wif: String,
        address: String,
        creator: String,
        amount: {
            type: Number,
            default: 0,
        },
        funded: {
            type: Boolean,
            default: false,
        },
    },
    oraclePubKey: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contractData: mongoose.Schema.Types.Mixed,
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

// Nested virtuals - Not working
// OrderSchema.virtual('hedge.address').get(function () {
//     return bitbox.ECPair.toCashAddress(bitbox.ECPair.fromWIF(this.hedge.wif));
// });

// OrderSchema.virtual('long.address').get(function () {
//     return bitbox.ECPair.toCashAddress(bitbox.ECPair.fromWIF(this.long.wif));
// });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);

module.exports.OrderState = OrderState;
