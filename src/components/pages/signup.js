import React, { useState, useEffect, useContext } from 'react';
import { navigate, Link, useStaticQuery, graphql } from 'gatsby';

import { Alert, Container, Row, Col, Form } from 'react-bootstrap';
import Button from '../../styled_components';
import { useIdentityContext } from 'react-netlify-identity-widget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Img from 'gatsby-image';
import addStripeCustomer from '../../utils/addStripeCustomer';
import COLORS from '../../styles/color';
import fetchPlans from '../../utils/fetchPlans';
import redirectToCheckout from '../../utils/redirectToCheckout';
import fetchStripeSession from '../../utils/fetchStripeSession';
import { AuthContext } from '../../context/GlobalContextProvider';

const PLAN_PRICE_JOINER_TEXT = ' - $';

const Signup = () => {
    const data = useStaticQuery(graphql`
        {
            allFile(filter: { name: { eq: "brand-header2" } }) {
                edges {
                    node {
                        name
                        childImageSharp {
                            fluid {
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
            }
        }
    `);

    const { setSignupCredential, setAuthUserContext } = useContext(AuthContext);
    const [userCredentials, setUserCredentials] = useState({
        full_name: undefined,
        email: undefined,
        password: undefined,
        userPackage: 'plan_HF8Tc4J2WjLDAg',
        terms: undefined,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [plans, setPlans] = useState([]);
    const [planIds, setPlanIds] = useState({});

    const { user, signupUser } = useIdentityContext();
    const { email, password, full_name, userPackage, terms } = userCredentials;

    useEffect(() => {
        fetchPlans()
            .then(res => res.json())
            .then(({ plans }) => {
                if (Array.isArray(plans?.data)) {
                    setPlans(plans.data);
                    setPlanIds(
                        plans.data.reduce((nicknameAndId, { nickname, id }) => {
                            return {
                                ...nicknameAndId,
                                [nickname]: id,
                            };
                        }, {})
                    );
                }
            })
            .catch(error => console.error("Couldn't get plans:", error));
    }, []);

    useEffect(() => {
        if (!window && !user) {
            return;
        }
        const searchParams = new URLSearchParams(window.location.search);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return;
        } else {
            // On subscription purchase, ie we have a sessionId in the url, navigate to daily rides
            fetchStripeSession({ sessionId })
                .then(res => res.json())
                .then(({ session }) => {
                    if (session?.customer === user?.user_metadata?.stripeId) {
                        navigate('/app/daily_rides');
                    }
                });
        }
    }, []);

    const handleUpdate = event => {
        const nickname = event.target.value.split(PLAN_PRICE_JOINER_TEXT)[0];
        setUserCredentials({
            ...userCredentials,
            [event.target.name]: planIds[nickname] || event.target.value,
        });
    };

    const handleSubmit = event => {
        event.preventDefault();
        setIsLoading(true);

        addStripeCustomer({ name: full_name, email })
            .then(res => res.json())
            .then(data => {
                console.log('signup user data', data);
                setSignupCredential({
                    email,
                    password,
                    data: {
                        full_name,
                        userPackage,
                        stripeId: data?.customer?.id,
                    },
                });
                signupUser(email, password, {
                    full_name,
                    userPackage,
                    stripeId: data?.customer?.id,
                }).then(user => {
                    console.log(
                        'Respsonse from SignUp Page, No Redirect: ',
                        user
                    );
                    setAuthUserContext(user);
                    const lineItems = {};
                    const subscription = {
                        items: [
                            {
                                plan: userPackage,
                            },
                        ],
                    };
                    const metaData = {};

                    // redirectToCheckout(
                    //     event,
                    //     user,
                    //     lineItems,
                    //     metaData,
                    //     subscription
                    // );
                });
            })
            .then(() => {
                const timer = setTimeout(() => {
                    setIsLoading(false);
                    setIsError(false);
                    console.log('This will run after 3 second!');
                }, 2000);
                return () => clearTimeout(timer);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
                setIsError(true);
            });
    };

    return (
        <>
            <Container
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        width: '50%',
                        marginTop: 20,
                    }}
                >
                    <Img
                        fluid={data.allFile.edges[0].node.childImageSharp.fluid}
                    />
                </div>
                <Row className="pt-4">
                    <Col className="border rounded-lg p-5 mb-5">
                        <h1 className="m-auto py-4">Join The Crew</h1>
                        <p style={{ fontWeight: 'bold' }}>
                            7 Day Free Trial Cancel Anytime Zero Cancellation
                            Fees 
                        </p>
                        <p style={{ fontWeight: 'bold' }}>
                            Monthly Subscription Includes:
                        </p>
                        <ul style={{ marginLeft: 15 }}>
                            <li>
                                All Rides &amp; All Yoga Flows Available
                                Anytime, Anywhere In The World
                            </li>
                            <li>Direct Dialogue With Your Trainer</li>
                            <li>All for $14.95 AUD per week</li>
                        </ul>
                        <p>You will not be charged for your first 7 days</p>
                        {isError && !isLoading ? (
                            <Alert variant="danger">
                                <FontAwesomeIcon icon="heart-broken" /> Its Not
                                You, Its Me! Something seems to have gone wrong,
                                please try again
                            </Alert>
                        ) : (
                            <></>
                        )}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    name="full_name"
                                    onChange={handleUpdate}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    onChange={handleUpdate}
                                />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone
                                    else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Confirm Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Confirm Email Address"
                                    name="reenterEmail"
                                    onChange={handleUpdate}
                                />

                                {userCredentials.email ===
                                userCredentials.reenterEmail ? (
                                    <Form.Text className="text-muted">
                                        We'll be sending you a verification
                                        email, so lets make sure we have the
                                        right address.
                                    </Form.Text>
                                ) : (
                                    <Form.Text
                                        className="font-bold"
                                        style={{
                                            color: '#FF0000',
                                        }}
                                    >
                                        Email addresses do not match. Please
                                        check them.
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    onChange={handleUpdate}
                                />
                                <Form.Text className="text-muted">
                                    Shhhhh! This is a secret.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPackage">
                                <Form.Label>Package</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="userPackage"
                                    onChange={handleUpdate}
                                >
                                    {plans.map(
                                        ({
                                            amount,
                                            id,
                                            nickname,
                                            trial_period_days,
                                        }) => (
                                            <option key={id}>
                                                {`${nickname}${PLAN_PRICE_JOINER_TEXT}${(
                                                    ((amount / 100) * 12) /
                                                    52
                                                ).toFixed(
                                                    2
                                                )} per week, billed monthly`}
                                                {!!trial_period_days &&
                                                    ` (with ${trial_period_days} day free trial)`}
                                            </option>
                                        )
                                    )}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox">
                                <Form.Check
                                    type="checkbox"
                                    name="terms"
                                    onChange={handleUpdate}
                                    label="I agree to RevelWell's Terms &amp; Conditions"
                                />
                            </Form.Group>
                            {isLoading ? (
                                <p>
                                    Redirecting To Secure Checkout...{' '}
                                    <FontAwesomeIcon icon="lock" />
                                </p>
                            ) : (
                                <Button
                                    className="mt-4"
                                    signup
                                    type="submit"
                                    disabled={
                                        !email ||
                                        !password ||
                                        !full_name ||
                                        !userPackage ||
                                        terms !== 'on' ||
                                        userCredentials.email !==
                                            userCredentials.reenterEmail
                                    }
                                >
                                    Proceed To Secure Checkout{' '}
                                    <FontAwesomeIcon icon="lock" />
                                </Button>
                            )}

                            <Link to="/login/" style={{ color: COLORS.petrol }}>
                                <p className="mt-3">
                                    Already a memeber? Sign In
                                </p>
                            </Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Signup;
