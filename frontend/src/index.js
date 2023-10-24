import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Provider } from "react-redux";
import store from './State/store';
import { ModalProvider } from './Context/ModalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ModalProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </ModalProvider>
);
