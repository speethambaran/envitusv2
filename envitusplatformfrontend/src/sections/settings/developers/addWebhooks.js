import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { addWebhook } from '../../../services/v1/webhookApi';
import { useRouteMatch, Link } from 'react-router-dom';

const AddWebhooks = () => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const [data, setData] = useState(false);
    const [alerts, setAlerts] = useState(false);

    const onSubmitForm = async (formData) => {
        const params = {
            ...formData
        }
        params.sensor_data = data;
        params.alerts = alerts;
        const result = await dispatch(addWebhook(params));
        console.log(result)
    }

    const handleChange = (type, e) => {
        switch (type) {
            case 'sensor_data':
                setData(e.target.checked);
                break;
            case 'alerts':
                setAlerts(e.target.checked);
                break;
        }
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="block">
                    <div className="block-header block-header-default">
                        <h3 className="block-title">Add Webhook</h3>
                        <div className="block-options">
                            <Link to={'/dashboard/settings/developers'} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Webhook List">
                                    <i className="si si-arrow-left"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="block-content">
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">URL</label>
                                <div className="col-md-12">
                                    <input type="url" className="form-control" ref={register({ required: true })} name="url" placeholder="URL.." />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-12" htmlFor="example-text-input">Secret Key</label>
                                <div className="col-md-12">
                                    <input type="password" className="form-control" ref={register({ required: true })} name="key" placeholder="Secret Key.." />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-12">Events</label>
                                <div className="col-12">
                                    <div className="custom-control custom-checkbox custom-control-inline mb-5">
                                        <input className="custom-control-input" type="checkbox" name="sensor_data" id="example-inline-checkbox1" value="sensor_data" onChange={e => handleChange('sensor_data', e)} />
                                        <label className="custom-control-label" htmlFor="example-inline-checkbox1">Sensor Data</label>
                                    </div>
                                    <div className="custom-control custom-checkbox custom-control-inline mb-5">
                                        <input className="custom-control-input" type="checkbox" name="alerts" id="example-inline-checkbox2" value="alerts" onChange={e => handleChange('alerts', e)} />
                                        <label className="custom-control-label" htmlFor="example-inline-checkbox2">Alerts</label>
                                    </div>

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

export default AddWebhooks;