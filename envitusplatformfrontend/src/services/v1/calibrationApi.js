/* eslint-disable eol-last */
import { API } from '../api';
import { toastr } from 'react-redux-toastr';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
    updateNetworkCall, calibCertList, addCalibSuccess
} from '../../action/calibrationAction';

export function addCalibCert(data) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.post("/calibration", data).then(res => {
            if (res.data && res.data.success) {
                toastr.success('', res.data.message)
            } else {
                toastr.warning('', res.data.message)
            }
            dispatch(hideLoading('sectionBar'))
            dispatch(addCalibSuccess());
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}

export function listCalibCert(params) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        dispatch(updateNetworkCall(true));
        API.get("/calibration?" + new URLSearchParams(Object.assign(params))).then(res => {
            dispatch(calibCertList(res.data))
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
        })
    }
}

export function deleteCalibCert(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.delete("/calibration/" + id).then(res => {
            toastr.success('', res.data.message);
            dispatch(hideLoading('sectionBar'))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}

export function fileDownload(id, fileName) {
    const endPoint = '/calibration/download/' + id;
    return async dispatch => {
        dispatch(showLoading('sectionBar'));
        API.get(endPoint, { responseType: 'blob' }).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            dispatch(hideLoading('sectionBar'))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
            toastr.error('Error', 'File not found');
        })
    }
}