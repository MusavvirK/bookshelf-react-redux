import React, { Component } from "react";
import { connect } from "react-redux";

import NoMatch from "../../nomatch";
import BookBody from "./book_body";
import BookEdit from "./book_edit";

import { fetchBook, checkAuthority, deleteBook } from "../../../actions";

class BookDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			beingEdit: false,
		};
	}

	componentDidMount() {
		this.setState({
			beingEdit: false,
		});

		const { id } = this.props.match.params;

		if (!this.props.book) {
			this.props.fetchBook(id);
		}

		this.props.checkAuthority(id);
	}

	handleEditSuccess() {
		this.setState({
			beingEdit: false,
		});
	}

	onEditClick() {
		this.setState({
			beingEdit: true,
		});
	}

	onDeleteClick() {
		const { id } = this.props.match.params;
		this.props.deleteBook(id, (path) => {
			this.props.history.push(path);
		});
	}

	renderDeleteConfirmModal() {
		return (
			<div
				className="modal fade"
				id="deleteConfirmModal"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="deleteConfirmModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5
								className="modal-title"
								id="deleteConfirmModalLabel"
							>
								Confirm Delete
							</h5>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close"
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<p>
								Are you sure you want to delete this book with
								its comments? <strong>Attention!</strong> This
								delete operation cannot be undone.
							</p>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								data-dismiss="modal"
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-danger"
								data-dismiss="modal"
								onClick={this.onDeleteClick.bind(this)}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	renderUpdateAndDeleteButton() {
		if (this.props.allowChange) {
			return (
				<div>
					<button
						className="btn btn-primary mr-1"
						onClick={this.onEditClick.bind(this)}
					>
						Edit
					</button>
					<button
						className="btn btn-danger"
						data-toggle="modal"
						data-target="#deleteConfirmModal"
					>
						Delete
					</button>
				</div>
			);
		}
	}

	render() {
		if (!this.props.book) {
			return <NoMatch />;
		}

		if (this.state.beingEdit) {
			return (
				<BookEdit
					book={this.props.book}
					onEditSuccess={this.handleEditSuccess.bind(this)}
					history={this.props.history}
					state={this.props.history.location.state}
					action={this.props.history.action}
				/>
			);
		}

		return (
			<div className="post">
				<BookBody book={this.props.book} />
				{this.renderUpdateAndDeleteButton()}

				{this.renderDeleteConfirmModal()}
			</div>
		);
	}
}

function mapStateToProps({ books, auth }, ownProps) {
	return {
		book: books[ownProps.match.params.id],
		allowChange: auth.allowChange,
	};
}

export default connect(mapStateToProps, {
	fetchBook,
	checkAuthority,
	deleteBook,
})(BookDetail);
