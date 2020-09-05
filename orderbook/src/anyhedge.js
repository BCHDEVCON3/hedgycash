// Custodial example of establishing the parameters for an AnyHedge contract and funding it.
// The contract will redeem through the default redemption service.
// After making settings, you can run the sample one time to get the required funding details for hedge and long.
// After funding the addresses, you can run again for the example to create an actual contract.

// Set how many US cents that Hedge would like to protect against price volatility.
const CONTRACT_UNITS = 500;

// There are 3 important timing settings.
// The example code sets the contract start block to the current block for you.
// The earliest liquidation modifier sets the earliest point after start block that a contract can be liquidated. Typically zero.
// The maturity modifier sets the exact point after start block that a contract can be matured.
const CONTRACT_EARLIEST_LIQUIDATION_MODIFIER = 0;
const CONTRACT_MATURITY_MODIFIER = 1;

// Set the multipliers for how much the price can change before the contract is liquidated.
// For example assuming the price today is $300 then:
//   if low multiplier = 0.75, the low liquidation price will be $300 * 0.75 = $225.
//   if high multiplier = 10, the high liquidation price will be $300 * 10 = $3,000.
const CONTRACT_LOW_LIQUIDATION_PRICE_MULTIPLIER = 0.75;
const CONTRACT_HIGH_LIQUIDATION_PRICE_MULTIPLIER = 10.00;

// The contract requires addresses for payout and public keys for validating mutual redemptions.
// Set these values to compressed WIF keys that you control and the example will use it for the public key and address.
// You can get WIF keys with a standard Electron Cash wallet.
// For safety it is recommended to create a new wallet or use a testing wallet for this:
//   1. Go to the Addresses tab
//   2. Choose any address and take note of it so you can watch later for the automatic redemption to appear.
//   2. Right click the address --> Private Key
//   3. Copy the private key in the top box.
const HEDGE_WIF = '';
const LONG_WIF = '';

// Set the oracle public key to one that you know is operational and available. This is the beta oracle.
const ORACLE_PUBLIC_KEY = '0273ee49099f0a09be514cbb45756bf49ad256d0a6de993107e98c89c16b6fa84e';

// Load the AnyHedge library.
const AnyHedgeLibrary = require('../dist/lib/anyhedge.js');

// Create an instance of the contract manager.
const anyHedgeManager = new AnyHedgeLibrary();

// Load the BitBox bitcoin cash library
const bitboxSDK = require('bitbox-sdk');

// Initialize the bitbox SDK.
const bitbox = new bitboxSDK.BITBOX();

// Add support for fetching data.
const fetch = require('node-fetch');

// Wrap the example code in an async function to allow async/await.
const example = async function()
{
	// Collect all the parameters that we need to create a contract
	const [contractStartPrice, contractStartHeight] = await getStartConditions();
	const [hedgeKeyPair, hedgePublicKey, hedgeAddress] = await parseWIF(HEDGE_WIF);
	const [longKeyPair, longPublicKey, longAddress] = await parseWIF(LONG_WIF);
	const oraclePublicKey = Buffer.from(ORACLE_PUBLIC_KEY, 'hex');

	// Load the default anyhedge contract.
	await anyHedgeManager.load();

	// Register a contract for automatic redemption.
	const contractParameters = [
		oraclePublicKey, hedgePublicKey, longPublicKey,
		CONTRACT_UNITS, contractStartPrice,
		contractStartHeight, CONTRACT_EARLIEST_LIQUIDATION_MODIFIER, CONTRACT_MATURITY_MODIFIER,
		CONTRACT_HIGH_LIQUIDATION_PRICE_MULTIPLIER, CONTRACT_LOW_LIQUIDATION_PRICE_MULTIPLIER,
	];
	const contractData = await anyHedgeManager.register(...contractParameters);

	// Validate the contract received to confirm it has not been tampered with.
	const isValid = await anyHedgeManager.validate(contractData.contract.address, ...contractParameters);
	if(!isValid)
	{
		// Abort if the backend provided an invalid contract.
		throw(new Error('The contract provided from the backend is not identical to the contract created on the front end.'));
	}

	// Log the contract address for easier debugging.
	console.log(`Registered '${contractData.contract.address}' for automated settlement after funding is complete.`);

	// Fund the contract
	const fundingTransaction = await fundContract(hedgeKeyPair, hedgeAddress, longKeyPair, longAddress, contractData);

	// Output the raw hex-encoded funding transaction to the console.
	console.log(`Funding transaction: ${fundingTransaction.toHex()}`);

	// Log the next steps.
	console.log(`Wait for ${CONTRACT_MATURITY_MODIFIER} block(s) and the redemption service should mature your contract, paying out to hedge (${hedgeAddress}) and long (${longAddress}).`)
};

const getStartConditions = async function(){
	// Fetch the current price in US dollars.
	const bitpayResponse = await fetch('https://bitpay.com/api/rates/BCH/USD');
	const bitpayData = await bitpayResponse.json();

	// Set the starting price of the contract in US cents.
	const contractStartPrice = Number(bitpayData.rate * 100);

	// Set the starting contract height to the current blockheight.
	const contractStartHeight = await bitbox.Blockchain.getBlockCount();

	return [contractStartPrice, contractStartHeight];
}

const parseWIF = async function(wif){
	// Derive the keypair, public key and address from the WIF
	const keyPair = bitbox.ECPair.fromWIF(wif);
	const publicKey = bitbox.ECPair.toPublicKey(keyPair);
	const address = bitbox.ECPair.toCashAddress(keyPair);

	return [keyPair, publicKey, address];
}

const fundContract = async function(hedgeKeyPair, hedgeAddress, longKeyPair, longAddress, contractData){
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
	const longContractAmount = contractData.metadata.longInputSats + contractData.metadata.minerCost + contractData.metadata.dustCost;
	const hedgeFee = 750;
	const longFee = 750;
	const hedgeSendAmount = hedgeContractAmount + hedgeFee;
	const longSendAmount = longContractAmount + longFee;

	// Verify that the hedge has enough funds to enter the contract.
	if((hedgeBalance < hedgeSendAmount) || (longBalance < longSendAmount))
	{
		throw(new Error(`Hedge (${hedgeAddress}) has ${hedgeBalance} sats and requires at least ${hedgeSendAmount} sats. Long (${longAddress}) has ${longBalance} sats and requires at least ${longSendAmount} sats.`));
	}

	// Create a transaction builder.
	const fundingTransactionBuilder = new bitbox.TransactionBuilder('mainnet');

	// Calculate return amounts
	const hedgeReturnAmount = hedgeBalance - hedgeSendAmount;
	const longReturnAmount = longBalance - longSendAmount;

	// Set the target amount to be sent to the contract, and the remainder to be sent back to the wallets.
	// NOTE: Change address is the same address as we will be sending from.
	fundingTransactionBuilder.addOutput(contractData.contract.address, (hedgeContractAmount + longContractAmount));
	fundingTransactionBuilder.addOutput(hedgeAddress, hedgeReturnAmount);
	fundingTransactionBuilder.addOutput(longAddress, longReturnAmount);

	// Get a list of all inputs for for the hedge and long addresses.
	const hedgeOutputs = await bitbox.Address.utxo(hedgeAddress);
	const longOutputs = await bitbox.Address.utxo(longAddress);

	// For each UTXO in the hedge wallet..
	for(const utxoIndex in hedgeOutputs.utxos)
	{
		// Add this input to the hedge transaction.
		fundingTransactionBuilder.addInput(hedgeOutputs.utxos[utxoIndex].txid, hedgeOutputs.utxos[utxoIndex].vout);
	}

	// For each UTXO in the long wallet..
	for(const utxoIndex in longOutputs.utxos)
	{
		// Add this input to the long transaction.
		fundingTransactionBuilder.addInput(longOutputs.utxos[utxoIndex].txid, longOutputs.utxos[utxoIndex].vout);
	}

	// For each UTXO in the hedge wallet..
	for(const utxoIndex in hedgeOutputs.utxos)
	{
		// Create an empty variable to hold a redeemScript Buffer.
		// ... then lets never assign it a value and assume that sane defaults will be used.
		let redeemScript;

		// Calculate the transactions output index.
		const index = Number(utxoIndex);

		// Sign this input to allow us to spend it.
		fundingTransactionBuilder.sign(index, hedgeKeyPair, redeemScript, fundingTransactionBuilder.hashTypes.SIGHASH_ALL, hedgeOutputs.utxos[utxoIndex].satoshis, fundingTransactionBuilder.signatureAlgorithms.SCHNORR);
	}

	// For each UTXO in the long wallet..
	for(const utxoIndex in longOutputs.utxos)
	{
		// Create an empty variable to hold a redeemScript Buffer.
		// ... then lets never assign it a value and assume that sane defaults will be used.
		let redeemScript;

		// Calculate the transactions output index.
		const index = Number(hedgeOutputs.utxos.length) + Number(utxoIndex);

		// Sign this input to allow us to spend it.
		fundingTransactionBuilder.sign(index, longKeyPair, redeemScript, fundingTransactionBuilder.hashTypes.SIGHASH_ALL, longOutputs.utxos[utxoIndex].satoshis, fundingTransactionBuilder.signatureAlgorithms.SCHNORR);
	}

	// Build the funding transaction.
	const fundingTransaction = fundingTransactionBuilder.build();

	return fundingTransaction;
}

// Run the example code.
example();
