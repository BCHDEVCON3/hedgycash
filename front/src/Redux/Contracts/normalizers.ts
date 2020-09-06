export const normalizeContracts = (contracts) =>
    contracts &&
    contracts.map &&
    contracts.map((contract) => ({
        highMultiplier: contract.highLiquidationPriceMultiplier,
        lowMultiplier: contract.lowLiquidationPriceMultiplier,
        hedge: contract.hedge,
        long: contract.long,
        maturity: contract.maturityModifier,
        oraclePubKey: contract.oraclePubKey,
        description: contract.description,
        state: contract.state,
    }));
