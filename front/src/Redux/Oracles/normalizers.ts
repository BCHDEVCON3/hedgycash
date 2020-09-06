import moment from 'moment';
import { Oracle } from './constants';

export const normalizeOracles = (oracles): [Oracle] =>
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

export const normalizeChartData = (chartData) =>
    chartData &&
    chartData.map &&
    chartData.map((point) => ({
        price: point.price, // Comes in asset description
        timestamp: point.timestamp,
        timestampFormatted: moment.unix(point.timestamp).format('DD/MM/YYYY hh:mm'),
    }));
