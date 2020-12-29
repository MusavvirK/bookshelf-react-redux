import _ from "lodash";
import {
	FETCH_BOOKS,
	CREATE_BOOK,
	FETCH_BOOK,
	UPDATE_BOOK,
	DELETE_BOOK,
} from "../actions/types";

export default function (state = {}, action) {
	// Attention!!! The state object here refers to state.books, instead of the application state.

	switch (action.type) {
		case FETCH_BOOKS:
			return _.mapKeys(action.payload, "_id");
		case CREATE_BOOK:
			return { ...state, [action.payload._id]: action.payload }; // [] here is not for creating array, is for key interpolation, i.e. newState[action.payload.id] = action.payload
		case FETCH_BOOK:
			return { ...state, [action.payload._id]: action.payload };
		case UPDATE_BOOK:
			return { ...state, [action.payload._id]: action.payload };
		case DELETE_BOOK:
			return _.omit(state, action.payload);
		default:
			return state;
	}
}
