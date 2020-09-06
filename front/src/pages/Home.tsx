import React from 'react';
import {
    IonPage,
    IonContent,
    IonRow,
    IonCol,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
} from '@ionic/react';

import './Home.css';

const Home: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonButtons>
                    <IonMenuButton color="success"></IonMenuButton>
                </IonButtons>
            </IonHeader>
            <IonContent fullscreen>
                <IonRow>
                    <IonCol offsetMd="1" sizeMd="6" offsetXs="1" sizeXs="10">
                        <h1 className="home__title">
                            Take a position on any asset with Hedgy.Cash App
                        </h1>
                        <p>
                            Simply import your wallet via Badger Wallet. No need to sign up, swipe
                            your card, type a PIN or sing anything. You will experience the power of
                            smart contracts on Bitcoin Cash to usher in a new era of trustless and
                            private trading.
                        </p>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol offsetMd="5" sizeMd="6" offsetXs="1" sizeXs="10">
                        <h1 className="home__title">
                            Keep your privacy and mitigate the stability when diversifying your
                            portfolio
                        </h1>
                        <p>
                            Powered by the unbiased AnyHedge protocol, you'll access a decentralized
                            hedge solution against arbitrary assets on the BCH network.
                        </p>
                    </IonCol>
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default Home;
