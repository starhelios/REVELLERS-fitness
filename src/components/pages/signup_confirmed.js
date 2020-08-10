import React, { useEffect, useContext } from 'react'
import { AuthContext } from '../../context/GlobalContextProvider';
import redirectToCheckout from '../../utils/redirectToCheckout';

export default function SignUpConfirmed() {

  const {authUser} = useContext(AuthContext);

  useEffect(() => {
    const subscription = {
      items: [{
          plan: user?.user_metadata?.userPackage,
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
}
