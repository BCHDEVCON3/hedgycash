const {
  OracleData,
  OracleNetwork,
  OracleProtocol,
} = require("@generalprotocols/price-oracle");
const { BITBOX } = require("bitbox-sdk");
const pushPriceOnChain = require("./push-price-chain");

const bitbox = new BITBOX();

const privateKeyWIF = "";

(async () => {
  const price = 120;
  const blockHeight = 0;
  const blockHash = bitbox.Crypto.hash256("1").toString("hex");
  const blockSequence = 0;
  const oracleSequence = 0;
  const timestamp = Date.now() / 1000;

  const message = await OracleData.createPriceMessage(
    price,
    blockHeight,
    blockHash,
    blockSequence,
    oracleSequence,
    timestamp
  );

  const signature = await OracleData.signMessage(message, privateKeyWIF);

  await pushPriceOnChain({
    oracleWif: privateKeyWIF,
    signature,
    priceMessage: message,
  });
})();
