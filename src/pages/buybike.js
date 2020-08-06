import React from 'react';
import Layout from '../components/layout/layout';
import styles from '../css/buybike.module.css';
import Title from '../components/layout/Title';

import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

import { loadStripe } from '@stripe/stripe-js';
import BikeDetails from '../components/common/BikeDetails';
const stripePromise = loadStripe('pk_live_P7kweP5kBkYEumgsJcUn8Srj00vS6JhiiY');

const handleBuyPerformance = async event => {
    const stripe = await stripePromise;
    const { error } = await stripe
        .redirectToCheckout({
            lineItems: [
                // Replace with the ID of your price
                { price: 'price_1GqbpkCwj6YF3l8aESrDUbeD', quantity: 1 },
            ],
            mode: 'payment',
            successUrl: 'https://revelwell.com.au/buy_bike_succes/',
            cancelUrl: 'https://revelwell.com.au/buy_bike_cancel/',
            shippingAddressCollection: {
                allowedCountries: ['AU'],
            },
        })
        .then(error => {
            console.log('Error: ', error.message);
        });
};
const handlBuyClassic = async event => {
    const stripe = await stripePromise;
    const { error } = await stripe
        .redirectToCheckout({
            lineItems: [
                // Replace with the ID of your price
                { price: 'price_1Gqbq6Cwj6YF3l8aFst1bbo3', quantity: 1 },
            ],
            mode: 'payment',
            successUrl: 'https://revelwell.com.au/buy_bike_succes/',
            cancelUrl: 'https://revelwell.com.au/buy_bike_cancel/',
            shippingAddressCollection: {
                allowedCountries: ['AU'],
            },
        })
        .then(error => {
            console.log('Error: ', error.message);
        });
};
const BuyBike = () => {
    const data = useStaticQuery(graphql`
        {
            classic: file(relativePath: { eq: "IC-Classic.jpg" }) {
                name
                childImageSharp {
                    fluid(maxWidth: 600) {
                        ...GatsbyImageSharpFluid_tracedSVG
                    }
                }
            }
            performance: file(relativePath: { eq: "RW_Performance.jpg" }) {
                name
                childImageSharp {
                    fluid(maxWidth: 600) {
                        ...GatsbyImageSharpFluid_tracedSVG
                    }
                }
            }
        }
    `);
    const performanceDetails = () => {
        return (
            <>
                <ul>
                    <li> Height: 130cm (51”) </li>
                    <li> Width: 53cm (21”) </li>
                    <li> Length: 127cm (50″) </li>
                    <li> Item weight: 51 kg (112 lbs) </li>
                    <li> Max user weight: 159 kg (350 lbs) </li>
                    <li> User size range: 150 to 203 cm (4’11 to 6’8) tall </li>
                </ul>
                <h5> Features</h5>
                <ul>
                    <li>Handlebars: Adjustable ErgoLoop Handlebars</li>
                    <li>Pedals: Double Link with SPD + Toe Cages</li>
                    <li>
                        Seat: Adjustable Seat Position (up, down, forward,
                        backward)
                    </li>
                    <li>
                        Resistance: Magnetic Brake Chain drive system uses
                        forged steel crank
                    </li>
                    <li>Flywheel: 37 lbs perimeter weighted disc</li>
                    <li>Drive Options: Carbon Blue Belt Drive</li>
                    <li>
                        Computer: None. Compatible with MPower Consoles (sold
                        separately – contact us to add this to your order)
                    </li>
                    <li>Transport: Front wheels provide easy transport</li>
                    <li>Frame Color: Pearl White"</li>
                </ul>
            </>
        );
    };
    const classicDetails = () => {
        return (
            <>
                <ul>
                    <li>Height: 117 CM (46”)</li>
                    <li>Width: 51 CM (20”)</li>
                    <li>Length: 110 CM (43.5”)</li>
                    <li>Item weight: 114 LBS (52 kg)</li>
                    <li>Max user weight: 159 KG (350 lbs)</li>
                </ul>
                <h5> Features</h5>
                <ul>
                    <li>
                        Classic handlebar design with integrated water bottle
                        holder and smartphone tablet mount
                    </li>
                    <li>
                        Perimeter-weighted flywheel with dual-pad brake
                        technology
                    </li>
                    <li>
                        Chain drive using forged steel crank and ISIS oversized
                        bottom bracket
                    </li>
                    <li>Heavy Perimeter-Weighted Flywheel</li>
                    <li>Direct Pressure Brake Resistance</li>
                    <li>Narrow Q-Factor</li>
                    <li>Trapezoidal seat adjustment</li>
                    <li>Frame Finish – E-Coated & Powder Coated Steel</li>
                </ul>
            </>
        );
    };
    return (
        <Layout>
            <section className={styles.about}>
                <div className={styles.aboutCenter}>
                    <article>
                        <div>
                            <Img
                                fluid={data.performance.childImageSharp.fluid}
                                alt="spin bike"
                            />
                        </div>
                    </article>
                    <article className={styles.aboutInfo}>
                        <Title title="RevelWell" subtitle="Performance" />

                        <p
                            style={{
                                margin: 'auto',
                                textAlign: 'justify',
                            }}
                        >
                            The flagship offering from leading manufacturer
                            Schwinn, the RevelWell Performance is the ultimate
                            in training at home. The RevelWell Performance gives
                            you studio quality equipment in the comfort of your
                            own home. Featuring Carbon Blue belt drive system
                            that combines the maintenance-free durability and
                            performance of a belt with the authentic-ride feel
                            of a chain it is on the cutting-edge of indoor
                            cycling. Add to this feature-set the smallest foot
                            print of any commercial indoor bike so it will fit
                            nicely into even the smallest spaces in your home To
                            enhance your riding experience the RevelWell
                            Performance features a RevelGel saddle pad for added
                            comfort Your bike will be delivered fully assembled
                            with pedals featuring toe cage and SPD cleat
                            fixtures.
                        </p>
                        <p
                            style={{
                                margin: '0 auto',
                                fontWeight: 'bold',
                                paddingTop: 10,
                            }}
                        >
                            $AUD 3,495 <br />{' '}
                            <span style={{ fontSize: '0.8rem' }}>
                                (inc Delivery Australia Wide Early August &amp;
                                1 Month RevelWell Subscription)
                            </span>
                        </p>
                        <div
                            style={{
                                width: '100%',
                                textAlign: 'center',
                                paddingTop: 30,
                            }}
                        >
                            <button
                                className="btn-primary"
                                onClick={handleBuyPerformance}
                            >
                                Preorder
                            </button>
                        </div>
                    </article>
                    <BikeDetails info={performanceDetails()} className="ml-5" />
                </div>

                <div className={styles.aboutCenter}>
                    <article>
                        <div>
                            <Img
                                fluid={data.classic.childImageSharp.fluid}
                                alt="spin bike"
                            />
                        </div>
                    </article>
                    <article className={styles.aboutInfo}>
                        <Title title="RevelWell" subtitle="Classic" />
                        <p
                            style={{
                                margin: '0 auto',
                                textAlign: 'justify',
                            }}
                        >
                            The Revelwell Classic offers a sturdy steel frame,
                            heavy perimeter weighted flywheel, traditional chain
                            drive, and direct pressure brake. The bike comes
                            standard with the familiar classic flat pedals and
                            cages to accommodate regular athletic shoes. The
                            RevelWell Classic is also compatible with the
                            Schwinn Triple Link™ pedal to allow you to clip in
                            (sold seperately) please contact us to add these to
                            your order. To enhance your riding experience the
                            bike features a RevelGel saddle pad for your
                            comfort. Bike will be delivered fully assembled to
                            you anywhere in Australia.
                        </p>
                        <p
                            style={{
                                margin: '0 auto',
                                fontWeight: 'bold',
                                paddingTop: 10,
                            }}
                        >
                            $AUD 2,540
                            <br />
                            <span
                                style={{
                                    fontSize: '0.8rem',
                                    textAlign: 'left',
                                }}
                            >
                                (inc Delivery Australia Wide Early August &amp;
                                1 Month RevelWell Subscription)
                            </span>
                        </p>
                        <p></p>
                        <div
                            style={{
                                width: '100%',
                                marginBottom: 20,
                                textAlign: 'center',
                                paddingTop: 30,
                            }}
                        >
                            <button
                                className="btn-disabled"
                                //onClick={handlBuyClassic}
                            >
                                SOLD OUT
                            </button>
                        </div>
                    </article>
                    <BikeDetails info={classicDetails()} className="ml-5" />
                </div>
            </section>
        </Layout>
    );
};

export default BuyBike;
