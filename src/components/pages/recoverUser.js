import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';

import Button from '../../styled_components';
import Layout from '../../components/layout/layout';

import GoTrue from 'gotrue-js';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const ResetPassword = () => {
    const [userPassword, setUserPassword] = useState();
    const [confirmUserPassword, setConfirmUserPassword] = useState();
    const [user, setUser] = useState();
    const [show, setShow] = useState(false);

    const showPassword = () => {
        setShow(!show);
    };

    const handleValidateMatch = () => {
        if (userPassword !== confirmUserPassword) {
            return true;
        }
    };
    const handleUpdateSetNewPassword = event => {
        setUserPassword(event.target.value);
    };
    const handleUpdateSetConfirmNewPassword = event => {
        setConfirmUserPassword(event.target.value);
    };

    const handleSubmitSetNewPassword = event => {
        event.preventDefault();
        void user
            ?.update({ password: userPassword })
            .then(() => {
                navigate('/app/profile');
            })
            // TODO: show an error message to user
            .catch(error => console.error('Unable to update password', error));
    };

    const handleRecoverUser = token => {
        const auth = new GoTrue({
            APIUrl: 'https://revelwell.com.au/.netlify/identity',
            audience: '',
            setCookie: false,
        });
        auth.recover(token)
            .then(response => {
                console.log('Logged in as %s', JSON.stringify({ response }));
                setUser(response);
            })
            .catch(error =>
                console.log('Failed to verify recover token: %o', error)
            );
    };

    useEffect(() => {
        if (window) {
            const searchParams = new URLSearchParams(window.location.search);
            const token = searchParams.get('recovery_token');
            handleRecoverUser(token);
        }
    }, []);

    return (
        <Layout>
            <Container>
                <Row className="mt-5">
                    <Col>
                        <h1>Change Your Password</h1>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <Form
                            noValidate
                            method="post"
                            onSubmit={event => {
                                handleSubmitSetNewPassword(event);
                            }}
                        >
                            <Form.Row>
                                <Form.Group controlId="newPassword">
                                    <Form.Label>Enter New Password</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend
                                            onClick={showPassword}
                                        >
                                            <InputGroup.Text id="inputGroupPrepend">
                                                {show ? (
                                                    <FaEye />
                                                ) : (
                                                    <FaEyeSlash />
                                                )}
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type={show ? 'text' : 'password'}
                                            placeholder="New Password"
                                            onChange={
                                                handleUpdateSetNewPassword
                                            }
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group controlId="confirmNewPassword">
                                    <Form.Label>
                                        Confirm New Password
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend
                                            onClick={showPassword}
                                        >
                                            <InputGroup.Text id="inputGroupPrepend">
                                                {show ? (
                                                    <FaEye />
                                                ) : (
                                                    <FaEyeSlash />
                                                )}
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type={show ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            onChange={
                                                handleUpdateSetConfirmNewPassword
                                            }
                                            onBlur={handleValidateMatch}
                                            aria-describedby="inputGroupPrepend"
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Button
                                    logout={
                                        userPassword !== confirmUserPassword
                                            ? true
                                            : false
                                    }
                                    type="submit"
                                    disabled={
                                        !userPassword ||
                                        !confirmUserPassword ||
                                        userPassword !== confirmUserPassword
                                    }
                                >
                                    {userPassword === confirmUserPassword
                                        ? 'Set Your New Password'
                                        : 'Passwords Do Not Match'}
                                </Button>
                            </Form.Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default ResetPassword;
