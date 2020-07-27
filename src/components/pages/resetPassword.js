import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import Button from '../../styled_components';
import { useIdentityContext } from 'react-netlify-identity';
import { RiMailSendLine } from 'react-icons/ri';
const ResetPassword = () => {
    const { requestPasswordRecovery } = useIdentityContext();
    const [userEmail, setUserEmail] = useState();
    const [showSentMessage, setShowSentMessage] = useState(false);

    const handleUpdateRequestResetEmail = event => {
        setUserEmail(event.target.value);
    };

    const handleSubmitRequestResetEmail = event => {
        event.preventDefault();
        requestPasswordRecovery(userEmail).then(() => {
            setShowSentMessage(true);
        });
    };

    return (
        <Container>
            <Row className="mt-5">
                <Col>
                    <h1>Password Recovery</h1>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <Form
                        className="m-auto w-100"
                        method="post"
                        onSubmit={event => {
                            handleSubmitRequestResetEmail(event);
                        }}
                    >
                        <Form.Group controlId="passwordResetEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                onChange={handleUpdateRequestResetEmail}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Button type="submit" disabled={!userEmail}>
                                Send Email <RiMailSendLine />
                            </Button>
                        </Form.Group>
                    </Form>
                    {!!showSentMessage && (
                        <Row className="d-flex justify-content-center mt-4 alert alert-success">
                            Email sent! Please check your inbox.
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
