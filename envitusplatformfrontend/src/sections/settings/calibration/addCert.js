/* eslint-disable eol-last */
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addCalibCert } from '../../../services/v1/calibrationApi';
import { getDeviceIds } from '../../../services/v1/deviceApi';
import Select from 'react-select';

const AddCert = () => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const [devices, setDevices] = useState(null);
    const [file, setFile] = useState('');

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    }
    const onSubmitForm = (formData) => {
        const params = new FormData();
        params.append('cert_id', formData.cert_id);
        params.append('expire_date', formData.expire_date);
        if (devices != null) {
            params.append('device_id', devices);
        }
        
        params.append('calibration-cert', file)
        dispatch(addCalibCert(params));
    }

    const { deviceIds } = useSelector(
        state => ({
            deviceIds: state.devices.deviceIds
        })
    );
    const hanldeSelect = (option, type) => {
        switch (type) {
            case 'device_id':
                setDevices(option.value)
                break;
        }
    }
    useEffect(() => {
        dispatch(getDeviceIds())
    }, [dispatch]);

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="block">
                    <div className="block-header block-header-default">
                        <h3 className="block-title">Add Calibration Certificate</h3>
                        <div className="block-options">
                            <Link to={'/dashboard/settings/calibration'} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Calibration Certificates">
                                    <i className="si si-arrow-left"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="block-content">
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">Certificate Id</label>
                                <div className="col-md-12">
                                    <input type="text" className="form-control" ref={register({ required: true })} name="cert_id" placeholder="Certificate Id.." />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="profile-settings-name">Device ID</label>
                                <Select
                                    placeholder={'Device'}
                                    options={deviceIds}
                                    onChange={(e) => hanldeSelect(e, 'device_id')}
                                />
                            </div>
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">Expiry</label>
                                <div className="col-md-12">
                                    <input type="date" min="1" className="form-control" ref={register({ required: true })} name="expire_date" placeholder="Expiry Date.." />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">Upload Certificate</label>
                                <div className="col-md-12">
                                    <input type="file" accept="application/pdf" onChange={handleChange} />
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

export default AddCert;