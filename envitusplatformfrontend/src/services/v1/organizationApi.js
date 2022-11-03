/* eslint-disable eol-last */
import { API } from '../api';
import { toastr } from 'react-redux-toastr';
import { organizationList, organizationDetails, organizationDetailsFetchRequest, organizationIdList } from '../../action/organizationAction';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

/**
 * Add new organization
 *
 * @param
 */
export function addOrganization(data) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.post("/organization", data).then(res => {
            dispatch(hideLoading('sectionBar'))
            toastr.success('', res.data.message);
        }).catch(err => {

        })
    }
}


/**
 * Get - Org list
 *
 * @param
 */
export function getOrgList(queryParams) {
    let query = ''
    if (queryParams) {
        const esc = encodeURIComponent;
        const params = Object.keys(queryParams)
            .map(k => esc(k) + '=' + esc(queryParams[k]))
            .join('&');
        query = '?' + params;
    }
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.get("/organization" + query).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(organizationList(res.data))
        }).catch(err => {

        })
    }
}

/**
 * Get org details
 *
 * @param
 */
export function getOrganizationDetails(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        dispatch(organizationDetailsFetchRequest(true))
        API.get("/organization/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(organizationDetails(res.data.org_details))
            dispatch(organizationDetailsFetchRequest(false))
        }).catch(err => {

        })
    }
}

/**
 * Update organization details
 *
 * @param
 */
export function updateOrganizationDetails(data, id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.put("/organization/" + id, data).then(res => {
            dispatch(hideLoading('sectionBar'))
            toastr.success('', res.data.message);
        }).catch(err => {

        })
    }
}

/**
 * Delete organization
 *
 * @param
 */
export function deleteOrganization(id) {
    return async dispatch => {
        dispatch(showLoading('sectionBar'))
        API.delete("/organization/" + id).then(res => {
            dispatch(hideLoading('sectionBar'))
            dispatch(getOrgList());
            toastr.success('', res.data.message);
        }).catch(err => {

        })
    }
}

/**
 * Get organization ids
 *
 * @param
 */
export function getOrganizationIdList() {
    return async dispatch => {
        API.get("/organization/ids").then(res => {
            const orgIds = [];
            res.data.organization_ids.forEach(item => {
                const device = {
                    value: item._id,
                    label: item.name,
                    type: 'organization_id'
                }
                orgIds.push(device)
            });
            dispatch(organizationIdList(orgIds))
        }).catch(err => {

        })
    }
}