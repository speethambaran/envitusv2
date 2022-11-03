/* eslint-disable eol-last */
import React from 'react';
import Sidebar from '../sidebar/sidebar';
import NavHeader from '../header/navHeader';
import {
    Route, Switch,
    useRouteMatch
} from 'react-router-dom';

import LiveDataLayout from '../../sections/livedata/liveDataLayout';
import Board from '../../sections/dashboard/board';
import Device from '../../sections/devices/device.js';
import ApiKey from '../../sections/tpUser/apiKey.js';
import Users from '../../sections/userMngt/users';
import AlarmRule from '../../sections/alarm/rule';
import Profile from '../../sections/settings/account/profile';
import Diagnostics from '../../sections/settings/diagnostics/diagnostics';
import ActiveAlarms from '../../sections/alarm/activeAlarms';
import AlarmHistory from '../../sections/alarm/alarmHistory';
import Organization from '../../sections/settings/organization/organization';
import Sensor from '../../sections/settings/sensor/sensor';
import Calibration from '../../sections/settings/calibration/calibration'
import Faq from '../../sections/settings/faq/faq';
import Preferences from '../../sections/settings/preferences/preferences';

const DashboardLayout = () => {
    const { path } = useRouteMatch();
    return (
        <div id="page-container" className="sidebar-mini sidebar-o sidebar-inverse enable-page-overlay side-scroll page-header-fixed main-content-narrow">
            <Sidebar />
            <NavHeader />
            <main id="main-container">
                <div className="bg-image bg-image-bottom">
                    <div className="bg-primary-dark-op" />
                </div>
                <div className="content">
                    <Switch>
                        <Route exact path={`${path}`} component={Board} />
                        <Route path={`${path}/devices`} component={Device} />
                        <Route exact path={`${path}/livedata`} component={LiveDataLayout} />
                        <Route path={`${path}/settings/developers`} component={ApiKey} />
                        <Route path={`${path}/users`} component={Users} />
                        <Route path={`${path}/alarmrule`} component={AlarmRule} />
                        <Route path={`${path}/settings/profile`} component={Profile} />
                        <Route path={`${path}/settings/diagnostics`} component={Diagnostics} />
                        <Route path={`${path}/activealarm`} component={ActiveAlarms} />
                        <Route path={`${path}/alarmhistory`} component={AlarmHistory} />
                        <Route path={`${path}/settings/organization`} component={Organization} />
                        <Route path={`${path}/settings/sensor`} component={Sensor} />
                        <Route path={`${path}/settings/calibration`} component={Calibration} />
                        <Route path={`${path}/settings/faq`} component={Faq} />
                        <Route path={`${path}/settings/preferences`} component={Preferences} />
                    </Switch>
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout;