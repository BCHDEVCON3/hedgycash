import { Actions } from './constants';
import { ordersApi } from '../../utils/axios';
import { normalizeContracts } from './normalizers';

export const fetchContractsInit = () => ({
    type: Actions.CONTRACTS_FETCH_INIT,
});

export const fetchContracts = () =>
    ordersApi
        .get('/orders')
        .then((response) => response.data)
        .then(normalizeContracts);

export const fetchContractsSuccess = (contracts) => ({
    type: Actions.CONTRACTS_FETCH_SUCCESS,
    contracts,
});

export const fetchContractsError = () => ({
    type: Actions.CONTRACTS_FETCH_ERROR,
});
