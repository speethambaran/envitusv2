/* eslint-disable eol-last */
import { UserActionTypes } from '../utils/types';

export const login = (user) => {
    return {
        type: UserActionTypes.USER_LOGIN,
        payload: user
    };
};

export const logout = () => {
    return {
        type: UserActionTypes.USER_LOGOUT
    };
};

export const userPrivilegeRole = (role) => {
    return {
        type: UserActionTypes.USER_PRIVILEGE_ROLE,
        payload: role
    }
}

/**
 * 
 *
 * @method userDetails
 *
 * @returns {{type: {string} }}
 */
export const userDetails = (userDetail) => ({
    type: UserActionTypes.USER_DETAILS,
    payload: userDetail
});

export const deviceLimit = (limit) => ({
    type: UserActionTypes.DEVICE_LIMIT,
    payload: limit
});

/**
 * 
 *
 * @method updateUserDetails
 *
 * @returns {{type: {string} }}
 */
export const updateUserDetails = (userDetail) => ({
    type: UserActionTypes.UPDTAE_USER_DETAILS,
    payload: userDetail
});

/**
 * 
 *
 * @method currentUser
 *
 * @returns {{type: {string} }}
 */
export const currentUser = (userDetail) => ({
    type: UserActionTypes.CURRENT_USER_DETAILS,
    payload: userDetail
});


/**
 * 
 *
 * @method updateNetworkCall
 *
 * @returns {{type: {string} }}
 */
export const updateNetworkCall = (isLoading) => ({
    type: UserActionTypes.USER_NETWORK_CALL_UPDATE,
    payload: isLoading
});


/**
 * 
 *
 * @method userLists
 *
 * @returns {{type: {string} }}
 */
export const userLists = (userList) => ({
    type: UserActionTypes.USER_LIST,
    payload: userList
});

/**
 * 
 *
 * @method userIdList
 *
 * @returns {{type: {string} }}
 */
export const userIdList = (data) => ({
    type: UserActionTypes.USER_ID_LIST,
    payload: data
});