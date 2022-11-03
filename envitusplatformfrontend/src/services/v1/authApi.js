/* eslint-disable eol-last */
import { API } from '../api';
import { login, logout } from '../../action/userAction';
import { toastr } from 'react-redux-toastr';

/**
 * Auth -  User
 *
 * @param
 */
export function authUser(loginDetails) {
    const response = API.post("/auth/login", loginDetails);
    return dispatch => {
        response.then(res => {
            if (res.data && res.data.success) {
                localStorage.setItem('currentUser', JSON.stringify(res.data.user_details));
                localStorage.setItem("token", res.data.token);
                sessionStorage.setItem("isLoggedIn", true);
                sessionStorage.setItem("ngStorage-loggedIn", true);
                sessionStorage.setItem("ngStorage-userName", '"' + loginDetails.userName + '"');
                dispatch(login(res.data.user_details));
            }
        }).catch(e => {
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        });
    };
}

/**
 * Logout -  User
 *
 * @param
 */
export function logOut() {
    return dispatch => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("ngStorage-loggedIn");
        sessionStorage.removeItem("ngStorage-userName");
        dispatch(logout());
        return true;
    };
}