import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane, IonPage, IonAlert } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Menu from './components/Menu/Menu';
import { PAGES } from './constants/constants';

import './App.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

document.body.classList.toggle('dark', true);

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <IonSplitPane contentId="main">
                <Menu />
                <IonPage id="main">
                    <IonRouterOutlet>
                        {PAGES.map((page) => (
                            <Route
                                key={page.title}
                                path={page.path}
                                component={page.component}
                                exact={true}
                            />
                        ))}
                        <Route
                            path="/"
                            render={() => <Redirect to={PAGES[0].path} />}
                            exact={true}
                        />
                    </IonRouterOutlet>
                </IonPage>
            </IonSplitPane>
        </IonReactRouter>
        <IonAlert
            isOpen={true}
            header={'Warning'}
            message={'This app is alpha version, you may lose your funds.'}
            buttons={['OK']}
        />
    </IonApp>
);

export default App;
