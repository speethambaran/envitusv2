import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { getAlarmRuleDetails, updateAlarmRule } from '../../services/v1/alarmApi';
import { alarmClearingMode, deviceParams, alarmRuleFunctions, text } from '../../utils/helpers';
import { getDeviceIds } from '../../services/v1/deviceApi';

const EditRule = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [devices, setDeviceID] = useState(null);
    const [clearingMode, setClearingMode] = useState(null);
    const [alarmParameter, setAlarmParameter] = useState(null);
    const [alarmFunction, setAlarmFunction] = useState(null);


    const { data, loading, deviceIds } = useSelector(
        state => ({
            data: state.alarmData.data,
            loading: state.alarmData.loading,
            deviceIds: state.devices.deviceIds
        })
    );

    useEffect(() => {
        dispatch(getDeviceIds())
        dispatch(getAlarmRuleDetails(id));
    }, [dispatch]);

    const onSubmitForm = (formData) => {
        const params = {
            ...formData,
            clearing_mode: data.clearingMode,
            info: [{ ...data.info[0] }]
        }
        params.info[0].limit = formData.limit
        if (devices != null) {
            params.devices = devices
        }

        if (clearingMode != null) {
            params.clearing_mode = clearingMode
        }
        if (alarmParameter != null) {
            params.info[0].parameter = alarmParameter
        }

        if (alarmFunction != null) {
            params.info[0].function = alarmFunction
        }

        dispatch(updateAlarmRule(params, id));
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
                setAlarmParameter(option.value)
                break;
            case 'alarm_rule_function':
                setAlarmFunction(option.value)
                break;
            default:
        }

    }

    const getDefaultValue = (value, type) => {
        let data = '';
        const deviceIds = [];
        switch (type) {
            case 'clearing_mode':
                data = alarmClearingMode.find((element) => { return element.value === value })
                if (value == 'Time Based' && clearingMode == null) {
                    setClearingMode(value)
                }
                break;
            case 'device_params':
                data = deviceParams.find((element) => { return element.value === value })
                break;
            case 'alarm_rule_function':
                data = alarmRuleFunctions.find((element) => { return element.value === value })
                break;
            case 'device_id':
                if (value != null) {
                    value.forEach(device => {
                        deviceIds.push({
                            type: 'device_id',
                            value: device._id,
                            label: device.deviceId
                        })
                    });
                }
                data = deviceIds;
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
                        <h3 className="block-title"><b>Edit Rule</b></h3>
                        <div className="block-options">
                            <Link to={'/dashboard/alarmrule'} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Alarm Rule List">
                                    <i className="si si-arrow-left"></i>
                                </button>
                            </Link>
                            <Link to={'/dashboard/alarmrule/add'} >
                                <button type="button" className="btn btn-sm btn-secondary" data-toggle="tooltip" title="Add New Rule">
                                    <i className="si si-plus"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                    {!loading &&
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="col-12 block-content block-content-full">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="wizard-validation-classic-deviceid">Rule Name</label>
                                            <input className="form-control" type="text" ref={register({ required: true })}
                                                id="rule_name" name="rule_name" defaultValue={data.ruleName} placeholder="Rule Name" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="wizard-validation-classic-deviceid">Description</label>
                                            <input className="form-control" type="text" ref={register({ required: true })}
                                                id="description" name="description" defaultValue={data.description} placeholder="Description" required />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="wizard-validation-classic-deviceid">Clearing Mode</label>
                                            <Select
                                                defaultValue={getDefaultValue(data.clearingMode, 'clearing_mode')}
                                                placeholder={'Alarm Clearing Mode'}
                                                options={alarmClearingMode}
                                                onChange={(e) => hanldeSelect(e, 'clearing_mode')}
                                                required
                                            />
                                        </div>
                                        {(clearingMode == null && data.clearingMode == 'Time Based') || clearingMode == 'Time Based' &&
                                            <div className="form-group">
                                                <label htmlFor="wizard-validation-classic-deviceid">Interval</label>
                                                <input className="form-control" type="text" ref={register({ required: true })}
                                                    id="time_interval" name="time_interval" defaultValue={data.timeInterval} placeholder="Intervel" />
                                            </div>
                                        }
                                        <div className="form-group">
                                            <label htmlFor="wizard-validation-classic-type">Device IDs</label>
                                            <Select className={'mb-10'}
                                                defaultValue={getDefaultValue(data.devices, 'device_id')}
                                                placeholder={'Device IDs'}
                                                options={deviceIds}
                                                id="deviceIDs"
                                                isMulti="true"
                                                onChange={(e) => hanldeSelect(e, 'device_id')}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="row items-push">
                                            <div className="col-lg-4">

                                                <div className="form-group">
                                                    <label htmlFor="wizard-validation-classic-customer-name">Parameter</label>
                                                    <Select className={'mb-10'}
                                                        defaultValue={getDefaultValue(data.info ? data.info[0].parameter : '', 'device_params')}
                                                        placeholder={'Parameter'}
                                                        options={deviceParams}
                                                        onChange={(e) => hanldeSelect(e, 'device_params')}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group">
                                                    <label htmlFor="wizard-validation-classic-locationId">Function</label>
                                                    <Select className={'mb-10'}
                                                        defaultValue={getDefaultValue(data.info ? data.info[0].function : '', 'alarm_rule_function')}
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
                                                        id="limit" name="limit" placeholder="limit" defaultValue={data.info ? data.info[0].limit : ''} required />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="block-content block-content-sm block-content-full bg-body-light">
                                <div className="row">
                                    <div className="col-12 text-right">
                                        <button type="submit" className="btn btn-alt-primary">{text.buttons.update}</button>
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

export default EditRule;