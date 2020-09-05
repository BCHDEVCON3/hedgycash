import { Actions } from './constants';
import bitcoincomLink from 'bitcoincom-link';

export const getAddressInit = () => ({
    type: Actions.ADDRESS_GET_INIT,
});

export const getAddress = () => {
    const params = { protocol: 'BCH' };

    return (bitcoincomLink as any).getAddress(params).then((response: any) => response.address);
};

export const getAddressSuccess = (address: string) => ({
    type: Actions.ADDRESS_GET_SUCCESS,
    address,
});

export const getAddressError = () => ({
    type: Actions.ADDRESS_GET_ERROR,
});

export const setWallet = (address: string) => ({
    type: Actions.SET_ADDRESS,
    address,
});

export const setError = (error: boolean) => ({
    type: Actions.SET_ERROR,
    error,
});
