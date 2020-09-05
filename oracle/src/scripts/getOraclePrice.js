const BITBOX = require('bitbox-sdk').BITBOX;
const { OracleData } = require('@generalprotocols/price-oracle');

const bitbox = new BITBOX();

(async () => {
    try {
        let transactions = await bitbox.Address.transactions(
            'bitcoincash:qphuzhuytccu9aufcm2xh435hsrems98wckn3z7dq6',
        );
        const prices = await Promise.all(transactions.txs.map((tx) => {
            const priceMessage = OracleData.unpackPriceMessage(
                Buffer.from(transactions.txs[0].vout[0].scriptPubKey.hex, 'hex'),
            );

            return OracleData.parsePriceMessage(priceMessage.message);
        }));
        console.info(prices);
    } catch (error) {
        console.error(error);
    }
})();

// [
//     {
//       price: 5427,
//       blockHeight: 651490,
//       blockHash: <Buffer 00 00 00 00 00 00 00 00 00 1f 10 18 26 7d c5 2d 79 2e 0c 14 53 7d d8 bb 40 be 62 3e 0f af 99 9f>,
//       blockSequence: 13,
//       oracleSequence: 75,
//       timestamp: 1599325227
//     },
//     {
//       price: 5427,
//       blockHeight: 651490,
//       blockHash: <Buffer 00 00 00 00 00 00 00 00 00 1f 10 18 26 7d c5 2d 79 2e 0c 14 53 7d d8 bb 40 be 62 3e 0f af 99 9f>,
//       blockSequence: 13,
//       oracleSequence: 75,
//       timestamp: 1599325227
//     },
//     {
//       price: 5427,
//       blockHeight: 651490,
//       blockHash: <Buffer 00 00 00 00 00 00 00 00 00 1f 10 18 26 7d c5 2d 79 2e 0c 14 53 7d d8 bb 40 be 62 3e 0f af 99 9f>,
//       blockSequence: 13,
//       oracleSequence: 75,
//       timestamp: 1599325227
//     },
//     {
//       price: 5427,
//       blockHeight: 651490,
//       blockHash: <Buffer 00 00 00 00 00 00 00 00 00 1f 10 18 26 7d c5 2d 79 2e 0c 14 53 7d d8 bb 40 be 62 3e 0f af 99 9f>,
//       blockSequence: 13,
//       oracleSequence: 75,
//       timestamp: 1599325227
//     },
//     {
//       price: 5427,
//       blockHeight: 651490,
//       blockHash: <Buffer 00 00 00 00 00 00 00 00 00 1f 10 18 26 7d c5 2d 79 2e 0c 14 53 7d d8 bb 40 be 62 3e 0f af 99 9f>,
//       blockSequence: 13,
//       oracleSequence: 75,
//       timestamp: 1599325227
//     },
//     {
//       price: 5427,
//       blockHeight: 651490,
//       blockHash: <Buffer 00 00 00 00 00 00 00 00 00 1f 10 18 26 7d c5 2d 79 2e 0c 14 53 7d d8 bb 40 be 62 3e 0f af 99 9f>,
//       blockSequence: 13,
//       oracleSequence: 75,
//       timestamp: 1599325227
//     },
//     {
//       price: 5427,
//       blockHeight: 651490,
//       blockHash: <Buffer 00 00 00 00 00 00 00 00 00 1f 10 18 26 7d c5 2d 79 2e 0c 14 53 7d d8 bb 40 be 62 3e 0f af 99 9f>,
//       blockSequence: 13,
//       oracleSequence: 75,
//       timestamp: 1599325227
//     },
//     {
//       price: 5427,
//       blockHeight: 651490,
//       blockHash: <Buffer 00 00 00 00 00 00 00 00 00 1f 10 18 26 7d c5 2d 79 2e 0c 14 53 7d d8 bb 40 be 62 3e 0f af 99 9f>,
//       blockSequence: 13,
//       oracleSequence: 75,
//       timestamp: 1599325227
//     },
//     {
//       price: 5427,
//       blockHeight: 651490,
//       blockHash: <Buffer 00 00 00 00 00 00 00 00 00 1f 10 18 26 7d c5 2d 79 2e 0c 14 53 7d d8 bb 40 be 62 3e 0f af 99 9f>,
//       blockSequence: 13,
//       oracleSequence: 75,
//       timestamp: 1599325227
//     },
//     {
//       price: 5427,
//       blockHeight: 651490,
//       blockHash: <Buffer 00 00 00 00 00 00 00 00 00 1f 10 18 26 7d c5 2d 79 2e 0c 14 53 7d d8 bb 40 be 62 3e 0f af 99 9f>,
//       blockSequence: 13,
//       oracleSequence: 75,
//       timestamp: 1599325227
//     }
//   ]