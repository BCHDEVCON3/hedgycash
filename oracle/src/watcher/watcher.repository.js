const mongoose = require("mongoose");
const validator = require("validator");

const WatcherSchema = mongoose.Schema({
  blockHeight: {
    type: Number,
    required: true,
    validate: {
      validator(blockHeight) {
        return blockHeight && validator.isNumeric(blockHeight.toString());
      },
    },
  },
  bestblockhash: {
    type: String,
    required: true,
    validate: {
      validator(bestblockhash) {
        return !!bestblockhash;
      },
    },
  },
  blockSequence: {
    type: Number,
    default: 0,
    validate: {
      validator(blockSequence) {
        return validator.isNumeric(`${blockSequence}`);
      },
    },
  },
});

module.exports =
  mongoose.models.Watcher || mongoose.model("Watcher", WatcherSchema);
