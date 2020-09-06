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
    IonButtons,
    IonMenuButton,
} from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import AssetChart from '../../components/AssetChart/AssetChart';

import { fetchOraclesInit } from '../../Redux/Oracles';
import { RootState } from '../../store';

import './Order.css';

const Order: React.FC = () => {
    const [orderType, setOrderType] = useState<string>('Hedge');
    const [asset, setAsset] = useState<string>();
    const [bchValue, setBCHValue] = useState<number>();
    const [assetValue, setAssetValue] = useState<number>();
    const [selectedOracle, setSelectedOracle] = useState(null);

    const { oracles } = useSelector((state: RootState) => state.oraclesState);

    const dispatch = useDispatch();

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

    useEffect(() => {
        dispatch(fetchOraclesInit());
    }, [dispatch]);

    useEffect(() => {
        if (oracles && oracles.length) {
            setAsset(oracles[0].asset);
            setSelectedOracle(oracles[0]);
        }
    }, [oracles]);

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
                                            onIonChange={(e) => {
                                                oracles.forEach((oracle) => {
                                                    if (oracle.asset === e.detail.value) {
                                                        setAsset(oracle.asset);
                                                        setSelectedOracle(oracle);
                                                    }
                                                });
                                            }}
                                        >
                                            {oracles.map((oracle) => (
                                                <IonSelectOption
                                                    key={oracle.pubKey}
                                                    value={oracle.asset}
                                                >
                                                    {oracle.asset}
                                                </IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonButton
                                            id="submitOrder"
                                            color="success"
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
                <IonRow>
                    <IonCol>
                        <AssetChart oracle={selectedOracle} />
                    </IonCol>
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default Order;
