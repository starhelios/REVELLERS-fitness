import React from 'react';
import Layout from '../components/layout/layout';
import styles from '../css/aboutpage.module.css';

import { Link, useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const About = () => {
    const data = useStaticQuery(graphql`
        {
            small: file(relativePath: { eq: "ABOUT_US_PAGE.jpg" }) {
                name
                childImageSharp {
                    fluid(maxWidth: 1000, quality: 90, webpQuality: 90) {
                        ...GatsbyImageSharpFluid_withWebp_tracedSVG
                    }
                }
            }
        }
    `);

    return (
        <Layout>
            <section className={styles.about}>
                <div className={styles.aboutCenter}>
                    <article className={styles.aboutImg}>
                        <div className={styles.imgContainer}>
                            <Img
                                fluid={data.small.childImageSharp.fluid}
                                alt="pretty landscape"
                            />
                        </div>
                    </article>
                    <article className={styles.aboutInfo}>
                        <h4>Why We're Here</h4>
                        <p>
                            Our purpose is to empower people with choice on how
                            and when they work out. We have developed an
                            industry leading platform designed for the future of
                            health and wellness
                        </p>
                        <p>
                            Our vision is to create the new benchmark for
                            digital fitness and wellbeing, for people anywhere
                        </p>
                        <p>
                            Our mission is to ensure every experience,
                            interaction, communication and product we deliver,
                            is grounded in choice, quality and care
                        </p>
                        <h4>Your Trainer</h4>
                        <p>
                            Eve is a Cert III Fitness Trainer, Head Ride
                            Instructor and Yoga Teacher at RevelWell.
                        </p>
                        <p>
                            Her experience as an international DJ and career in
                            fashion has helped shape her into one of Australia’s
                            most unique fitness experts.
                        </p>
                        <p>
                            As well as her enviable taste in music, Eve’s
                            palpable positivity enables you to develop an
                            authentic connection which she strongly believes is
                            the key to achieving your goals together.
                        </p>
                        <p>
                            Passionate about coaching each client based on their
                            individual needs, Eve’s focus on delivering the
                            highest quality training experience and honing in on
                            the unique motivators of each client is her top
                            priority.
                        </p>
                        <p>
                            Eve and her team have built RevelWell as an answer
                            to the wellness community's needs for a progressive,
                            connected and energy-fuelled training experience.
                        </p>
                        <h4> Subscription</h4>
                        <p>
                            RevelWell is brand new approach to fitness and
                            wellness that allows you to chose when, where and
                            how you train
                        </p>
                        <p>
                            A subscription-based membership, the global
                            RevelWell community and fitness programs are built
                            on a unique and holistic approach to the way we
                            workout. From approachability and affordability to
                            growth through progression and communication,
                            RevelWell values YOU and what your goals and dreams
                            are
                        </p>
                        <p>
                            For only{' '}
                            <span className={styles.bold}>
                                $14.95 AUD per week
                            </span>
                            , you are a part of the RevelWell family, and can
                            access all Daily Rides, Yoga Flows and Ride Series
                            programs, as well as purchase On-Demand Rides for
                            just $4.95 AUD each
                        </p>
                        <p>
                            <span className={styles.bold}>DAILY RIDE:</span>{' '}
                            Brand new Daily ride training is live for 24 hours
                            each and everyday giving you up to 31 Fresh Rides
                            each month
                        </p>
                        <p>
                            <span className={styles.bold}>YOGA:</span> Dive into
                            the ever expanding library of Yoga flows to build
                            heat or unpack some tension
                        </p>
                        <p>
                            <span className={styles.bold}>RIDE SERIES:</span>{' '}
                            Explore Ride Series to work on your specific goals;
                            from an energizing introduction to Ride series to an
                            equalizer stamina building collection
                        </p>
                        <p>
                            <span className={styles.bold}>ON DEMAND:</span> Let
                            your mood be your guide in the On Demand section.
                            Choose from themed rides including our signature
                            Moving Meditation for those looking for a soothing
                            rhythmic mind-body connection
                        </p>
                        <p>
                            Let us join you on your journey. We will revel in
                            these moments and RevelWell together
                        </p>

                        <Link fade to="/app/daily_rides/">
                            <button className="btn-primary">
                                Ride With Me
                            </button>
                        </Link>
                    </article>
                </div>
            </section>
        </Layout>
    );
};

export default About;
