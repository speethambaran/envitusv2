import { OrganizationActionTypes } from '../utils/types';

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
	orgIds: []
}

const organizationReducer = (state = initialState, action) => {
	const newState = { ...state };
	switch (action.type) {
		case OrganizationActionTypes.ORG_LIST:
			newState.list = action.payload.organizations;
			newState.pagination = action.payload.pagination;
			break;
		case OrganizationActionTypes.ORG_DETAILS:
			newState.data = action.payload;
			break;
		case OrganizationActionTypes.ORG_DETAILS_FETCH_REQUEST:
			newState.loading = action.payload;
			break;
		case OrganizationActionTypes.ORG_IDS:
			newState.orgIds = action.payload;
			break;
		default:
			break;
	}
	return newState;
};

export default organizationReducer;