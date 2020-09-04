const BITBOX = require("bitbox-sdk").BITBOX;
const bitcore = require("bitcore-lib-cash");
const Oracle = require("./oracles.repository");

const bitbox = new BITBOX();

class OraclesService {
  create = ({ code, description = "", ...otherProps }) => {
    const privateKey = new bitcore.PrivateKey();
    const wif = privateKey.toWIF();
    const pubKey = privateKey.toPublicKey().toString();

    const oracle = new Oracle({
      wif,
      pubKey,
      code,
      description,
      ...otherProps,
    });
    const errors = oracle.validateSync();
    if (errors) {
      return Promise.reject({
        statusCode: 400,
        message: errors.message,
      });
    }

    return oracle.save();
  };

  list = () => {
    return Oracle.find();
  };
}

module.exports = new OraclesService();
