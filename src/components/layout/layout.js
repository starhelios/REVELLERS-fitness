/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import Header from './header';
import Footer from './footer';
import { useIdentityContext } from 'react-netlify-identity';
import './layout.css';

const Layout = ({ children }) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    const { user } = useIdentityContext();

    const pathName =
        typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <>
            <Header
                siteTitle={data.site.siteMetadata.title}
                pathName={pathName}
            />
            <main>
                {!user?.confirmed_at && !!user?.confirmation_sent_at ? (
                    <div>
                        Please check your email and click the "Confirm your
                        email" link that I've sent you from my very creative
                        "no-reply" email address.
                        {/* {<Button onClick={sendConfirmationEmail}>
                            Send Confirmation Email Again
                        </Button>} */}
                    </div>
                ) : (
                    children
                )}
                <Footer />
            </main>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
