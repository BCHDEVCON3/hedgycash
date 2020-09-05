import React, { useState } from 'react';
import {
    IonCard,
    IonCardContent,
    IonItem,
    IonIcon,
    IonLabel,
    IonRow,
    IonCol,
    IonChip,
    IonToast,
} from '@ionic/react';
import { cash, copy } from 'ionicons/icons';
import RawQRCode from 'qrcode.react';

import './Portfolio.css';
import './PortfolioDetails.css';

interface PortfolioDetailsInterface {
    address: string;
}

const PortfolioDetails: React.FC<PortfolioDetailsInterface> = ({ address }) => {
    const [copyMsg, setCopyMsg] = useState(false);

    const handleCopy = () => {
        const input = document.createElement('input');
        input.setAttribute('value', address);
        document.body.append(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        setCopyMsg(true);
    };

    return (
        <IonRow>
            <IonCol offset="3" size="6">
                <IonCard>
                    <IonItem>
                        <IonIcon icon={cash} slot="start" />
                        <IonLabel>Wallet Details</IonLabel>
                    </IonItem>
                    <IonCardContent id="portfolio-details-card-content">
                        <RawQRCode
                            className="portfolio-details__qr-code"
                            value={address || ''}
                            size={210}
                            renderAs={'svg'}
                            includeMargin
                            onClick={handleCopy}
                        />
                        <IonChip onClick={handleCopy}>
                            <IonLabel>{address}</IonLabel>
                            <IonIcon icon={copy} />
                        </IonChip>
                    </IonCardContent>
                </IonCard>
            </IonCol>
            <IonToast
                id="portfolio-details-toast"
                isOpen={copyMsg}
                onDidDismiss={() => setCopyMsg(false)}
                color="light"
                message="Copied"
                duration={2000}
            />
        </IonRow>
    );
};

export default PortfolioDetails;
