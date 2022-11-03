import React, { useEffect } from 'react';
import { logOut } from '../../services/v1/authApi';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar'
import { getOrganizationIdList } from '../../services/v1/organizationApi';
import { useRouteMatch, Link, Redirect, useHistory } from 'react-router-dom';
import { clearAllAlerts } from '../../services/v1/alarmApi';

const NavHeader = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const doLogout = () => {
        dispatch(logOut())
    }
    const { url } = useRouteMatch();
    const { user, list, isLoggedIn } = useSelector(
        state => ({
            user: state.user.currentUser,
            list: state.alarmData.alarms,
            isLoggedIn: state.user.isLoggedIn
        })
    );

    const clearAllAlarms = () => {
        dispatch(clearAllAlerts());
    }
    useEffect(() => {
        dispatch(getOrganizationIdList())
    }, [dispatch]);

    if (isLoggedIn) {
        return (
            <header id="page-header">
                <div className="content-header">
                    <div className="content-header-section">
                        {/* <button type="button" className="btn btn-circle btn-dual-secondary navicon" data-toggle="layout" data-action="sidebar_toggle">
                        <i className="fa fa-navicon"></i>
                    </button> */}
                    </div>
                    <div className="content-header-section">
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-rounded btn-dual-secondary" id="page-header-user-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-user d-sm-none"></i>
                                <span className="d-none d-sm-inline-block">{user.name}</span>
                                <i className="fa fa-angle-down ml-5"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right min-width-200" aria-labelledby="page-header-user-dropdown">
                                <h5 className="h6 text-center py-10 mb-5 border-b text-uppercase">User</h5>
                                <a className="dropdown-item" href="/dashboard/settings/profile"><i className="si si-user mr-5"></i> Profile</a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="#" onClick={() => { doLogout() }}><i className="si si-logout mr-5"></i> Sign Out</a>
                            </div>
                        </div>
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-rounded btn-dual-secondary" id="page-header-notifications" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            >
                                <i className="fa fa-bell" ></i>
                                <span className="badge badge-primary badge-pill">{list.length}</span>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right min-width-300" aria-labelledby="page-header-notifications">
                                <h5 className="h6 text-center py-10 mb-0 border-b text-uppercase">Notifications</h5>
                                <ul className="list-unstyled my-20">
                                    {list.map((item, i) => {
                                        return <li key={i}>
                                            <Link to={`${url}/activealarm`} className="text-body-color-dark media mb-15">
                                                <div className="ml-5 mr-15">
                                                    <i className="fa fa-fw fa-exclamation-triangle text-warning"></i>
                                                </div>
                                                <div className="media-body pr-10">
                                                    <p className="mb-0">{item.log}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    })}

                                </ul>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item text-center mb-0" onClick={() => clearAllAlarms()} href="#">
                                    <i className="fa fa-bell-slash"></i> Clear All
                            </a>
                            </div>
                        </div>
                    </div>
                </div>
                <LoadingBar scope="sectionBar" />
            </header>
        )
    } else {
        return <Redirect to="/" />
    }
}

export default NavHeader;