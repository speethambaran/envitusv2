import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../components/paginations/page';
import { getActiveAlarms, clearAlarm, clearAllAlerts } from '../../services/v1/alarmApi';
import ConfirmationModal from '../../components/modal/confirmationModal';
import { text } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const ActiveAlarms = () => {
    const dispatch = useDispatch();
    const [modalShow, setModalShow] = useState(false);
    const [modalShows, setModalShows] = useState(false)
    const [clrAlarm, setClearAlarm] = useState(null);
    const { list, pagination, loading } = useSelector(
        state => ({
            list: state.alarmData.alarms,
            pagination: state.alarmData.pagination,
            loading: state.alarmData.loading
        })
    );
    const [alertSearch, setAlertSearch] = useState('');
    const filter = {
        skip: 0,
        limit: 10,
        search: alertSearch
    }
    useEffect(() => {
        dispatch(getActiveAlarms(filter));
    }, [dispatch]);
    const clearActiveAlarm = () => {
        dispatch(clearAlarm(clrAlarm, { status: 'Inactive' }, filter));
        setModalShow(false);
    }
    const clearAllAlarms = () => {
        dispatch(clearAllAlerts(filter));
        setModalShows(false);
    }
    const searchAlarms = (e) => {
        if (e.key === 'Enter') {
            setAlertSearch(e.target.value)
            filter.search = e.target.value
            dispatch(getActiveAlarms(filter))
        }
    }
    const handlePageChange = (pageNumber) => {
        filter.skip = (pageNumber - 1) * pagination.limit
        filter.limit = pagination.limit
        dispatch(getActiveAlarms(filter));
    }
    return (
        <div className="block">
            <div className="block-header block-header-default">
                <h3 className="block-title">Active Alarms</h3>
                <div className="col-3">
                    <input className="form-control" name="searchKey" defaultValue={alertSearch} onKeyDown={(e) => searchAlarms(e)}
                        placeholder="Search for an alarm" />
                </div>
                <div className="block-options">
                    <button type="button" className="btn btn-outline-danger" disabled={list.length == 0}
                        onClick={() => { setModalShows(true); }} > Clear All Alarm</button>
                </div>
                <div className="block-options">
                    <button type="button" className="btn btn-outline-primary"
                        onClick={() => dispatch(getActiveAlarms(filter))}>Refresh</button>
                </div>
            </div>
            <div className="block-content block-content-full">
                <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Device ID</th>
                            <th>Alarm Name</th>
                            <th>Time</th>
                            <th>Info</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item, i) => {
                            return <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{item.deviceId}</td>
                                <td>{item.ruleName} </td>
                                <td>{item.updatedAt}</td>
                                <td> {item.log}</td>
                                <td>
                                    <div className="block-options">
                                        <button type="button" className="btn btn-sm btn-outline-danger mr-2" data-toggle="tooltip" title="Clear Alarm"
                                            onClick={() => { setModalShow(true); setClearAlarm(item._id) }}>
                                            <i className="fa fa-bell-slash"></i>
                                        </button>
                                        <Link to={{pathname: '/dashboard/livedata', dev: item.deviceId, time: item.updatedAt}}>
                                            <button type="button" className="btn btn-sm btn-outline-info" data-toggle="tooltip" title="Goto Livedata">
                                                <i className="fa fa-desktop"></i>
                                            </button>
                                        </Link>
                                    </div>

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
                        handlePageChange={(pageNumber) => handlePageChange(pageNumber)}>
                    </Page>
                </div>
            </div>
            <ConfirmationModal
                show={modalShow}
                title={text.title.clearAlarm}
                body={text.body.clearAlarm}
                confirmAction={() => clearActiveAlarm()}
                onHide={() => setModalShow(false)}>
            </ConfirmationModal>
            <ConfirmationModal
                show={modalShows}
                title={text.title.clearAllAlarm}
                body={text.body.clearAllAlarm}
                confirmAction={() => clearAllAlarms()}
                onHide={() => setModalShows(false)}>
            </ConfirmationModal>
        </div>
    )
}

export default ActiveAlarms;