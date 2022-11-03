import { WebhookActionTypes } from '../utils/types';
export const initialState = {
    data: {},
    list: [],
    error: null,
    pagination: {
        totalItems: 0,
        skip: 0,
        limit: 10,
        totalPages: 0,
        currentPage: 0
    },
    loading: false,
}

const webhookReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case WebhookActionTypes.WEBHOOK_ADD_SUCCESS:
            break;
        case WebhookActionTypes.WEBHOOK_LIST:
            newState.list = action.payload.webhook_list;
            newState.pagination = action.payload.pagination;
            break;
        case WebhookActionTypes.WEBHOOK_DETAILS:
            newState.data = action.payload;
            break;
        default:
            break;
    }
    return newState;
}

export default webhookReducer;