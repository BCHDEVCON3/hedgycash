const validator = require("validator");
const axios = require("axios");
const vm = require("vm");
const BITBOX = require("bitbox-sdk").BITBOX;
const bitcore = require("bitcore-lib-cash");
const Order = require("./order.repository");

const bitbox = new BITBOX();

const MIN_ORACLE_BALANCE = 0.001;

class orderService {
  create = async () => {
   
  };

  list = () => {
    return Order.find();
  };
}

module.exports = new orderService();
