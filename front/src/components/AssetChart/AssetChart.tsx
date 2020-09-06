import React, { useState, useEffect } from 'react';

import { fetchChartData } from '../../Redux/Oracles';

const AssetChart = ({ oracle }) => {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(false);

    useEffect(() => {
        if (oracle) {
            setLoading(true);
            fetchChartData(oracle.pubKey).then((data) => {
                setLoading(false);
                setChartData(data);
            });
        }
    }, [oracle]);

    return <div>{loading ? 'Loading...' : 'Chart'}</div>;
};

export default AssetChart;
