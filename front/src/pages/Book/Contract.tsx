import React, { useState } from 'react';
import {
    IonButton,
    IonCard,
    IonRow,
    IonCol,
    IonCardContent,
    IonText,
    IonCardHeader,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    
} from '@ionic/react';
import { ordersApi } from '../../utils/axios';
import bitcoincomLink from 'bitcoincom-link'
import './Contract.css';

interface ContractInterface {
    contract: any;
}

const Contract: React.FC<ContractInterface> = ({ contract }) => {
    const [strategy, setStrategy] = useState(contract.hedge.creator ? 'hedge' : 'long');
    
    const onSubmitOrder = () => {
        (bitcoincomLink as any).getAddress({ protocol: 'BCH' }).then(({ address }) => {
             (bitcoincomLink as any).sendAssets({
                                to: strategy === 'hedge' ? contract.long.address : contract.hedge.address,
                                protocol: 'BCH',
                                value: strategy === 'hedge' ? Number(contract.long.amount/10 ** 8).toFixed(8) : Number(contract.hedge.amount/10 ** 8).toFixed(8)
                            })
                            .then((data: any) => {
                                console.log(data)
                                ordersApi.post('/orders/confirmPayment', {
                                    address: strategy === 'hedge' ? contract.long.address : contract.hedge.address,
                                    id: contract.id
                                    
                                })
                                .then((response : any) => {
                                    console.log('Sent!', response);
                                 
                               
                            })
                        })
            
            })
            .catch(() => {
                // setPostError(true);
                // setToastMsg('Contract failed!');
            })
    };

    console.log(contract)
    return (
        <IonCard id="orderCard">
            <IonCardHeader>
                <IonSegment
                    color="success"
                    value={strategy}
                    onIonChange={(e) => setStrategy(e.detail.value!)}
                >
                </IonSegment>
            </IonCardHeader>
            <IonCardContent id="orderCardContent">
                <IonRow>
                    <IonCol size="6">
                        <IonText>
                            <h2>
                                <strong>{contract.description}</strong>
                            </h2>
                        </IonText>
                        <IonText>
                            <h2>{strategy === 'hedge' ? Number(contract.long.amount/10 ** 8).toFixed(8)  : Number(contract.hedge.amount/10 ** 8).toFixed(8) }</h2>
                        </IonText>
                    </IonCol>
                    <IonCol size="6">
                        <IonText>
                            <h2>Matures in {contract.maturity} blocks</h2>
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
                                    <h2>High: {contract.highMultiplier}x</h2>
                                </IonText>
                            </IonCol>
                            <IonCol size="6">
                                <IonText>
                                    <h2>Low: {contract.lowMultiplier}x</h2>
                                </IonText>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonButton onClick={onSubmitOrder} className="contract__button" color="success" expand="full">
                            {strategy === 'long' ? 'Hedge' : 'Long'}
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonCardContent>
        </IonCard>
    );
};

export default Contract;
