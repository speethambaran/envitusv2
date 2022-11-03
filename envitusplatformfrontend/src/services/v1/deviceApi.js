/* eslint-disable eol-last */
import { API } from '../api';
import { toastr } from 'react-redux-toastr';
import { deviceErrorList, errorListFetchRequest } from '../../action/diagnosticsAction';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
    deviceStatistics, deviceList,
    deviceListFetchRequest, deviceDetails,
    deviceIdList, deviceDataLoading, sensorParamList
} from '../../action/deviceAction';

import { getDashboardStatistics } from './dashboardApi';
import {
    dashboardSelectedDevice
} from '../../action/dashboardAction';

/**
 * Get - Device erros list
 *
 * @param
 */
export function getDeviceErrorList(queryParams) {
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
        dispatch(errorListFetchRequest(true))
        API.get("/device/errors" + query).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(deviceErrorList(res.data))
            dispatch(errorListFetchRequest(false))
        }).catch(err => {

        })
    }
}

/**
 * Get - Device statistics data
 *
 * @param
 */
export function getDeviceStatistics() {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.get("/device/statistics").then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(deviceStatistics(res.data.device_statistics))
        }).catch(err => {

        })
    }
}

/**
 * Get - Device lists
 *
 * @param
 */
export function getDeviceLists(params, isDashboardStatistics = false) {
    const urlParam = {};
    return async dispatch => {
        dispatch(deviceListFetchRequest(true))
        dispatch(showLoading('sectionBar'))
        API.get("/device?" + new URLSearchParams(Object.assign(urlParam, params))).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(deviceList(res.data))
            if (isDashboardStatistics && res.data.device_list.length > 0) {
                dispatch(getDashboardStatistics(res.data.device_list[0]._id))
                dispatch(dashboardSelectedDevice(res.data.device_list[0]))
            }
            dispatch(deviceListFetchRequest(false))
        }).catch(err => {

        })
    }
}

/**
 * Get - Device details data
 *
 * @param
 */
export function getDeviceDetails(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        dispatch(deviceDataLoading(true))
        API.get("/device/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            const paramDefinitions = [];
            for (let index = 0; index < res.data.device_details.paramDefinitions.length; index++) {
                const element = res.data.device_details.paramDefinitions[index];
                if (!element.hasOwnProperty('filteringMethod')) {
                    element.filteringMethod = ''
                }
                if (!element.hasOwnProperty('filteringMethodDef')) {
                    element.filteringMethodDef = {}
                }
                paramDefinitions.push(element)
            }
            res.data.device_details.paramDefinitions = paramDefinitions
            dispatch(deviceDetails(res.data.device_details))
            dispatch(deviceDataLoading(false))
        }).catch(err => {

        })
    }
}

/**
 * Get - Device id list
 *
 * @param
 */
export function getDeviceIds(params) {
    return async dispatch => {
        const urlParam = {};
        API.get("/device/ids?" + new URLSearchParams(Object.assign(urlParam, params))).then(res => {
            const deviceIds = [];
            res.data.device_ids.forEach(item => {
                const device = {
                    value: item._id,
                    label: item.deviceId,
                    type: 'device_id'
                }
                deviceIds.push(device)
            });
            dispatch(deviceIdList(deviceIds))
        }).catch(err => {

        })
    }
}

/**
 * Delete - Device 
 *
 * @param
 */
export function deleteDevice(id, params, delDevicePermanently) {
    if (delDevicePermanently) {
        return async dispatch => {
            dispatch(showLoading('sectionBar'))
            API.delete("/device/permanently/" + id).then(res => {
                dispatch(hideLoading('sectionBar'))
                dispatch(getDeviceLists(params));
                toastr.success('', res.data.message);
            }).catch(err => {

            })
        }
    }
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.delete("/device/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(getDeviceLists(params));
            toastr.success('', res.data.message);
        }).catch(err => {

        })
    }

}

/**
 * Delete - Device 
 *
 * @param
 */
export function restoreDevice(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/device/restore/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(getDeviceLists());
            toastr.success('', res.data.message);
        }).catch(err => {

        })
    }
}

/**
 * Add - Device 
 *
 * @param
 */
export async function addDevice(params) {
    const device = await new Promise((resolve, reject) => {
        API.post("/device/", params).then(res => {
            if (res.data.success) {
                toastr.success('', res.data.message);
                resolve(true);
            }
        }).catch(e => {
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
            reject(false);
        })
    })
    return device;
}

/**
 * Edit - Device 
 *
 * @param
 */
export async function editDevice(id, params) {
    const device = await new Promise((resolve, reject) => {
        API.put("/device/" + id, params).then(res => {
            if (res.data.success) {
                toastr.success('', res.data.message);
                resolve(true);
            }
        }).catch(e => {
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
            reject(false);
        })
    })
    return device;
}

/**
 * Get - Device details data
 *
 * @param
 */
export function getDeviceParams() {
    return async dispatch => {
        API.get("/sensor/parameters").then(res => {
            const paramList = [];
            for (let index = 0; index < res.data.parameters.length; index++) {
                const element = res.data.parameters[index];
                const params = {
                    "type": "device_params",
                    "value": element.paramName,
                    "label": element.displayName,
                }
                paramList.push(params)
            }
            dispatch(sensorParamList(paramList))
        }).catch(err => {

        })
    }
}