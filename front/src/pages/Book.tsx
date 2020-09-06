import React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonMenuButton,
    IonList, IonItem, IonLabel, IonListHeader,
    IonCard,
    IonRow, IonCol,IonCardContent, IonText, IonCardHeader, IonCardTitle
    
} from '@ionic/react';

const Book: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonMenuButton color="success"></IonMenuButton>
                </IonButtons>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Book</IonTitle>
                    </IonToolbar>
                </IonHeader>
              
                <IonRow>
                    <IonCol size-md="2">
                    <IonCard id="orderCard">
                            <IonCardContent id="orderCardContent">
                                <IonRow>
                                    <IonCol size="6">
                                        <IonText>
                                            <h2><strong>BCH/USDT</strong></h2>
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
                                    <h2><strong>Liquidation</strong></h2>
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
                                        <IonButton
                                            id="submitOrder"
                                            color="success"
                                            expand="full"
                                          
                                        >
                                            SHORT
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

export default Book;
