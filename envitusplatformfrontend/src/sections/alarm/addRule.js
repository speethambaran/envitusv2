/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { addAlarmRule } from '../../services/v1/alarmApi';
import { alarmClearingMode, deviceParams, alarmRuleFunctions } from '../../utils/helpers';
import { getDeviceIds, getDeviceParams } from '../../services/v1/deviceApi';

const AddRule = () => {
    const { register, handleSubmit } = useForm();
    const [devices, setDeviceID] = useState(null);
    const [clearingMode, setClearingMode] = useState('Manual');
    const [alarmParameter, setAlarmParameter] = useState('temperature');
    const [alarmFunction, setAlarmFunction] = useState('gt');
    const dispatch = useDispatch();

    const { deviceIds, sensorParameters } = useSelector(
        state => ({
            deviceIds: state.devices.deviceIds,
            sensorParameters: state.devices.sensorParameters
        })
    );

    useEffect(() => {
        dispatch(getDeviceIds())
        dispatch(getDeviceParams())
    }, [dispatch]);


    const onSubmitForm = (formData) => {
        const params = {
            ...formData,
            clearing_mode: clearingMode,
            devices: devices,
            info: [{
                parameter: alarmParameter,
                function: alarmFunction,
                limit: formData.limit
            }]
        }
        dispatch(addAlarmRule(params));
    }

    const hanldeSelect = (option, type) => {
        const ids = [];
        switch (type) {
            case 'clearing_mode':
                setClearingMode(option.value)
                break;
            case 'device_id':
                if (option != null) {
                    for (let index = 0; index < option.length; index++) {
                        const item = option[index];
                        ids.push(item.value)
                    }
                    setDeviceID(ids)
                } else {
                    setDeviceID(null)
                }
                break;
            case 'device_params':
                setAlarmParameter(option.value);

                break;
            case 'alarm_rule_function':
                setAlarmFunction(option.value)
                break;
            default:
        }

    }

    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'clearing_mode':
                data = alarmClearingMode.find((element) => { return element.value === value })
                break;
            case 'device_params':
                data = deviceParams.find((element) => { return element.value === value })
                break;
            case 'alarm_rule_function':
                data = alarmRuleFunctions.find((element) => { return element.value === value })
                break;
            default:
                break;
        }

        return data;
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="block">
                    <div className="block-header block-header-default">
                        <h3 className="block-title"><b>Add New Rule</b></h3>
                        <div className="block-options">
                            <Link to={'/dashboard/alarmrule'} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Alarm Rule List">
                                    <i className="si si-arrow-left" />
                                </button>
                            </Link>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className="col-12 block-content block-content-full">
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-deviceid">Rule Name</label>
                                        <input className="form-control" type="text" ref={register({ required: true })}
                                            id="rule_name" name="rule_name" placeholder="Rule Name" required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-deviceid">Description</label>
                                        <input className="form-control" type="text" ref={register({ required: true })}
                                            id="description" name="description" placeholder="Description" required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-deviceid">Clearing Mode</label>
                                        <Select
                                            defaultValue={getDefaultValue('Manual', 'clearing_mode')}
                                            placeholder={'Alarm Clearing Mode'}
                                            options={alarmClearingMode}
                                            onChange={(e) => hanldeSelect(e, 'clearing_mode')}
                                            required
                                        />
                                    </div>
                                    {clearingMode === 'Time Based' &&
                                        <div className="form-group">
                                            <label htmlFor="wizard-validation-classic-deviceid">Interval</label>
                                            <input className="form-control" type="text" ref={register({ required: true })}
                                                id="time_interval" name="time_interval" placeholder="Intervel"
                                            />
                                        </div>
                                    }
                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-type">Device IDs</label>
                                        <Select className={'mb-10'}
                                            defaultValue={''}
                                            placeholder={'Device IDs'}
                                            options={deviceIds}
                                            id="deviceIDs"
                                            isMulti="true"
                                            onChange={(e) => hanldeSelect(e, 'device_id')}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-deviceid">Select Date(Optional)</label>
                                        <input className="form-control" type="date" ref={register()}
                                            id="date" name="date" placeholder="Date"
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="row items-push">
                                        <div className="col-lg-4">

                                            <div className="form-group">
                                                <label htmlFor="wizard-validation-classic-customer-name">Parameter</label>
                                                <Select className={'mb-10'}
                                                    defaultValue={''}
                                                    placeholder={'Parameter'}
                                                    options={sensorParameters}
                                                    onChange={(e) => hanldeSelect(e, 'device_params')}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label htmlFor="wizard-validation-classic-locationId">Function</label>
                                                <Select className={'mb-10'}
                                                    defaultValue={getDefaultValue('gt', 'alarm_rule_function')}
                                                    placeholder={'Function'}
                                                    options={alarmRuleFunctions}
                                                    onChange={(e) => hanldeSelect(e, 'alarm_rule_function')}
                                                />
                                            </div>

                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <label htmlFor="wizard-validation-classic-latitude">Limit</label>
                                                <input className="form-control" type="text" ref={register({ required: true })}
                                                    id="limit" name="limit" placeholder="limit" required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="block-content block-content-sm block-content-full bg-body-light">
                            <div className="row">
                                <div className="col-12 text-right">
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

export default AddRule;
