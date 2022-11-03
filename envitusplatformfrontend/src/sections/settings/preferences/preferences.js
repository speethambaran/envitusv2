/* eslint-disable eol-last */
import React, { useState } from 'react';
import {
    Route, Switch, Link,
    useRouteMatch
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import './preferences.scss';
import Devices from './devices/devices';
import Reports from './reports/reports';
import Notifications from './notifications/notifications';

const Preferences = (props) => {
    const { path, url } = useRouteMatch();

    const { role } = useSelector(
        state => ({
            role: state.user.currentUser.role
        })
    );

    const getSelectedTab = () => {
        switch (props.location.pathname) {
            case '/dashboard/settings/preferences/devices':
                return 'device';
            case '/dashboard/settings/preferences/notifications':
                return 'notify';
            case '/dashboard/settings/preferences/reports':
                return 'reports';
            default:
                break;
        }
    }
    const [selectedTab, setTab] = useState(getSelectedTab());
    return (

        <div className="row">
            <div className="col-md-5 col-xl-3">
                <div className="js-inbox-nav d-none d-md-block">
                    <div className="block">
                        <div className="block-header block-header-default">
                            <h3 className="block-title">System Preferences</h3>
                            <div className="block-options" />
                        </div>
                        <div className="block-content">
                            <ul className="nav nav-pills flex-column push">
                                {role === 'Super Admin' &&
                                    <li className="nav-item">
                                        <Link className={selectedTab === 'device' ? 'm-auto active nav-link d-flex align-items-center justify-content-between' :
                                            'nav-link d-flex align-items-center justify-content-between'}
                                            to={`${url}/devices`} onClick={() => setTab('device')}
                                        >
                                            <span><i className="fa fa-envira mr-5" /> Devices</span>
                                        </Link>
                                    </li>
                                }
                                <li className="nav-item">
                                    <Link className={selectedTab === 'notify' ? 'm-auto active nav-link d-flex align-items-center justify-content-between' :
                                        'nav-link d-flex align-items-center justify-content-between'}
                                        to={`${url}/notifications`} onClick={() => setTab('notify')}
                                    >
                                        <span><i className="si si-bell mr-5" /> Notifications</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={selectedTab === 'reports' ? 'm-auto active nav-link d-flex align-items-center justify-content-between' :
                                        'nav-link d-flex align-items-center justify-content-between'}
                                        to={`${url}/reports`} onClick={() => setTab('reports')}
                                    >
                                        <span><i className="fa fa-bar-chart-o mr-5" /> Reports</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-7 col-xl-9">
                <Switch>
                    {role === 'Super Admin' &&
                        <Route exact path={`${path}/devices`} component={Devices} />
                    }
                    <Route exact path={`${path}/notifications`} component={Notifications} />
                    <Route exact path={`${path}/reports`} component={Reports} />
                </Switch>
            </div>
        </div >


    );
}

export default Preferences;