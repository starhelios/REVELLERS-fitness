import React, { useEffect, useContext } from 'react';
import Layout from '../components/layout/layout';
import { AuthContext } from '../context/GlobalContextProvider';
import redirectToCheckout from '../utils/redirectToCheckout';
import GoTrue from 'gotrue-js';

const SignUpConfirmed = () => {
    const { authUser } = useContext(AuthContext);
    console.log({ authUser });

    useEffect(() => {
        if (authUser?.id) {
            if (window) {
                const searchParams = new URLSearchParams(
                    window.location.search
                );
                const token = searchParams.get('confirmation_token');

                const auth = new GoTrue({
                    APIUrl: 'https://revelwell.com.au/.netlify/identity',
                    audience: '',
                    setCookie: false,
                });
                auth.confirm(token)
                    .then(response => {
                        console.log(
                            'SUCCESS: User Has Clicked Verification Email',
                            JSON.stringify({ response })
                        );
                    })
                    .then(data => {
                        console.log('Data Pre Checkout Call:', data);
                        const subscription = {
                            items: [
                                {
                                    plan: authUser?.user_metadata?.userPackage,
                                },
                            ],
                        };
                        redirectToCheckout(
                            null,
                            authUser,
                            {},
                            {},
                            subscription
                        );
                    })
                    .catch(error =>
                        console.log('Failed to verify recover token: %o', error)
                    );
            }
        }
    }, [authUser]);

    return <Layout>Please Try Refreshing The Page...</Layout>;
};

export default SignUpConfirmed;
