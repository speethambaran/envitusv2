/* eslint-disable eol-last */
import { SensorActionTypes } from '../utils/types';

export const initialState = {
	sensorTypeDetails: {},
	sensorParamDetails: {},
	sensorTypeList: [],
	sensorParamList: [],
	sensorParamIds: [],
	error: null,
	pagination: {
		totalItems: 0,
		skip: 0,
		limit: 10,
		totalPages: 0,
		currentPage: 0
	},
	loading: false,
	sensorTypeIds: [],
}

const sensorReducer = (state = initialState, action) => {
	const newState = { ...state };
	switch (action.type) {
		case SensorActionTypes.SENSOR_TYPE_LIST:
			newState.sensorTypeList = action.payload.sensor_types;
			break;
		case SensorActionTypes.SENSOR_PARAM_LIST:
			newState.sensorParamList = action.payload.sensor_parameters;
			newState.pagination = action.payload.pagination;
			break;
		case SensorActionTypes.SENSOR_PARAM_ID_LIST:
			newState.sensorParamIds = action.payload;
			break;
		case SensorActionTypes.SENSOR_TYPE_ID_LIST:
			newState.sensorTypeIds = action.payload;
			break;
		case SensorActionTypes.SENSOR_TYPE_DETAILS:
			newState.sensorTypeDetails = action.payload;
			break;
		default:
			break;
	}
	return newState;
}

export default sensorReducer;