import { loop, Cmd } from 'redux-loop';
import { Actions } from './constants';
import { fetchOracles, fetchOraclesSuccess, fetchOraclesError } from './actions';

export const initialState = {
    oracles: [],
    loading: false,
    error: false,
};

export const oraclesReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case Actions.ORACLES_FETCH_INIT:
            return loop(
                { ...state, loading: true },
                Cmd.run(fetchOracles, {
                    successActionCreator: fetchOraclesSuccess,
                    failActionCreator: fetchOraclesError,
                }),
            );
        case Actions.ORACLES_FETCH_SUCCESS:
            return {
                ...state,
                oracles: action.oracles,
                loading: false,
                error: false,
            };
        case Actions.ORACLES_FETCH_ERROR:
            return { ...state, error: true, loading: false };
        default:
            return state;
    }
};
