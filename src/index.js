import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Splash from './pages/Splash/splash';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

const root = ReactDOM.createRoot(document.getElementById('root'));
const persistor = persistStore(store)
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <PersistGate persistor={persistor}>
                <App />
            </PersistGate>
        </BrowserRouter>
    </Provider>
);




