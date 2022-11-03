/* eslint-disable eol-last */
import { DeviceActionTypes } from '../utils/types';
export const updateDeviceCount = (count) => {
    return {
        type: 'UPDATE_DEVICE_COUNT',
        payload: count
    };
};

export const updateDeviceDetails = (details) => {
    return {
        type: 'UPDATE_DEVICE_DETAILS',
        payload: details
    };
};

export const updateSelectedDevice = (deviceId) => {
    return {
        type: 'UPDATE_SELECTED_DEVICE',
        payload: deviceId
    };
};

/**
 * 
 *
 * @method deviceStatistics
 *
 * @returns {{type: {string} }}
 */
export const deviceStatistics = (data) => ({
    type: DeviceActionTypes.DEVICE_STATISTICS_DATA,
    payload: data
});

/**
 * 
 *
 * @method deviceList
 *
 * @returns {{type: {string} }}
 */
export const deviceList = (data) => ({
    type: DeviceActionTypes.DEVICE_LIST,
    payload: data
});

/**
 * 
 *
 * @method deviceListFetchRequest
 *
 * @returns {{type: {string} }}
 */
export const deviceListFetchRequest = (isFetch) => ({
    type: DeviceActionTypes.DEVICE_FETCH_REQUEST,
    payload: isFetch
});

/**
 * 
 *
 * @method deviceDetails
 *
 * @returns {{type: {string} }}
 */
export const deviceDetails = (data) => ({
    type: DeviceActionTypes.DEVICE_DETAILS,
    payload: data
});

/**
 * 
 *
 * @method deviceIdList
 *
 * @returns {{type: {string} }}
 */
export const deviceIdList = (data) => ({
    type: DeviceActionTypes.DEVICE_ID_LIST,
    payload: data
});

/**
 * 
 *
 * @method deviceDataLoading
 *
 * @returns {{type: {string} }}
 */
export const deviceDataLoading = (isLoading) => ({
    type: DeviceActionTypes.DEVICE_DATA_LOADING,
    payload: isLoading
});

/**
 * 
 *
 * @method sensorParamList
 *
 * @returns {{type: {string} }}
 */
export const sensorParamList = (data) => ({
    type: DeviceActionTypes.DEVICE_PARAM_LIST,
    payload: data
});