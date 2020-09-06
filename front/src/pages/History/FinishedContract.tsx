import React, { useState } from 'react';
import {
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

interface FinishedContractInterface {
    contract: any;
    address: string;
}

const FinishedContract: React.FC<FinishedContractInterface> = ({ contract, address }) => {
    const [strategy] = useState(contract.hedge.creator === address ? 'hedge' : 'long');

    return (
        <IonCard id="orderCard">
            <IonCardHeader>
                <IonSegment color="success" value={strategy}>
                    <IonSegmentButton value={strategy}>
                        <IonLabel>{strategy === 'hedge' ? 'Short' : 'Long'}</IonLabel>
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
            </IonCardContent>
        </IonCard>
    );
};

export default FinishedContract;
