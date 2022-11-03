import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { timeZone, deviceForm, deviceStatusType } from '../../utils/helpers';
import { getSensorTypeIdList, getSensorTypeDetails } from '../../services/v1/sensorApi';
import { addDevice } from '../../services/v1/deviceApi';
import { useForm } from "react-hook-form";
import { useHistory, Link } from 'react-router-dom';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

const AddDevice = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { register, handleSubmit } = useForm();
    const [parameterFilter, setParameterFilter] = useState({
        'filter': {},
        'calibration': {}
    });
    const [deviceType, setDeviceType] = useState('Sensor')
    const [deviceFamily, setDeviceFamily] = useState('Air')
    const [deviceSubType, setDeviceSubType] = useState(null)
    const [deviceTimeZone, setDeviceTimeZone] = useState('Asia/Calcutta')
    const [deviceGrade, setDeviceGrade] = useState('Consumer')
    const [deviceDeployment, setDeviceDeployment] = useState('Indoor')
    const [deviceOrganization, setDeviceOrganization] = useState(null)
    const [deviceStatus, setDeviceStatus] = useState('enabled')

    const { organizationIds, sensorTypeIds, sensorTypeDetails } = useSelector(
        state => ({
            organizationIds: state.organization.orgIds,
            sensorTypeIds: state.sensors.sensorTypeIds,
            sensorTypeDetails: state.sensors.sensorTypeDetails
        })
    );

    useEffect(() => {
        dispatch(getSensorTypeIdList());
    }, [dispatch]);

    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'timezone':
                data = timeZone.find((element) => { return element.value === value })
                break;
            case 'device_grade':
                data = deviceForm.deviceGrade.find((element) => { return element.value === value })
                break;
            case 'device_deployment':
                data = deviceForm.deviceDeployment.find((element) => { return element.value === value })
                break;
            case 'device_family':
                data = deviceForm.deviceFamily.find((element) => { return element.value === value })
                break;
            case 'device_type':
                data = deviceForm.deviceType.find((element) => { return element.value === value })
                break;
            case 'device_filter':
                data = deviceForm.deviceFilter.find((element) => { return element.value === value })
                break;
            case 'device_calbFunc':
                data = deviceForm.deviceCalbFunc.find((element) => { return element.value === value })
                break;
            case 'device_status':
                data = deviceStatusType.find((element) => { return element.value === value })
                break;
            default:
                break;
        }
        return data;
    }

    const handleSelection = (option, type) => {
        // console.log(option)
        switch (type) {
            case 'timezone':
                setDeviceTimeZone(option.value)
                break;
            case 'device_grade':
                setDeviceGrade(option.value)
                break;
            case 'device_deployment':
                setDeviceDeployment(option.value)
                break;
            case 'device_family':
                setDeviceFamily(option.value)
                break;
            case 'device_type':
                setDeviceType(option.value)
                break;
            case 'sensor_type_id':
                setDeviceSubType(option.value)
                dispatch(getSensorTypeDetails(option.value))
                break;
            case 'organization':
                setDeviceOrganization(option.value)
                break;
            case 'device_status':
                setDeviceStatus(option.value)
                break;
            default:
                break;
        }
    }

    const handleParamSelection = (option, filterType, param) => {
        const params = { ...parameterFilter }
        params[filterType][param] = option.value
        setParameterFilter(params)
    }

    const onSubmitForm = async (formData) => {
        formData.paramDefinitions.forEach((element, i) => {
            formData.paramDefinitions[i]['filterType'] = parameterFilter['filter'][element.paramName]
            formData.paramDefinitions[i]['calibrationType'] = parameterFilter['calibration'][element.paramName]
        });
        const params = {
            ...formData
        }
        params.device_timezone = deviceTimeZone;
        params.device_grade = deviceGrade;
        params.device_deployment = deviceDeployment;
        params.device_family = deviceFamily;
        params.device_type = deviceType;
        params.device_sub_type = deviceSubType;
        params.device_status = deviceStatus;
        if (deviceSubType == null) {
            params.device_sub_type = sensorTypeIds[0].value
        }
        params.device_organization = deviceOrganization;
        if (deviceOrganization == null) {
            if (organizationIds.length > 0) {
                params.device_organization = organizationIds[0].value
            }
        }
        try {
            dispatch(showLoading('sectionBar'))
            const result = await addDevice(params)
            dispatch(hideLoading('sectionBar'))
            if (result) {
                history.push('/dashboard/devices')
            }
        } catch (error) {
            dispatch(hideLoading('sectionBar'))
        }
    }

    return (
        <div>
            <div className="block">
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="block-header block-header-default">
                        <div className="block-title">
                            <strong>ADD NEW DEVICE</strong>
                        </div>
                        <div className="block-options">
                            <Link to={'/dashboard/devices'} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Api List">
                                    <i className="si si-arrow-left"></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="block-content">
                        <div className="row">
                            <div className="col-4">
                                <div className="form-group">
                                    <label htmlFor="profile-settings-name">Organization</label>
                                    {organizationIds.length > 0 &&
                                        <Select
                                            defaultValue={organizationIds[0]}
                                            placeholder={'Select organization'}
                                            options={organizationIds}
                                            onChange={(e) => handleSelection(e, 'organization')}
                                        />
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-deviceid">Device Id</label>
                                    <input className="form-control" type="text" ref={register({ required: true })} name="device_id" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-type">Type</label>
                                    <Select className={'mb-10'}
                                        defaultValue={getDefaultValue('Sensor', 'device_type')}
                                        placeholder={'Device Type'}
                                        options={deviceForm.deviceType}
                                        onChange={(e) => handleSelection(e, 'device_type')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-family">Family</label>
                                    <Select className={'mb-10'}
                                        defaultValue={getDefaultValue('Air', 'device_family')}
                                        placeholder={'Device Family'}
                                        options={deviceForm.deviceFamily}
                                        onChange={(e) => handleSelection(e, 'device_family')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-subtype">Sub Type</label>
                                    {sensorTypeIds.length > 0 &&
                                        <Select className={'mb-10'}
                                            defaultValue={sensorTypeIds[0]}
                                            placeholder={'Device Sub type'}
                                            options={sensorTypeIds}
                                            onChange={(e) => handleSelection(e, 'sensor_type_id')}
                                        />
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-timezone">Time Zone</label>
                                    <Select className={'mb-10'}
                                        defaultValue={getDefaultValue('Asia/Calcutta', 'timezone')}
                                        placeholder={'Device Time Zone'}
                                        options={timeZone}
                                        onChange={(e) => handleSelection(e, 'timezone')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-customer-name">Customer Name</label>
                                    <input className="form-control" pattern="[A-Za-z]*" type="text" ref={register({ required: true })} name="customer_name" />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-lot-no">Lot No</label>
                                    <input className="form-control" type="text" ref={register({ required: true })} name="lot_no" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-serial-no">Serial No</label>
                                    <input className="form-control" type="number" ref={register({ required: true })} name="serial_no" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-grade">Grade</label>
                                    <Select className={'mb-10'}
                                        defaultValue={getDefaultValue('Consumer', 'device_grade')}
                                        placeholder={'Device Grade'}
                                        options={deviceForm.deviceGrade}
                                        onChange={(e) => handleSelection(e, 'device_grade')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-deployment">Deployment</label>
                                    <Select className={'mb-10'}
                                        defaultValue={getDefaultValue('Indoor', 'device_deployment')}
                                        placeholder={'Device Deployment'}
                                        options={deviceForm.deviceDeployment}
                                        onChange={(e) => handleSelection(e, 'device_deployment')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-locationId">Location ID</label>
                                    <input className="form-control" type="text" ref={register({ required: true })} name="location_id" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-city">City</label>
                                    <input className="form-control" pattern="[A-Za-z]*" type="text" ref={register({ required: true })} name="city" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-deployment">Device</label>
                                    <Select className={'mb-10'}
                                        defaultValue={getDefaultValue('enabled', 'device_status')}
                                        placeholder={'Device Status'}
                                        options={deviceStatusType}
                                        onChange={(e) => handleSelection(e, 'device_status')}
                                    />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-zone">Zone</label>
                                    <input className="form-control" pattern="[A-Za-z]*" type="text" ref={register({ required: true })} name="zone" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-landmark">Land Mark</label>
                                    <input className="form-control" type="text" ref={register({ required: true })} name="land_mark" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-latitude">Latitude</label>
                                    <input className="form-control" type="number" step="any" ref={register({ required: true })} name="latitude" />
                                </div><div className="form-group">
                                    <label htmlFor="wizard-validation-classic-longitude">Longitude</label>
                                    <input className="form-control" type="number" step="any" ref={register({ required: true })} name="longitude" />
                                </div><div className="form-group">
                                    <label htmlFor="wizard-validation-classic-building">Building</label>
                                    <input className="form-control" type="text" ref={register({ required: true })} name="building" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="wizard-validation-classic-floor">Floor</label>
                                    <input className="form-control" type="text" ref={register({ required: true })} name="floor" />
                                </div>
                            </div>
                        </div>

                        {sensorTypeDetails.specs && sensorTypeDetails.specs.map((param, i) => {
                            return (
                                <div className="row items-push param-block" key={i}>
                                    <div className="col-lg-2">
                                        <p className="text-muted">{param.displayName}</p>
                                    </div>
                                    <input type="hidden" className="form-control form-control-lg" defaultValue={param.paramName}
                                        ref={register()} name={`paramDefinitions[${i}]['paramName']`} />
                                    <div className="col-lg-10">
                                        <div className="row">
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label htmlFor="profile-settings-name">Range</label>
                                                    <input type="number" className="form-control form-control-lg" defaultValue={param.maxRanges.min}
                                                        ref={register()} step="any" name={`paramDefinitions[${i}].maxRanges.min`} placeholder="Min Value" />
                                                    <input type="number" className="form-control form-control-lg mt-10" defaultValue={param.maxRanges.max}
                                                        ref={register()} step="any" name={`paramDefinitions[${i}].maxRanges.max`} placeholder="Max Value" />
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label htmlFor="profile-settings-name">Filtering</label>
                                                    <Select className={'mb-10'}
                                                        defaultValue={getDefaultValue('none', 'device_filter')}
                                                        placeholder={'Device Filter'}
                                                        options={deviceForm.deviceFilter}
                                                        onChange={(e) => handleParamSelection(e, 'filter', param.paramName)}
                                                    />
                                                    {parameterFilter['filter'][param.paramName] == 'WMAFilter' &&
                                                        <div>
                                                            <label htmlFor="profile-settings-name">Offsets</label>
                                                            <input type="number" step="any" className="form-control form-control-lg" ref={register()} name={`paramDefinitions[${i}]['filter'].weightT0`} placeholder="Weight T0" />
                                                            <input type="number" step="any" className="form-control form-control-lg mt-10" ref={register()} name={`paramDefinitions[${i}]['filter'].weightT1`} placeholder="Weight T1" />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label htmlFor="profile-settings-name">Calibration</label>
                                                    <Select className={'mb-10'}
                                                        defaultValue={getDefaultValue('none', 'device_calbFunc')}
                                                        placeholder={'Device Calibration'}
                                                        options={deviceForm.deviceCalbFunc}
                                                        onChange={(e) => handleParamSelection(e, 'calibration', param.paramName)}
                                                    />
                                                    {(parameterFilter['calibration'][param.paramName] == 'scale' ||
                                                        parameterFilter['calibration'][param.paramName] == 'translate') &&
                                                        <div>
                                                            <label htmlFor="profile-settings-name">Offset</label>
                                                            <input type="number" step="any" className="form-control form-control-lg" placeholder="Weight"
                                                                ref={register()} name={`paramDefinitions[${i}]['calibration']['offset']`} />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                {(parameterFilter['calibration'][param.paramName] == 'scale' ||
                                                    parameterFilter['calibration'][param.paramName] == 'translate') &&
                                                    <div className="form-group">
                                                        <label htmlFor="profile-settings-name">Range</label>
                                                        <input type="number" step="any" className="form-control form-control-lg" placeholder="Min Value"
                                                            ref={register()} name={`paramDefinitions[${i}]['calibration']['min']`} />
                                                        <input type="number" step="any" className="form-control form-control-lg mt-10" placeholder="Max Value"
                                                            ref={register()} name={`paramDefinitions[${i}]['calibration']['max']`} />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="block-content block-content-sm block-content-full bg-body-light">
                        <div className="row">
                            <div className="col-6">

                            </div>
                            <div className="col-6 text-right">
                                <Link to={'/dashboard/devices'} >
                                    <button type="button" className="btn btn-alt-secondary mr-5">
                                        <i className="fa fa-angle-left mr-5"></i> Cancel
                                                </button>
                                </Link>
                                <button type="submit" className="btn btn-alt-primary">
                                    <i className="fa fa-check mr-5"></i> Submit
                                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddDevice;