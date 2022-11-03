/* eslint-disable eol-last */
import { AlarmActionTypes } from '../utils/types';
export const updateAlarmruleDetails = (details) => {
    return {
        type: 'UPDATE_ALARMruleDetails',
        payload: details
    };
};

/**
 * 
 *
 * @method alarmRuleList
 *
 * @returns {{type: {string} }}
 */
export const alarmList = (data) => ({
    type: AlarmActionTypes.ALARM_LIST,
    payload: data
});

/**
 * 
 *
 * @method alarmDetails
 *
 * @returns {{type: {string} }}
 */
export const alarmDetails = (ruleDetails) => ({
    type: AlarmActionTypes.ALARM_DETAILS,
    payload: ruleDetails
});

/**
 * 
 *
 * @method addNewAlarmRule
 *
 * @returns {{type: {string} }}
 */
export const addAlarmRuleSuccess = (ruleDetails) => ({
    type: AlarmActionTypes.ALARM_ADD_SUCCESS,
    payload: ruleDetails
});

/**
 * 
 *
 * @method networkCallUpdate
 *
 * @returns {{type: {string} }}
 */
export const updateNetworkCall = (isLoading) => ({
    type: AlarmActionTypes.ALARM_NETWORK_CALL_UPDATE,
    payload: isLoading
});

/**
 * 
 *
 * @method alarmRuleFetchRequest
 *
 * @returns {{type: {string} }}
 */
export const alarmRuleFetchRequest = (isCall) => ({
    type: AlarmActionTypes.ALARM_RULE_FETCH_REQUEST,
    payload: isCall
});

/**
 * 
 *
 * @method activeAlarmList
 *
 * @returns {{type: {string} }}
 */
export const activeAlarmList = (data) => ({
    type: AlarmActionTypes.ACTIVE_ALARM_LIST,
    payload: data
});

/**
 * 
 *
 * @method alarmHistoryList
 *
 * @returns {{type: {string} }}
 */
export const alarmHistoryList = (data) => ({
    type: AlarmActionTypes.ALARM_HISTORY_LIST,
    payload: data
});
