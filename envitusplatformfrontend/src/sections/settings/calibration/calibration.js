/* eslint-disable eol-last */
import React from "react";
import { Route, useRouteMatch, Switch } from 'react-router-dom';
import ListCert from "./listCert";
import AddCert from "./addCert";

const Calibration = () => {
    const { path } = useRouteMatch();
    return(
        <Switch>
            <Route exact path={`${path}`} component={ListCert} />
            <Route exact path={`${path}/add`} component={AddCert} />
        </Switch>
    )
}

export default Calibration;