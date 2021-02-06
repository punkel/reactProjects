import React from 'react';
import ReactDOM from 'react-dom';

import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

import App from './App.js';

ReactDOM.render(
    <CookiesProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </CookiesProvider>,
    document.getElementById('root')
)
