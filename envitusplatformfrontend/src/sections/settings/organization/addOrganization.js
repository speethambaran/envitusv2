import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { addOrganization } from '../../../services/v1/organizationApi';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { yesOrNo } from '../../../utils/helpers';
import { getDeviceIds } from '../../../services/v1/deviceApi';
import { getUserIds } from '../../../services/v1/userApi';

const AddOrganization = () => {

    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const [defaultValue, setDefaultValue] = useState(null);
    const [devices, setDevices] = useState(null);
    const [users, setUsers] = useState(null);

    const { deviceIds, userIds } = useSelector(
        state => ({
            deviceIds: state.devices.deviceIds,
            userIds: state.user.userIds
        })
    );

    useEffect(() => {
        dispatch(getDeviceIds({ type: 'organization-add' }))
        dispatch(getUserIds())
    }, [dispatch]);

    const onSubmitForm = (formData) => {
        const params = {
            ...formData
        }
        if (defaultValue != null) {
            params.is_default = defaultValue;
        }
        if (devices != null) {
            params.devices = devices;
        }
        if (users != null) {
            params.users = users;
        }
        dispatch(addOrganization(params));
    }

    const hanldeSelect = (option, type) => {
        const ids = [];
        switch (type) {
            case 'is_default':
                setDefaultValue(option.value)
                break;
            case 'device_id':
                if (option != null) {
                    for (let index = 0; index < option.length; index++) {
                        const item = option[index];
                        ids.push(item.value)
                    }
                }
                setDevices(ids)
                break;
            case 'user_id':
                if (option != null) {
                    for (let index = 0; index < option.length; index++) {
                        const item = option[index];
                        ids.push(item.value)
                    }
                }
                setUsers(ids)
                break;
            default:
        }

    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="block">
                    <div className="block-header block-header-default">
                        <h3 className="block-title">Add Organization</h3>
                        <div className="block-options">
                            <Link to={'/dashboard/settings/organization'} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Organization List">
                                    <i className="si si-arrow-left"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className="col-12 block-content block-content-full">
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" className="form-control" ref={register({ required: true })} name="name" placeholder="Name.." />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input type="text" className="form-control" ref={register({ required: true })} name="description" placeholder="Description" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="profile-settings-name">Default</label>
                                        <Select
                                            defaultValue={yesOrNo('is_default')[1]}
                                            placeholder={'Default'}
                                            options={yesOrNo('is_default')}
                                            onChange={(e) => hanldeSelect(e, 'is_default')}
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="profile-settings-name">Users</label>
                                        <Select
                                            placeholder={'Users'}
                                            options={userIds}
                                            isMulti={true}
                                            onChange={(e) => hanldeSelect(e, 'user_id')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="profile-settings-name">Devices</label>
                                        <Select
                                            placeholder={'Devices'}
                                            options={deviceIds}
                                            isMulti={true}
                                            onChange={(e) => hanldeSelect(e, 'device_id')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block-content block-content-sm block-content-full bg-body-light">
                            <div className="row">
                                <div className="col-12">
                                    <button type="submit" className="btn btn-alt-primary">Submit</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddOrganization;
