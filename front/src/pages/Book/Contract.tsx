import React from 'react';
import { IonButton, IonCard, IonRow, IonCol, IonCardContent, IonText } from '@ionic/react';

interface ContractInterface {
    contract: any;
}

const Contract: React.FC<ContractInterface> = ({ contract }) => {
    return (
        <IonCard id="orderCard">
            <IonCardContent id="orderCardContent">
                <IonRow>
                    <IonCol size="6">
                        <IonText>
                            <h2>
                                <strong>BCH/USDT</strong>
                            </h2>
                        </IonText>
                        <IonText>
                            <h2>3000 sats</h2>
                        </IonText>
                    </IonCol>
                    <IonCol size="6">
                        <IonText>
                            <h2>Matures in X blocks</h2>
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
                                    <h2>High: 3x</h2>
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
                <IonRow>
                    <IonCol>
                        <IonButton id="submitOrder" color="success" expand="full">
                            SHORT
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonCardContent>
        </IonCard>
    );
};

export default Contract;
