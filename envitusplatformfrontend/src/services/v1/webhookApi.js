/* eslint-disable eol-last */
import { API } from '../api';
import { toastr } from 'react-redux-toastr';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
    webhookList, addWebhookSuccess, webhookDetails
} from '../../action/webhookAction';

export function addWebhook(data) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.post("/webhook", data).then(res => {
            if (res.data && res.data.success) {
                toastr.success('', res.data.message)
            } else {
                toastr.warning('', res.data.message)
            }
            dispatch(hideLoading('sectionBar'))
            dispatch(addWebhookSuccess());
            return res;
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}
export function listWebhook(params) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        // dispatch(updateNetworkCall(true));
        API.get("/webhook?" + new URLSearchParams(Object.assign(params))).then(res => {
            dispatch(webhookList(res.data))
            dispatch(hideLoading('sectionBar'))
            // dispatch(updateNetworkCall(false))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
            // dispatch(updateNetworkCall(false))
        })
    }
}

export function deleteWebhook(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.delete("/webhook/" + id).then(res => {
            toastr.success('', res.data.message);
            dispatch(hideLoading('sectionBar'))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}

export function getWebhookDetails(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.get("/webhook/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(webhookDetails(res.data.hook_details))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}

export function updateWebhook(data, id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/webhook/" + id, data).then(res => {
            dispatch(hideLoading('sectionBar'))
            toastr.success('', res.data.message);
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}