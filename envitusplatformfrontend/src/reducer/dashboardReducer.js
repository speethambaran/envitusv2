import { DashboardActionTypes } from '../utils/types';
export const initialState = {
    loading: false,
    statistics: {
        pollutants: {
            display: {}
        },
        device_details: {}
    },
    selectedDevice: {
        paramDefinitions: []
    }
}

const dashbaordReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case DashboardActionTypes.DASHBOARD_STATISTICS:
            newState.statistics = action.payload
            break;
        case DashboardActionTypes.DASHBOARD_SELECTED_DEVICE:
            newState.selectedDevice = action.payload
            break;
        default:
            break;
    }

    return newState;
};

export default dashbaordReducer;