/* eslint-disable eol-last */
import { CalibrationActionTypes } from '../utils/types';

/**
 * 
 *
 * @method addNewCalibrationCertificate
 *
 * @returns {{type: {string} }}
 */
export const addCalibSuccess = (certDetails) => ({
    type: CalibrationActionTypes.CALIB_ADD_SUCCESS,
    payload: certDetails
});

/**
 * 
 *
 * @method calibrationCertificatesList
 *
 * @returns {{type: {string} }}
 */
export const calibCertList = (data) => ({
    type: CalibrationActionTypes.CALIB_LIST,
    payload: data
});

/**
 * 
 *
 * @method networkCallUpdate
 *
 * @returns {{type: {string} }}
 */
export const updateNetworkCall = (isLoading) => ({
    type: CalibrationActionTypes.CALIB_NETWORK_CALL_UPDATE,
    payload: isLoading
});