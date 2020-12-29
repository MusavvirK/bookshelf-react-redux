import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { fetchProfile } from "../../actions/index";

class Profile extends Component {
	componentDidMount() {
		if (!this.props.initialValues) {
			this.props.fetchProfile();
		}
	}

	componentWillUnmount() {}

	handleFormSubmit({ firstName, lastName }) {
		console.log("feature not supported still");
	}

	renderInput = (field) => (
		<fieldset className="form-group">
			<label>{field.label}</label>
			<input
				className="form-control"
				{...field.input}
				type={field.type}
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
				<div
					className={`alert ${
						state.status === "success"
							? "alert-success"
							: "alert-danger"
					}`}
					role="alert"
				>
					{`[${state.time}] --- `}{" "}
					<strong>
						{state.status === "success"
							? "Congratulations!"
							: "Oops!"}
					</strong>{" "}
					{state.message}
				</div>
			);
		}
	}

	render() {
		if (!this.props.initialValues) {
			return <div>Loading...</div>;
		}

		const { handleSubmit } = this.props;

		return (
			<div>
				{this.renderAlert()}
				<form
					className="form-profile"
					onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
				>
					<h3>Profile</h3>
					<hr />
					<Field
						name="email"
						component={this.renderInput}
						type="email"
						label="Email:"
						disabled={true}
					/>
					<Field
						name="firstName"
						component={this.renderInput}
						type="text"
						label="First Name:"
						disabled={true}
					/>
					<Field
						name="lastName"
						component={this.renderInput}
						type="text"
						label="Last Name:"
						disabled={true}
					/>
				</form>
			</div>
		);
	}
}

Profile = reduxForm({
	form: "profile",
})(Profile);

function mapStateToProps(state) {
	return { initialValues: state.profile.user };
}

export default connect(mapStateToProps, { fetchProfile })(Profile);
