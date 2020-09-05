import React from 'react';
import { useDispatch } from 'react-redux';
import {
    IonCard,
    IonCardContent,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    IonRow,
    IonCol,
} from '@ionic/react';
import { archive } from 'ionicons/icons';

import { getAddressInit } from '../../Redux/Wallet';

import './Portfolio.css';

const PortfolioEmpty: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <IonRow>
            <IonCol offset="3" size="6">
                <IonCard>
                    <IonItem>
                        <IonIcon icon={archive} slot="start" />
                        <IonLabel>Import Wallet</IonLabel>
                    </IonItem>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel>Badger Wallet</IonLabel>
                            <IonButton fill="outline" onClick={() => dispatch(getAddressInit())}>
                                Import
                            </IonButton>
                        </IonItem>
                    </IonCardContent>
                </IonCard>
            </IonCol>
        </IonRow>
    );
};

export default PortfolioEmpty;
