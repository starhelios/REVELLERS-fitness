import React, { useState, useEffect } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { Container, Row } from 'react-bootstrap';
import SEO from '../layout/seo';
import Button from '../../styled_components/';
import Img from 'gatsby-image';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import Helmet from 'react-helmet';
import applyCouponCode from '../../utils/applyCouponCode';
import createBillingDashboardSession from '../../utils/createBillingDashboardSession';
import getAllCouponCodes from '../../utils/getAllCouponCodes';
import { RiMedal2Line, RiLockPasswordLine } from 'react-icons/ri';
import { FaRegAddressCard } from 'react-icons/fa';
import { MdDirectionsBike } from 'react-icons/md';
import styles from '../../css/profile.module.css';

const Profile = () => {
    const data = useStaticQuery(graphql`
        {
            allFile(filter: { name: { eq: "brand-header2" } }) {
                edges {
                    node {
                        name
                        childImageSharp {
                            fluid(quality: 90, maxWidth: 600) {
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

    const [showCoupon, setCoupon] = useState(false);
    const [showCouponSuccess, setCouponSuccess] = useState(false);
    const [showCouponFailure, setCouponFailure] = useState(false);

    const [code, setCode] = useState('');
    const [allCodes, setAllCodes] = useState([]);
    const [codeIsValid, setCodeIsValid] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
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
        <Container
            style={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Helmet />
            <SEO title="Profile" />
            <Row
                className="mt-4"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: 400,
                        marginBottom: 30,
                    }}
                >
                    <Img
                        fluid={data.allFile.edges[0].node.childImageSharp.fluid}
                    />
                </div>
                <h2 className="m-auto text-center">
                    Welcome Back, {full_name.split(' ', 1)}
                </h2>
            </Row>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div style={{ flex: 1, marginTop: 30 }}>
                    <Button
                        profileButton
                        onClick={() => navigate('/app/daily_rides')}
                        className="m-auto"
                    >
                        Start Riding {<MdDirectionsBike />}
                    </Button>
                </div>
                <div style={{ flex: 1, marginTop: 10 }}>
                    <Button
                        profileButton
                        onClick={toggleCoupon}
                        className="m-auto"
                    >
                        Enter Voucher Code {<RiMedal2Line />}
                    </Button>
                </div>
                <div style={{ flex: 1, marginTop: 10 }}>
                    <Button
                        disabled={loading}
                        profileButton
                        onClick={startBillingDashboard}
                        className="m-auto"
                    >
                        {loading ? 'Redirecting You' : 'Manage Subscription'}{' '}
                        {<FaRegAddressCard />}
                    </Button>
                </div>
                <div style={{ flex: 1, marginTop: 10 }}>
                    <Button
                        profileButton
                        onClick={() => navigate('/reset_password/')}
                        className="m-auto"
                    >
                        Change Password {<RiLockPasswordLine />}
                    </Button>
                </div>
            </div>
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
        </Container>
    );
};
export default Profile;
