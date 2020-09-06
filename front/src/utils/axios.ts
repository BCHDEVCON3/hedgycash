import axios from 'axios';

// export const ORDERS_API = 'https://uyfx577r6j.execute-api.us-east-1.amazonaws.com/dev/api/rest';
// export const ORACLES_API = 'https://uzs2lnqnqe.execute-api.us-east-1.amazonaws.com/dev/api/rest';

export const ORDERS_API = 'http://ba7182c1b606.ngrok.io/dev/api/rest';
export const ORACLES_API = 'https://uzs2lnqnqe.execute-api.us-east-1.amazonaws.com/dev/api/rest';

export const oraclesApi = axios.create({
    baseURL: ORACLES_API,
});

export const ordersApi = axios.create({
    baseURL: ORDERS_API,
});
