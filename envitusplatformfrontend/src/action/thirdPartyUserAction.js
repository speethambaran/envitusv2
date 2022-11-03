/* eslint-disable eol-last */
import { ThirdPartyActionTypes } from '../utils/types';

export const updateThirdPartyUserDetails = (details) => {
    return {
        type: 'UPDATE_THIRDPARTYUSER_DETAILS',
        payload: details
    };
};

/**
 * 
 *
 * @method addNewApiKey
 *
 * @returns {{type: {string} }}
 */
export const addApiSuccess = (apiDetails) => ({
    type: ThirdPartyActionTypes.API_KEY_ADD_SUCCESS,
    payload: apiDetails
});


/**
 * 
 *
 * @method apiKeyList
 *
 * @returns {{type: {string} }}
 */
export const apiKeyList = (data) => ({
    type: ThirdPartyActionTypes.API_KEY_LIST,
    payload: data
});

/**
 * 
 *
 * @method apiKeyDetails
 *
 * @returns {{type: {string} }}
 */
export const apiKeyDetails = (keyDetails) => ({
    type: ThirdPartyActionTypes.API_KEY_DETAILS,
    payload: keyDetails
});

/**
 * 
 *
 * @method apiKeyFetchRequest
 *
 * @returns {{type: {string} }}
 */
export const apiKeyFetchRequest = (isCall) => ({
    type: ThirdPartyActionTypes.API_KEY_FETCH_REQUEST,
    payload: isCall
});

/**
 * 
 *
 * @method updateNetworkCall
 *
 * @returns {{type: {string} }}
 */
export const updateNetworkCall = (isLoading) => ({
    type: ThirdPartyActionTypes.API_KEY_NETWORK_CALL_UPDATE,
    payload: isLoading
});