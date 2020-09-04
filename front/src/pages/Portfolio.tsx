import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Portfolio: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Portfolio</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Portfolio</IonTitle>
                    </IonToolbar>
                </IonHeader>
            </IonContent>
        </IonPage>
    );
};

export default Portfolio;
