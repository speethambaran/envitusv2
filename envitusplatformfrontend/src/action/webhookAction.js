/* eslint-disable eol-last */
import { WebhookActionTypes } from '../utils/types';

/**
 * 
 *
 * @method addWebhookSuccess
 *
 * @returns {{type: {string} }}
 */
export const addWebhookSuccess = (webhookDetails) => ({
    type: WebhookActionTypes.WEBHOOK_ADD_SUCCESS,
    payload: webhookDetails
});

/**
 * 
 *
 * @method webhookList
 *
 * @returns {{type: {string} }}
 */
export const webhookList = (data) => ({
    type: WebhookActionTypes.WEBHOOK_LIST,
    payload: data
});

/**
 * 
 *
 * @method webhookDetails
 *
 * @returns {{type: {string} }}
 */
export const webhookDetails = (hookDetails) => ({
    type: WebhookActionTypes.WEBHOOK_DETAILS,
    payload: hookDetails
});