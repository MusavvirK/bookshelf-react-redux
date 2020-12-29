import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchBooks } from "../../actions/index";

class BookList extends Component {
	componentDidMount() {
		this.props.fetchBooks();
	}

	renderTags(tags) {
		return tags.map((tag) => {
			return (
				<span className="badge badge-info span-with-margin" key={tag}>
					{tag}
				</span>
			);
		});
	}

	renderBookSummary(book) {
		return (
			<div key={book._id}>
				<h3>
					<Link
						className="link-without-underline"
						to={`/posts/${book._id}`}
					>
						{book.title}
					</Link>
				</h3>
				{this.renderTags(book.genre)}
				<span className="span-with-margin text-grey"> • </span>
				<span className="span-with-margin text-grey">
					{book.author}
				</span>
				<span className="span-with-margin text-grey"> • </span>
				<span className="span-with-margin text-grey">
					{book.publisher}
				</span>
				<hr />
			</div>
		);
	}

	render() {
		return (
			<div className="post">
				<Link
					className="btn btn-primary mb-5 button-pad"
					to={"/posts/new"}
				>
					Add Book
				</Link>
				{_.map(this.props.books, (book) => {
					return this.renderBookSummary(book);
				})}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { books: state.books };
}

export default connect(mapStateToProps, { fetchBooks })(BookList);
