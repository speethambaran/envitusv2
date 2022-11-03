/* eslint-disable eol-last */
import { PreferenceActionTypes } from '../utils/types';

/**
 * 
 *
 * @method preferenceList
 *
 * @returns {{type: {string} }}
 */
export const preferenceList = (data) => ({
    type: PreferenceActionTypes.PREFERENCE_LIST,
    payload: data
});

/**
 * 
 *
 * @method preferenceListFetch
 *
 * @returns {{type: {string} }}
 */
export const preferenceListFetch = (data) => ({
    type: PreferenceActionTypes.PREFERENCE_LIST_FETCHING,
    payload: data
});