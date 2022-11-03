/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { logOut } from '../../services/v1/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { userAccess, scripts } from '../../utils/helpers';
import useScript from '../../hooks/useScript';

const Sidebar = () => {
    useScript(scripts.codebase_core)
    useScript(scripts.codebase_app)
    const { url } = useRouteMatch();
    const dispatch = useDispatch();
    const doLogout = () => {
        dispatch(logOut())
    }
    const { role } = useSelector(
        state => ({
            role: state.user.currentUser.role
        })
    );

    return (
        <nav id="sidebar">
            <div className="sidebar-content">
                <div className="content-header content-header-fullrow px-15">
                    <div className="content-header-section sidebar-mini-visible-b">
                        <span className="content-header-item font-w700 font-size-xl float-left animated fadeIn">
                            <span className="text-primary"> <i className="fa fa-envira" /></span>
                        </span>
                    </div>

                    <div className="content-header-section text-center align-parent sidebar-mini-hidden">
                        <button type="button" className="btn btn-circle btn-dual-secondary d-lg-none align-v-r" data-toggle="layout" data-action="sidebar_close">
                            <i className="fa fa-times text-danger" />
                        </button>
                        <div className="content-header-item">
                            <div className="link-effect font-w700" >
                                <i className="fa fa-envira text-primary" />
                                <span className="font-size-xl text-dual-primary-dark">Envi</span><span className="font-size-xl text-primary">tus</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-side content-side-full">
                    <ul className="nav-main">
                        <li>
                            <Link to={`${url}`} >
                                <i className="fa fa-dashboard" />
                                <span className="sidebar-mini-hide">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={`${url}/livedata`} ><i className="fa fa-bar-chart-o" /><span className="sidebar-mini-hide">Live Data</span></Link>
                        </li>
                        {userAccess.sideMenu.device.includes(role) &&
                            <li>
                                <Link to={`${url}/devices`} ><i className="fa fa-envira" /><span className="sidebar-mini-hide">Devices</span></Link>
                            </li>
                        }
                        {userAccess.sideMenu.user.includes(role) && <li>
                            <Link to={`${url}/users`} ><i className="si si-user" /><span className="sidebar-mini-hide">Users</span></Link>
                        </li>
                        }
                        <li>
                            <a className="nav-submenu cursor-pointer" data-toggle="nav-submenu">
                                <i className="si si-bell" /><span className="sidebar-mini-hide">Alarm</span>
                            </a>
                            <ul>
                                <li>
                                    <Link to={`${url}/alarmrule`} ><span className="sidebar-mini-hide">Alarm Rules</span></Link>
                                </li>
                                <li>
                                    <Link to={`${url}/activealarm`} ><span className="sidebar-mini-hide">Active Alarms</span></Link>
                                </li>
                                <li>
                                    <Link to={`${url}/alarmhistory`} ><span className="sidebar-mini-hide">Alarm History</span></Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a className="nav-submenu cursor-pointer" data-toggle="nav-submenu">
                                <i className="si si-settings" /><span className="sidebar-mini-hide">Settings</span>
                            </a>
                            <ul>
                                <li>
                                    <Link to={`${url}/settings/profile`} >Profile</Link>
                                </li>
                                {userAccess.sideMenu.settings.organization.includes(role) &&
                                    <li>
                                        <Link to={`${url}/settings/organization`} >Organizations</Link>
                                    </li>
                                }
                                {userAccess.sideMenu.settings.preferences.includes(role) &&
                                    <li>
                                        <Link to={`${url}/settings/preferences/notifications`} >Preferences</Link>
                                    </li>
                                }
                                {userAccess.sideMenu.settings.sensors.includes(role) &&
                                    <li>
                                        <Link to={`${url}/settings/sensor/spec`} >Sensors</Link>
                                    </li>
                                }
                                {userAccess.sideMenu.settings.api.includes(role) &&
                                    <li>
                                        <Link to={`${url}/settings/developers`} >Developers</Link>
                                    </li>
                                }
                                {userAccess.sideMenu.settings.diagnostics.includes(role) &&
                                    <li>
                                        <Link to={`${url}/settings/diagnostics`} >Diagnostics</Link>
                                    </li>
                                }
                                <li>
                                    <Link to={`${url}/settings/calibration`} >Calibration</Link>
                                </li>
                                <li>
                                    <Link to={`${url}/settings/faq`} >FAQ</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#" onClick={() => { doLogout() }} ><i className="si si-logout" />
                                <span className="sidebar-mini-hide">Sign Out</span></a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Sidebar;
