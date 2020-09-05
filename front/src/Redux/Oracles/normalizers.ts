export const normalizeOracles = (oracles) =>
    oracles &&
    oracles.map &&
    oracles.map((oracle) => {
        const assetRegex = /(\/)(\w+)/gi;
        const asset = assetRegex.exec(oracle.description)![2];
        return {
            address: oracle.address,
            asset,
            pubKey: oracle.pubKey,
        };
    });
