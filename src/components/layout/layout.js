/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import Header from './header';
import Footer from './footer';
import { useIdentityContext } from 'react-netlify-identity';
import './layout.css';
import Button from '../../styled_components';
import { Modal, Form, Alert, Container } from 'react-bootstrap';
import { AuthContext } from '../../context/GlobalContextProvider';

const Layout = ({ children }) => {

    const {signupCredential} = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');

    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    const { user, signupUser } = useIdentityContext();

    const pathName =
        typeof window !== 'undefined' ? window.location.pathname : '';

    const onResendEmail = () => {
        signupUser(signupCredential?.email, signupCredential?.password, signupCredential?.data).then(user => {
            console.log('response on resend email', user);
        });
    }

    const onSendOtherEmail = () => {
        signupUser(email, signupCredential?.password, signupCredential?.data).then(user => {
            console.log('response on send other email', user);
            setShow(false);
        });
    }
    
    return (
        <>
            <Header
                siteTitle={data.site.siteMetadata.title}
                pathName={pathName}
            />
            <main>
                {!user?.confirmed_at && !!user?.confirmation_sent_at ? (
                    <Container className='pt-5'>
                        <Alert key={'0'} variant='success'>
                            Please check your email and click the "Confirm your
                            email" link that I've sent you from my very creative
                            "no-reply" email address.
                        </Alert>
                        <div className='d-flex justify-content-around'>
                            <Button signup onClick={() => setShow(true)}>
                                Re-enter Email
                            </Button>
                            <Button onClick={onResendEmail}>
                                Re-send Confirm Link
                            </Button>
                            <Modal show={show} onHide={() => setShow(false)}>
                                <Modal.Header closeButton className='border-0'>
                                    <Modal.Title>Enter your email</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Control
                                        type="text"
                                        placeholder="email"
                                        name="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </Modal.Body>
                                <Modal.Footer className='border-0'>
                                    <Button onClick={() => setShow(false)}>
                                        Close
                                    </Button>
                                    <Button signup onClick={onSendOtherEmail}>
                                        Resend
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </Container>
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
