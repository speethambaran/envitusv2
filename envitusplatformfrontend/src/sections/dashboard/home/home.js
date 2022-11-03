import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Page from '../../../components/paginations/page';
import { getDeviceLists } from '../../../services/v1/deviceApi';
import { getAQIColorIndex } from '../../../utils/helpers';
import { getDashboardStatistics } from '../../../services/v1/dashboardApi';
import Locations from './locations';
import Pollutants from './pollutants';
import Historical from './historical';

const Home = () => {
    const projectType = process.env.REACT_APP_PROJECT_TYPE;
    const dispatch = useDispatch();
    const { list, pagination, statistics, selectedDevice } = useSelector(
        state => ({
            list: state.devices.list,
            statistics: state.dashboard.statistics,
            pagination: state.devices.pagination,
            selectedDevice: state.dashboard.selectedDevice,
        })
    );

    const [deviceFilterSearch, setDeviceFilterSearch] = useState('')

    useEffect(() => {
        dispatch(getDeviceLists({
            status: 'enabled',
            type: 'all',
            sub_type: 'all',
            family: 'all',
            search: '',
            organization_id: 'all'
        }, true));
    }, [dispatch]);



    // Device list Pagination handler
    const handlePageChange = (pageNumber) => {
        dispatch(getDeviceLists({
            status: 'online', organization_id: 'all', skip: (pageNumber - 1) * pagination.limit,
            limit: pagination.limit, search: deviceFilterSearch
        }, false))
    }

    const doDeviceSearch = () => {
        console.log("Search");
        dispatch(getDeviceLists({
            status: 'enabled', organization_id: 'all', search: deviceFilterSearch, skip: 0, limit: 5
        }, false))
    }

    return (
        <div>
            { projectType !== 'SOIL' &&
                <div className="row">
                    <div className="col-md-12 col-xl-12" >
                        <Pollutants />
                    </div>
                </div>
            }
            { projectType === 'SOIL' &&
                <div className="row">
                    <div className="col-md-12 col-xl-12" >
                        <Locations />
                    </div>
                </div>
            }
            <div className="row items-push">
                <div className="col-xl-9">
                    <Historical selectedDev={selectedDevice} />
                </div>
                <div className="col-xl-3 d-none d-xl-block">
                    <div className="ml-10">
                        <form class="mb-10">
                            <div class="input-group input-group-lg">
                                <input type="text" class="form-control" defaultValue={deviceFilterSearch}
                                    onKeyDown={(e) => setDeviceFilterSearch(e.target.value)} placeholder="Search ... (eg: HMT)" />
                                <div class="input-group-append">
                                    <button onClick={(e) => { e.preventDefault(); doDeviceSearch(e) }} class="btn btn-secondary" >
                                        <i class="fa fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                        <table class="table table-borderless table-striped table-hover mb-0 mt-30">
                            <tbody>
                                {list.map((item, i) => {
                                    return <tr key={i} style={{
                                        backgroundColor: statistics.device_details && item._id === statistics.device_details._id ? 'aliceblue' : '',
                                        cursor: "pointer"
                                    }} onClick={() => dispatch(getDashboardStatistics(item._id))}>
                                        <td class="text-left">
                                            {item.location.city}
                                        </td>
                                        {projectType === 'AQI' &&
                                            <td class="text-right"><span className="badge mr-5" style={{
                                                backgroundColor: getAQIColorIndex(item.rawAqi, 'color')
                                            }}>{'AQI : ' + item.rawAqi}</span> </td>
                                        }
                                    </tr>
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div style={{ textAlign: 'center', 'marginTop': 10 }} className="ml-10">
                        <Page
                            activePage={pagination.currentPage}
                            itemsCountPerPage={pagination.limit}
                            totalItemsCount={pagination.totalItems}
                            handlePageChange={(pageNumber) => handlePageChange(pageNumber)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home;
