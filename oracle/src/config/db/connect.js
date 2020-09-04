const mongoose = require("mongoose");

const mongoString = process.env.MONGO_URL;

const connect = () => {
  // Check if the connection is already open before tying again
  if (mongoose.connection.readyState !== 1) {
    mongoose
      .connect(mongoString, {
        useNewUrlParser: true,
      })
      .catch((error) => setTimeout(connect, 3000));
  }

  mongoose.connection.on("connected", function (ref) {
    console.log("Connected to mongo server.");
  });

  mongoose.connection.on("error", function (err) {
    console.log("Could not connect to mongo server!", err);
  });
};

module.exports = connect;
