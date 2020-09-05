import React, { useState } from 'react';
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
    IonButtons,
    IonMenuButton,
} from '@ionic/react';

import './Order.css';

const Order: React.FC = () => {
    const [orderType, setOrderType] = useState<string>('Hedge');
    const [asset, setAsset] = useState<string>('USD');
    const [bchValue, setBCHValue] = useState<number>();
    const [assetValue, setAssetValue] = useState<number>();

    const onBCHInputChanged = (e: CustomEvent) => {
        setBCHValue(e.detail.value);
    };

    const onAssetInputChanged = (e: CustomEvent) => {
        setAssetValue(e.detail.value);
    };

    const onSubmitOrderButtonClicked = () => {
        console.log(orderType);
        console.log(bchValue);
        console.log(assetValue);
        console.log(asset);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                    <IonTitle>Order</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonRow>
                    <IonCol
                        offsetLg="3"
                        sizeLg="6"
                        offsetMd="2"
                        sizeMd="8"
                        offsetSm="1"
                        sizeSm="10"
                    >
                        <IonCard id="orderCard">
                            <IonCardHeader>
                                <IonCardTitle id="orderCardTitle">Choose your Order</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent id="orderCardContent">
                                <IonRow>
                                    <IonCol size="6">
                                        <IonText>
                                            <h2>{orderType} in BCH:</h2>
                                        </IonText>
                                        <IonInput
                                            onIonChange={onBCHInputChanged}
                                            type="number"
                                            inputMode="decimal"
                                            placeholder="0.0"
                                        />
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonText>
                                            <h2>Select Order Type:</h2>
                                        </IonText>
                                        <IonSelect
                                            interface="popover"
                                            value={orderType}
                                            onIonChange={(e) => setOrderType(e.detail.value)}
                                        >
                                            <IonSelectOption value="Hedge">Hedge</IonSelectOption>
                                            <IonSelectOption value="Short">Short</IonSelectOption>
                                        </IonSelect>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="6">
                                        <IonText>
                                            <h2>Value in {asset}:</h2>
                                        </IonText>
                                        <IonInput
                                            onIonChange={onAssetInputChanged}
                                            type="number"
                                            inputMode="decimal"
                                            placeholder="0.0"
                                        />
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonText>
                                            <h2>Select Asset:</h2>
                                        </IonText>
                                        <IonSelect
                                            interface="popover"
                                            value={asset}
                                            onIonChange={(e) => setAsset(e.detail.value)}
                                        >
                                            <IonSelectOption value="USD">USD</IonSelectOption>
                                            <IonSelectOption value="ETH">ETH</IonSelectOption>
                                            <IonSelectOption value="BTC">BTC</IonSelectOption>
                                        </IonSelect>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonButton
                                            id="submitOrder"
                                            expand="full"
                                            onClick={onSubmitOrderButtonClicked}
                                        >
                                            Submit Order
                                        </IonButton>
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
