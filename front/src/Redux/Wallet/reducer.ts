import { loop, Cmd } from 'redux-loop';
import { Actions } from './constants';
import { getAddress, getAddressSuccess, getAddressError } from './actions';

export const initialState = {
    address: '',
    mnemonic: '',
    loading: false,
    error: false,
};

export const walletReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case Actions.ADDRESS_GET_INIT:
            return loop(
                { ...state, loading: true },
                Cmd.run(getAddress, {
                    successActionCreator: getAddressSuccess,
                    failActionCreator: getAddressError,
                }),
            );
        case Actions.ADDRESS_GET_SUCCESS:
            return {
                ...state,
                address: action.address,
                loading: false,
                error: false,
            };
        case Actions.ADDRESS_GET_ERROR:
            return { ...state, error: true, loading: false };
        case Actions.SET_ADDRESS:
            return {
                ...state,
                address: action.address,
            };
        default:
            return state;
    }
};
