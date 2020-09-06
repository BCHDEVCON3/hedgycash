import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonRow,
    IonCol,
    useIonViewDidEnter,
} from '@ionic/react';

import Contract from './Contract';

import { fetchContractsInit } from '../../Redux/Contracts';
import { RootState } from '../../store';
import Loading from '../../components/Loading/Loading';

import './Book.css';

const Book: React.FC = () => {
    const dispatch = useDispatch();

    const { contracts, loading } = useSelector((state: RootState) => state.contractsState);

    useIonViewDidEnter(() => {
        dispatch(fetchContractsInit());
    });

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
                    {loading || !contracts.length ? (
                        <Loading className="book__loading" />
                    ) : (
                        <>
                            {contracts
                                .filter((elem) => elem.state === 'UNFULFILLED')
                                .map((contract, index) => (
                                    <IonCol
                                        key={`${contract.oraclePubKey}${index}`}
                                        size="3"
                                        size-lg="4"
                                        size-sm="6"
                                        size-xs="12"
                                    >
                                        <Contract contract={contract} />
                                    </IonCol>
                                ))}
                        </>
                    )}
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default Book;
