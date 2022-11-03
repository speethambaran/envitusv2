import { DiagnosticsActionTypes } from '../utils/types';

export const initialState = {
	filter: {
		deviceId: null,
		errorType: null
	},
	list: [],
	error: null,
	pagination: {
		totalItems: 0,
		skip: 0,
		limit: 10,
		totalPages: 0,
		currentPage: 0
	},
	deviceDetails: {},
	loading: false
}

const diagnosticsReducer = (state = initialState, action) => {
	const newState = { ...state };
	switch (action.type) {
		case DiagnosticsActionTypes.DEVICE_ERROR_LIST:
			newState.list = action.payload.device_errors;
			newState.pagination = action.payload.pagination;
			break;
		case DiagnosticsActionTypes.DEVICE_NETWORK_CALL_UPDATE:
			newState.loading = action.payload;
			break;
		default:
			break;
	}
	return newState;
};

export default diagnosticsReducer;