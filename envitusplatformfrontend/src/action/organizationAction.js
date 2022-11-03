/* eslint-disable eol-last */
import { OrganizationActionTypes } from '../utils/types';

/**
 * 
 *
 * @method organizationList
 *
 * @returns {{type: {string} }}
 */
export const organizationList = (data) => ({
    type: OrganizationActionTypes.ORG_LIST,
    payload: data
});

/**
 * 
 *
 * @method organizationDetails
 *
 * @returns {{type: {string} }}
 */
export const organizationDetails = (keyDetails) => ({
    type: OrganizationActionTypes.ORG_DETAILS,
    payload: keyDetails
});

/**
 * 
 *
 * @method organizationDetailsFetchRequest
 *
 * @returns {{type: {string} }}
 */
export const organizationDetailsFetchRequest = (isCall) => ({
    type: OrganizationActionTypes.ORG_DETAILS_FETCH_REQUEST,
    payload: isCall
});


/**
 * 
 *
 * @method organizationIdList
 *
 * @returns {{type: {string} }}
 */
export const organizationIdList = (ids) => ({
    type: OrganizationActionTypes.ORG_IDS,
    payload: ids
});
