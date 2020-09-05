const BITBOX = require("bitbox-sdk").BITBOX;
const aws = require("aws-sdk");
const Watcher = require("./watcher.repository");
const Oracles = require("../oracles/oracles.repository");

const bitbox = new BITBOX();

class WatcherService {
  watch = async () => {
    try {
      const info = await bitbox.Blockchain.getBlockchainInfo();
      let watcher = await Watcher.findOne();
      if (watcher && watcher.blockHeight !== info.blocks) {
        watcher.blockHeight = info.blocks;
        watcher.bestblockhash = info.bestblockhash;
        watcher.blockSequence = 0;
      } else if (!watcher) {
        watcher = new Watcher({
          blockHeight: info.blocks,
          bestblockhash: info.bestblockhash,
          blockSequence: 0,
        });
      } else {
        watcher.blockSequence += 1;
      }
      if (process.env.PUSH_ON_CHAIN === "true" && !process.env.IS_OFFLINE) {
        const oracles = await Oracles.find({
          state: Oracles.OracleState.RUNNING,
        });
        this.updateOracles(watcher, oracles);
      }
      await watcher.save();
    } catch (error) {
      console.error(error.stack, error.message);
    }
  };

  updateOracles = (
    { blockHeight, bestblockhash: blockHash, blockSequence },
    oracles
  ) => {
    const lambda = new aws.Lambda({
      endpoint: process.env.IS_OFFLINE
        ? "http://localhost:3002"
        : "https://lambda.us-east-1.amazonaws.com",
    });
    for (let i = 0; i < oracles.length; i++) {
      const oracle = oracles[i];
      const opts = {
        InvocationType: "Event",
        FunctionName: `hedgy-cash-oracle-${process.env.STAGE}-publishPrice`,
        Payload: JSON.stringify({
          blockHeight,
          blockHash,
          blockSequence,
          pubKey: oracle.pubKey,
        }),
      };

      lambda.invoke(opts, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  };
}

module.exports = new WatcherService();
