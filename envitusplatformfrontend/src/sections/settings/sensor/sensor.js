/* eslint-disable eol-last */
import React, { useState } from 'react';
import {
	Route, Switch, Link,
	useRouteMatch
} from 'react-router-dom';
import './sensor.scss';
import SensorSpec from './sensorParams/sensorSpec';
import SensorType from './sensorType/sensorType';

const Sensor = (props) => {
	const { path, url } = useRouteMatch();

	const getSelectedTab = () => {
		switch (props.location.pathname) {
			case '/dashboard/settings/sensor/types':
				return 'type';
			case '/dashboard/settings/sensor/spec':
				return 'spec';
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
							<h3 className="block-title">Sensor Settings</h3>
							<div className="block-options"></div>
						</div>
						<div className="block-content">
							<ul className="nav nav-pills flex-column push">
								<li className="nav-item">
									<Link className={selectedTab === 'spec' ? 'm-auto active nav-link d-flex align-items-center justify-content-between' :
										'nav-link d-flex align-items-center justify-content-between'}
										to={`${url}/spec`} onClick={() => setTab('spec')}>
										<span><i className="fa fa-fw fa-star mr-5"></i> Sensor Parameters</span>
									</Link>
								</li>
								<li className="nav-item">
									<Link className={selectedTab === 'type' ? 'm-auto active nav-link d-flex align-items-center justify-content-between' :
										'nav-link d-flex align-items-center justify-content-between'}
										to={`${url}/types`} onClick={() => setTab('type')}>
										<span><i className="fa fa-fw fa-inbox mr-5"></i> Sensor Types</span>
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className="col-md-7 col-xl-9">
				<Switch>
					<Route exact path={`${path}/types`} component={SensorType} />
					<Route exact path={`${path}/spec`} component={SensorSpec} />
				</Switch>
			</div>
		</div>


	);
}

export default Sensor;