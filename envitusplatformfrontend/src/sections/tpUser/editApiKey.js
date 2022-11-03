import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './apiKey.scss'
import { getApiKeyDetails, updateApiKey } from '../../services/v1/apiKeyApi';
import { useParams, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { apiKeyStatusEdit } from '../../utils/helpers';

const EditApiKey = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [apiStatus, setApiStatus] = useState(null);
    const { register, handleSubmit } = useForm();

    const getDefaultValue = (value) => {
        const status = value ? 'enabled' : 'disabled';
        const data = apiKeyStatusEdit.find((element) => { return element.value === status })
        return data;
    }

    const { data, loading } = useSelector(
        state => ({
            data: state.thirdPartyUser.data,
            loading: state.thirdPartyUser.loading
        })
    );

    useEffect(() => {
        dispatch(getApiKeyDetails(id));
    }, [dispatch]);

    const updateApiStatus = (status) => {
        setApiStatus(status.value == 'enabled' ? true : false)
    }

    const onSubmitForm = (formData) => {
        const params = {
            ...formData,
            status: apiStatus != null ? apiStatus : data.activated
        }
        dispatch(updateApiKey(params, id));
    }

    const deleteKey = () => {

    }

    return (
        <div>
            { !loading &&
                <div className="row">
                    <div className="col-md-12">
                        <div className="block">
                            <div className="block-header block-header-default">
                                <h3 className="block-title">Update API Key Details</h3>
                                <div className="block-options">
                                    <Link to={'/dashboard/settings/developers'} >
                                        <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Api List">
                                            <i className="si si-arrow-left"></i>
                                        </button>
                                    </Link>
                                    <Link to={'/dashboard/settings/apiKey/add'} >
                                        <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Add Api Key">
                                            <i className="si si-plus"></i>
                                        </button>
                                    </Link>
                                    {/* <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Delete Api key"
                                        onClick={() => { deleteKey() }}>
                                        <i className="fa fa-trash"></i>
                                    </button> */}
                                </div>
                            </div>
                            <div className="block-content">
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className="form-group row">
                                        <label className="col-12" for="example-text-input">Name</label>
                                        <div className="col-md-12">
                                            <input type="text" className="form-control" ref={register({ required: true })} defaultValue={data.name} name="name" placeholder="Name.." />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12" for="example-text-input">Rate Limit</label>
                                        <div className="col-md-12">
                                            <input type="number" min="1" className="form-control" ref={register({ required: true })} defaultValue={data.limit} name="limit" placeholder="Api Rate Limit.." />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="profile-settings-name">Status</label>
                                        <Select
                                            defaultValue={getDefaultValue(data.activated)}
                                            placeholder={'Status'}
                                            options={apiKeyStatusEdit}
                                            onChange={updateApiStatus}
                                        />
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-alt-primary">Update</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default EditApiKey;