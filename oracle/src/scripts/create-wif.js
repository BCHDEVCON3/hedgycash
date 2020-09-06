const bitcore = require('bitcore-lib-cash');

const privateKey = new bitcore.PrivateKey();
const wif = privateKey.toWIF();
const address = privateKey.toAddress().toString();

console.info(wif);
console.info(address);
