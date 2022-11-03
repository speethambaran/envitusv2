import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/app.js';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from "./store.js";
import { login, logout, currentUser } from './action/userAction';
import { authenticationService } from './services/v1/authentication';
sessionStorage.setItem("deviceType", process.env.REACT_APP_DEVICE_FAMILY)

if(sessionStorage.getItem("isLoggedIn")) {
    authenticationService.currentUser.subscribe(user => store.dispatch(login(user)));
} else {
    store.dispatch(logout());
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
