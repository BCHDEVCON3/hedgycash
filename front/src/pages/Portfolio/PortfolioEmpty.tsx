import React, { useState } from 'react';
import {
    IonCard,
    IonCardContent,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    IonRow,
    IonInput,
    IonCol,
} from '@ionic/react';
import { addCircle, archive } from 'ionicons/icons';

import './Portfolio.css';

const PortfolioEmpty: React.FC = () => {
    const [text] = useState<string>();

    return (
        <IonRow>
            <IonCol>
                <IonCard>
                    <IonItem>
                        <IonIcon icon={addCircle} slot="start" />
                        <IonLabel>New Wallet</IonLabel>
                    </IonItem>
                    <IonCardContent>
                        <IonButton fill="outline">New Wallet</IonButton>
                    </IonCardContent>
                </IonCard>
            </IonCol>
            <IonCol>
                <IonCard>
                    <IonItem>
                        <IonIcon icon={archive} slot="start" />
                        <IonLabel>Import Wallet</IonLabel>
                    </IonItem>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel position="floating">mnemonic (seed phrase)</IonLabel>
                            <IonInput value={text}></IonInput>
                        </IonItem>
                        <IonButton fill="outline">Import</IonButton>
                    </IonCardContent>
                </IonCard>
            </IonCol>
        </IonRow>
    );
};

export default PortfolioEmpty;
