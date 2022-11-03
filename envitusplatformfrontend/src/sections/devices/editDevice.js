import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { timeZone, deviceForm, deviceStatusType } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import { getDeviceDetails, editDevice } from '../../services/v1/deviceApi';
import { getSensorTypeIdList, getSensorTypeDetails } from '../../services/v1/sensorApi';
import { useForm } from "react-hook-form";
import { showLoading, hideLoading } from 'react-redux-loading-bar';

const EditDevice = () => {
    const { id } = useParams();
    const { device, loading, organizationIds, sensorTypeIds, sensorTypeDetails } = useSelector(
        state => ({
            device: state.devices.data,
            loading: state.devices.loading,
            organizationIds: state.organization.orgIds,
            sensorTypeIds: state.sensors.sensorTypeIds,
            sensorTypeDetails: state.sensors.sensorTypeDetails
        })
    );
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const [parameterFilter, setParameterFilter] = useState({
        'filter': {},
        'calibration': {}
    });
    const [deviceType, setDeviceType] = useState(null)
    const [deviceFamily, setDeviceFamily] = useState(null)
    const [deviceSubType, setDeviceSubType] = useState(null)
    const [deviceTimeZone, setDeviceTimeZone] = useState(null)
    const [deviceGrade, setDeviceGrade] = useState(null)
    const [deviceDeployment, setDeviceDeployment] = useState(null)
    const [deviceOrganization, setDeviceOrganization] = useState(null)
    const [deviceStatusValue, setDeviceStatus] = useState(null)

    useEffect(() => {
        dispatch(getDeviceDetails(id));
        dispatch(getSensorTypeIdList());
    }, [dispatch, id]);

    const getDefaultValue = (value, type, parameter = null) => {
        let data = '';
        const params = { ...parameterFilter }
        switch (type) {
            case 'timezone':
                data = timeZone.find((element) => { return element.value === value })
                break;
            case 'organization_id':
                data = organizationIds.find((element) => { return element.value === value })
                break;
            case 'device_family':
                data = deviceForm.deviceFamily.find((element) => { return element.value === value })
                break;
            case 'device_type':
                data = deviceForm.deviceType.find((element) => { return element.value === value })
                break;
            case 'sensor_type_id':
                data = sensorTypeIds.find((element) => { return element.value === value })
                break;
            case 'device_grade':
                data = deviceForm.deviceGrade.find((element) => { return element.value === value })
                break;
            case 'device_deployment':
                data = deviceForm.deviceDeployment.find((element) => { return element.value === value })
                break;
            case 'device_filter':
                data = deviceForm.deviceFilter.find((element) => { return element.value === value })
                if (data && parameter != null && !params['filter'].hasOwnProperty(parameter)) {
                    params['filter'][parameter] = data.value
                    setParameterFilter(params)
                }
                break;
            case 'device_calbFunc':
                data = deviceForm.deviceCalbFunc.find((element) => { return element.value === value })
                if (data && parameter != null && !params['calibration'].hasOwnProperty(parameter)) {
                    params['calibration'][parameter] = data.value
                    setParameterFilter(params)
                }
                break;
            case 'device_status':
                data = deviceStatusType.find((element) => { return element.value === value })
                break;
            default:
                break;
        }
        return data;
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

        if (deviceTimeZone != null) {
            params.device_timezone = deviceTimeZone
        }
        if (deviceGrade != null) {
            params.device_grade = deviceGrade
        }
        if (deviceDeployment != null) {
            params.device_deployment = deviceDeployment
        }
        if (deviceFamily != null) {
            params.device_family = deviceFamily
        }
        if (deviceType != null) {
            params.device_type = deviceType
        }
        if (deviceSubType != null) {
            params.device_sub_type = deviceSubType
        } else {
            params.device_sub_type = device.subType
        }
        if (deviceOrganization != null) {
            params.device_organization = deviceOrganization
        }

        if (deviceStatusValue != null) {
            params.device_status = deviceStatusValue
        }

        try {
            dispatch(showLoading('sectionBar'))
            const result = await editDevice(id, params);
            dispatch(hideLoading('sectionBar'))
            if (result) {
                history.push('/dashboard/devices')
            }
        } catch (error) {
            dispatch(hideLoading('sectionBar'))
        }
    }

    const handleSelection = (option, type) => {
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
                setParameterFilter({
                    'filter': {},
                    'calibration': {}
                })
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


    return (
        <div>
            <div className="block">
                <div className="block-header block-header-default">
                    <h3 className="block-title"><b>EDIT DEVICE</b></h3>
                    <div className="block-options">
                        <Link to={'/dashboard/devices'} >
                            <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Api List">
                                <i className="si si-arrow-left"></i>
                            </button>
                        </Link>
                        <Link to={'/dashboard/devices/add'} >
                            <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Add New Device">
                                <i className="si si-plus"></i>
                            </button>
                        </Link>
                        <Link to={'/dashboard/livedata'} >
                            <button type="button" className="btn btn-sm btn-secondary" data-toggle="tooltip" title="View Live Data">
                                <i className="fa fa-bar-chart"></i>
                            </button>
                        </Link>

                    </div>
                </div>
                {!loading &&
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className="block-content">
                            <div className="row">
                                <div className="col-4">
                                    <div className="form-group">
                                        <label>Organization</label>
                                        {organizationIds.length > 0 &&
                                            <Select
                                                defaultValue={getDefaultValue(device.organizationId, 'organization_id')}
                                                placeholder={'Select organization'}
                                                options={organizationIds}
                                                onChange={(e) => handleSelection(e, 'organization')}
                                            />
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label>Device Id</label>
                                        <input className="form-control" type="text" defaultValue={device.deviceId} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <Select className={'mb-10'}
                                            defaultValue={getDefaultValue(device.type, 'device_type')}
                                            placeholder={'Device Type'}
                                            options={deviceForm.deviceType}
                                            onChange={(e) => handleSelection(e, 'device_type')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label >Family</label>
                                        <Select className={'mb-10'}
                                            defaultValue={getDefaultValue(device.devFamily, 'device_family')}
                                            placeholder={'Device Family'}
                                            options={deviceForm.deviceFamily}
                                            onChange={(e) => handleSelection(e, 'device_family')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label >Sub Type</label>
                                        {sensorTypeIds.length > 0 &&
                                            <Select className={'mb-10'}
                                                defaultValue={getDefaultValue(device.subType, 'sensor_type_id')}
                                                placeholder={'Device Sub type'}
                                                options={sensorTypeIds}
                                                isDisabled={true}
                                                onChange={(e) => handleSelection(e, 'sensor_type_id')}
                                            />
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label >Time Zone</label>
                                        <Select className={'mb-10'}
                                            defaultValue={getDefaultValue(device.timeZone, 'timezone')}
                                            placeholder={'Device Time Zone'}
                                            options={timeZone}
                                            onChange={(e) => handleSelection(e, 'timezone')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label >Customer Name</label>
                                        <input className="form-control" type="text" ref={register()} name="customer_name"
                                            defaultValue={device.customerName} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label >Lot No</label>
                                        <input className="form-control" type="text" ref={register()} name="lot_no"
                                            defaultValue={device.lotNo} />
                                    </div>
                                    <div className="form-group">
                                        <label >Serial No</label>
                                        <input className="form-control" type="text" ref={register()} name="serial_no"
                                            defaultValue={device.serialNo} />
                                    </div>
                                    <div className="form-group">
                                        <label >Grade</label>
                                        <Select className={'mb-10'}
                                            defaultValue={getDefaultValue(device.grade, 'device_grade')}
                                            placeholder={'Device Grade'}
                                            options={deviceForm.deviceGrade}
                                            onChange={(e) => handleSelection(e, 'device_grade')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label >Deployment</label>
                                        <Select className={'mb-10'}
                                            defaultValue={getDefaultValue(device.deployment, 'device_deployment')}
                                            placeholder={'Device Deployment'}
                                            options={deviceForm.deviceDeployment}
                                            onChange={(e) => handleSelection(e, 'device_deployment')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label >Location ID</label>
                                        <input className="form-control" type="text" ref={register()} name="location_id"
                                            defaultValue={device.location ? device.location.locId : ''} />
                                    </div>
                                    <div className="form-group">
                                        <label >City</label>
                                        <input className="form-control" type="text" ref={register()} name="city"
                                            defaultValue={device.location ? device.location.city : ''} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="wizard-validation-classic-deployment">Device</label>
                                        <Select className={'mb-10'}
                                            defaultValue={getDefaultValue(device.activated ? 'enabled' : 'disabled', 'device_status')}
                                            placeholder={'Device Status'}
                                            options={deviceStatusType}
                                            onChange={(e) => handleSelection(e, 'device_status')}
                                        />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <label >Zone</label>
                                        <input className="form-control" type="text" ref={register()} name="zone"
                                            defaultValue={device.location ? device.location.zone : ''} />
                                    </div>
                                    <div className="form-group">
                                        <label >Land Mark</label>
                                        <input className="form-control" type="text" ref={register()} name="land_mark"
                                            defaultValue={device.location ? device.location.landMark : ''} />
                                    </div>
                                    <div className="form-group">
                                        <label >Latitude</label>
                                        <input className="form-control" type="number" step="any" ref={register()} name="latitude"
                                            defaultValue={device.location ? device.location.latitude : ''} />
                                    </div>
                                    <div className="form-group">
                                        <label >Longitude</label>
                                        <input className="form-control" type="number" step="any" ref={register()} name="longitude"
                                            defaultValue={device.location ? device.location.longitude : ''} />
                                    </div>
                                    <div className="form-group">
                                        <label >Building</label>
                                        <input className="form-control" type="text" ref={register()} name="building"
                                            defaultValue={device.location ? device.location.building : ''} />
                                    </div>
                                    <div className="form-group">
                                        <label >Floor</label>
                                        <input className="form-control" type="text" ref={register()} name="floor"
                                            defaultValue={device.location ? device.location.floor : ''} />
                                    </div>
                                </div>
                            </div>

                            {device.paramDefinitions && device.paramDefinitions.map((param, i) => {
                                return (
                                    <div className="row items-push param-block" key={i}>
                                        <div className="col-lg-2">
                                            <p className="text-muted">{param.displayName + '( ' + param.unit + ' )'}</p>
                                        </div>
                                        <input type="hidden" className="form-control form-control-lg" defaultValue={param.paramName}
                                            ref={register()} name={`paramDefinitions[${i}]['paramName']`} />
                                        <div className="col-lg-10">
                                            <div className="row">
                                                <div className="col-3">
                                                    <div className="form-group">
                                                        <label >Range Min</label>
                                                        <input type="number" step="any" className="form-control form-control-lg" defaultValue={param.maxRanges?.min || 0}
                                                            ref={register()} name={`paramDefinitions[${i}].maxRanges.min`} placeholder="Min Value" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label >Range Max</label>
                                                        <input type="number" step="any" className="form-control form-control-lg mt-10" defaultValue={param.maxRanges?.max || 0}
                                                            ref={register()} name={`paramDefinitions[${i}].maxRanges.max`} placeholder="Max Value" />
                                                    </div>
                                                </div>
                                                <div className="col-3">
                                                    <div className="form-group">
                                                        <label >Filtering</label>
                                                        <Select className={'mb-10'}
                                                            defaultValue={getDefaultValue(param.filteringMethod, 'device_filter', param.paramName)}
                                                            placeholder={'Device Filter'}
                                                            options={deviceForm.deviceFilter}
                                                            onChange={(e) => handleParamSelection(e, 'filter', param.paramName)}
                                                        />
                                                    </div>
                                                    {parameterFilter['filter'][param.paramName] == 'WMAFilter' &&
                                                        <div className="form-group">
                                                            <label >Offsets Min</label>
                                                            <input type="number" step="any" className="form-control form-control-lg" ref={register()}
                                                                defaultValue={param['filteringMethodDef'].weightT0}
                                                                name={`paramDefinitions[${i}]['filteringMethodDef'].weightT0`} placeholder="Weight T0" />
                                                        </div>
                                                    }
                                                    {parameterFilter['filter'][param.paramName] == 'WMAFilter' &&
                                                        <div className="form-group">
                                                            <label >Offsets Max</label>
                                                            <input type="number" step="any" className="form-control form-control-lg" ref={register()}
                                                                defaultValue={param['filteringMethodDef'].weightT1}
                                                                name={`paramDefinitions[${i}]['filteringMethodDef'].weightT1`} placeholder="Weight T1" />
                                                        </div>
                                                    }
                                                </div>
                                                <div className="col-3">
                                                    {param.calibration?.type &&
                                                        <div className="form-group">
                                                            <label >Calibration</label>
                                                            <Select className={'mb-10'}
                                                                defaultValue={getDefaultValue(param.calibration.type, 'device_calbFunc', param.paramName)}
                                                                placeholder={'Device Calibration'}
                                                                options={deviceForm.deviceCalbFunc}
                                                                onChange={(e) => handleParamSelection(e, 'calibration', param.paramName)}
                                                            />
                                                        </div>
                                                    }
                                                    {(parameterFilter['calibration'][param.paramName] == 'scale' ||
                                                        parameterFilter['calibration'][param.paramName] == 'translate') &&
                                                        <div className="form-group">
                                                            <label >Offset</label>
                                                            <input type="number" step="any" className="form-control form-control-lg" ref={register()}
                                                                defaultValue={param['calibration']['data'][0] ? param['calibration']['data'][0]['offset'] : ''}
                                                                name={`paramDefinitions[${i}]['calibration']['offset]`} placeholder="Weight" />
                                                        </div>
                                                    }
                                                </div>
                                                <div className="col-3">
                                                    {(parameterFilter['calibration'][param.paramName] == 'scale' ||
                                                        parameterFilter['calibration'][param.paramName] == 'translate') &&
                                                        <div className="form-group">
                                                            <label >Calibration Min Range</label>
                                                            <input type="number" step="any" className="form-control form-control-lg" ref={register()}
                                                                defaultValue={param['calibration']['data'][0] ? param['calibration']['data'][0]['min'] : ''}
                                                                name={`paramDefinitions[${i}]['calibration']['min]`} placeholder="Min Value" />
                                                        </div>
                                                    }
                                                    {(parameterFilter['calibration'][param.paramName] == 'scale' ||
                                                        parameterFilter['calibration'][param.paramName] == 'translate') &&
                                                        <div className="form-group">
                                                            <label >Calibration Max Range</label>
                                                            <input type="number" step="any" className="form-control form-control-lg" ref={register()}
                                                                defaultValue={param['calibration']['data'][0] ? param['calibration']['data'][0]['max'] : ''}
                                                                name={`paramDefinitions[${i}]['calibration']['max]`} placeholder="Max Value" />
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
                                    <button type="submit" className="btn btn-alt-primary" data-wizard="finish">
                                        <i className="fa fa-check mr-5"></i> Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                }
            </div>
        </div>
    )
}

export default EditDevice;