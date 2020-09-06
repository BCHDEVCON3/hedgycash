const PaymentProtocol= require('bitcore-payment-protocol')

const Big = require("big.js");
const { BITBOX } = require("bitbox-sdk");

const bitbox = new BITBOX();

const DUST = 546;
const SATOSHIS_PER_BYTE = 1.01;

const testSendToBip70 = async () => {
  try {
    const ecpair = bitbox.ECPair.fromWIF('L43LxePYLu3vBtooLxKeMYB7eV2TFyQAP8QpYNh3bnNZimHbvjyg');
    const oracleAddress = bitbox.ECPair.toCashAddress(ecpair);
    console.log(oracleAddress)
    const oraclePubKey = bitbox.ECPair.toPublicKey(ecpair);

    const { utxos } = await bitbox.Address.utxo(oracleAddress);

    const inputUtxos = [];
    let transactionBuilder = new bitbox.TransactionBuilder();

    let originalAmount = new Big(0);
    let txFee = 0;
    console.log(utxos)
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
        satoshisPerByte * 100
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

    transactionBuilder.addOutput('bitcoincash:qphuzhuytccu9aufcm2xh435hsrems98wckn3z7dq6', remainder);

    // Sign the transactions with the HD node.
    for (let i = 0; i < inputUtxos.length; i++) {
      const utxo = inputUtxos[i];
      transactionBuilder.sign(
        i,
        bitbox.ECPair.fromWIF('L43LxePYLu3vBtooLxKeMYB7eV2TFyQAP8QpYNh3bnNZimHbvjyg'),
        undefined,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        utxo.satoshis
      );
    }

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();
    // console.log(tx);
    // console.log(hex);
    const payment = new PaymentProtocol().makePayment();
    payment.set('merchant_data', Buffer.from(JSON.stringify({
      amount: 10000,
      hedgeAddress: oracleAddress,
      startPrice: 100,
      highLiquidationModifier: 5,
      lowLiquidationModifier: 2,
      maturityModifier: 2

    })))
    payment.set('transactions', [Buffer.from(hex, 'hex')])
    var outputs = new PaymentProtocol().makeOutput();
    outputs.set('amount', 0);
    outputs.set('script', Buffer.from(tx.outs[0].script));
    payment.set('refund_to', outputs.message);
    const rawbody = payment.serialize()
    console.log(rawbody.toString('hex'))

    // Broadcast transation to the network
    // const txidStr = await bitbox.RawTransactions.sendRawTransaction([hex]);
    // let link = `https://explorer.bitcoin.com/bch/tx/${txidStr}`;
    // console.log(link);

    // return link;
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

testSendToBip70();