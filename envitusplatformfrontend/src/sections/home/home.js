import React from 'react';
import {
    Route, Switch,
    useRouteMatch
} from 'react-router-dom';

import Login from '../auth/login';
import Register from '../auth/register';

const Home = () => {
    const { path } = useRouteMatch();
    return (
        <div id="page-container" className="main-content-boxed">

            <main id="main-container">

                <div className="bg-image" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/envitus_bg.jpg)`}} >
                    <div className="row mx-0 bg-black-op">
                        <div className="hero-static col-md-6 col-xl-8 d-none d-md-flex align-items-md-end">
                            <div className="p-30">
                                <p className="font-size-h3 font-w600 text-white">
                                    Environmental information for coginitive decisions.
                                </p>
                            </div>
                        </div>
                        <div className="hero-static col-md-6 col-xl-4 d-flex align-items-center bg-white">

                            <Switch>
                                <Route exact path={`${path}`} component={Login} />
                                <Route exact path={`${path}/login`} component={Login} />
                                <Route eaxct path={`${path}/register`} component={Register} />

                            </Switch>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default Home;
