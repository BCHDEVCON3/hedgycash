import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    IonCard,
    IonCardContent,
    IonItem,
    IonIcon,
    IonLabel,
    IonButton,
    IonRow,
    IonToast,
    IonCol,
} from '@ionic/react';
import { archive } from 'ionicons/icons';

import { RootState } from '../../store';

import { getAddressInit, setError } from '../../Redux/Wallet';

import './Portfolio.css';

const PortfolioEmpty: React.FC = () => {
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.walletState);

    return (
        <IonRow>
            <IonCol id="portfolioCol" offsetLg="3" sizeLg="6">
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
            <IonToast
                isOpen={error}
                onDidDismiss={() => dispatch(setError(false))}
                color="danger"
                message="Badger Wallet not installed or configured!"
                duration={5000}
            />
        </IonRow>
    );
};

export default PortfolioEmpty;
