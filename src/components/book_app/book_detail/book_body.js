import React, { Component } from "react";

class BookBody extends Component {
	renderTags(tags) {
		return tags.map((tag) => {
			return (
				<span className="badge badge-info span-with-margin" key={tag}>
					{tag}
				</span>
			);
		});
	}

	render() {
		const { book } = this.props;

		return (
			<div>
				<h3>{book.title}</h3>
				{this.renderTags(book.genre)}
				<span className="span-with-margin"> • </span>
				<span className="span-with-margin">{book.author}</span>
				<span className="span-with-margin"> • </span>
				<span className="span-with-margin">{book.publisher}</span>
				<hr />
			</div>
		);
	}
}

export default BookBody;
