import { compose, createStore, applyMiddleware, Action, Reducer } from 'redux';
import { install, combineReducers } from 'redux-loop';
import { walletReducer } from './Redux/Wallet';
import { composeWithDevTools } from 'redux-devtools-extension';
const persistState = require('redux-sessionstorage');

const rootReducer: Reducer<any, Action<any>> = combineReducers({
    walletState: walletReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

let composedEnhancers: any = [];

const persistStateSlicer = () => (state: any) => ({
    walletState: {
        address: state.walletState.address,
    },
});

if (process.env.NODE_ENV !== 'production') {
    composedEnhancers = composeWithDevTools(
        applyMiddleware(),
        install(),
        persistState(null, { slicer: persistStateSlicer }),
    );
} else {
    composedEnhancers = compose(
        applyMiddleware(),
        install(),
        persistState(null, { slicer: persistStateSlicer }),
    );
}

export const store = createStore(rootReducer, {}, composedEnhancers);

export default store;
