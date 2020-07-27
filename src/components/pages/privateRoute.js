import React from 'react';
import { navigate } from 'gatsby';
import { useIdentityContext } from 'react-netlify-identity';

const PrivateRoute = ({ component: Component, location, ...rest }) => {
    const { user, isLoggedIn } = useIdentityContext();

    const { pathname, search } = location;

    if (!isLoggedIn && location.pathname !== `/login`) {
        navigate('/login', { state: { pathname } });
        return null;
    }

    if (
        user?.user_metadata?.userPackage !== 'plan_HF8Tc4J2WjLDAg' &&
        location.pathname === `/app/daily_rides` &&
        !search.includes('session_id=')
    ) {
        navigate('/app/profile', { state: { upgradeToSubscription: true } });
        return null;
    }

    if (
        !user?.app_metadata?.roles?.includes('Admin') &&
        location.pathname === '/app/admin'
    ) {
        navigate('/app/profile');
        return null;
    }

    return <Component {...rest} />;
};

export default PrivateRoute;
