import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Select from 'react-select';
import { yesOrNo } from '../../../utils/helpers';
import { useForm } from "react-hook-form";
import { getOrganizationDetails, updateOrganizationDetails } from '../../../services/v1/organizationApi';
import { useDispatch, useSelector } from 'react-redux';
import { getDeviceIds } from '../../../services/v1/deviceApi';
import { getUserIds } from '../../../services/v1/userApi';

const EditOrganization = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [defaultValue, setDefaultValue] = useState(null);
    const [devices, setDevices] = useState(null);
    const [users, setUsers] = useState(null);
    const { register, handleSubmit } = useForm();

    const { data, loading, deviceIds, userIds } = useSelector(
        state => ({
            data: state.organization.data,
            loading: state.organization.loading,
            deviceIds: state.devices.deviceIds,
            userIds: state.user.userIds
        })
    );

    const getDefaultValue = (value, type) => {
        let data = []
        switch (type) {
            case 'user_id':
                if (value) {
                    value.forEach(item => {
                        data.push({
                            value: item._id,
                            label: item.name,
                            type: type
                        })
                    });
                }
                break;
            case 'device_id':
                value.forEach(item => {
                    data.push({
                        value: item._id,
                        label: item.deviceId,
                        type: type
                    })
                });
                break;
            default:
                data = yesOrNo(type).find((element) => { return element.value === value })
                break;
        }
        return data;
    }

    useEffect(() => {
        dispatch(getOrganizationDetails(id));
        dispatch(getDeviceIds({
            type: 'organization',
            operation: 'eq',
            value: id
        }))
        dispatch(getUserIds())
    }, [dispatch]);

    const onSubmitForm = (formData) => {
        const params = {
            ...formData
        }
        if (defaultValue != null) {
            params.is_default = defaultValue
        }
        if (devices != null) {
            params.devices = devices
        }
        if (users != null) {
            params.users = users
        }
        dispatch(updateOrganizationDetails(params, id))
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
            {!loading &&
                <div className="col-md-12">
                    <div className="block">
                        <div className="block-header block-header-default">
                            <h3 className="block-title">Edit Organization</h3>
                            <div className="block-options">
                                <Link to={'/dashboard/settings/organization'} >
                                    <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Organization">
                                        <i className="si si-arrow-left"></i>
                                    </button>
                                </Link>
                                <Link to={'/dashboard/settings/organization/add'} >
                                    <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Add Organization">
                                        <i className="si si-plus"></i>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="col-12 block-content block-content-full">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="wizard-validation-classic-customer-name">Name</label>
                                            <input className="form-control" type="text" ref={register({ required: true })} name="name" defaultValue={data.name} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="wizard-validation-classic-customer-name">Description</label>
                                            <input className="form-control" type="text" ref={register({ required: true })} name="description" defaultValue={data.description} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="profile-settings-name">Default</label>
                                            <Select
                                                defaultValue={getDefaultValue(data.isDefault, 'is_default')}
                                                placeholder={'Default'}
                                                options={yesOrNo('is_default')}
                                                onChange={(e) => hanldeSelect(e, 'is_default')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="profile-settings-name">Users</label>
                                            {!loading && userIds.length > 0 &&
                                                <Select
                                                    defaultValue={getDefaultValue(data.users, 'user_id')}
                                                    placeholder={'Users'}
                                                    options={userIds}
                                                    isMulti={true}
                                                    onChange={(e) => hanldeSelect(e, 'user_id')}
                                                />
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="profile-settings-name">Devices</label>
                                            {!loading && deviceIds.length > 0 &&
                                                <Select
                                                    defaultValue={getDefaultValue(data.devices, 'device_id')}
                                                    placeholder={'Devices'}
                                                    options={deviceIds}
                                                    isMulti={true}
                                                    onChange={(e) => hanldeSelect(e, 'device_id')}
                                                />
                                            }
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
            }
        </div>
    )
}
export default EditOrganization;
