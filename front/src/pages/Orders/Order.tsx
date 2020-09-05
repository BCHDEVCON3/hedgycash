import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCol,
    IonRow,
    IonButton,
    IonCardContent,
    IonInput,
    IonCardTitle,
    IonSelect,
    IonText,
    IonSelectOption,
    IonCardHeader,
} from '@ionic/react';

import './Order.css';

const Order: React.FC = () => {

    const [defaultOrderType] = useState("Hedge");
    const [orderType, setOrderType] = useState<string>();
    const [defaultAsset] = useState("USD");
    const [asset, setAsset] = useState<string>();
    const [bchValue, setBCHValue] = useState<number>();
    const [assetValue, setAssetValue] = useState<number>();

    const onBCHInputChanged = (e : CustomEvent) => {
        setBCHValue(e.detail.value)
    };

    const onAssetInputChanged = (e : CustomEvent) => {
        setAssetValue(e.detail.value)
    };

    const oSubmitOrderButtonClicked = () => {
        console.log(orderType)
        console.log(bchValue)
        console.log(assetValue)
        console.log(asset)
    };

    useEffect(() => {
        setOrderType(defaultOrderType)
        setAsset(defaultAsset)
    }, [defaultAsset, defaultOrderType])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Order</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonRow>
                    <IonCol offset="4" size="4">
                        <IonCard id="orderCard">
                            <IonCardHeader>
                                <IonCardTitle id="orderCardTitle">Choose your Order</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent id="orderCardContent">
                                <IonRow>
                                    <IonCol size="6">
                                        <IonText><h2>{orderType} in BCH:</h2></IonText>
                                        <IonInput onIonChange={onBCHInputChanged} id="bleblelbleb" type="number" inputMode="decimal" placeholder="0.0" />
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonText><h2>Select Order Type:</h2></IonText>
                                        <IonSelect interface="popover" value={orderType} onIonChange={e => setOrderType(e.detail.value)}>
                                            <IonSelectOption value="Hedge">Hedge</IonSelectOption>
                                            <IonSelectOption value="Short">Short</IonSelectOption>
                                        </IonSelect>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="6">
                                        <IonText><h2>Value in {asset}:</h2></IonText>
                                        <IonInput onIonChange={onAssetInputChanged} type="number" inputMode="decimal" placeholder="0.0" />
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonText><h2>Select Asset:</h2></IonText>
                                        <IonSelect interface="popover" value={asset} onIonChange={e => setAsset(e.detail.value)}>
                                            <IonSelectOption value="USD">USD</IonSelectOption>
                                            <IonSelectOption value="ETH">ETH</IonSelectOption>
                                            <IonSelectOption value="BTC">BTC</IonSelectOption>
                                        </IonSelect>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonButton id="submitOrder" expand="full" onClick={oSubmitOrderButtonClicked}>Submit Order</IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default Order;