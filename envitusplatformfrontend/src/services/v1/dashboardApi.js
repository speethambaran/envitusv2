/* eslint-disable eol-last */
import { API } from '../api';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
    dashboardStatistics
} from '../../action/dashboardAction';

/**
 * Get sensor spec ids lists
 *
 * @param
 */
export function getDashboardStatistics(deviceId) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.get("/dashboard/statistics/" + deviceId).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(dashboardStatistics(res.data.statistics))
        }).catch(err => {
            dispatch(hideLoading('sectionBar'))
        })
    }
}