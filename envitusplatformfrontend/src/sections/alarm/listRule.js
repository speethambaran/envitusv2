import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../components/paginations/page';
import { useRouteMatch, Link } from 'react-router-dom';
import { getAlarmRuleList, deleteAlarmRule } from '../../services/v1/alarmApi';
import ConfirmationModal from '../../components/modal/confirmationModal';
import { text, AlarmRuleStatus } from '../../utils/helpers';
import Select from 'react-select';
import useSound from 'use-sound';
import boopSfx from '../../sounds/app_alert.mp3';
const ListRule = () => {
    const [play] = useSound(boopSfx);
    const dispatch = useDispatch();
    const { list, pagination, loading } = useSelector(
        state => ({
            list: state.alarmData.list,
            pagination: state.alarmData.pagination,
            loading: state.alarmData.loading
        })
    );
    const [modalShow, setModalShow] = useState(false); // show/hide modal
    const [delRule, setDeleteRule] = useState(null); // show/hide modal
    const [ruleSearch, setRuleSearch] = useState('');
    const [status, setStatus] = useState('enabled');

    const filter = {
        skip: 0,
        limit: 10,
        search: ruleSearch
    }

    useEffect(() => {
        dispatch(getAlarmRuleList(filter));
    }, [dispatch]);

    const deleteRule = () => {
        dispatch(deleteAlarmRule(delRule, filter))
        setModalShow(false);
    }
    const handlePageChange = (pageNumber) => {
        filter.skip = (pageNumber - 1) * pagination.limit
        filter.limit = pagination.limit
        dispatch(getAlarmRuleList(filter));
    }
    const searchRules = (e) => {
        if (e.key === 'Enter') {
            setRuleSearch(e.target.value)
            filter.search = e.target.value
            dispatch(getAlarmRuleList(filter))
        }
    }
    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'status':
                data = AlarmRuleStatus.find((element) => { return element.value === value })
                break;
            default:
                break;
        }
        return data;
    }
    const reloadList = (query) => {
        setStatus(query.value)
        dispatch(getAlarmRuleList({ status: query.value }));
    }

    const { url } = useRouteMatch();

    return (
        <div className="block">
            <div className="block-header block-header-default">
                <h3 className="block-title">Alarm Rules</h3>
                <div className="col-3">
                    <input className="form-control" name="searchKey" defaultValue={ruleSearch} onKeyDown={(e) => searchRules(e)}
                        placeholder="Search for an alarm rule" />
                </div>


                <div className="block-options">
                    <Link to={`${url}/add`} >
                        <button type="button" className="btn btn-outline-primary">
                            Add New Rule
                        </button>
                    </Link>
                </div>
            </div>
            {!loading &&
                <div className="col-12 block-content">
                    <div className="row">
                        <div className="col-3">
                            <label htmlFor="profile-settings-name">Status</label>
                            <Select
                                defaultValue={getDefaultValue(status, 'status')}
                                placeholder={'Status'}
                                options={AlarmRuleStatus}
                                onChange={reloadList}
                            />
                        </div>
                    </div>
                </div>
            }
            {!loading &&
                <div className="block-content block-content-full">
                    <table className="table table-bordered table-striped table-vcenter js-dataTable-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Rule Name</th>
                                <th>Description</th>
                                <th>Clearing Mode</th>
                                <th>Info</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item, i) => {
                                return <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{item.ruleName}</td>
                                    <td>{item.description} </td>
                                    <td>{item.clearingMode}
                                        {item.clearingMode == 'Time Based' && <div>Interval -{item.timeInterval} Min</div>} </td>
                                    <td>Device IDs: {item.deviceIds} <br />
                                        Rule: {item.info[0].parameter} {item.info[0].function == 'gt' && '>'}
                                        {item.info[0].function == 'eq' && '='} {item.info[0].function == 'lt' && '<'} {item.info[0].limit}</td>
                                    <td className="d-none d-sm-table-cell">
                                        {item.activated &&
                                            <span className="badge badge-success">Enabled</span>
                                        }
                                        {!item.activated &&
                                            <span className="badge badge-danger">Disabled</span>
                                        }
                                    </td>
                                    <td>
                                        <Link to={`${url}/edit/${item._id}`} >
                                            <button type="button" className="btn btn-sm btn-outline-primary mr-5" data-toggle="tooltip" title="Edit Rule">
                                                <i className="fa fa-pencil"></i>
                                            </button>
                                        </Link>
                                        <button type="button" className="btn btn-sm btn-outline-danger mr-5" data-toggle="tooltip" title="Delete Rule"
                                            onClick={() => { setModalShow(true); setDeleteRule(item._id) }} >
                                            <i className="fa fa-trash"></i>
                                        </button>

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
            }
            <ConfirmationModal
                show={modalShow}
                title={text.title.deleteAlarmRule}
                body={text.body.deleteAlarmRule}
                confirmAction={() => deleteRule()}
                onHide={() => setModalShow(false)}>
            </ConfirmationModal>
        </div>
    )

}

export default ListRule;
