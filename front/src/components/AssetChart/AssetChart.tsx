import React, { useState, useEffect } from 'react';
import { IonCard, IonIcon } from '@ionic/react';
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Line } from 'recharts';
import { refresh } from 'ionicons/icons';

import { fetchChartData } from '../../Redux/Oracles';

import './AssetChart.css';

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

    return (
        <IonCard className="asset-chart__card">
            {loading || !chartData ? (
                <IonIcon className="icon-rotate" icon={refresh} size="large" />
            ) : (
                <LineChart
                    className="asset-chart__chart"
                    width={600}
                    height={300}
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestampFormatted" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" />
                </LineChart>
            )}
        </IonCard>
    );
};

export default AssetChart;
