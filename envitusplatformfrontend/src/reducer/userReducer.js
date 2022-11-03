/* eslint-disable eol-last */
import { UserActionTypes } from '../utils/types';


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
	userPrivilegeRole: '',
	isLoggedIn: false,
	currentUser: {},
	userIds: []
}

const userReducer = (state = initialState, action) => {
	const newState = { ...state };
	switch (action.type) {
		case UserActionTypes.USER_LOGIN:
			newState.currentUser = action.payload
			newState.isLoggedIn = true;
			break;
		case UserActionTypes.USER_LOGOUT:
			newState.isLoggedIn = false;
			break;
		case UserActionTypes.USER_PRIVILEGE_ROLE:
			newState.userPrivilegeRole = action.payload;
			break;
		case UserActionTypes.USER_DETAILS:
			newState.data = action.payload;
			break;
		case UserActionTypes.CURRENT_USER_DETAILS:
			newState.currentUser = action.payload;
			break;
		case UserActionTypes.USER_NETWORK_CALL_UPDATE:
			newState.loading = action.payload;
			break;
		case UserActionTypes.USER_LIST:
			newState.list = action.payload.users_list;
			newState.pagination = action.payload.pagination
			break;
		case UserActionTypes.USER_ID_LIST:
			newState.userIds = action.payload
			break;
		case UserActionTypes.DEVICE_LIMIT:
			newState.limit = action.payload;
			break;
		default:
			break;
	}
	return newState;
};

export default userReducer;
