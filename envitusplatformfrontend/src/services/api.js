/* eslint-disable eol-last */
import axios from 'axios';
import { store } from "../store";
import { logout } from '../action/userAction';
const baseUrl = process.env.REACT_APP_API_V1_URL + '/v1.0';


/**
 * axios instance
 */
const instance = axios.create({
    baseURL: baseUrl
});

// request header
instance.interceptors.request.use(
    config => {
        const token = process.env.REACT_APP_API === 'V1' ? localStorage.getItem('token') : sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    });

/**
* parse response
*/
function parseBody(response) {
    //  if (response.status === 200 && response.data.status.code === 200) { // - if use custom status code
    if (response.status === 200) {
        return response
    }
    return this.parseError(response.data.messages)
}

/**
 *
 * parse error response
 */
function parseError(messages) {
    // error
    if (messages) {
        if (messages instanceof Array) {
            return Promise.reject({ messages: messages })
        }
        return Promise.reject({ messages: [messages] })
    }
    return Promise.reject({ messages: [] })
}

// response parse
instance.interceptors.response.use((response) => {
    if (response.data.errorCode === -10) {
        store.dispatch(logout());
    }
    return response;
}, error => {
    if (error.response) {
        if (401 === error.response.status) {
            store.dispatch(logout());
        } else {
            return parseError(error.response.data)
        }
    }

    return Promise.reject({ messages: [{ 'message': 'Network error please try later' }] })
})

export const API = instance
