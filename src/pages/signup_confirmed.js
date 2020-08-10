import React, { useEffect, useContext } from 'react'
import { AuthContext } from '../context/GlobalContextProvider';
import redirectToCheckout from '../utils/redirectToCheckout';

const SignUpConfirmed = () => {

  const {authUser} = useContext(AuthContext);
  console.log({authUser});

  useEffect(() => {
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
  }, [])

  return (
    <div>
      Confirmed page!
    </div>
  )
};

export default SignUpConfirmed;
