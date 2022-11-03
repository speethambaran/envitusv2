/* eslint-disable eol-last */
import React from 'react';
import {
    Route, Switch,
    useRouteMatch
} from 'react-router-dom';
import ListUsers from './listUsers';
import AddUsers from './addUsers';
import EditUsers from './editUsers';
import UserDetails from './userDetails';

const Users = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}`} component={ListUsers} />
            <Route exact path={`${path}/add`} component={AddUsers} />
            <Route exact path={`${path}/edit/:id`} component={EditUsers} />
            <Route exact path={`${path}/:id`} component={UserDetails} />
        </Switch>

    )
}

export default Users;