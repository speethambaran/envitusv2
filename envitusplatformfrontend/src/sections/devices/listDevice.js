import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../components/paginations/page';
import { useRouteMatch, Link } from 'react-router-dom';
import Select from 'react-select';
import { deviceStatus, deviceTypes, deviceSubTypes, deviceFamily, userAccess, text } from '../../utils/helpers';
import { getDeviceStatistics, getDeviceLists, deleteDevice, restoreDevice } from '../../services/v1/deviceApi';
import { useState } from 'react';
import ConfirmationModal from '../../components/modal/confirmationModal';

const ListDevice = () => {
    const dispatch = useDispatch();
    const { list, pagination, loading, statistics, organizationIds, role } = useSelector(
        state => ({
            list: state.devices.list,
            pagination: state.devices.pagination,
            loading: state.devices.loading,
            statistics: state.devices.statistics,
            organizationIds: state.organization.orgIds,
            role: state.user.currentUser.role
        })
    );
    const [deviceFilterStatus, setDeviceFilterStatus] = useState('enabled')
    const [deviceFilterType, setDeviceFilterType] = useState('all')
    const [deviceFilterSubType, setDeviceFilterSubType] = useState('all')
    const [deviceFilterFamily, setDeviceFilterFamily] = useState('all')
    const [deviceFilterSearch, setDeviceFilterSearch] = useState('')
    const [organization, setOrganization] = useState('all')
    const [modalShow, setModalShow] = useState(false); // show/hide modal
    const [delDeviceId, setDelDeviceId] = useState(null);
    const [modalShowRestoreDevice, setModalShowRestoreDevice] = useState(false); // show/hide modal
    const [restoreDeviceId, setRestoreDeviceId] = useState(null);
    const [delDevicePermanently, setDelDevicePermanently] = useState(false);

    const filter = {
        status: deviceFilterStatus,
        type: deviceFilterType,
        sub_type: deviceFilterSubType,
        family: deviceFilterFamily,
        skip: 0,
        limit: 10,
        search: deviceFilterSearch,
        organization_id: organization
    }

    const { url } = useRouteMatch();
    const now = new Date();
    now.setMinutes(now.getMinutes() - 10); // timestamp
    const timeStamp = new Date(now).getTime();

    useEffect(() => {
        dispatch(getDeviceStatistics())
        dispatch(getDeviceLists(filter))
    }, [dispatch]);

    // Filter dropdown default values
    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'device_status':
                data = deviceStatus.find((element) => { return element.value === value })
                break;
            case 'device_type':
                data = deviceTypes.find((element) => { return element.value === value })
                break;
            case 'device_sub_type':
                data = deviceSubTypes.find((element) => { return element.value === value })
                break;
            case 'device_family':
                data = deviceFamily.find((element) => { return element.value === value })
                break;
            case 'organization_id':
                data = [{ label: 'All', value: 'all', type: 'organization_id' }, ...organizationIds].find((element) => { return element.value === value })
                break;
            default:
                break;
        }
        return data;
    }

    // Device list Pagination handler
    const handlePageChange = (pageNumber) => {
        filter.skip = (pageNumber - 1) * pagination.limit
        filter.limit = pagination.limit
        dispatch(getDeviceLists(filter));
    }

    // To check device online
    const isOnline = (time) => {
        return new Date(time).getTime() >= timeStamp ? true : false;
    }

    // Dropdown filter action - call device list api
    const loadDeviceList = (option) => {
        switch (option.type) {
            case 'device_status':
                setDeviceFilterStatus(option.value)
                filter.status = option.value
                break;
            case 'device_type':
                setDeviceFilterType(option.value)
                filter.type = option.value
                break;
            case 'device_sub_type':
                setDeviceFilterSubType(option.value)
                filter.sub_type = option.value
                break;
            case 'device_family':
                setDeviceFilterFamily(option.value)
                filter.family = option.value
                break;
            case 'organization_id':
                setOrganization(option.value)
                filter.organization_id = option.value
                break;
            default:
                break;
        }
        dispatch(getDeviceLists(filter))
    }

    // Statistics blocks onclick action handler
    const handleStatisticsData = (type) => {
        switch (type) {
            case 'device_total':
                setDeviceFilterStatus('all')
                filter.status = 'all'
                break;
            case 'device_online':
                setDeviceFilterStatus('enabled')
                filter.status = 'online'
                break;
            case 'device_enabled':
                setDeviceFilterStatus('enabled')
                filter.status = 'enabled'
                break;
            case 'device_disabled':
                setDeviceFilterStatus('disabled')
                filter.status = 'disabled'
                break;
            default:
                break;
        }
        dispatch(getDeviceLists(filter))
    }

    // Device search input handler
    const searchDevices = (e) => {
        if (e.key === 'Enter') {
            setDeviceFilterSearch(e.target.value)
            filter.search = e.target.value
            dispatch(getDeviceLists(filter))
        }
    }

    const deviceDelete = () => {
        dispatch(deleteDevice(delDeviceId, filter, delDevicePermanently));
        setDelDevicePermanently(false)
        setModalShow(false);
    }

    const deviceRestore = () => {
        dispatch(restoreDevice(restoreDeviceId));
        setModalShowRestoreDevice(false);
    }

    return (
        <div>
            <div className="row">
                <div className="col-6 col-xl-3 cursor-pointer" onClick={() => handleStatisticsData('device_total')}>
                    <a className="block block-link-shadow text-right" >
                        <div className="block-content block-content-full clearfix">
                            <div className="float-left mt-10 d-none d-sm-block">
                                <i className="fa fa-envira fa-3x text-body-bg-dark" />
                            </div>
                            <div className="font-size-h3 font-w600">{statistics.devices_total}</div>
                            <div className="font-size-sm font-w600 text-uppercase text-muted">Total Devices</div>
                        </div>
                    </a>
                </div>
                <div className="col-6 col-xl-3 cursor-pointer" onClick={() => handleStatisticsData('device_online')}>
                    <a className="block block-link-shadow text-right" >
                        <div className="block-content block-content-full clearfix">
                            <div className="float-left mt-10 d-none d-sm-block">
                                <i className="si si-feed fa-3x text-body-bg-dark" />
                            </div>
                            <div className="font-size-h3 font-w600">{statistics.devices_online}</div>
                            <div className="font-size-sm font-w600 text-uppercase text-muted">Devices Online</div>
                        </div>
                    </a>
                </div>
                <div className="col-6 col-xl-3 cursor-pointer" onClick={() => handleStatisticsData('device_enabled')}>
                    <a className="block block-link-shadow text-right" >
                        <div className="block-content block-content-full clearfix">
                            <div className="float-left mt-10 d-none d-sm-block">
                                <i className="si si-wallet fa-3x text-body-bg-dark" />
                            </div>
                            <div className="font-size-h3 font-w600">{statistics.devices_enabled}</div>
                            <div className="font-size-sm font-w600 text-uppercase text-muted">Devices Enabled</div>
                        </div>
                    </a>
                </div>
                <div className="col-6 col-xl-3 cursor-pointer" onClick={() => handleStatisticsData('device_disabled')}>
                    <a className="block block-link-shadow text-right" >
                        <div className="block-content block-content-full clearfix">
                            <div className="float-left mt-10 d-none d-sm-block">
                                <i className="si si-ban fa-3x text-body-bg-dark" />
                            </div>
                            <div className="font-size-h3 font-w600">{statistics.devices_disabled}</div>
                            <div className="font-size-sm font-w600 text-uppercase text-muted">Devices Disabled</div>
                        </div>
                    </a>
                </div>
            </div>

            <div className="block">
                <div className="block-header block-header-default">
                    <h3 className="block-title text-uppercase">Device List</h3>
                    <div className="block-options">
                        <button type="button" className="btn btn-sm btn-secondary mr-5" onClick={() => dispatch(getDeviceLists(filter))}
                            data-toggle="tooltip" title="Refresh List">
                            <i className="si si-refresh" />
                        </button>
                        {userAccess.deviceManagement.add.includes(role) &&
                            <Link to={`${url}/add`} >
                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Add New Device">
                                    <i className="si si-plus" />
                                </button>
                            </Link>
                        }

                    </div>
                </div>
                {!loading &&
                    <div className="col-12 block-content">
                        <div className="row">
                            <div className="col-2">
                                <label htmlFor="profile-settings-name">Organization</label>
                                <Select
                                    defaultValue={getDefaultValue(organization, 'organization_id')}
                                    placeholder={'Device Status'}
                                    options={[{ label: 'All', value: 'all', type: 'organization_id' }, ...organizationIds]}
                                    onChange={loadDeviceList}
                                />
                            </div>
                            <div className="col-2">
                                <label htmlFor="profile-settings-name">Device</label>
                                <Select
                                    defaultValue={getDefaultValue(deviceFilterStatus, 'device_status')}
                                    placeholder={'Device Status'}
                                    options={deviceStatus}
                                    onChange={loadDeviceList}
                                />
                            </div>
                            {/* <div className="col-2">
                                <label htmlFor="profile-settings-name">Device Type</label>
                                <Select
                                    defaultValue={getDefaultValue(deviceFilterType, 'device_type')}
                                    placeholder={'Type'}
                                    options={deviceTypes}
                                />
                            </div>
                            <div className="col-2">
                                <label htmlFor="profile-settings-name">Device Sub Type</label>
                                <Select
                                    defaultValue={getDefaultValue(deviceFilterSubType, 'device_sub_type')}
                                    placeholder={'Sub Type'}
                                    options={deviceSubTypes}
                                />
                            </div> */}
                            <div className="col-2">
                                <label htmlFor="profile-settings-name">Device Family</label>
                                <Select
                                    defaultValue={getDefaultValue(deviceFilterFamily, 'device_family')}
                                    placeholder={'Family'}
                                    options={deviceFamily}
                                    onChange={loadDeviceList}
                                />
                            </div>

                            <div className="col-2"></div>
                            <div className="col-2"></div>
                            <div className="col-2">
                                <label htmlFor="profile-settings-name">Search</label>
                                <input className="form-control" defaultValue={deviceFilterSearch} onKeyDown={(e) => searchDevices(e)} placeholder="Search for a device" />
                            </div>
                        </div>
                    </div>
                }
                {!loading &&
                    <div className="block-content block-content-full">
                        <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                            <thead>
                                <tr>
                                    <th className="d-none d-sm-table-cell">Device Id</th>
                                    <th className="d-none d-sm-table-cell">Status</th>
                                    <th className="d-none d-sm-table-cell">Type</th>
                                    <th className="d-none d-sm-table-cell">Family</th>
                                    <th className="d-none d-sm-table-cell">City</th>
                                    <th className="d-none d-sm-table-cell">Landmark</th>
                                    <th className="d-none d-sm-table-cell">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((item, i) => {
                                    return <tr key={i}>
                                        <td className="font-w600">{item.deviceId}</td>
                                        <td className="d-none d-sm-table-cell">
                                            {item.activated &&
                                                <div>
                                                    <span className="badge badge-success mr-5">Enabled</span>
                                                    {isOnline(item.lastDataReceiveTime) ? <span className="badge badge-success">Online</span> :
                                                        <span className="badge badge-danger">Offline</span>}
                                                </div>
                                            }
                                            {!item.activated &&
                                                <div>
                                                    <span className="badge badge-danger mr-5">Disabled</span>
                                                    <span className="badge badge-danger">Offline</span>
                                                </div>

                                            }
                                        </td>
                                        <td className="d-none d-sm-table-cell">{item.type}</td>
                                        <td className="d-none d-sm-table-cell">{item.devFamily}</td>
                                        <td className="d-none d-sm-table-cell">{item.location.city}</td>
                                        <td className="d-none d-sm-table-cell">{item.location.landMark}</td>
                                        <td>
                                            {userAccess.deviceManagement.edit.includes(role) && !item.isDeleted &&
                                                <Link to={`${url}/${item._id}/edit`} >
                                                    <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Edit Device">
                                                        <i className="fa fa-pencil" />
                                                    </button>
                                                </Link>
                                            }
                                            {userAccess.deviceManagement.edit.includes(role) && !item.isDeleted &&
                                                <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Delete Device"
                                                    onClick={() => { setModalShow(true); setDelDeviceId(item._id) }}>
                                                    <i className="fa fa-trash" />
                                                </button>
                                            }
                                            {!item.isDeleted &&
                                                <Link to={`${url}/${item._id}`} >
                                                    <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Device Details">
                                                        <i className="fa fa-eye" />
                                                    </button>
                                                </Link>
                                            }
                                            {!item.isDeleted &&
                                                <Link to={{pathname: '/dashboard/livedata', dev: item.deviceId}} >
                                                    <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="View Live Data">
                                                        <i className="fa fa-bar-chart" />
                                                    </button>
                                                </Link>
                                            }
                                            {item.isDeleted &&
                                                <div>
                                                    <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Restore Device"
                                                        onClick={() => { setModalShowRestoreDevice(true); setRestoreDeviceId(item._id); }}>
                                                        <i className="si si-action-undo" />
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Delete Permanently"
                                                        onClick={() => { setModalShow(true); setDelDeviceId(item._id); setDelDevicePermanently(true) }}>
                                                        <i className="fa fa-trash" />
                                                    </button>
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                })
                                }
                            </tbody>
                        </table>
                        <div style={{ textAlign: 'center', 'marginTop': 10 }}>
                            <Page
                                activePage={pagination.currentPage}
                                itemsCountPerPage={pagination.limit}
                                totalItemsCount={pagination.totalItems}
                                handlePageChange={(pageNumber) => handlePageChange(pageNumber)}
                            />
                        </div>
                    </div>
                }
            </div>
            <ConfirmationModal
                show={modalShow}
                title={text.title.deleteDevice}
                body={text.body.deleteDevice}
                confirmAction={() => deviceDelete()}
                onHide={() => setModalShow(false)}>
            </ConfirmationModal>

            <ConfirmationModal
                show={modalShowRestoreDevice}
                title={text.title.restoreDevice}
                body={text.body.restoreDevice}
                confirmAction={() => deviceRestore()}
                onHide={() => setModalShowRestoreDevice(false)}>
            </ConfirmationModal>

        </div>
    )
}

export default ListDevice;
