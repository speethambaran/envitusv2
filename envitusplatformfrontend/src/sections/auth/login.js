import React from 'react';
import { useForm } from "react-hook-form";
import { authUser } from '../../services/v1/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from "react-router-dom";

const Login = () => {
	const { register, handleSubmit } = useForm();
	const dispatch = useDispatch();
	const { isLoggedIn } = useSelector(
		state => ({
			isLoggedIn: state.user.isLoggedIn
		})
	);

	const onSubmitForm = (formData) => {
		dispatch(authUser(formData));
	}

	if (isLoggedIn) {
		return <Redirect to='/dashboard' />;
	} else {
		return (
			<div className="content content-full">
				<div className="px-30 py-10 logo">
					<img src={process.env.PUBLIC_URL + process.env.REACT_APP_HOME_LOGO} alt="logo" />
					<h1 className="h4 font-w700 mt-30 mb-10">Welcome to Your Dashboard</h1>
				</div>

				<form className="js-validation-signin px-30" onSubmit={handleSubmit(onSubmitForm)}>
					<div className="form-group row">
						<div className="col-12">
							<div className="form-material floating">
								<input type="text" className="form-control" id="login-username" name="username" ref={register({ required: true })} />
								<label htmlFor="login-username">Username</label>
							</div>
						</div>
					</div>
					<div className="form-group row">
						<div className="col-12">
							<div className="form-material floating">
								<input type="password" className="form-control" id="login-password"
									name="password" ref={register({ required: true })} />
								<label htmlFor="login-password">Password</label>
							</div>
						</div>
					</div>
					<div className="form-group">
						<button className="btn btn-sm btn-hero btn-alt-primary">
							<i className="si si-login mr-10"></i> Sign In
                                        </button>
					</div>
				</form>
			</div>
		)
	}
}

export default Login;
