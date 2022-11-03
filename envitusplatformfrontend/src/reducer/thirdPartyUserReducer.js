import { ThirdPartyActionTypes } from '../utils/types';

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

const thirdPartyUserReducer = (state = initialState, action) => {
	const newState = { ...state };
	switch (action.type) {
		case 'UPDATE_THIRDPARTYUSER_DETAILS':
			newState.data[action.payload.name] = action.payload;
			break;
		case ThirdPartyActionTypes.API_KEY_ADD_SUCCESS:
			break;
		case ThirdPartyActionTypes.API_KEY_LIST:
			newState.list = action.payload.api_list;
			newState.pagination = action.payload.pagination;
			break;
		case ThirdPartyActionTypes.API_KEY_DETAILS:
			newState.data = action.payload;
			break;
		case ThirdPartyActionTypes.API_KEY_FETCH_REQUEST:
			newState.loading = action.payload;
			break;
		case ThirdPartyActionTypes.API_KEY_NETWORK_CALL_UPDATE:
			newState.loading = action.payload;
		default:
			break;
	}
	return newState;
};

export default thirdPartyUserReducer;
