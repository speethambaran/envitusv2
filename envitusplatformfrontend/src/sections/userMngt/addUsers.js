import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { addNewUser } from '../../services/v1/userApi';
import Select from 'react-select';
import { userRolesEdit } from '../../utils/helpers';

const AddUsers = () => {
    const { register, handleSubmit } = useForm();
    const [userRole, setUserRole] = useState('Admin');
    const dispatch = useDispatch();

    const onSubmitForm = (formData) => {
        const params = {
            ...formData
        }
        if(userRole != null){
            params.role = userRole
        }
        dispatch(addNewUser(params))
    }

    const getDefaultValue = (value) => {
        const data = userRolesEdit.find((element) => { return element.value === value })
        return data;
    }

    const updateUserRole = (role) => {
        setUserRole(role.value)
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="block">
                    <div className="block-header block-header-default">
                        <h3 className="block-title">Add New User</h3>
                        <div className="block-options">
                            <Link to={'/dashboard/users'} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Users List">
                                    <i className="si si-arrow-left"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className="block-content">
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">Name</label>
                                <div className="col-md-12">
                                    <input type="text" className="form-control" ref={register()} id="name" name="name" placeholder="Name" required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">Email</label>
                                <div className="col-md-12">
                                    <input type="text" className="form-control" ref={register()} id="email" name="email" placeholder="Email" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-12 row" htmlFor="example-text-input">Role</label>
                                <Select
                                    defaultValue={getDefaultValue('Admin')}
                                    placeholder={'User Role'}
                                    options={userRolesEdit}
                                    onChange={updateUserRole}
                                />
                            </div>
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">Username</label>
                                <div className="col-md-12">
                                    <input type="text" className="form-control" ref={register()} id="username" name="username" placeholder="Username" required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">Password</label>
                                <div className="col-md-12">
                                    <input type="password" className="form-control" ref={register()} id="password" name="password" placeholder="Password" required />
                                </div>
                            </div>
                        </div>
                        <div className="block-content block-content-sm block-content-full bg-body-light">
                            <div className="row">
                                <div className="col-6">
                                    <Link to={`/dashboard/users`} >
                                        <button type="button" className="btn btn-danger" data-wizard="prev">
                                            <i className="fa fa-angle-left mr-5"></i> Cancel
                                        </button>
                                    </Link>
                                </div>
                                <div className="col-6 text-right">
                                    <button type="submit" className="btn btn-primary" data-wizard="finish">
                                        <i className="fa fa-check mr-5"></i> Submit
                                        </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddUsers;