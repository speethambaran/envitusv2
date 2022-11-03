import React, { useEffect } from 'react';
import Select from 'react-select';
import { deviceStatus } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, Link, useParams } from 'react-router-dom';
import { getDeviceDetails } from '../../services/v1/deviceApi';

const DeviceDetails = () => {
    const { url } = useRouteMatch();
    const { id } = useParams();
    const { device, loading } = useSelector(
        state => ({
            device: state.devices.data,
            loading: state.devices.loading
        })
    );
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getDeviceDetails(id));
    }, [dispatch]);

    return (
        <div>
            <div className="block">
                <div className="block-header block-header-default">
                    <h3 className="block-title">Device Details</h3>
                    <div className="block-options">
                        <Link to={'/dashboard/devices'} >
                            <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Api List">
                                <i className="si si-arrow-left"></i>
                            </button>
                        </Link>
                        <Link to={`${url}/edit`} >
                            <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Edit Device">
                                <i className="fa fa-pencil"></i>
                            </button>
                        </Link>
                        <Link to={'/dashboard/devices/add'} >
                            <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Add New Device">
                                <i className="si si-plus"></i>
                            </button>
                        </Link>
                        <Link to={'/dashboard/livedata'} >
                            <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Live Data">
                                <i className="fa fa-bar-chart"></i>
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="col-12 block-content block-content-full">
                    <div className="row">
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Last Data Received At</label>
                                <input className="form-control" type="text" defaultValue={device.lastDataReceiveTime} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Organization</label>
                                <input className="form-control" type="text" defaultValue={device.organization ? device.organization.name : ''} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Device Id</label>
                                <input className="form-control" type="text" defaultValue={device.deviceId} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Device Type</label>
                                <input className="form-control" type="text" defaultValue={device.type} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Device Sub Type</label>
                                <input className="form-control" type="text" defaultValue={device.subTypeDetails ? device.subTypeDetails.name : ''} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Device Family</label>
                                <input className="form-control" type="text" defaultValue={device.devFamily} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Device Time Zone</label>
                                <input className="form-control" type="text" defaultValue={device.timeZone} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Customer Name</label>
                                <input className="form-control" type="text" defaultValue={device.customerName} disabled />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Lot No</label>
                                <input className="form-control" type="text" defaultValue={device.lotNo} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Serial No</label>
                                <input className="form-control" type="text" defaultValue={device.serialNo} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Grade</label>
                                <input className="form-control" type="text" defaultValue={device.grade} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Deployment</label>
                                <input className="form-control" type="text" defaultValue={device.deployment} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Location ID</label>
                                <input className="form-control" type="text" defaultValue={device.location ? device.location.locId : ''} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">City</label>
                                <input className="form-control" type="text" defaultValue={device.location ? device.location.city : ''} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Zone</label>
                                <input className="form-control" type="text" defaultValue={device.location ? device.location.zone : ''} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Land Mark</label>
                                <input className="form-control" type="text" defaultValue={device.location ? device.location.landMark : ''} disabled />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Latitude</label>
                                <input className="form-control" type="text" defaultValue={device.location ? device.location.latitude : ''} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Longitude</label>
                                <input className="form-control" type="text" defaultValue={device.location ? device.location.longitude : ''} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Building</label>
                                <input className="form-control" type="text" defaultValue={device.location ? device.location.building : ''} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Floor</label>
                                <input className="form-control" type="text" defaultValue={device.location ? device.location.floor : ''} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Created At</label>
                                <input className="form-control" type="text" defaultValue={device.createdAt} disabled />
                            </div>
                            <div className="form-group">
                                <label htmlFor="wizard-validation-classic-customer-name">Updated At</label>
                                <input className="form-control" type="text" defaultValue={device.updatedAt} disabled />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="block">
                <div className="block-header block-header-default">
                    <h3 className="block-title">Device Parameter Details</h3>
                    <div className="block-options">
                        <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="block-option" data-action="content_toggle"></button>
                    </div>
                </div>

                <div className="col-12 block-content block-content-full">
                    {device.paramDefinitions &&
                        device.paramDefinitions.map((item, i) => {
                            return <div className="row items-push">
                                <div className="col-lg-2">
                                    <p className="text-muted">{item.displayName + '( ' + item.unit + ' )'}</p>
                                </div>
                                <div className="col-lg-10">
                                    <div className="row">
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor="profile-settings-name">Range</label>
                                                <input className="form-control" type="text" defaultValue={item.maxRanges? item.maxRanges.min : ''} disabled />
                                                <input className="form-control mt-10" type="text" defaultValue={item.maxRanges ? item.maxRanges.max : ''} disabled />
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor="profile-settings-name">Filtering</label>
                                                <input className="form-control" type="text" defaultValue={item.filteringMethod} disabled />
                                            </div>
                                            <div className="form-group">
                                                {item.filteringMethod == 'WMAFilter' &&
                                                    <div>
                                                        <label htmlFor="profile-settings-name">Filter Weight T0</label>
                                                        <input type="number" className="form-control form-control-lg" defaultValue={item.filteringMethodDef ? item.filteringMethodDef.weightT0: ''} placeholder="Weight T0" disabled />
                                                    </div>
                                                }
                                            </div>
                                            <div className="form-group">
                                                {item.filteringMethod == 'WMAFilter' &&
                                                    <div>
                                                        <label htmlFor="profile-settings-name">Filter Weight T1</label>
                                                        <input type="number" className="form-control form-control-lg" defaultValue={item.filteringMethodDef ? item.filteringMethodDef.weightT1: ''} placeholder="Weight T1" disabled />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor="profile-settings-name">Calibration</label>
                                                <input className="form-control" type="text" defaultValue={item.filteringMethodDef ? item.calibration.type: ''} disabled />
                                            </div>
                                            <div className="form-group">
                                                {(item.calibration.type == 'scale' ||
                                                    item.calibration.type == 'translate') &&
                                                    <div>
                                                        <label htmlFor="profile-settings-name">Calibration Offset</label>
                                                        <input type="number" className="form-control form-control-lg" defaultValue={item.calibration.data[0].offset} placeholder="Weight"
                                                            disabled />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            {(item.calibration.type == 'scale' ||
                                                item.calibration.type == 'translate') &&
                                                <div>
                                                    <div className="form-group">
                                                        <label htmlFor="profile-settings-name">Range Min</label>
                                                        <input type="number" className="form-control form-control-lg" defaultValue={item.calibration.data[0].min} placeholder="Min Value"
                                                            disabled />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="profile-settings-name">Range Max</label>
                                                        <input type="number" className="form-control form-control-lg" defaultValue={item.calibration.data[0].max} placeholder="Max Value"
                                                            disabled />
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }

                </div>
            </div>
        </div>
    )
}


export default DeviceDetails;