import { DeviceActionTypes } from '../utils/types';
export const initialState = {
	data: {},
	list: [],
	error: null,
	pagination: {
		totalItems: 10,
		skip: 0,
		limit: 10,
		totalPages: 0,
		currentPage: 0
	},
	loading: false,
	statistics: {},
	deviceIds: [],
	sensorParameters: [],
}
const deviceReducer = (state = initialState, action) => {
	const newState = { ...state };
	switch (action.type) {
		case 'UPDATE_DEVICE_COUNT':
			newState.deviceCount = action.payload;
			break;
		case 'UPDATE_DEVICE_DETAILS':
			newState.data = { ...newState.data, [action.payload.deviceId]: action.payload };
			break;
		case 'UPDATE_SELECTED_DEVICE':
			newState.selectedDevice = action.payload;
			break;
		case DeviceActionTypes.DEVICE_STATISTICS_DATA:
			newState.statistics = action.payload;
			break;
		case DeviceActionTypes.DEVICE_LIST:
			newState.list = action.payload.device_list;
			newState.pagination = action.payload.pagination;
			break;
		case DeviceActionTypes.DEVICE_FETCH_REQUEST:
			newState.loading = action.payload
			break;
		case DeviceActionTypes.DEVICE_DETAILS:
			newState.data = action.payload
			break;
		case DeviceActionTypes.DEVICE_ID_LIST:
			newState.deviceIds = action.payload
			break;
		case DeviceActionTypes.DEVICE_DATA_LOADING:
			newState.loading = action.payload
			break;
		case DeviceActionTypes.DEVICE_PARAM_LIST:
			newState.sensorParameters = action.payload
			break;
		default:
			break;
	}

	return newState;
};

export default deviceReducer;
