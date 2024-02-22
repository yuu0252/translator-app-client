import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { Provider } from "react-redux";
import store from "./reducer/store.ts";
import { CookiesProvider } from "react-cookie";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </CookiesProvider>
  </React.StrictMode>
);
