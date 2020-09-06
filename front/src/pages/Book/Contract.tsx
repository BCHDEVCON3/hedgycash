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

import './Contract.css';

interface ContractInterface {
    contract: any;
}

const Contract: React.FC<ContractInterface> = ({ contract }) => {
    const [strategy, setStrategy] = useState('long');

    return (
        <IonCard id="orderCard">
            <IonCardHeader>
                <IonSegment
                    color="success"
                    value={strategy}
                    onIonChange={(e) => setStrategy(e.detail.value!)}
                >
                    <IonSegmentButton value="long">
                        <IonLabel>Long</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="hedge">
                        <IonLabel>Short</IonLabel>
                    </IonSegmentButton>
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
                            <h2>{contract[strategy].amount}</h2>
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
                        <IonButton className="contract__button" color="success" expand="full">
                            {strategy === 'long' ? 'Long' : 'Short'}
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonCardContent>
        </IonCard>
    );
};

export default Contract;
