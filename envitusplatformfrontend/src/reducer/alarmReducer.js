import { AlarmActionTypes } from "../utils/types";

export const initialState = {
	data: {},
	list: [],
	alarms: [],
	error: null,
	pagination: {
		totalItems: 0,
		skip: 0,
		limit: 10,
		totalPages: 0,
		currentPage: 0
	},
	loading: false,
	historyList: [],
}

const alarmReducer = (state = initialState, action) => {
	const newState = { ...state };
	switch (action.type) {
		case 'UPDATE_ALARMRULE_DETAILS':
			newState.data = action.payload;
			break;
		case AlarmActionTypes.ALARM_LIST:
			newState.list = action.payload.alarm_list;
			newState.pagination = action.payload.pagination;
			break;
		case AlarmActionTypes.ALARM_DETAILS:
			newState.data = action.payload;
			break;
		case AlarmActionTypes.ALARM_ADD_SUCCESS:
			break;
		case AlarmActionTypes.ALARM_NETWORK_CALL_UPDATE:
			newState.loading = action.payload;
		case AlarmActionTypes.ALARM_RULE_FETCH_REQUEST:
			newState.loading = action.payload;
			break;
		case AlarmActionTypes.ACTIVE_ALARM_LIST:
			newState.alarms = action.payload.active_alerts;
			newState.pagination = action.payload.pagination;
			break;
		case AlarmActionTypes.ALARM_HISTORY_LIST:
			newState.historyList = action.payload.alert_history;
			newState.pagination = action.payload.pagination;
			break;
		default:
			break;
	}
	return newState;
};

export default alarmReducer;
