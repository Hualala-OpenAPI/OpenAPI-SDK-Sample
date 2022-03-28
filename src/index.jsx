import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {PersistGate} from "redux-persist/lib/integration/react";
import Store, {persistor} from "./store";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
