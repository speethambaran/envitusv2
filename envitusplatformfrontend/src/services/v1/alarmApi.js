/* eslint-disable eol-last */
import { API } from '../api';
import { toastr } from 'react-redux-toastr';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
    addAlarmRuleSuccess, alarmList, updateNetworkCall, alarmDetails,
    alarmRuleFetchRequest, activeAlarmList, alarmHistoryList
} from '../../action/alarmAction';

export function addAlarmRule(data) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.post("/alarmrule", data).then(res => {
            toastr.success('', res.data.message);
            dispatch(hideLoading('sectionBar'))
            dispatch(addAlarmRuleSuccess());
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}

export function getAlarmRuleList(params) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        dispatch(updateNetworkCall(true))
        API.get("/alarmrule?" + new URLSearchParams(Object.assign(params))).then(res => {
            dispatch(alarmList(res.data))
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
        })
    }
}

export function deleteAlarmRule(id, query) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.delete("/alarmrule/" + id).then(res => {
            toastr.success('', res.data.message);
            dispatch(hideLoading('sectionBar'))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}

export function updateAlarmRule(data, id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/alarmrule/" + id, data).then(res => {
            dispatch(hideLoading('sectionBar'))
            toastr.success('', res.data.message);
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}

export function getAlarmRuleDetails(id) {
    return async dispatch => {
        dispatch(alarmRuleFetchRequest(true))
        dispatch(showLoading('sectionBar'))
        API.get("/alarmrule/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(alarmDetails(res.data.rule_details))
            dispatch(alarmRuleFetchRequest(false))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}

export function getActiveAlarms(params) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        dispatch(updateNetworkCall(true))
        API.get("/alarm?" + new URLSearchParams(Object.assign(params))).then(res => {
            dispatch(activeAlarmList(res.data))
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
        })
    }
}

export function clearAlarm(id, data, filter) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/alarm/" + id, data).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(getActiveAlarms(filter));
            toastr.success('', res.data.message);
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}

export function getAlarmHistory(params) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        dispatch(updateNetworkCall(true))
        API.get("/alarm/history?" + new URLSearchParams(Object.assign(params))).then(res => {
            dispatch(alarmHistoryList(res.data))
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
            dispatch(updateNetworkCall(false))
        })
    }
}

export function clearAllAlerts(filter) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/alarm/clear").then(res => {
            dispatch(getActiveAlarms(filter));
            dispatch(hideLoading('sectionBar'))
            toastr.success('', res.data.message);
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}
export function clearAllHistory(filter) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/alarm/history/clear").then(res => {
            dispatch(getAlarmHistory(filter));
            dispatch(hideLoading('sectionBar'))
            toastr.success('', res.data.message);
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
} 
