import React from 'react';
import { Router } from '@reach/router';
import Layout from '../components/layout/layout';

import PrivateRoute from '../components/pages/privateRoute';
import Profile from '../components/pages/profile';
import DailyRides from '../components/pages/dailyRides';
import OnDemand from '../components/pages/on_demand_rides';
import TheYoke from '../components/pages/the_yoke';
import Admin from '../components/admin/Admin';
import Login from '../components/pages/login';

const App = () => (
    <Layout>
        <Router>
            <PrivateRoute path="/app/profile" component={Profile} />
            <PrivateRoute path="/app/daily_rides" component={DailyRides} />
            <PrivateRoute path="/app/on_demand_rides" component={OnDemand} />
            <PrivateRoute path="/app/the_yoke" component={TheYoke} />
            <PrivateRoute path="/app/admin" component={Admin} />
            <Login path="/login" />
        </Router>
    </Layout>
);

export default App;
