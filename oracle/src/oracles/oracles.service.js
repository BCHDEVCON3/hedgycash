const validator = require('validator');
const axios = require('axios');
const vm = require('vm');
const BITBOX = require('bitbox-sdk').BITBOX;
const bitcore = require('bitcore-lib-cash');
const { OracleData } = require('@generalprotocols/price-oracle');
const Oracle = require('./oracles.repository');
const pushPriceOnChain = require('./utils/push-price-chain');

const bitbox = new BITBOX();

const MIN_ORACLE_BALANCE = 0.001;

class OraclesService {
    create = ({ code, description = '', ...otherProps }) => {
        const privateKey = new bitcore.PrivateKey();
        const wif = privateKey.toWIF();
        const pubKey = privateKey.toPublicKey().toString();

        const oracle = new Oracle({
            wif,
            pubKey,
            code,
            description,
            ...otherProps,
        });
        const errors = oracle.validateSync();
        if (errors) {
            return Promise.reject({
                statusCode: 400,
                message: errors.message,
            });
        }

        return oracle.save();
    };

    list = () => {
        return Oracle.find();
    };

    run = async (rawOracle) => {
        const oracle = await this.findById(rawOracle._id);

        if (oracle.state !== Oracle.OracleState.CREATED) {
            return Promise.reject({
                statusCode: 400,
                message: 'Invalid state change',
            });
        }
        oracle.code = rawOracle.code;
        oracle.description = rawOracle.description;
        oracle.state = Oracle.OracleState.RUNNING;

        const errors = oracle.validateSync();
        if (errors) {
            return Promise.reject({
                statusCode: 400,
                message: errors.message,
            });
        }

        try {
            const details = await bitbox.Address.details(oracle.address);
            const totalBalance = details.balance + details.unconfirmedBalance;
            if (totalBalance < MIN_ORACLE_BALANCE) {
                throw new Error(`Not enough balance. Min oracle balance: ` + MIN_ORACLE_BALANCE);
            }
        } catch (error) {
            return Promise.reject({
                statusCode: 400,
                message: error.message,
            });
        }

        await this.testCode(oracle.code);

        return oracle.save();
    };

    findById = (id) => {
        if (!validator.isMongoId(id)) {
            return Promise.reject({
                statusCode: 400,
                message: 'Invalid id',
            });
        }

        return Oracle.findById(id);
    };

    findByPubKey = (pubKey) => {
        return Oracle.findOne({ pubKey });
    };

    testCode = async (code) => {
        return new Promise(async (resolve, reject) => {
            try {
                await Promise.resolve(
                    vm.runInNewContext(code, {
                        axios,
                        broadcastPrice: resolve,
                    }),
                );
            } catch (error) {
                reject(error);
            }
        }).then((result) => ({ result, valid: !Number.isNaN(Number(result)) }));
    };

    publishPrice = async ({ pubKey, blockHeight, blockHash, blockSequence }) => {
        const oracle = await this.findByPubKey(pubKey);

        const codeResult = await this.testCode(oracle.code);

        const price = Number(codeResult.result);
        const oracleSequence = oracle.sequence++;
        const timestamp = Date.now() / 1000;

        const message = await OracleData.createPriceMessage(
            price,
            blockHeight,
            blockHash,
            blockSequence,
            oracleSequence,
            timestamp,
        );

        const signature = await OracleData.signMessage(message, oracle.wif);

        await pushPriceOnChain({
            oracleWif: oracle.wif,
            signature,
            priceMessage: message,
        });

        await oracle.save();
    };

    getOraclePrices = async (oraclePubkey) => {
        const oracle = await this.findByPubKey(oraclePubkey);
        // const ecpair = bitbox.ECPair.fromPublicKey(Buffer.from(oraclePubkey, 'hex'));
        // const address = bitbox.ECPair.toCashAddress(ecpair)

        let transactions = await bitbox.Address.transactions(oracle.address);
        return await Promise.all(
            transactions.txs
                .map((tx, index) => {
                    const priceMessage = OracleData.unpackPriceMessage(
                        Buffer.from(transactions.txs[index].vout[0].scriptPubKey.hex, 'hex'),
                    );

                    if (!priceMessage) {
                        return null;
                    }

                    const parsedMessage = OracleData.parsePriceMessage(priceMessage.message);
                    return parsedMessage;
                })
                .filter((price) => !!price)
                .reverse(),
        );
    };
}

module.exports = new OraclesService();
