import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IdentityContextProvider } from 'react-netlify-identity-widget';
import GlobalContextProvider from './src/context/GlobalContextProvider';
import '@stripe/stripe-js';
import 'video-react/dist/video-react.css';
const url = process.env.GATSBY_NETLIFY_IDENTITY_URL;

// export const onServiceWorkerUpdateReady = () => {
//     const answer = window.confirm(
//         `RevelWell has been updated. ` + `Reload to display the latest version?`
//     );
//     if (answer === true) {
//         window.location.reload();
//     }
// };

export const wrapPageElement = ({ element, props }) => {
    return (
        <GlobalContextProvider>
            <IdentityContextProvider url={url} {...props}>
                {element}
            </IdentityContextProvider>
        </GlobalContextProvider>
    );
};
