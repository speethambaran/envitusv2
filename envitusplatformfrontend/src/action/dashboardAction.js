/* eslint-disable eol-last */
import { DashboardActionTypes } from '../utils/types';

/**
 * 
 *
 * @method dashboardStatistics
 *
 * @returns {{type: {string} }}
 */
export const dashboardStatistics = (statistics) => ({
    type: DashboardActionTypes.DASHBOARD_STATISTICS,
    payload: statistics
});


/**
 * 
 *
 * @method dashboardSelectedDevice
 *
 * @returns {{type: {string} }}
 */
export const dashboardSelectedDevice = (device) => ({
    type: DashboardActionTypes.DASHBOARD_SELECTED_DEVICE,
    payload: device
});