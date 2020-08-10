import React, { useEffect, useContext } from 'react'
import Layout from '../components/layout/layout';
import { AuthContext } from '../context/GlobalContextProvider';
import redirectToCheckout from '../utils/redirectToCheckout';
import GoTrue from 'gotrue-js';

const SignUpConfirmed = () => {
  const {authUser} = useContext(AuthContext);
  console.log({authUser});

  useEffect(() => {
    if (authUser?.id) {
      if (window) {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('confirmation_token');
        
        const auth = new GoTrue({
          APIUrl: 'https://revelwell.com.au/.netlify/identity',
          audience: '',
          setCookie: false,
        });
        auth.confirm(token)
          .then(response => {
              console.log('Confirmed', JSON.stringify({ response }));
          })
          .catch(error =>
              console.log('Failed to verify recover token: %o', error)
          );
      }
      
      const subscription = {
        items: [{
            plan: authUser?.user_metadata?.userPackage,
        }],
      };

      redirectToCheckout(
        null,
        authUser,
        {},
        {},
        subscription
      );

    }
  }, [authUser])

  return (
    <Layout>
    </Layout>
  )
};

export default SignUpConfirmed;
