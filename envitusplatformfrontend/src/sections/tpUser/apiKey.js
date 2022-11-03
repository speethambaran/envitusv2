import React from 'react';
import {
    Route, Switch,
    useRouteMatch
} from 'react-router-dom';
import ListApiKey from './listApiKey';
import AddApiKey from './addApiKey';
import EditApiKey from './editApiKey';
import AddWebhooks from '../settings/developers/addWebhooks';
import EditWebhook from '../settings/developers/editWebhook';

const ApiKey = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}`} component={ListApiKey} />
            <Route exact path={`${path}/add`} component={AddApiKey} />
            <Route exact path={`${path}/edit/:id`} component={EditApiKey} />
            <Route exact path={`${path}/webhooks/add`} component={AddWebhooks} />
            <Route exact path={`${path}/webhooks/edit/:id`} component={EditWebhook} />
        </Switch>

    )
}


export default ApiKey;