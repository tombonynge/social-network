import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome.js";
import App from "./app.js";

/**********SOCKET ************/
import { init } from "./socket";

/***********REDUX*************/
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
/*****************************/

let elem;
const userIsLoggedIn = location.pathname != "/welcome";

if (userIsLoggedIn) {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
    // elem = <App />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
