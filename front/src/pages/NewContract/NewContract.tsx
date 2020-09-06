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
    IonSegment,
    IonSegmentButton,
    IonLabel,
} from '@ionic/react';
import { useDispatch, useSelector } from 'react-redux';

import AssetChart from '../../components/AssetChart/AssetChart';

import { fetchOraclesInit, Oracle } from '../../Redux/Oracles';
import { RootState } from '../../store';
// import bitcoincomLink from 'bitcoincom-link';
import { ordersApi } from '../../utils/axios';
import bitcoincomLink from 'bitcoincom-link'

import './NewContract.css';

const NewContract: React.FC = () => {
    const initialOrderState = {
        maturity: '',
        highMultiplier: '',
        lowMultiplier: '',
        contractUnits: '',
        strategy: 'long',
    };
    const oracleState = { address: '', asset: '', pubKey: '' };

    const [asset, setAsset] = useState<string>();
    const [selectedOracle, setSelectedOracle] = useState<Oracle>(oracleState);
    const [postError, setPostError] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [orderState, setOrderState] = React.useState(initialOrderState);

    const { oracles } = useSelector((state: RootState) => state.oraclesState);

    const dispatch = useDispatch();

    const onSubmitOrder = () => {
        (bitcoincomLink as any).getAddress({ protocol: 'BCH' }).then(({ address }) => {
        ordersApi
            .post('/orders', {
                oraclePubKey: '0273ee49099f0a09be514cbb45756bf49ad256d0a6de993107e98c89c16b6fa84e',
                maturityModifier: Number(orderState.maturity),
                highLiquidationPriceMultiplier: Number(orderState.highMultiplier),
                lowLiquidationPriceMultiplier: Number(orderState.lowMultiplier),
                contractUnits: Number(orderState.contractUnits),
                isHedge: orderState.strategy === 'hedge',
                address
                
            })
            .then((response : any) => {
                console.log('response fsss', response);
                (bitcoincomLink as any).sendAssets({
                                to: orderState.strategy === 'hedge' ? response.data.hedge.address : response.data.long.address,
                                protocol: 'BCH',
                                value: orderState.strategy === 'hedge' ? Number(response.data.hedge.amount/10 ** 8).toFixed(8) : Number(response.data.long.amount/10 ** 8).toFixed(8)
                            })
                            .then((data: any) => {
                                console.log(data)
                                setPostError(false);
                                setToastMsg('Contract created!');
                                setOrderState(initialOrderState);
                               
                            })
            
            })
            .catch(() => {
                setPostError(true);
                setToastMsg('Contract failed!');
            })
        })
    };

    const isDisabled = () =>
        !asset ||
        !orderState.maturity ||
        !orderState.highMultiplier ||
        !orderState.lowMultiplier ||
        !orderState.contractUnits;

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
                            <IonCardContent>
                                <IonRow id="orderCardContentSegment">
                                    <IonCol size="12">
                                        <IonSegment
                                            color="success"
                                            value={orderState.strategy}
                                            onIonChange={(e) =>
                                                setOrderState((prev) => ({
                                                    ...prev,
                                                    strategy: e.detail.value!,
                                                }))
                                            }
                                        >
                                            <IonSegmentButton value="long">
                                                <IonLabel>Long</IonLabel>
                                            </IonSegmentButton>
                                            <IonSegmentButton value="hedge">
                                                <IonLabel>Hedge</IonLabel>
                                            </IonSegmentButton>
                                        </IonSegment>
                                    </IonCol>
                                </IonRow>
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
                                            <h2>High Liquidation Price Multiplier</h2>
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
                                            min="2"
                                            max="10"
                                            placeholder="2"
                                            required
                                        />
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonText>
                                            <h2>Low Liquidation Price Multiplier</h2>
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
                                            max="5"
                                            placeholder="1"
                                            required
                                        />
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol size="6">
                                        <IonText>
                                            <h2>Contract Units</h2>
                                        </IonText>
                                        <IonInput
                                            onIonChange={(e) =>
                                                setOrderState((prev) => ({
                                                    ...prev,
                                                    contractUnits: e.detail.value!,
                                                }))
                                            }
                                            type="number"
                                            inputMode="numeric"
                                            value={orderState.contractUnits}
                                            min="1"
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
                                            onClick={onSubmitOrder}
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
                isOpen={!!toastMsg}
                onDidDismiss={() => setToastMsg('')}
                color={postError ? 'danger' : 'light'}
                message={toastMsg}
                duration={3000}
            />
        </IonPage>
    );
};

export default NewContract;
