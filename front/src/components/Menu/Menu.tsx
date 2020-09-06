import React, { useState, useEffect } from 'react';
import {
    IonMenu,
    IonHeader,
    IonToolbar,
    IonContent,
    IonList,
    IonMenuToggle,
    IonLabel,
    IonItem,
    IonButton,
} from '@ionic/react';
import { RouteComponentProps, withRouter } from 'react-router';

import { PAGES, Page } from '../../constants/constants';

import HedgyCashLogoBlack from './assets/hedgycash-black.png';
import HedgyCashName from './assets/hedgycash-name.png';

import './Menu.css';

type Props = RouteComponentProps<{}>;

const Menu = ({ history, location }: Props) => {
    const [activePage, setActivePage] = useState(PAGES[0].title);

    useEffect(() => {
        const selectedPage = PAGES.find((page) => page.path === location.pathname);
        if (selectedPage) {
            setActivePage(selectedPage.title);
        }
    }, [location.pathname]);

    const renderMenuItems = (): JSX.Element[] => {
        return PAGES.map((page: Page) => (
            <IonMenuToggle key={page.title} auto-hide="false">
                <IonItem color={page.title === activePage ? 'primary' : ''}>
                    <IonButton fill="clear" expand="full" onClick={() => navigateToPage(page)}>
                        <IonLabel color="dark">{page.title}</IonLabel>
                    </IonButton>
                </IonItem>
            </IonMenuToggle>
        ));
    };

    const navigateToPage = (page: Page) => {
        history.push(page.path);
    };

    return (
        <IonMenu contentId="main">
            <IonHeader>
                <IonToolbar>
                    <img className="side-menu-header__name" src={HedgyCashName} alt="logo" />
                </IonToolbar>
            </IonHeader>
            <IonContent className="side-menu-content" id="main">
                <IonList>{renderMenuItems()}</IonList>
                <img className="side-menu-content__logo" src={HedgyCashLogoBlack} alt="logo" />
            </IonContent>
        </IonMenu>
    );
};

export default withRouter(Menu);
