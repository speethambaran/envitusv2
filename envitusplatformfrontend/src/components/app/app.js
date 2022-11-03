import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { useEffect } from 'react';
import '@google/model-viewer';
import ReduxToastr, { toastr } from 'react-redux-toastr';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './app.scss';
import Home from '../../sections/home/home';
import DashboardLayout from '../layout/dashboardLayout.js';
import socketIOClient from "socket.io-client";

function App() {
	useEffect(() => {
		const socket = socketIOClient(process.env.REACT_APP_API_V1_URL, {
			withCredentials: true
		});
		socket.on("alarm-alerts", data => {
			console.log(data)
			switch (data.alertType) {
				case 'warning':
					toastr.warning(data.title, data.message)
					break;
				case 'success':
					break;
				case 'error':
					break;
				default:
					break;
			}
		});
	}, []);
	return (
		<div>
			<Router data-test="mainAppTag">
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/dashboard" component={DashboardLayout} />
				</Switch>
			</Router>
			<ReduxToastr timeOut={6000} newestOnTop={false} position="top-right"
				getState={(state) => state.toastr} transitionIn="fadeIn" transitionOut="fadeOut"
				progressBar closeOnToastrClick
			/>
		</div>
	);
}

export default App;
