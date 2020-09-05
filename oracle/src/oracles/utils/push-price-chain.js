const Big = require("big.js");
const { BITBOX } = require("bitbox-sdk");
const { OracleData } = require("@generalprotocols/price-oracle");

const bitbox = new BITBOX();

const DUST = 546;
const SATOSHIS_PER_BYTE = 1.01;
const ERRORS = {
  INSUFICIENT_FUNDS: "custom code 0",
  NETWORK_ERROR: "custom code 1",
  INSUFFICIENT_PRIORITY: "code 66", // ~insufficien fee
  DOUBLE_SPENDING: "code 18",
  MAX_UNCONFIRMED_TXS: "code 64",
};

const pushPriceOnChain = async ({ oracleWif, signature, priceMessage }) => {
  try {
    const ecpair = bitbox.ECPair.fromWIF(oracleWif);
    const oracleAddress = bitbox.ECPair.toCashAddress(ecpair);
    const oraclePubKey = bitbox.ECPair.toPublicKey(ecpair);

    const encodedOpReturn = Buffer.concat(
      OracleData.packPriceMessage(priceMessage, signature, oraclePubKey)
    );

    const { utxos } = await bitbox.Address.utxo(oracleAddress);

    const inputUtxos = [];
    let transactionBuilder = new bitbox.TransactionBuilder();

    let originalAmount = new Big(0);
    let txFee = 0;
    for (let i = 0; i < utxos.length; i++) {
      const utxo = utxos[i];
      originalAmount = originalAmount.plus(utxo.satoshis);
      const vout = utxo.vout;
      const txid = utxo.txid;
      // add input with txid and index of vout
      transactionBuilder.addInput(txid, vout);
      inputUtxos.push(utxo);

      const byteCount = bitbox.BitcoinCash.getByteCount(
        { P2PKH: inputUtxos.length },
        { P2PKH: 2 }
      );
      const satoshisPerByte = SATOSHIS_PER_BYTE;
      txFee = Math.floor(
        satoshisPerByte * (byteCount + encodedOpReturn.length)
      );

      if (originalAmount.minus(txFee).gte(DUST)) {
        break;
      }
    }
    // amount to send back to the remainder address.
    const remainder = Math.floor(originalAmount.minus(txFee));
    if (remainder < 0) {
      const error = new Error(`Insufficient funds`);
      error.code = ERRORS.INSUFICIENT_FUNDS;
      throw error;
    }

    transactionBuilder.addOutput(encodedOpReturn, 0);

    transactionBuilder.addOutput(oracleAddress, remainder);

    // Sign the transactions with the HD node.
    for (let i = 0; i < inputUtxos.length; i++) {
      const utxo = inputUtxos[i];
      transactionBuilder.sign(
        i,
        bitbox.ECPair.fromWIF(oracleWif),
        undefined,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        utxo.satoshis
      );
    }

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();

    // Broadcast transation to the network
    const txidStr = await bitbox.RawTransactions.sendRawTransaction([hex]);
    let link = `https://explorer.bitcoin.com/bch/tx/${txidStr}`;
    console.log(link);

    return link;
  } catch (err) {
    if (err.error && err.error.includes(ERRORS.INSUFFICIENT_PRIORITY)) {
      err.code = ERRORS.INSUFFICIENT_PRIORITY;
    } else if (err.error && err.error.includes(ERRORS.DOUBLE_SPENDING)) {
      err.code = ERRORS.DOUBLE_SPENDING;
    } else if (err.error === "Network Error") {
      err.code = ERRORS.NETWORK_ERROR;
    } else if (err.error && err.error.includes(ERRORS.MAX_UNCONFIRMED_TXS)) {
      err.code = ERRORS.MAX_UNCONFIRMED_TXS;
    }
    console.log(`error: `, err);
    throw err;
  }
};

pushPriceOnChain.ERRORS = ERRORS;

module.exports = pushPriceOnChain;
