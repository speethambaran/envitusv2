/* eslint-disable eol-last */
import { SensorActionTypes } from '../utils/types';

/**
 * 
 *
 * @method sensorTypeList
 *
 * @returns {{type: {string} }}
 */
export const sensorTypeList = (list) => ({
    type: SensorActionTypes.SENSOR_TYPE_LIST,
    payload: list
})

/**
 * 
 *
 * @method sensorSpecList
 *
 * @returns {{type: {string} }}
 */
export const sensorSpecList = (list) => ({
    type: SensorActionTypes.SENSOR_PARAM_LIST,
    payload: list
})


/**
 * 
 *
 * @method sensorSpecIdList
 *
 * @returns {{type: {string} }}
 */
export const sensorSpecIdList = (list) => ({
    type: SensorActionTypes.SENSOR_PARAM_ID_LIST,
    payload: list
})

/**
 * 
 *
 * @method sensorTypeIdList
 *
 * @returns {{type: {string} }}
 */
export const sensorTypeIdList = (list) => ({
    type: SensorActionTypes.SENSOR_TYPE_ID_LIST,
    payload: list
})


/**
 * 
 *
 * @method sensorTypeDetails
 *
 * @returns {{type: {string} }}
 */
export const sensorTypeDetails = (list) => ({
    type: SensorActionTypes.SENSOR_TYPE_DETAILS,
    payload: list
})