import React from 'react';
import { Link } from 'gatsby';
import { Col, Row, Container, Button } from 'react-bootstrap';
import '../../utils/fontawesome';

const buttonStyles = {
    fontSize: '13px',
    textAlign: 'center',
    color: '#fff',
    outline: 'none',
    padding: '12px 60px',
    boxShadow: '2px 5px 10px rgba(0,0,0,.1)',
    backgroundColor: 'rgb(255, 178, 56)',
    borderRadius: '6px',
    letterSpacing: '1.5px',
};

const PaymentError = ({ redirectUrl = '/' }) => {
    return (
        <Container>
            <Row>
                <h1 className="m-auto py-2">Uh oh, something went wrong :(</h1>
            </Row>
            <Row className="mt-2">
                <p className="m-auto p-2">
                    We weren't able to process the payment. Please try again or
                    contact us so we can get you back on your bike.
                </p>
            </Row>
            <Row className="mt-5">
                <Col className="d-flex justify-content-end">
                    <Link to={redirectUrl}>
                        <Button style={buttonStyles}>Try Again</Button>
                    </Link>
                </Col>

                <Col className="d-flex justify-content-start">
                    <Link to="/contact_us">
                        <Button
                            style={{
                                padding: buttonStyles.padding,
                                fontSize: buttonStyles.fontSize,
                            }}
                            variant="outline-info"
                        >
                            Contact Us
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default PaymentError;
