import React from 'react';
import {
    Route, Switch,
    useRouteMatch
} from 'react-router-dom';
import ListDevice from './listDevice';
import AddDevice from './addDevice';
import EditDevice from './editDevice';
import DeviceDetails from './deviceDetails';

const Device = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}`} component={ListDevice} />
            <Route exact path={`${path}/add`} component={AddDevice} />
            <Route exact path={`${path}/:id`} component={DeviceDetails} />
            <Route exact path={`${path}/:id/edit`} component={EditDevice} />
        </Switch>

    )
}


export default Device;