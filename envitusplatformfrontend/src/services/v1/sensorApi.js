/* eslint-disable eol-last */
import { API } from '../api';
import { toastr } from 'react-redux-toastr';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
    sensorTypeList, sensorSpecList, sensorSpecIdList, sensorTypeIdList,
    sensorTypeDetails
} from '../../action/sensorAction';
/**
 * Add new sensor type
 *
 * @param
 */
export function addSensorType(data) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.post("/sensor/type", data).then(res => {
            dispatch(hideLoading('sectionBar'))
            if (res.data.success) {
                dispatch(listSensorType())
                toastr.success('', res.data.message);
            } else {
                toastr.warning('', res.data.message);
            }
        }).catch(err => {

        })
    }
}

/**
 * List sensor type
 *
 * @param
 */
export function listSensorType(queryParams) {
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
        API.get("/sensor/type" + query).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(sensorTypeList(res.data))
        }).catch(err => {

        })
    }
}

/**
 * Update sensor type
 *
 * @param
 */
export function updateSensorType(id, data) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/sensor/type/" + id, data).then(res => {
            dispatch(hideLoading('sectionBar'))
            if (res.data.success) {
                dispatch(listSensorType())
                toastr.success('', res.data.message);
            } else {
                toastr.warning('', res.data.message);
            }
        }).catch(err => {

        })
    }
}


/**
 * Delete sensor type
 *
 * @param
 */
export function deleteSensorType(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.delete("/sensor/type/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            if (res.data.success) {
                dispatch(listSensorType())
                toastr.success('', res.data.message);
            } else {
                toastr.warning('', res.data.message);
            }
        }).catch(err => {

        })
    }
}



/**
 * Add new sensor Parameter
 *
 * @param
 */
export function addSensorParameter(data) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.post("/sensor/spec", data).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(listSensorParameter())
            toastr.success('', res.data.message);
        }).catch(err => {

        })
    }
}

/**
 * List sensor Parameter
 *
 * @param
 */
export function listSensorParameter(queryParams) {
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
        API.get("/sensor/spec" + query).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(sensorSpecList(res.data))
        }).catch(err => {

        })
    }
}

/**
 * Update sensor Parameter
 *
 * @param
 */
export function updateSensorParameter(id, data) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/sensor/spec/" + id, data).then(res => {
            dispatch(hideLoading('sectionBar'))
            if (res.data.success) {
                dispatch(listSensorParameter())
                toastr.success('', res.data.message);
            } else {
                toastr.warning('', res.data.message);
            }
        }).catch(err => {

        })
    }
}


/**
 * Delete sensor Parameter
 *
 * @param
 */
export function deleteSensorParameter(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.delete("/sensor/spec/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            if (res.data.success) {
                dispatch(listSensorParameter())
                toastr.success('', res.data.message);
            } else {
                toastr.warning('', res.data.message);
            }
        }).catch(err => {

        })
    }
}


/**
 * Get sensor spec ids lists
 *
 * @param
 */
export function getSensorSpecIdList() {
    return async dispatch => {
        API.get("/sensor/spec/ids").then(res => {
            const specIds = [];
            res.data.spec_ids.forEach(item => {
                const spec = {
                    value: item._id,
                    label: item.displayName,
                    type: 'spec_id'
                }
                specIds.push(spec)
            });
            dispatch(sensorSpecIdList(specIds))
        }).catch(err => {

        })
    }
}

/**
 * Get sensor tpe ids list
 *
 * @param
 */
export function getSensorTypeIdList() {
    return async dispatch => {
        API.get("/sensor/type/ids").then(res => {
            const typeIds = [];
            res.data.sensor_type_ids.forEach(item => {
                const spec = {
                    value: item._id,
                    label: item.name,
                    type: 'sensor_type_id'
                }
                typeIds.push(spec)
            });
            dispatch(sensorTypeIdList(typeIds))
            dispatch(getSensorTypeDetails(typeIds[0].value))
        }).catch(err => {

        })
    }
}

/**
 * Get sensor tpe ids list
 *
 * @param
 */
export function getSensorTypeDetails(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.get("/sensor/type/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(sensorTypeDetails(res.data.sensor_type))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}