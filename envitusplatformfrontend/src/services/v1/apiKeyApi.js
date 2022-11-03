/* eslint-disable eol-last */
import { API } from '../api';
import { addApiSuccess, apiKeyList, apiKeyDetails, apiKeyFetchRequest, updateNetworkCall } from '../../action/thirdPartyUserAction';
import { toastr } from 'react-redux-toastr';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

/**
 * Get - Api key list
 *
 * @param
 */
export function getApiKeyList(queryParams) {
    let query = ''
    if (queryParams) {
        const esc = encodeURIComponent;
        const params = Object.keys(queryParams)
            .map(k => esc(k) + '=' + esc(queryParams[k]))
            .join('&');
        query = '?' + params;
    }
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        dispatch(updateNetworkCall(true))
        API.get("/apikey" + query).then(res => {
            dispatch(apiKeyList(res.data))
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
        })
    }
}

/**
 * Add new api key
 *
 * @param
 */
export function addApiKey(data) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.post("/apikey", data).then(res => {
            if (res.data && res.data.success) {
                toastr.success('', res.data.message)
            } else {
                toastr.warning('', res.data.message)
            }
            dispatch(hideLoading('sectionBar'))
            dispatch(addApiSuccess());
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}

/**
 * Update api key details
 *
 * @param
 */
export function updateApiKey(data, id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/apikey/" + id, data).then(res => {
            dispatch(hideLoading('sectionBar'))
            if (res.data && res.data.success) {
                toastr.success('', res.data.message)
            } else {
                toastr.warning('', res.data.message)
            }
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}

/**
 * Delete api key details
 *
 * @param
 */
export function deleteApiKey(id, query) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.delete("/apikey/" + id).then(res => {
            toastr.success('', res.data.message);
            dispatch(hideLoading('sectionBar'))
            dispatch(getApiKeyList(query));
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}

/**
 * Get api key details
 *
 * @param
 */
export function getApiKeyDetails(id) {
    return async dispatch => {
        dispatch(apiKeyFetchRequest(true))
        dispatch(showLoading('sectionBar'))
        API.get("/apikey/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(apiKeyDetails(res.data.api_details))
            dispatch(apiKeyFetchRequest(false))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}