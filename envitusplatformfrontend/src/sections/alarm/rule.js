import React from 'react';
import {
    Route, Switch,
    useRouteMatch
} from 'react-router-dom';
import ListRule from './listRule';
import AddRule from './addRule';
import EditRule from './editRule';

const Rules = () => {
    const { path} = useRouteMatch();
  
    return (
        <Switch>
            <Route exact path={`${path}`} component={ListRule} />
            <Route exact path={`${path}/add`} component={AddRule} />
            <Route exact path={`${path}/edit/:id`} component={EditRule} />
        </Switch>

    )
}

export default Rules;