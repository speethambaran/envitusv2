/* eslint-disable eol-last */
import { DiagnosticsActionTypes } from '../utils/types';

/**
 * 
 *
 * @method deviceErrorList
 *
 * @returns {{type: {string} }}
 */
export const deviceErrorList = (data) => ({
    type: DiagnosticsActionTypes.DEVICE_ERROR_LIST,
    payload: data
});


/**
 * 
 *
 * @method errorListFetch
 *
 * @returns {{type: {string} }}
 */
export const errorListFetchRequest = (data) => ({
    type: DiagnosticsActionTypes.DEVICE_NETWORK_CALL_UPDATE,
    payload: data
});

