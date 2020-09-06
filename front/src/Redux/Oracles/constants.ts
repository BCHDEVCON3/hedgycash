export const Actions = {
    ORACLES_FETCH_INIT: 'ORACLES_FETCH_INIT',
    ORACLES_FETCH_SUCCESS: 'ORACLES_FETCH_SUCCESS',
    ORACLES_FETCH_ERROR: 'ORACLES_FETCH_ERROR',
};

export interface Oracle {
    address: string;
    asset: string;
    pubKey: string;
}
