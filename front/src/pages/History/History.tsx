import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonCol,
    IonCard,
    IonCardHeader,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCardContent,
    IonRow,
    IonText,
    IonToast,
} from '@ionic/react';

import Loading from '../../components/Loading/Loading';

import { getAddressInit } from '../../Redux/Wallet';
import { RootState } from '../../store';

import './History.css';

const History: React.FC = () => {
    const loading = false;
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.walletState);

    useEffect(() => {
        dispatch(getAddressInit());
    }, [dispatch]);

    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonMenuButton color="success"></IonMenuButton>
                </IonButtons>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">History</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonRow>
                    {loading ? (
                        <Loading className="history__loading" />
                    ) : (
                        <IonCol size="3" size-lg="4" size-sm="6" size-xs="12">
                            <IonCard>
                                <IonCardHeader>
                                    <IonSegment color="success" value="long">
                                        <IonSegmentButton value="long">
                                            <IonLabel>Long</IonLabel>
                                        </IonSegmentButton>
                                    </IonSegment>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonRow>
                                        <IonCol size="6">
                                            <IonText>
                                                <h2>
                                                    <strong>BCH/USD</strong>
                                                </h2>
                                            </IonText>
                                            <IonText>
                                                <h2>1000</h2>
                                            </IonText>
                                        </IonCol>
                                        <IonCol size="6">
                                            <IonText>
                                                <h2>Matures in 3 blocks</h2>
                                            </IonText>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <h2>
                                                <strong>Liquidation</strong>
                                            </h2>
                                            <IonRow>
                                                <IonCol size="6">
                                                    <IonText>
                                                        <h2>High: 2x</h2>
                                                    </IonText>
                                                </IonCol>
                                                <IonCol size="6">
                                                    <IonText>
                                                        <h2>Low: 2x</h2>
                                                    </IonText>
                                                </IonCol>
                                            </IonRow>
                                        </IonCol>
                                    </IonRow>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    )}
                </IonRow>
            </IonContent>
            <IonToast
                id="portfolio-empty-toast"
                isOpen={error}
                color="danger"
                message="Badger Wallet not installed or configured!"
                duration={5000}
            />
        </IonPage>
    );
};

export default History;
