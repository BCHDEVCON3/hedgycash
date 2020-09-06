import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
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
    IonToast,
} from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import AssetChart from '../../components/AssetChart/AssetChart';

import { fetchOraclesInit } from '../../Redux/Oracles';
import { RootState } from '../../store';
import bitcoincomLink from 'bitcoincom-link';

import './NewContract.css';

const NewContract: React.FC = () => {
    const [orderType, setOrderType] = useState<string>('Hedge');
    const [asset, setAsset] = useState<string>();
    const [bchValue, setBCHValue] = useState<number>();
    const [assetValue, setAssetValue] = useState<number>();
    const [selectedOracle, setSelectedOracle] = useState(null);
    const [debug, setDebug] = useState(false)
    const [debugMessage, setDebugMessage] = useState('')
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
  
        (bitcoincomLink as any).getAddress({ protocol: 'BCH' }).then(() => (bitcoincomLink as any).sendAssets({
            to: 'bitcoincash:qrd9khmeg4nqag3h5gzu8vjt537pm7le85lcauzezc',
            protocol: 'BCH',
            value: '0.000123', })
        //   })payInvoice({
        //   //  url: 'http://1a4adcc7a8ec.ngrok.io/dev/api/rest/createPaymentRequest?amount=546',
        //   url: 'bitcoincash:?r=http://1a4adcc7a8ec.ngrok.io/dev/api/rest/createPaymentRequest?amount=546'
        //     })
            .then((data: any) => {
            const {
                memo,
            } = data;
            setDebugMessage('foi')
            setDebug(true)
            console.log('Payment processed memo from merchant server: ' + memo);
            })
            .catch(( e ) => {
                console.log('ERRORRR')
                setDebugMessage(JSON.stringify(e))
                setDebug(true)
               console.log(e)
            }))

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
                <IonButtons>
                    <IonMenuButton color="success"></IonMenuButton>
                </IonButtons>
            </IonHeader>
            <IonContent fullscreen>
                <IonRow>
                    <IonCol
                        size-sm="12"
                        offsetLg="3"
                        sizeLg="6"
                    >
                        <AssetChart oracle={selectedOracle} />
                    </IonCol>
                    <IonCol
                         size="12"
                         offsetLg="3"
                         sizeLg="6"
                    >
                        <IonCard id="orderCard">
                            <IonCardHeader>
                                <IonCardTitle id="orderCardTitle">New Contract</IonCardTitle>
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
                                            Submit New Contract
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
               
            </IonContent>
            <IonToast
                id=""
                isOpen={debug}
                onDidDismiss={() => setDebug(false)}
                color="light"
                message={debugMessage}
                duration={2000}
            />
        </IonPage>
    );
};

export default NewContract;
