import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { createBook } from "../../actions";

class AddBook extends Component {
	handleFormSubmit({ title, author, genre, publisher }) {
		// console.log(title);
		// console.log(categories);
		// console.log(content);
		this.props.createBook(
			{ title, author, genre, publisher },
			(path) => {
				// callback 1: history push
				this.props.history.push(path);
			},
			(path, state) => {
				// callback 2: history replace
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
		const { state } = this.props.history.location;
		const { action } = this.props.history;

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
				<h2 className="mb-5">New Book</h2>
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
						Add Book
					</button>
				</form>
			</div>
		);
	}
}

AddBook = reduxForm({
	form: "add_book", // name of the form
})(AddBook);

export default connect(null, { createBook })(AddBook);
