const mongoose = require("mongoose");
const validator = require("validator");
const BITBOX = require("bitbox-sdk").BITBOX;

const bitbox = new BITBOX();

const OrderState = {
  UNFULFILLED: "UNFULFILLED",
  FULFILLED: "FULFILLED",
  REDEEEMED: "REDEEMED",
  FINISHED: "FINISHED",
};

const OrderSchema = mongoose.Schema(
  {
    hedgeAddress: {
      type: String,
    },
    counterpartyAddress: {
      type: String,
    },
    oracleAddress: {
      type: String,
    },
    contractAddress: {
      type: String,
    },
    // TODO Schema for contractData object
    // contractData: {
    //   type: Number,
    // }
  }
);

OrderSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

OrderSchema.methods.toString = function () {
  return JSON.stringify(this.toJSON());
};

module.exports =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

module.exports.OrderState = OrderState;
