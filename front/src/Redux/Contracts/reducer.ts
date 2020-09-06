import { loop, Cmd } from 'redux-loop';
import { Actions } from './constants';
import { fetchContracts, fetchContractsSuccess, fetchContractsError } from './actions';

export const initialState = {
    contracts: [],
    loading: false,
    error: false,
};

export const contractsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case Actions.CONTRACTS_FETCH_INIT:
            return loop(
                { ...state, loading: true },
                Cmd.run(fetchContracts, {
                    successActionCreator: fetchContractsSuccess,
                    failActionCreator: fetchContractsError,
                }),
            );
        case Actions.CONTRACTS_FETCH_SUCCESS:
            return {
                ...state,
                contracts: action.contracts,
                loading: false,
                error: false,
            };
        case Actions.CONTRACTS_FETCH_ERROR:
            return { ...state, error: true, loading: false };
        default:
            return state;
    }
};
