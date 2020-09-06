import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonCol,
    IonRow,
    IonToast,
    useIonViewDidEnter,
} from '@ionic/react';

import Loading from '../../components/Loading/Loading';

import { getAddressInit } from '../../Redux/Wallet';
import { fetchContractsInit } from '../../Redux/Contracts';
import { RootState } from '../../store';

import './History.css';
import FinishedContract from './FinishedContract';

const History: React.FC = () => {
    const dispatch = useDispatch();
    const { error, address } = useSelector((state: RootState) => state.walletState);
    const { contracts, loading } = useSelector((state: RootState) => state.contractsState);

    useIonViewDidEnter(() => {
        dispatch(getAddressInit());
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
                        <IonTitle size="large">History</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonRow>
                    {loading ? (
                        <Loading className="history__loading" />
                    ) : (
                        <>
                            {contracts
                                .filter((elem) => elem.state === 'FULFILLED')
                                .filter(
                                    (elem) =>
                                        elem.hedge.creator === address ||
                                        elem.long.creator === address,
                                )
                                .map((contract, index) => (
                                    <IonCol
                                        key={`${contract.oraclePubKey}${index}`}
                                        size="3"
                                        size-lg="4"
                                        size-sm="6"
                                        size-xs="12"
                                    >
                                        <FinishedContract contract={contract} address={address} />
                                    </IonCol>
                                ))}
                        </>
                    )}
                </IonRow>
            </IonContent>
            <IonToast
                id="portfolio-empty-toast"
                isOpen={error}
                color="danger"
                message="Badger Wallet not installed or configured!"
                duration={5000}
            />
        </IonPage>
    );
};

export default History;
