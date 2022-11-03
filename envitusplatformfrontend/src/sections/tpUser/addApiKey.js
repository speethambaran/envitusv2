import React from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { addApiKey } from '../../services/v1/apiKeyApi';
import { Link } from 'react-router-dom';

const AddApiKey = () => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();

    const onSubmitForm = (formData) => {
        dispatch(addApiKey(formData));
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="block">
                    <div className="block-header block-header-default">
                        <h3 className="block-title">Generate New API Key</h3>
                        <div className="block-options">
                            <Link to={'/dashboard/settings/developers'} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Api List">
                                    <i className="si si-arrow-left"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="block-content">
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">Name</label>
                                <div className="col-md-12">
                                    <input type="text" className="form-control" ref={register({ required: true })} name="name" placeholder="Name.." />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">Rate Limit</label>
                                <div className="col-md-12">
                                    <input type="number" min="1" className="form-control" ref={register({ required: true })} name="limit" placeholder="Api Rate Limit.." />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-alt-primary">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddApiKey;
