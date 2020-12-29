import axios from "axios";
import { reset } from "redux-form";
import {
	AUTH_USER,
	UNAUTH_USER,
	FETCH_PROFILE,
	FETCH_BOOKS,
	CREATE_BOOK,
	FETCH_BOOK,
	UPDATE_BOOK,
	DELETE_BOOK,
	CHECK_AUTHORITY,
} from "./types";

const ROOT_URL = "https://bookshelf-node-express-api.herokuapp.com/api";

/**
 * Authentication
 */

export function signinUser({ email, password }, historyPush, historyReplace) {
	// Using redux-thunk (instead of returning an object, return a function)
	// All redux-thunk doing is giving us arbitrary access to the dispatch function, and allow us to dispatch our own actions at any time we want
	return function (dispatch) {
		// Submit email/password to the server
		axios
			.post(`${ROOT_URL}/signin`, { email, password }) // axios returns a promise
			.then((response) => {
				// If request is good (sign in succeeded) ...

				// - Save the JWT token (use local storage)
				localStorage.setItem("token", response.data.token);

				// - Update state to indicate user is authenticated
				dispatch({
					type: AUTH_USER,
					payload: response.data.username,
				});

				// - Redirect (PUSH) to the route '/books'
				historyPush("/posts");
			})
			.catch(() => {
				// If request is bad (sign in failed) ...

				// - Redirect (REPLACE) to the route '/signin', then show an error to the user
				historyReplace("/signin", {
					time: new Date().toLocaleString(),
					message: "The email and/or password are incorrect.",
				});
			});
	};
}

export function signupUser(
	{ email, password, firstName, lastName },
	historyPush,
	historyReplace
) {
	return function (dispatch) {
		axios
			.post(`${ROOT_URL}/signup`, {
				email,
				password,
				firstName,
				lastName,
			}) // axios returns a promise
			.then((response) => {
				// If request is good (sign up succeeded) ...

				// - Redirect (PUSH) to the route '/signin', then show a success message to the user
				historyPush("/signin", {
					time: new Date().toLocaleString(),
					message: response.data.message,
				});
			})
			.catch(({ response }) => {
				// If request is bad (sign up failed) ...

				// - Redirect (REPLACE) to the route '/signup', then show an error to the user
				historyReplace("/signup", {
					time: new Date().toLocaleString(),
					message: response.data.message,
				});
			});
	};
}

export function signoutUser() {
	// - Delete the JWT token from local storage
	localStorage.removeItem("token");

	// - Update state to indicate the user is not authenticated
	return { type: UNAUTH_USER };
}

export function verifyJwt() {
	return function (dispatch) {
		axios
			.get(`${ROOT_URL}/verify_jwt`, {
				headers: { authorization: localStorage.getItem("token") },
			})
			.then((response) => {
				dispatch({
					type: AUTH_USER,
					payload: response.data.username,
				});
			});
	};
}

/**
 * User information
 */

export function fetchProfile() {
	return function (dispatch) {
		axios
			.get(`${ROOT_URL}/profile`, {
				headers: { authorization: localStorage.getItem("token") },
			})
			.then((response) => {
				dispatch({
					type: FETCH_PROFILE,
					payload: response.data.user,
				});
			});
	};
}

/**
 * Books API
 */

export function fetchBooks() {
	return function (dispatch) {
		axios.get(`${ROOT_URL}/posts`).then((response) => {
			dispatch({
				type: FETCH_BOOKS,
				payload: response.data,
			});
		});
	};
}

export function createBook(
	{ title, author, genre, publisher },
	historyPush,
	historyReplace
) {
	return function (dispatch) {
		axios
			.post(
				`${ROOT_URL}/posts`,
				{
					title,
					author,
					genre,
					publisher,
				},
				{
					headers: { authorization: localStorage.getItem("token") }, // require auth
				}
			)
			.then((response) => {
				// If create book succeed, navigate to the book detail page
				dispatch({
					type: CREATE_BOOK,
					payload: response.data,
				});
				historyPush(`/posts`);
			})
			.catch(({ response }) => {
				// If create book failed, alert failure message
				historyReplace("/posts/new", {
					time: new Date().toLocaleString(),
					message: response.data.message,
				});
			});
	};
}

export function fetchBook(id) {
	return function (dispatch) {
		axios.get(`${ROOT_URL}/posts/${id}`).then((response) => {
			// console.log(response);
			dispatch({
				type: FETCH_BOOK,
				payload: response.data,
			});
		});
	};
}

export function updateBook(
	{ _id, title, author, genre, publisher },
	onEditSuccess,
	historyReplace
) {
	return function (dispatch) {
		axios
			.put(
				`${ROOT_URL}/posts/${_id}`,
				{
					_id,
					title,
					author,
					genre,
					publisher,
				},
				{
					headers: { authorization: localStorage.getItem("token") }, // require auth
				}
			)
			.then((response) => {
				dispatch({
					type: UPDATE_BOOK,
					payload: response.data,
				});
				onEditSuccess(); // set beingEdit to false
				historyReplace(`/posts/${_id}`, null);
			})
			.catch(({ response }) => {
				historyReplace(`/posts/${_id}`, {
					time: new Date().toLocaleString(),
					message: response.data.message,
				});
			});
	};
}

export function deleteBook(id, historyPush) {
	return function (dispatch) {
		axios
			.delete(`${ROOT_URL}/posts/${id}`, {
				headers: { authorization: localStorage.getItem("token") }, // require auth
			})
			.then((response) => {
				dispatch({
					type: DELETE_BOOK,
					payload: id,
				});
				historyPush("/posts");
			});
	};
}

export function fetchBooksByUserId() {
	return function (dispatch) {
		axios
			.get(`${ROOT_URL}/my_posts`, {
				headers: { authorization: localStorage.getItem("token") }, // require auth
			})
			.then((response) => {
				dispatch({
					type: FETCH_BOOKS,
					payload: response.data,
				});
			});
	};
}

/**
 * Check authority: Check if the user has the authority to make change to a specific book
 */
export function checkAuthority(bookId) {
	return function (dispatch) {
		axios
			.get(`${ROOT_URL}/allow_edit_or_delete/${bookId}`, {
				headers: { authorization: localStorage.getItem("token") }, // require auth
			})
			.then((response) => {
				dispatch({
					type: CHECK_AUTHORITY,
					payload: response.data.allowChange,
				});
			})
			.catch(() => {
				// If an user is un-authorized, he/she cannot make change to any books
				dispatch({
					type: CHECK_AUTHORITY,
					payload: false,
				});
			});
	};
}
