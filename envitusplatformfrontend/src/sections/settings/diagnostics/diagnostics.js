import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Page from '../../../components/paginations/page';
import { useDispatch, useSelector } from 'react-redux';
import { diagnosticsErrorTypes, sensorErrors } from '../../../utils/helpers';
import { getDeviceErrorList } from '../../../services/v1/deviceApi';
import { Link } from 'react-router-dom';
import { getDeviceIds, getDeviceDetails } from '../../../services/v1/deviceApi';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

const Diagnostics = () => {
    const [errorType, setErrorType] = useState(diagnosticsErrorTypes[0].value);
    const [deviceId, setDeviceId] = useState(null);
    const dispatch = useDispatch();
    const { list, pagination, loading, deviceIds, device } = useSelector(
        state => ({
            list: state.diagnostics.list,
            pagination: state.diagnostics.pagination,
            loading: state.diagnostics.loading,
            deviceIds: state.devices.deviceIds,
            device: state.devices.data,
        })
    );

    useEffect(() => {
        dispatch(getDeviceIds())
        dispatch(getDeviceErrorList({ error_type: errorType }));
    }, [dispatch]);


    const handlePageChange = (pageNumber) => {
        dispatch(getDeviceErrorList({
            skip: (pageNumber - 1) * pagination.limit,
            limit: pagination.limit,
            error_type: errorType,
            device_id: deviceId
        }));
    }

    const query = {
        error_type: errorType,
        device_id: deviceId
    }
    const reloadErrorList = (option) => {
        switch (option.type) {
            case 'diagnostics_error':
                setErrorType(option.value)
                query.error_type = option.value
                break;
            case 'device_id':
                setDeviceId(option.value)
                query.device_id = option.value
                dispatch(getDeviceDetails(option.value))
                break;
            default:
                break;
        }
        dispatch(getDeviceErrorList(query));
    }

    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'diagnostics_error':
                data = diagnosticsErrorTypes.find((element) => { return element.value === value })
                break;
            default:
                break;
        }
        return data;
    }

    const getDeviceId = (id) => {
        const device = deviceIds.find((e) => { return e.value === id })
        if (device) {
            return device.label;
        }
        return '';
    }

    return (
        <div className="block">
            <div className="block-header block-header-default">
                <h3 className="block-title"><i className="fa fa-user-circle mr-5 text-muted"></i> Device Diagnostics</h3>
                <div class="block-options">
                    <Link to={'/dashboard/devices'} >
                        <button type="button" class="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Device List">
                            <i class="fa fa-envira"></i>
                        </button>
                    </Link>
                    <button type="button" class="btn btn-sm btn-secondary mr-5" data-toggle="tooltip" title="Refresh List">
                        <i class="si si-refresh"></i>
                    </button>
                </div>
            </div>
            <div className="block-content">
                <form >
                    <div className="row">
                        <div className="col-lg-3">
                            <Select className={'mb-10'}
                                defaultValue={{ value: 'all', label: 'All', type: 'device_id' }}
                                placeholder={'Device'}
                                options={[{ value: 'all', label: 'All', type: 'device_id' }, ...deviceIds]}
                                onChange={reloadErrorList}
                            />

                            <Select className={'mb-10'}
                                defaultValue={getDefaultValue('all', 'diagnostics_error')}
                                placeholder={'Error Type'}
                                options={diagnosticsErrorTypes}
                                onChange={reloadErrorList}
                            />

                            <div className="block block-bordered" id="my-block">
                                <div className="block-header">
                                    <h3 className="block-title">Device Details</h3>
                                    <div className="block-options">
                                        <button type="button" className="btn-block-option" data-toggle="block-option" data-action="content_toggle"></button>
                                    </div>
                                </div>
                                {device && deviceId != null &&
                                    <div className="block-content">
                                        <ListGroup className="list-group-flush">
                                            <ListGroupItem>Device Type : <b>{device.type}</b></ListGroupItem>
                                            <ListGroupItem>Device Family : <b>{device.devFamily}</b></ListGroupItem>
                                            <ListGroupItem>City : <b>{device.location ? device.location.city : ''}</b></ListGroupItem>
                                            <ListGroupItem>Zone : <b>{device.location ? device.location.zone : ''}</b></ListGroupItem>
                                            <ListGroupItem>Land Mark : <b>{device.location ? device.location.landMark : ''}</b></ListGroupItem>
                                        </ListGroup>
                                    </div>
                                }
                            </div>
                        </div>
                        {!loading &&
                            <div className="col-lg-9">
                                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th className="d-none d-sm-table-cell">Device</th>
                                            <th className="d-none d-sm-table-cell">Error Type</th>
                                            <th className="d-none d-sm-table-cell">Error Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map((item, i) => {
                                            return <tr key={i}>
                                                <td className="font-w600">{item.createdAt}</td>
                                                <td className="d-none d-sm-table-cell">{getDeviceId(item.deviceId)}</td>
                                                <td className="d-none d-sm-table-cell">{sensorErrors[item.errorType]}</td>
                                                <td className="d-none d-sm-table-cell">{item.errorDetails}</td>
                                            </tr>
                                        })
                                        }
                                    </tbody>
                                </table>
                                <div style={{ textAlign: 'center', 'margin-top': 10 }}>
                                    <Page
                                        activePage={pagination.currentPage}
                                        itemsCountPerPage={pagination.limit}
                                        totalItemsCount={pagination.totalItems}
                                        handlePageChange={(pageNumber) => handlePageChange(pageNumber)}>
                                    </Page>
                                </div>
                            </div>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Diagnostics;