/* eslint-disable eol-last */
import { API } from '../api';
import {
    userDetails, updateNetworkCall,
    userLists, userIdList, deviceLimit
} from '../../action/userAction';
import { toastr } from 'react-redux-toastr';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

/**
 * Get  -  Profile detaisl
 *
 * @param
 */
export function getMe() {
    return async dispatch => {
        dispatch(showLoading('sectionBar'));
        dispatch(updateNetworkCall(true))
        API.get("/user/me").then(res => {
            dispatch(hideLoading('sectionBar'))
            localStorage.setItem('currentUser', JSON.stringify(res.data.user_details));
            dispatch(userDetails(res.data.user_details));
            dispatch(deviceLimit(res.data.device_limit))
            dispatch(updateNetworkCall(false))
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}

/**
 * Update   - Profile details
 *
 * @param
 */
export function updateMe(params) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/user/me", params).then(res => {
            dispatch(hideLoading('sectionBar'))
            if (res.data && res.data.success) {
                localStorage.setItem('currentUser', JSON.stringify(res.data.user_details));
                toastr.success('', res.data.message)
            }
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}

/**
 * Update   - Profile password
 *
 * @param
 */
export function updatePassword(params) {
    return dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/user/me/password", params).then(res => {
            dispatch(hideLoading('sectionBar'))
            if (res.data && res.data.success) {
                toastr.success('', res.data.message)
            }

        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}

/**
 * Get all users
 *
 * @param
 */
export function getAllUsers(params) {
    return dispatch => {
        dispatch(showLoading('sectionBar'))
        dispatch(updateNetworkCall(true))
        const urlParam = {};
        API.get("/user?" + new URLSearchParams(Object.assign(urlParam, params))).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(userLists(res.data));
            dispatch(updateNetworkCall(false))
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}

/**
 * Get  -  user  details
 *
 * @param
 */
export function getUserDetails(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'));
        dispatch(updateNetworkCall(true))
        API.get("/user/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(userDetails(res.data.user_details));
            dispatch(updateNetworkCall(false))
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}

/**
 * Update   - User Profile details
 *
 * @param
 */
export function updateUserDetails(id, params) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/user/" + id, params).then(res => {
            dispatch(hideLoading('sectionBar'))
            if (res.data && res.data.success) {
                toastr.success('', res.data.message)
            } else {
                toastr.warning('', res.data.message)
            }
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}

/**
 * Add new - User Profile details
 *
 * @param
 */
export function addNewUser(params) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.post("/user/", params).then(res => {
            dispatch(hideLoading('sectionBar'))
            if (res.data && res.data.success) {
                toastr.success('', res.data.message)
            } else {
                toastr.warning('', res.data.message)
            }
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}

/**
 * Get - User id list
 *
 * @param
 */
export function getUserIds() {
    return async dispatch => {
        API.get("/user/ids").then(res => {
            const userIds = [];
            res.data.user_ids.forEach(item => {
                const user = {
                    value: item._id,
                    label: item.name,
                    type: 'user_id'
                }
                userIds.push(user)
            });
            dispatch(userIdList(userIds))
        }).catch(err => {

        })
    }
}

/**
 * Delete - User account
 *
 * @param
 */
export function deleteUser(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.delete("/user/" + id).then(res => {
            dispatch(getAllUsers())
            dispatch(hideLoading('sectionBar'))
            if (res.data && res.data.success) {
                toastr.success('', res.data.message)
            } else {
                toastr.warning('', res.data.message)
            }
        }).catch(e => {
            dispatch(hideLoading('sectionBar'))
            e.messages.forEach(err => {
                toastr.error('', err.message)
            });
        })
    }
}