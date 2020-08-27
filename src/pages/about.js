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
                                alt="eve smith"
                            />
                        </div>
                    </article>
                    <article className={styles.aboutInfo}>
                        <h4>Why We're Here</h4>
                        <p>
                            Our purpose is to empower people with choice on how
                            &amp; when they work out. We have developed an
                            industry leading platform designed for the future of
                            health &amp; wellness.
                        </p>
                        <p>
                            Our vision is to create the new benchmark for
                            digital fitness &amp; wellbeing, for people
                            anywhere.
                        </p>
                        <p>
                            Our mission is to ensure every experience,
                            interaction, communication &amp; product we deliver,
                            is grounded in choice, quality &amp; care.
                        </p>
                        <h4>Your Trainer</h4>
                        <p>
                            Eve is a Cert III Fitness Trainer, Head Ride
                            Instructor &amp; Yoga Teacher at RevelWell.
                        </p>
                        <p>
                            Her experience as an international DJ &amp; career
                            in fashion has helped shape her into one of
                            Australia’s most unique fitness experts.
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
                            highest quality training experience &amp; honing in
                            on the unique motivators of each client is her top
                            priority.
                        </p>
                        <p>
                            Eve &amp; her team have built RevelWell as an answer
                            to the wellness community's needs for a progressive,
                            connected &amp; energy-fuelled training experience.
                        </p>
                        <h4> Subscription</h4>
                        <p>
                            RevelWell is brand new approach to fitness &amp;
                            wellness that allows you to choose when, where &amp;
                            how you train.
                        </p>
                        <p>
                            A subscription-based membership, the global
                            RevelWell community &amp; fitness programs are built
                            on a unique &amp; holistic approach to the way we
                            train. From approachability &amp; affordability to
                            growth through progression &amp; communication,
                            RevelWell values YOU &amp; what your goals &amp;
                            dreams are.
                        </p>
                        <p>
                            For only{' '}
                            <span className={styles.bold}>
                                $14.95 AUD per week
                            </span>
                            , you have unlimited access to ALL our Rides &amp;
                            Yoga Flows.
                        </p>
                        <p>
                            Let us join you on your journey. We will revel in
                            these moments &amp; RevelWell together
                        </p>

                        <Link to="/app/daily_rides/">
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
