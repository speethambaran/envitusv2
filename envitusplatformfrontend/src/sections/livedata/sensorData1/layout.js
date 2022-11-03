import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';

import { getDeviceLists } from '../../../services/v1/deviceApi';
import Statistics from './statistics'
import RawData from './rawData';
import LiveData from './liveData'

const Layout = (props) => {
    const dispatch = useDispatch();
    const { list, organizationIds, role } = useSelector(
        state => ({
            list: state.devices.list,
            organizationIds: state.organization.orgIds,
            role: state.user.currentUser.role
        })
    );
    const [organization, setOrganization] = useState('all')
    const [dateRange, setDateRange] = useState({})

    useEffect(() => {
        if(props.preselectedTime) {
            setDateRange({ 
                valid: true,
                start: new Date(moment(props.preselectedTime).subtract(2, 'm').toISOString()),
                end: new Date(moment(props.preselectedTime).add(2, 'm').toISOString()) 
            })
        } else {
            setDateRange({ 
                valid: true,
                start: new Date(moment().startOf('day').toISOString()),
                end: new Date(moment().endOf('day').toISOString()) 
            })
        }
        
        console.log(dateRange)
        dispatch(getDeviceLists({
            status: 'enabled',
            type: 'all',
            sub_type: 'all',
            family: 'all',
            search: '',
            organization_id: organization
        }))
    }, [organization]);

    const setRanges = (date, name) => {
        let valid = true;
        if ((date === null) || (name === 'start' && date > dateRange.end) || (name === 'end' && dateRange.start > date)) {
            valid = false;
            toastr.error('Oops !!', 'Please select the dates accordingly');
        } else {
            const difference = (name === 'start') ? Math.abs(new Date(dateRange.end).valueOf() - new Date(date).valueOf()) :
                Math.abs(new Date(date).valueOf() - new Date(dateRange.start).valueOf());
            const oneDay = 24 * 60 * 60 * 1000;
            if (difference / oneDay > 60) {
                valid = false;
                toastr.error('Oops !!', 'Selected period Exceeds 60 Days')
            }
        }

        if (name === 'start') { setDateRange({ valid: valid, start: date, end: dateRange.end }) }
        else { setDateRange({ valid: valid, start: dateRange.start, end: date }) }
    }

    const getDefaultValue = (value, type) => {
        let data = '';
        switch (type) {
            case 'organization_id':
                data = [{ label: 'All', value: 'all', type: 'organization_id' }, ...organizationIds].find((element) => { return element.value === value })
                break;
            default:
                break;
        }
        return data;
    }

    const updateSelect = (option) => {
        switch (option.type) {
            case 'organization_id':
                setOrganization(option.value)
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <div className="p-5 bg-white push">
                <div className="row col-12">
                    <div className="col-sm-12 col-md-3">
                        <label>Organization</label>
                        <Select
                            value={getDefaultValue(organization, 'organization_id')}
                            options={[{ label: 'All', value: 'all', type: 'organization_id' }, ...organizationIds]}
                            onChange={updateSelect}
                        />
                    </div>
                    <div className="col-sm-12 col-md-3">
                        <div id="DataTables_Table_1_filter" className="dataTables_filter">
                            <label>Date From:
                                <DatePicker selected={dateRange.start} className="mt-1 form-control"
                                    showTimeSelect dateFormat="MMM d, yyyy h:mm aa"
                                    onChange={date => setRanges(date, 'start')}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-3">
                        <div id="DataTables_Table_1_filter" className="dataTables_filter">
                            <label>Date To:
                                <DatePicker selected={dateRange.end} className="mt-1 form-control"
                                    showTimeSelect dateFormat="MMM d, yyyy h:mm aa"
                                    onChange={date => setRanges(date, 'end')}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <LiveData list={list} dateRange={dateRange} preselectedDev={props.preselectedDev} />
            <Statistics list={list} dateRange={dateRange} preselectedDev={props.preselectedDev} />
            {role === 'Super Admin' &&
                <RawData list={list} dateRange={dateRange} preselectedDev={props.preselectedDev} />
            }
        </div>
    )
}

export default Layout;
