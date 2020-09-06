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
    const initialOrderState = { maturity: '', highMultiplier: '', lowMultiplier: '' };

    const [asset, setAsset] = useState<string>();
    const [selectedOracle, setSelectedOracle] = useState(null);
    const [debug, setDebug] = useState(false);
    const [debugMessage, setDebugMessage] = useState('');
    const [orderState, setOrderState] = React.useState(initialOrderState);

    const { oracles } = useSelector((state: RootState) => state.oraclesState);

    const dispatch = useDispatch();

    const onSubmitOrderButtonClicked = () => {
        (bitcoincomLink as any).getAddress({ protocol: 'BCH' }).then(() =>
            (bitcoincomLink as any)
                .sendAssets({
                    to: 'bitcoincash:qrd9khmeg4nqag3h5gzu8vjt537pm7le85lcauzezc',
                    protocol: 'BCH',
                    value: '0.000123',
                })
                //   })payInvoice({
                //   //  url: 'http://1a4adcc7a8ec.ngrok.io/dev/api/rest/createPaymentRequest?amount=546',
                //   url: 'bitcoincash:?r=http://1a4adcc7a8ec.ngrok.io/dev/api/rest/createPaymentRequest?amount=546'
                //     })
                .then((data: any) => {
                    const { memo } = data;
                    setDebugMessage('foi');
                    setDebug(true);
                    console.log('Payment processed memo from merchant server: ' + memo);
                })
                .catch((e) => {
                    console.log('ERRORRR');
                    setDebugMessage(JSON.stringify(e));
                    setDebug(true);
                    console.log(e);
                }),
        );
    };

    const isDisabled = () =>
        !asset || !orderState.maturity || !orderState.highMultiplier || !orderState.lowMultiplier;

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
                    <IonCol size-sm="12" offsetLg="3" sizeLg="6">
                        <AssetChart oracle={selectedOracle} />
                    </IonCol>
                    <IonCol size="12" offsetLg="3" sizeLg="6">
                        <IonCard id="orderCard">
                            <IonCardHeader>
                                <IonCardTitle id="orderCardTitle">New Contract</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent id="orderCardContent">
                                <IonRow>
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
                                    <IonCol size="6">
                                        <IonText>
                                            <h2>Number of Blocks for Maturity</h2>
                                        </IonText>
                                        <IonInput
                                            onIonChange={(e) =>
                                                setOrderState((prev) => ({
                                                    ...prev,
                                                    maturity: e.detail.value!,
                                                }))
                                            }
                                            type="number"
                                            inputMode="numeric"
                                            value={orderState.maturity}
                                            min="0"
                                            placeholder="0"
                                            required
                                        />
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="6">
                                        <IonText>
                                            <h2>High Liquidation Price Multiplier (%)</h2>
                                        </IonText>
                                        <IonInput
                                            onIonChange={(e) =>
                                                setOrderState((prev) => ({
                                                    ...prev,
                                                    highMultiplier: e.detail.value!,
                                                }))
                                            }
                                            type="number"
                                            inputMode="numeric"
                                            value={orderState.highMultiplier}
                                            min="1"
                                            placeholder="1"
                                            required
                                        />
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonText>
                                            <h2>Low Liquidation Price Multiplier (%)</h2>
                                        </IonText>
                                        <IonInput
                                            onIonChange={(e) =>
                                                setOrderState((prev) => ({
                                                    ...prev,
                                                    lowMultiplier: e.detail.value!,
                                                }))
                                            }
                                            type="number"
                                            inputMode="numeric"
                                            value={orderState.lowMultiplier}
                                            min="1"
                                            max="99"
                                            placeholder="1"
                                            required
                                        />
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonButton
                                            id="submitOrder"
                                            disabled={isDisabled()}
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
