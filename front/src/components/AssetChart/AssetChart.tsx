import React, { useState, useEffect } from 'react';
import { IonCard } from '@ionic/react';
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Line } from 'recharts';

import Loading from '../Loading/Loading';

import { fetchChartData } from '../../Redux/Oracles';

import './AssetChart.css';

const AssetChart = ({ oracle }) => {
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

    useEffect(() => {
        if (oracle) {
            setLoading(true);
            fetchChartData(oracle.pubKey).then((data) => {
                setLoading(false);
                setChartData(data);
                const interval = setInterval(() => {
                    fetchChartData(oracle.pubKey).then((data) => {
                        setChartData(data);
                    });
                }, 60000);
                setIntervalId(interval);
            });
        }
    }, [oracle]);

    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    });

    return (
        <IonCard className="asset-chart__card">
            {loading || !chartData ? (
                <Loading />
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
