import React from 'react';
import Layout from '../components/layout/layout';
import Login from '../components/pages/login';
import { get } from 'lodash';
const login = ({ location }) => {
    return (
        <Layout>
            <Login redirectBackTo={get(location, 'state.pathname')} />
        </Layout>
    );
};

export default login;
