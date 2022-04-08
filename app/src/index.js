import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable";

import Store from "./store";
import App from "./app";
import * as ServiceWorker from "./ServiceWorker";

import "./polyfill";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/icon";

const index = (
    <Provider store={Store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(index, document.getElementById("root"));

ServiceWorker.unregister();
