import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import PortfolioEmpty from './PortfolioEmpty';

const Portfolio: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Portfolio</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <PortfolioEmpty />
            </IonContent>
        </IonPage>
    );
};

export default Portfolio;
