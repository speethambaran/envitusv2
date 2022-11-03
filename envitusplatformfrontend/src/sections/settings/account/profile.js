import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { getMe, updateMe, updatePassword } from '../../../services/v1/userApi';

const Profile = () => {
    
    const { register, handleSubmit } = useForm();
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword } = useForm();

    const { user, loading, role, limit } = useSelector(
        state => ({
            user: state.user.data,
            loading: state.user.loading,
            role: state.user.currentUser.role,
            limit: state.user.limit
        })
    );
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    const onSubmitFormProfile = (formData) => {
        dispatch(updateMe(formData))
    }

    const onSubmitFormPassword = (formData) => {
        dispatch(updatePassword(formData))
    }
    return (
        <div>
            {!loading &&
                <div>
                    <div className="block">
                        <div className="block-header block-header-default">
                            <h3 className="block-title">
                                <i className="fa fa-user-circle mr-5 text-muted"></i> User Profile
                            </h3>
                        </div>
                        <div className="block-content">
                            <Form key={1} onSubmit={handleSubmit(onSubmitFormProfile)}>
                                <div className="row items-push">
                                    <div className="col-lg-3">
                                        <p className="text-muted">
                                            Your account’s vital info.
                                        </p>
                                    </div>
                                    <div className="col-lg-7 offset-lg-1">
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <label htmlFor="profile-settings-name">Name</label>
                                                <input type="text" className="form-control form-control-lg" id="profile-settings-name"
                                                    name="name" ref={register()} placeholder="Enter your name.." defaultValue={user.name} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <label htmlFor="profile-settings-username">Username</label>
                                                <input type="text" className="form-control form-control-lg" id="profile-settings-username"
                                                    name="profile-settings-username" placeholder="Enter your username.." defaultValue={user.userName} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <label htmlFor="profile-settings-username">Role</label>
                                                <input type="text" className="form-control form-control-lg" id="profile-settings-username"
                                                    name="profile-settings-username" placeholder="Enter your username.." defaultValue={user.role} disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <label htmlFor="profile-settings-email">Email Address</label>
                                                <input type="email" className="form-control form-control-lg" id="profile-settings-email"
                                                    name="profile-settings-email" placeholder="Enter your email.." defaultValue={user.email} disabled />
                                            </div>
                                        </div>
                                        {(role === 'Super Admin') ?
                                            <div className="form-group row">
                                                <div className="col-12">
                                                    <label htmlFor="profile-settings-name">Device Limit</label>
                                                    <input type="text" className="form-control form-control-lg" id="profile-settings-limit"
                                                        name="limit" ref={register()} placeholder="Enter Device Limit.." defaultValue={limit} />
                                                </div>
                                            </div>
                                            : null
                                        }

                                        <div className="form-group row">
                                            <div className="col-12">
                                                <button type="submit" className="btn btn-alt-primary">Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>

                    <div className="block">
                        <div className="block-header block-header-default">
                            <h3 className="block-title"> <i className="fa fa-asterisk mr-5 text-muted"></i> Change Password</h3>
                        </div>
                        <div className="block-content">
                            <Form key={2} onSubmit={handleSubmitPassword(onSubmitFormPassword)}>
                                <div className="row items-push">
                                    <div className="col-lg-3">
                                        <p className="text-muted">Changing your sign in password is an easy way to keep your account secure.</p>
                                    </div>
                                    <div className="col-lg-7 offset-lg-1">
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <label htmlFor="profile-settings-password">Current Password</label>
                                                <input type="password" className="form-control form-control-lg" ref={registerPassword({ required: true })} name="current_password" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <label htmlFor="profile-settings-password-new">New Password</label>
                                                <input type="password" className="form-control form-control-lg" ref={registerPassword({ required: true })} name="password" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <label htmlFor="profile-settings-password-new-confirm">Confirm New Password</label>
                                                <input type="password" className="form-control form-control-lg" ref={registerPassword({ required: true })} name="confirm_password" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-12">
                                                <button type="submit" className="btn btn-alt-primary">Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}


export default Profile;