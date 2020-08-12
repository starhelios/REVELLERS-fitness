import React, { useState, useEffect } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { Table, Container, Row } from 'react-bootstrap';
import fetchPurchasedVideos from '../../utils/fetchPurchasedVideos';
import SEO from '../layout/seo';
import Button from '../../styled_components/';
import Img from 'gatsby-image';
import { useStaticQuery, graphql, Link, navigate } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Helmet from 'react-helmet';
import fetchPlans from '../../utils/fetchPlans';
import redirectToCheckout from '../../utils/redirectToCheckout';
import fetchCustomerSubscriptions from '../../utils/fetchCustomerSubscriptions';
import cancelStripeSubscription from '../../utils/cancelStripeSubscription';
import applyCouponCode from '../../utils/applyCouponCode';
import createBillingDashboardSession from '../../utils/createBillingDashboardSession';
import getAllCouponCodes from '../../utils/getAllCouponCodes';
import { RiMedal2Line } from 'react-icons/ri';
import styles from '../../css/profile.module.css';
const getLocalDateString = timeInMIlliseconds => {
    const dateObj = new Date(timeInMIlliseconds);
    const pad = n => (n < 10 ? '0' + n : n);
    return (
        pad(dateObj.getDate()) +
        '/' +
        pad(dateObj.getMonth() + 1) +
        '/' +
        dateObj.getFullYear()
    );
};

const Profile = ({ location }) => {
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
    const { user } = useIdentityContext();
    const { stripeId, full_name } = user?.user_metadata || {};

    const [library, setLibrary] = useState([]);
    const [plans, setPlans] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [cancelledSubscription, setCancelledSubscription] = useState();
    const [showCoupon, setCoupon] = useState(false);
    const [showCouponSuccess, setCouponSuccess] = useState(false);
    const [showCouponFailure, setCouponFailure] = useState(false);

    const [code, setCode] = useState('');
    const [allCodes, setAllCodes] = useState([]);
    const [codeIsValid, setCodeIsValid] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    const handleOnChange = event => {
        const value = event.target.value.toUpperCase();
        setCode(value);
    };

    const checkForValidCouponCode = event => {
        const value = event.target.value;
        const isValid = allCodes.find(c => c.id === value);
        isValid ? setCodeIsValid(true) : setCodeIsValid(false);
    };

    const toggleCoupon = () => {
        setCoupon(showCoupon => !showCoupon);
    };
    const toggleCouponSuccess = () => {
        setCouponSuccess(showCouponSuccess => !showCouponSuccess);
    };
    const toggleCouponFailure = () => {
        setCouponFailure(showCouponFailure => !showCouponFailure);
    };

    const startBillingDashboard = () => {
        console.log(stripeId);
        createBillingDashboardSession(stripeId)
            .then(res => res.json())
            .then(data => navigate(data.customer.url))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        getAllCouponCodes()
            .then(res => res.json())
            .then(data => {
                setAllCodes(data.data);
            })
            .catch(error => {
                console.error("Couldn't Fetch Codes", error);
            });
    }, []);

    useEffect(() => {
        fetchPurchasedVideos({ stripeId })
            .then(res => res.json())
            .then(({ paymentIntents }) => {
                if (paymentIntents?.data) {
                    setLibrary(paymentIntents.data);
                }
            });
    }, [stripeId]);

    useEffect(() => {
        fetchPlans()
            .then(res => res.json())
            .then(({ plans }) => {
                if (Array.isArray(plans?.data)) {
                    setPlans(plans.data);
                }
            })
            .catch(error => console.error("Couldn't get plans:", error));
    }, []);

    useEffect(() => {
        fetchCustomerSubscriptions({ stripeId })
            .then(res => res.json())
            .then(({ subscriptions }) => {
                if (Array.isArray(subscriptions?.data)) {
                    setSubscriptions(subscriptions.data);
                }
            })
            .catch(error =>
                console.error("Couldn't get subscriptions:", error)
            );
    }, [stripeId, cancelledSubscription]);

    const subscribe = id => {
        const lineItems = {};
        const subscription = {
            items: [
                {
                    plan: id,
                },
            ],
        };
        const metaData = {};

        redirectToCheckout(undefined, user, lineItems, metaData, subscription);
    };

    const cancelSubscription = id => {
        cancelStripeSubscription({
            stripeId,
            subscriptionId: id,
        })
            .then(res => res.json())
            .then(data => {
                setCancelledSubscription(data?.subscription?.plan?.nickname);
                setSubscriptions([]);
            })
            .catch(error =>
                console.error("Couldn't cancel subscription", error)
            );
    };
    const updateWithCoupon = () => {
        setIsApplying(true);
        applyCouponCode({
            stripeId,
            code,
        })
            .then(res => res.json())
            .then(data => {
                setCoupon(false);
                setCouponSuccess(true);
                setIsApplying(false);
                setCode('');
                console.log('COUPON APPLIED');
            })
            .catch(error => {
                setCoupon(false);
                setCode('');
                setIsApplying(false);
                setCouponFailure(true);
                console.error("Couldn't apply coupon code", error);
            });
    };

    return (
        <Container>
            <Helmet />
            <SEO title="Profile" />
            <Row className="mt-3">
                <div
                    style={{
                        width: '50%',
                        marginTop: 20,
                        margin: 'auto',
                    }}
                >
                    <Img
                        fluid={data.allFile.edges[0].node.childImageSharp.fluid}
                    />
                </div>
            </Row>
            <Row className="mt-4 text-center">
                <h1 className="m-auto">Welcome {full_name.split(' ', 1)}</h1>
            </Row>
            <Row>
                <div className="w-50 pt-3 m-auto text-center">
                    <Button onClick={toggleCoupon}>
                        Click Here To Enter Voucher Code {<RiMedal2Line />}
                    </Button>
                </div>
            </Row>
            {showCoupon && (
                <article className={styles.couponContainer}>
                    <h2>Enter Your Code</h2>
                    <input
                        className={styles.codeInput}
                        placeholder="Enter your code here"
                        maxLength="14"
                        name="code"
                        id="code"
                        value={code.toUpperCase()}
                        onChange={e => {
                            handleOnChange(e);
                            checkForValidCouponCode(e);
                        }}
                    />
                    {codeIsValid && (
                        <Button
                            onClick={() => {
                                updateWithCoupon();
                            }}
                            disabled={isApplying}
                        >
                            {isApplying
                                ? 'Applying Code'
                                : 'Good Guess, Apply Code'}
                        </Button>
                    )}
                </article>
            )}
            {showCouponSuccess && (
                <article className={styles.showCouponSuccess}>
                    <h2 className={styles.successHeading}>SUCCESS!</h2>
                    <p className={styles.successSubheading}>
                        1 Month Free Subscription Activated
                    </p>
                    <Button
                        success
                        onClick={() => {
                            toggleCouponSuccess();
                            navigate('/app/daily_rides');
                        }}
                    >
                        Get Riding!
                    </Button>
                </article>
            )}
            {showCouponFailure && (
                <article className={styles.showCouponError}>
                    <h2 className={styles.errorHeading}>Error</h2>
                    <p className={styles.errorSubheading}>
                        This Coupon Is Invalid Or Has Already Been Redeemed.
                        Please, Try Again.
                    </p>
                    <Button
                        error
                        onClick={() => {
                            setCouponSuccess(false);
                            toggleCouponFailure();
                            toggleCoupon();
                        }}
                    >
                        Try Another Code
                    </Button>
                </article>
            )}
            <Row className="px-3">
                <h3 className="my-4">
                    Your Library:{' '}
                    {
                        library.filter(
                            ({ description }) =>
                                !description
                                    ?.toLowerCase()
                                    ?.includes('subscription')
                        ).length
                    }{' '}
                    video
                    {library.filter(
                        ({ description }) =>
                            !description
                                ?.toLowerCase()
                                ?.includes('subscription')
                    ).length === 1
                        ? ''
                        : 's'}{' '}
                </h3>
                <Table striped bordered hover style={{ textAlign: 'center' }}>
                    <thead>
                        <tr>
                            <th>Date Purchased</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Play Now</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!library?.length ||
                            library?.[0]?.itemDescription
                                ?.toLowerCase()
                                .includes('subscription')) && (
                            <tr key="no-purchases">
                                <td colSpan="4">
                                    {'No purchased videos to display'}
                                </td>
                            </tr>
                        )}
                        {library.map(
                            ({
                                created,
                                status,
                                metadata,
                                description: itemDescription,
                            }) => {
                                // TODO: add whatever is needed to this metadata object
                                const { description, name } = metadata;

                                return (
                                    !itemDescription
                                        ?.toLowerCase()
                                        .includes('subscription') && (
                                        <tr key={created}>
                                            <td>
                                                {!!created &&
                                                    getLocalDateString(
                                                        created * 1000
                                                    )}
                                            </td>
                                            <td>{!!name && name}</td>
                                            <td>
                                                {' '}
                                                {!!description && description}
                                            </td>
                                            <td>
                                                {status === 'succeeded' && (
                                                    <Link to="/app/on_demand_rides/">
                                                        <Button
                                                            style={{
                                                                marginLeft:
                                                                    '20px',
                                                            }}
                                                        >
                                                            PLAY{' '}
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    'play-circle'
                                                                }
                                                            />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                );
                            }
                        )}
                    </tbody>
                </Table>
            </Row>
            {!!cancelledSubscription && (
                <Row className="d-flex justify-content-center mt-4 alert alert-danger">
                    {cancelledSubscription} subscription has been cancelled
                </Row>
            )}
            {!!subscriptions.length && !subscriptions?.[0]?.canceled_at ? (
                <Row className="d-flex justify-content-center mt-4">
                    <Button cancel onClick={() => cancelSubscription()}>
                        Cancel{' '}
                        {`${
                            subscriptions?.[0]?.plan?.nickname
                                ? subscriptions?.[0]?.plan?.nickname
                                : ''
                        } `}
                        Subscription
                    </Button>
                </Row>
            ) : (
                plans.map(({ id, nickname, amount }) => {
                    return (
                        <Row
                            key={id}
                            className="d-flex justify-content-center mt-4"
                        >
                            {
                                <Button onClick={() => subscribe(id)}>
                                    {`Subscribe to our${!!nickname &&
                                        ' ' + nickname} package ${!!amount &&
                                        '- $' +
                                            (
                                                ((amount / 100) * 12) /
                                                52
                                            ).toFixed(2) +
                                            ' per week, billed monthly'}`}
                                </Button>
                            }
                        </Row>
                    );
                })
            )}
        </Container>
    );
};
export default Profile;
