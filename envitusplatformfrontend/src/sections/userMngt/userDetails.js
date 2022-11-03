/* eslint-disable eol-last */
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../services/v1/userApi';

const UserDetails = () => {
    const { id } = useParams();
    const { user } = useSelector(
        state => ({
            user: state.user.data
        })
    );
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserDetails(id));
    }, [dispatch]);

    return (
        <div className="block">
            <div className="block-header block-header-default">
                <h3 className="block-title">User Details</h3>
                <div className="block-options">
                    <Link to={'/dashboard/users'} >
                        <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Back to User List">
                            <i className="si si-arrow-left"></i>
                        </button>
                    </Link>
                    <Link to={`/dashboard/users/edit/${id}`} >
                        <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Edit User">
                            <i className="fa fa-pencil"></i>
                        </button>
                    </Link>
                    <Link to={'/dashboard/users/add'} >
                        <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Add New User">
                            <i className="si si-plus"></i>
                        </button>
                    </Link>

                </div>
            </div>

            <div className="col-12 block-content block-content-full">
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="wizard-validation-classic-customer-name">Name</label>
                            <input className="form-control" type="text" defaultValue={user.name} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="wizard-validation-classic-customer-name">Username</label>
                            <input className="form-control" type="text" defaultValue={user.userName} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="wizard-validation-classic-customer-name">Email</label>
                            <input className="form-control" type="text" defaultValue={user.email} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="wizard-validation-classic-customer-name">Role</label>
                            <input className="form-control" type="text" defaultValue={user.role} disabled />
                        </div>
                    </div>
                    <div className="col-4">

                    </div>
                    <div className="col-4">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDetails;