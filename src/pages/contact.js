import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import { useIdentityContext } from 'react-netlify-identity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '../components/layout/layout';
import SEO from '../components/layout/seo';
import { Link } from 'gatsby';
import MainContactForm from '../components/Forms/MainContactForm';
import COLORS from '../styles/color';
const ContactUs = () => {
    return (
        <Layout>
            <SEO title="Contact" />
            <Container>
                <h1 className="m-auto py-4">Tell Us All The Things</h1>
                <Row>
                    <Col>
                        <MainContactForm />
                    </Col>
                </Row>
                <Row style={{ height: 100, textAlign: 'center' }}>
                    <Col className="pt-5">
                        <h4 className="mb-3">DM Me....</h4>
                        <Link style={{ color: COLORS.petrol }}>
                            <FontAwesomeIcon
                                style={{ fontSize: '2rem' }}
                                icon={['fab', 'facebook']}
                                className="mr-5"
                            />
                        </Link>

                        <a
                            href="https://www.instagram.com/revel.well/"
                            style={{ color: COLORS.petrol }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon
                                style={{ fontSize: '2rem' }}
                                icon={['fab', 'instagram']}
                            />
                        </a>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default ContactUs;
