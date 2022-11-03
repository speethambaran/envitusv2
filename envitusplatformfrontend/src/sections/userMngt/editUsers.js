import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserDetails } from '../../services/v1/userApi';
import Select from 'react-select';
import { userRolesEdit, statusActiveInactive } from '../../utils/helpers';

const EditUsers = () => {
    const { register, handleSubmit } = useForm();
    const [userRole, setUserRole] = useState(null);
    const [userStatus, setUserStatus] = useState(true);
    const { id } = useParams();
    const { user, loading } = useSelector(
        state => ({
            user: state.user.data,
            loading: state.user.loading
        })
    );
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserDetails(id));
    }, [dispatch]);
    
    const onSubmitForm = (formData) => {
        const params = {
            name: formData.name
        }
        if (userRole !== null) {
            formData.role = userRole
        }
        if (userStatus !== null) {
            formData.status = userStatus
        }
        formData.password !== '' ? params.password = formData.name : formData.password = '';
        dispatch(updateUserDetails(id, formData))
    }

    const getDefaultValue = (value, type) => {
        if (type === 'status') {
            const status = value ? 'active' : 'inactive';
            const data = statusActiveInactive.find((element) => { return element.value === status })
            return data;
        } else {
            const data = userRolesEdit.find((element) => { return element.value === value })
            return data;
        }
    }

    const updateUserRole = (role) => {
        setUserRole(role.value)
    }

    const updateUserStatus = (status) => {
        const userStatus = status.value === 'active' ? true : false;
        setUserStatus(userStatus)
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="block">
                    <div className="block-header block-header-default">
                        <h3 className="block-title">Edit User Details</h3>
                        <div className="block-options">
                            <Link to={'/dashboard/users'} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Users List">
                                    <i className="si si-arrow-left"></i>
                                </button>
                            </Link>
                            <Link to={'/dashboard/users/add'} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Add New user">
                                    <i className="si si-plus"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                    {!loading &&
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="block-content">
                                <div className="form-group row">
                                    <label className="col-12" htmlFor="example-text-input">Name</label>
                                    <div className="col-md-12">
                                        <input type="text" className="form-control" ref={register()} defaultValue={user.name} name="name" placeholder="Name " />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-12" htmlFor="example-text-input">Email</label>
                                    <div className="col-md-12">
                                        <input type="text" className="form-control" defaultValue={user.email} name="email" placeholder="Email" disabled />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-12 row" htmlFor="example-text-input">Role</label>
                                    <Select
                                        defaultValue={getDefaultValue(user.role, 'role')}
                                        placeholder={'User Role'}
                                        options={userRolesEdit}
                                        onChange={updateUserRole}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="col-12 row" htmlFor="example-text-input">Status</label>
                                    <Select
                                        defaultValue={getDefaultValue(user.activated, 'status')}
                                        placeholder={'User Status'}
                                        options={statusActiveInactive}
                                        onChange={updateUserStatus}
                                    />
                                </div>
                                <div className="form-group row">
                                    <label className="col-12" htmlFor="example-text-input">Username</label>
                                    <div className="col-md-12">
                                        <input type="text" className="form-control" defaultValue={user.userName} name="example-text-input" placeholder="Username" disabled />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-12" htmlFor="example-text-input">Password</label>
                                    <div className="col-md-12">
                                        <input type="password" className="form-control" ref={register()} name="password" placeholder="Password" />
                                    </div>
                                </div>

                            </div>
                            <div className="block-content block-content-sm block-content-full bg-body-light">
                                <div className="row">
                                    <div className="col-6">
                                        <Link to={`/dashboard/users`} >
                                            <button type="button" className="btn btn-danger" data-wizard="prev">
                                                <i className="fa fa-angle-left mr-5" /> Cancel
                                        </button>
                                        </Link>
                                    </div>
                                    <div className="col-6 text-right">
                                        <button type="submit" className="btn btn-primary" data-wizard="finish">
                                            <i className="fa fa-check mr-5" /> Submit
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    }
                </div>
            </div>
        </div>
    )
}

export default EditUsers;
