import { compose, createStore, combineReducers, applyMiddleware, Action, Reducer } from "redux";
import { walletReducer } from "./Redux/Wallet";
import { composeWithDevTools } from "redux-devtools-extension";
const persistState = require('redux-sessionstorage');

const rootReducer: Reducer<any, Action<any>> = combineReducers({
    walletState: walletReducer
});

let composedEnhancers: any = [];

const persistStateSlicer = () => (state: any) => ({
    walletState: {
        auth: state.authState.auth,
    },
});

if (process.env.NODE_ENV !== 'production') {
    composedEnhancers = composeWithDevTools(
        applyMiddleware(),
        persistState(null, { slicer: persistStateSlicer }),
    );
} else {
    composedEnhancers = compose(
        applyMiddleware(),
        persistState(null, { slicer: persistStateSlicer }),
    );
}

export const store = createStore(rootReducer, {}, composedEnhancers);

export default store;

