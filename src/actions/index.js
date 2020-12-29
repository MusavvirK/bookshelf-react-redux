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

export function signinUser({ email, password }, historyPush, historyReplace) {
	return function (dispatch) {
		axios
			.post(`${ROOT_URL}/signin`, { email, password })
			.then((response) => {
				localStorage.setItem("token", response.data.token);

				dispatch({
					type: AUTH_USER,
					payload: response.data.username,
				});

				historyPush("/posts");
			})
			.catch(() => {
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
			})
			.then((response) => {
				historyPush("/signin", {
					time: new Date().toLocaleString(),
					message: response.data.message,
				});
			})
			.catch(({ response }) => {
				historyReplace("/signup", {
					time: new Date().toLocaleString(),
					message: response.data.message,
				});
			});
	};
}

export function signoutUser() {
	localStorage.removeItem("token");

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
				dispatch({
					type: CREATE_BOOK,
					payload: response.data,
				});
				historyPush(`/posts`);
			})
			.catch(({ response }) => {
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
					headers: { authorization: localStorage.getItem("token") },
				}
			)
			.then((response) => {
				dispatch({
					type: UPDATE_BOOK,
					payload: response.data,
				});
				onEditSuccess();
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
				headers: { authorization: localStorage.getItem("token") },
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
				headers: { authorization: localStorage.getItem("token") },
			})
			.then((response) => {
				dispatch({
					type: FETCH_BOOKS,
					payload: response.data,
				});
			});
	};
}

export function checkAuthority(bookId) {
	return function (dispatch) {
		axios
			.get(`${ROOT_URL}/allow_edit_or_delete/${bookId}`, {
				headers: { authorization: localStorage.getItem("token") },
			})
			.then((response) => {
				dispatch({
					type: CHECK_AUTHORITY,
					payload: response.data.allowChange,
				});
			})
			.catch(() => {
				dispatch({
					type: CHECK_AUTHORITY,
					payload: false,
				});
			});
	};
}
