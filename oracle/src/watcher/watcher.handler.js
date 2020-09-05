const db = require("../config/db");
const watcherService = require("./watcher.service");

db.connect();

module.exports.watch = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  watcherService
    .watch()
    .then(() => callback(null))
    .catch((error) => {
      if (!process.env.IS_OFFLINE) {
        callback(error);
      }
      callback();
    });
};
