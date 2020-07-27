import React, { useState } from 'react';
import { navigate, graphql, useStaticQuery, Link } from 'gatsby';
import Img from 'gatsby-image';
import { Alert, Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import Button from '../../styled_components/';
import { useIdentityContext } from 'react-netlify-identity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import COLORS from '../../styles/color';
import fetchCustomerSubscriptions from '../../utils/fetchCustomerSubscriptions';
import redirectToCheckout from '../../utils/redirectToCheckout';
import addStripeCustomer from '../../utils/addStripeCustomer';

const Login = ({ redirectBackTo = `/app/profile` }) => {
    const data = useStaticQuery(graphql`
        {
            allFile(filter: { name: { eq: "brand-header2" } }) {
                edges {
                    node {
                        name
                        childImageSharp {
                            fluid(quality: 100, pngQuality: 100) {
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
            }
        }
    `);
    const [userCredentials, setUserCredentials] = useState({
        email: undefined,
        password: undefined,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const handleUpdate = event => {
        setUserCredentials({
            ...userCredentials,
            [event.target.name]: event.target.value,
        });
    };
    const { loginUser, isLoggedIn } = useIdentityContext();
    const { email, password } = userCredentials;

    // Let's login the user
    const handleSubmit = event => {
        event.preventDefault();
        setIsLoading(true);

        // Call the login function
        loginUser(email, password)
            .then(user => {
                // On successful login we'll make sure the user has our valid plan id
                user.update({
                    data: {
                        userPackage: 'plan_HF8Tc4J2WjLDAg', // TODO: remove this when adding new packages to stripe or everyone will only have one type of plan available
                        lastLogin: new Date(),
                    },
                })
                    .then(user => {
                        // Grab their stripeId
                        const { stripeId } = user?.user_metadata || undefined;

                        // Those with stripeId we'll make sure have actually purchased a plan (including the free trial)
                        if (stripeId) {
                            fetchCustomerSubscriptions({
                                stripeId,
                            })
                                .then(res => res.json())
                                .then(({ subscriptions = {} }) => {
                                    const activeSubscriptions = subscriptions?.data?.filter(
                                        ({ canceled_at, cancel_at }) =>
                                            !canceled_at ||
                                            new Date(
                                                cancel_at * 1000
                                            ).getTime() >= new Date()
                                    );
                                    const hasSubscription = !!activeSubscriptions?.length;

                                    setIsLoading(false);
                                    setIsError(false);

                                    // Those with a subscription can go to wherever they came from e.g. maybe you tried to access daily rides and were redirexted to login, this will take you back, alternatively you'll go to profile
                                    if (hasSubscription) {
                                        navigate(redirectBackTo);
                                        // Those who haven't paid/signed up in Stripe will be redirected to checkout
                                    } else {
                                        const lineItems = {};
                                        const subscription = {
                                            items: [
                                                {
                                                    plan: 'plan_HF8Tc4J2WjLDAg',
                                                },
                                            ],
                                        };
                                        const metaData = {};

                                        redirectToCheckout(
                                            event,
                                            user,
                                            lineItems,
                                            metaData,
                                            subscription
                                        );
                                    }
                                });
                            // Those without a stripeId are given one and then redirected to checkout
                        } else {
                            addStripeCustomer({ email })
                                .then(res => res.json())
                                .then(data => {
                                    user.update({
                                        data: {
                                            stripeId: data?.customer?.id,
                                            lastLogin: new Date(),
                                        },
                                    }).then(userWithStripeId => {
                                        const lineItems = {};
                                        const subscription = {
                                            items: [
                                                {
                                                    plan: 'plan_HF8Tc4J2WjLDAg', // TODO: remove this when adding new packages to stripe or everyone will only have one type of plan available
                                                },
                                            ],
                                        };
                                        const metaData = {};

                                        redirectToCheckout(
                                            event,
                                            userWithStripeId,
                                            lineItems,
                                            metaData,
                                            subscription
                                        );
                                    });
                                });
                        }
                    })
                    .catch(error => console.error('Unable to update: ', error));
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
                setIsError(true);
            });
    };

    if (isLoggedIn) {
        navigate(redirectBackTo);
    }

    return (
        <div
            style={{
                height: '95vh',
            }}
        >
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
                <Row className="w-75 pt-3">
                    <Col className="border rounded-lg p-3">
                        <h1 className="m-auto py-2">Log In</h1>
                        {isError && !isLoading ? (
                            <Alert variant="danger">
                                <FontAwesomeIcon icon="heart-broken" /> Whoops!
                                Make sure you have verified your email address
                                if this is your first time login in &amp; try
                                again.
                            </Alert>
                        ) : (
                            <></>
                        )}
                        <Form
                            className="m-auto w-100"
                            method="post"
                            onSubmit={event => {
                                handleSubmit(event);
                                // navigate(`/app/profile`);
                            }}
                        >
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

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    onChange={handleUpdate}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Button
                                    type="submit"
                                    disabled={!email || !password}
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        </>
                                    ) : (
                                        'Log In'
                                    )}
                                </Button>
                            </Form.Group>
                            <Row className="px-3">
                                <Link
                                    to="/signup/"
                                    style={{ color: COLORS.rust }}
                                >
                                    <p className="mt-2">
                                        Not A Member? Sign Up Here
                                    </p>
                                </Link>
                            </Row>
                            <Row className="px-3">
                                <Link
                                    to="/reset_password/"
                                    style={{ color: COLORS.dove_grey }}
                                >
                                    <p className="mt-2">Forgotten password?</p>
                                </Link>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
