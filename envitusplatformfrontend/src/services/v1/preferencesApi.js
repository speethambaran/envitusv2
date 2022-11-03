/* eslint-disable eol-last */
import { API } from '../api';
import { toastr } from 'react-redux-toastr';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
    preferenceList, preferenceListFetch
} from '../../action/preferenceAction';

/**
 * Get - Preferences
 *
 * @param
 */
export function getPreferenceData(params) {
    const urlParam = {};
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        dispatch(preferenceListFetch(true))
        API.get("/preferences?" + new URLSearchParams(Object.assign(urlParam, params))).then(res => {
            dispatch(preferenceList(res.data.preference))
            dispatch(hideLoading('sectionBar'))
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    };
}


/**
 * Update - Preferences
 *
 * @param
 */
export function updatePreferenceData(id, params) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/preferences/" + id, params).then(res => {
            toastr.success('', res.data.message)
            dispatch(preferenceList(res.data.preference))
            dispatch(hideLoading('sectionBar'))
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    };
}