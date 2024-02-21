import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.scss';
import { Provider } from 'react-redux';
import store from './reducer/store.js';
import { CookiesProvider } from 'react-cookie';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </CookiesProvider>
  </React.StrictMode>
);
