import React from "react";
import { Link } from "react-router-dom";

export default () => (
	<div>
		{/*Main jumbotron for a primary marketing message or call to action*/}
		<div className="jumbotron">
			<h1 className="display-3">Welcome!</h1>
			<p>
				MERN stack based functioning BookShelf app, users can add their
				own books, update, delete their books and view other books added
				by other users.
			</p>
			<p>
				<Link
					className="btn btn-primary btn-lg"
					to="/posts"
					role="button"
				>
					View Books &raquo;
				</Link>
			</p>
		</div>
	</div>
);
