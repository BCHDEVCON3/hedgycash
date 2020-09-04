const mongoose = require("mongoose");
const validator = require("validator");
const BITBOX = require("bitbox-sdk").BITBOX;

const bitbox = new BITBOX();

const OracleState = {
  CREATED: "CREATED",
  RUNNING: "RUNNING",
  STOPPED: "STOPPED",
};

const OracleSchema = mongoose.Schema(
  {
    wif: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(wif) {
          return wif && !!bitbox.ECPair.fromWIF(wif);
        },
      },
    },
    pubKey: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(pubKey) {
          return (
            bitbox.ECPair.toPublicKey(bitbox.ECPair.fromWIF(this.wif)).toString(
              "hex"
            ) === pubKey
          );
        },
      },
    },
    description: {
      type: String,
    },
    state: {
      type: String,
      enum: Object.values(OracleState),
      required: true,
      default: OracleState.CREATED,
      validate: {
        validator(state) {
          return !!Object.values(OracleState).includes(state);
        },
      },
    },
    code: {
      type: String,
      validate: {
        validator(code) {
          return !!code || this.state === OracleState.CREATED;
        },
      },
    },
    sequence: {
      type: Number,
      default: 0,
      validate: {
        validator(sequence) {
          return validator.isNumeric(`${sequence}`);
        },
      },
    },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

OracleSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.wif;
  return obj;
};

OracleSchema.methods.toString = function () {
  return JSON.stringify(this.toJSON());
};

OracleSchema.virtual("address").get(function () {
  return bitbox.ECPair.toCashAddress(bitbox.ECPair.fromWIF(this.wif));
});

module.exports =
  mongoose.models.Oracle || mongoose.model("Oracle", OracleSchema);

module.exports.OracleState = OracleState;
