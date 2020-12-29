import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import reduxThunk from "redux-thunk";

import Header from "./components/header";
import Footer from "./components/footer";
import NoMatch from "./components/nomatch";
import Welcome from "./components/welcome";
import Signin from "./components/auth/signin";
import Signup from "./components/auth/signup";
import RequireAuth from "./components/auth/require_auth";
import Profile from "./components/userinfo/profile";
import BookList from "./components/book_app/book_list";
import AddBook from "./components/book_app/add_book";
import BookDetail from "./components/book_app/book_detail/index";
import BookMine from "./components/book_app/book_mine";

import reducers from "./reducers";
import { AUTH_USER } from "./actions/types";

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem("token");
// If we have a token, consider the user to be signed in
if (token) {
	// We need to update application state
	store.dispatch({ type: AUTH_USER });
}

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<div>
				<Header />
				<div className="container" id="content">
					<Switch>
						<Route exact path="/" component={Welcome} />
						<Route path="/signin" component={Signin} />
						<Route path="/signup" component={Signup} />
						<Route
							path="/profile"
							component={RequireAuth(Profile)}
						/>
						<Route exact path="/posts" component={BookList} />
						<Route
							path="/posts/new"
							component={RequireAuth(AddBook)}
						/>
						<Route path="/posts/:id" component={BookDetail} />
						<Route
							path="/my_posts"
							component={RequireAuth(BookMine)}
						/>
						<Route component={NoMatch} />
					</Switch>
				</div>
				<Footer />
			</div>
		</Router>
	</Provider>,
	document.getElementById("root")
);
