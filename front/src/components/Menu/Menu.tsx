import React, { useState, useEffect } from 'react';
import {
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonLabel,
    IonItem,
} from '@ionic/react';
import { RouteComponentProps, withRouter } from 'react-router';

import { PAGES, Page } from '../../constants/constants';

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
                <IonItem
                    button
                    color={page.title === activePage ? 'primary' : ''}
                    onClick={() => navigateToPage(page)}
                >
                    <IonLabel>{page.title}</IonLabel>
                </IonItem>
            </IonMenuToggle>
        ));
    };

    const navigateToPage = (page: Page) => history.push(page.path);

    return (
        <IonMenu contentId="main">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Hedgy.Cash</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent id="main">
                <IonList>{renderMenuItems()}</IonList>
            </IonContent>
        </IonMenu>
    );
};

export default withRouter(Menu);
