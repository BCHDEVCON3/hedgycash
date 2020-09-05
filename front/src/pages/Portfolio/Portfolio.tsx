import React from 'react';
import { useSelector } from 'react-redux';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonMenuButton, IonButtons } from '@ionic/react';

import { RootState } from '../../store';

import PortfolioEmpty from './PortfolioEmpty';
import PortfolioDetails from './PortfolioDetails';

const Portfolio: React.FC = () => {
    const { address } = useSelector((state: RootState) => state.walletState);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                    <IonTitle>Portfolio</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {address ? <PortfolioDetails address={address} /> : <PortfolioEmpty />}
            </IonContent>
        </IonPage>
    );
};

export default Portfolio;
