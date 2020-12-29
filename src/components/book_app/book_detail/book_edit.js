import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { updateBook } from "../../../actions";

class BookEdit extends Component {
	componentDidMount() {}

	handleFormSubmit({ title, author, genre, publisher }) {
		const _id = this.props.book._id;
		genre = genre.toString();

		this.props.updateBook(
			{ _id, title, author, genre, publisher },
			this.props.onEditSuccess,
			(path, state) => {
				this.props.history.replace(path, state);
			}
		);
	}

	renderInput = (field) => (
		<fieldset className="form-group">
			<label>{field.label}</label>
			<input
				className="form-control"
				{...field.input}
				type={field.type}
				placeholder={field.placeholder}
				required={field.required ? "required" : ""}
				disabled={field.disabled ? "disabled" : ""}
			/>
		</fieldset>
	);

	renderAlert() {
		const { state } = this.props;
		const { action } = this.props;

		if (state && action === "REPLACE") {
			return (
				<div className="alert alert-danger" role="alert">
					{`[${state.time}] --- `} <strong>Oops!</strong>{" "}
					{state.message}
				</div>
			);
		}
	}

	render() {
		const { handleSubmit } = this.props;

		return (
			<div className="post">
				{this.renderAlert()}
				<h2 className="mb-5">Edit Your Book</h2>
				<form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
					<Field
						name="title"
						component={this.renderInput}
						type="text"
						label="Title:"
						placeholder="Title"
						required={true}
					/>
					<Field
						name="author"
						component={this.renderInput}
						type="text"
						label="Author:"
						placeholder="Author"
						required={true}
					/>
					<Field
						name="genre"
						component={this.renderInput}
						type="text"
						label="Genre:"
						placeholder="Genre"
						required={true}
					/>
					<Field
						name="publisher"
						component={this.renderInput}
						type="text"
						label="Publisher:"
						placeholder="Publisher"
						required={true}
					/>
					<button action="submit" className="btn btn-primary">
						Done
					</button>
				</form>
			</div>
		);
	}
}

BookEdit = reduxForm({
	form: "book_edit",
})(BookEdit);

function mapStateToProps(state, ownProps) {
	return { initialValues: ownProps.book };
}

export default connect(mapStateToProps, { updateBook })(BookEdit);
