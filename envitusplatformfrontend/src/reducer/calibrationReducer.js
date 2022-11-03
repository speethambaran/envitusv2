import { CalibrationActionTypes } from '../utils/types';

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

const calibrationReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case CalibrationActionTypes.CALIB_ADD_SUCCESS:
            break;
        case CalibrationActionTypes.CALIB_LIST:
            newState.list = action.payload.calib_list;
            newState.pagination = action.payload.pagination;
            break;
        default:
            break;
    }
    return newState;
}

export default calibrationReducer;