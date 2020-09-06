const BITBOX = require('bitbox-sdk').BITBOX;

const bitbox = new BITBOX();

module.exports = async function (hedge, long, contractData) {
    const hedgeKeyPair = bitbox.ECPair.fromWIF(hedge.wif);
    const hedgeAddress = bitbox.ECPair.toCashAddress(hedgeKeyPair);

    const longKeyPair = bitbox.ECPair.fromWIF(long.wif);
    const longAddress = bitbox.ECPair.toCashAddress(longKeyPair);

    // Fetch the current details for the hedge and long wallets.
    const hedgeAccount = await bitbox.Address.details(hedgeAddress);
    const longAccount = await bitbox.Address.details(longAddress);

    // Sum up the available balance for the hedge and long wallets.
    const hedgeBalance = hedgeAccount.balanceSat + hedgeAccount.unconfirmedBalanceSat;
    const longBalance = longAccount.balanceSat + longAccount.unconfirmedBalanceSat;

    // Calculate the exact amounts that hedge and long will need to cover the funding transaction
    // and the exact amounts that actually go into the contract.
    // Assume that 750 satoshis is enough to cover the mining fee for each side of the funding transaction itself.
    // Assume that long covers the required miner cost and dust safety cost.
    const hedgeContractAmount = contractData.metadata.hedgeInputSats;
    const longContractAmount =
        contractData.metadata.longInputSats +
        contractData.metadata.minerCost +
        contractData.metadata.dustCost;
    const hedgeFee = 950;
    const longFee = 950;
    const hedgeSendAmount = hedgeContractAmount + hedgeFee;
    const longSendAmount = longContractAmount + longFee;

    // Verify that the hedge has enough funds to enter the contract.
    if (hedgeBalance < hedgeSendAmount || longBalance < longSendAmount) {
        throw new Error(
            `Hedge (${hedgeAddress}) has ${hedgeBalance} sats and requires at least ${hedgeSendAmount} sats. Long (${longAddress}) has ${longBalance} sats and requires at least ${longSendAmount} sats.`,
        );
    }

    // Create a transaction builder.
    const fundingTransactionBuilder = new bitbox.TransactionBuilder('mainnet');

    // Calculate return amounts
    const hedgeReturnAmount = hedgeBalance - hedgeSendAmount;
    const longReturnAmount = longBalance - longSendAmount;

    // Set the target amount to be sent to the contract, and the remainder to be sent back to the wallets.
    // NOTE: Change address is the same address as we will be sending from.
    fundingTransactionBuilder.addOutput(
        contractData.contract.address,
        hedgeContractAmount + longContractAmount,
    );
    fundingTransactionBuilder.addOutput(hedgeAddress, hedgeReturnAmount);
    fundingTransactionBuilder.addOutput(longAddress, longReturnAmount);

    // Get a list of all inputs for for the hedge and long addresses.
    const hedgeOutputs = await bitbox.Address.utxo(hedgeAddress);
    const longOutputs = await bitbox.Address.utxo(longAddress);

    // For each UTXO in the hedge wallet..
    for (const utxoIndex in hedgeOutputs.utxos) {
        // Add this input to the hedge transaction.
        fundingTransactionBuilder.addInput(
            hedgeOutputs.utxos[utxoIndex].txid,
            hedgeOutputs.utxos[utxoIndex].vout,
        );
    }

    // For each UTXO in the long wallet..
    for (const utxoIndex in longOutputs.utxos) {
        // Add this input to the long transaction.
        fundingTransactionBuilder.addInput(
            longOutputs.utxos[utxoIndex].txid,
            longOutputs.utxos[utxoIndex].vout,
        );
    }

    // For each UTXO in the hedge wallet..
    for (const utxoIndex in hedgeOutputs.utxos) {
        // Create an empty variable to hold a redeemScript Buffer.
        // ... then lets never assign it a value and assume that sane defaults will be used.
        let redeemScript;

        // Calculate the transactions output index.
        const index = Number(utxoIndex);

        // Sign this input to allow us to spend it.
        fundingTransactionBuilder.sign(
            index,
            hedgeKeyPair,
            redeemScript,
            fundingTransactionBuilder.hashTypes.SIGHASH_ALL,
            hedgeOutputs.utxos[utxoIndex].satoshis,
            fundingTransactionBuilder.signatureAlgorithms.SCHNORR,
        );
    }

    // For each UTXO in the long wallet..
    for (const utxoIndex in longOutputs.utxos) {
        // Create an empty variable to hold a redeemScript Buffer.
        // ... then lets never assign it a value and assume that sane defaults will be used.
        let redeemScript;

        // Calculate the transactions output index.
        const index = Number(hedgeOutputs.utxos.length) + Number(utxoIndex);

        // Sign this input to allow us to spend it.
        fundingTransactionBuilder.sign(
            index,
            longKeyPair,
            redeemScript,
            fundingTransactionBuilder.hashTypes.SIGHASH_ALL,
            longOutputs.utxos[utxoIndex].satoshis,
            fundingTransactionBuilder.signatureAlgorithms.SCHNORR,
        );
    }

    // Build the funding transaction.
    const fundingTransaction = fundingTransactionBuilder.build();

    return fundingTransaction;
};
