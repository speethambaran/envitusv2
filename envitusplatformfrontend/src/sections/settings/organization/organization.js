import React from 'react';
import {
    Route, Switch,
    useRouteMatch
} from 'react-router-dom';
import ListOrganization from './listOrganizations';
import AddOrganization from './addOrganization';
import EditOrganization from './editOrganization';
import OrganizationDetails from './detailsOrganization';


const Organization = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}`} component={ListOrganization} />
            <Route exact path={`${path}/add`} component={AddOrganization} />
            <Route exact path={`${path}/:id`} component={OrganizationDetails} />
            <Route exact path={`${path}/:id/edit`} component={EditOrganization} />
        </Switch>
    )
}

export default Organization;