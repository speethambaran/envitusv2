import { PreferenceActionTypes } from '../utils/types';
export const initialState = {
    data: {},
    error: null,
    isLoading: true
}

const preferenceReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case PreferenceActionTypes.PREFERENCE_LIST:
            newState.data = action.payload;
            newState.isLoading = false
            break;
        case PreferenceActionTypes.PREFERENCE_LIST_FETCHING:
            newState.isLoading = action.payload
            break;
        default:
            break;
    }
    return newState;
}

export default preferenceReducer;