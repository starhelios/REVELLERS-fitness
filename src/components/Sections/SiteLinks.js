import React from 'react';

import { useStaticQuery, graphql } from 'gatsby';
import Title from '../layout/Title';
import styles from '../../css/items.module.css';
import SiteLinkCard from '../common/SiteLinkCard';

const FeaturedTours = () => {
    const data = useStaticQuery(graphql`
        {
            yoga: file(relativePath: { eq: "CARD_YOGA.jpg" }) {
                childImageSharp {
                    fluid(quality: 90, maxWidth: 600) {
                        ...GatsbyImageSharpFluid_withWebp_tracedSVG
                    }
                }
            }
            ondemand: file(relativePath: { eq: "CARD_ODR3.jpg" }) {
                childImageSharp {
                    fluid(quality: 90, maxWidth: 600) {
                        ...GatsbyImageSharpFluid_withWebp_tracedSVG
                    }
                }
            }
            bike: file(relativePath: { eq: "CARD_BUY_BIKE.jpg" }) {
                childImageSharp {
                    fluid(quality: 90, maxWidth: 600) {
                        ...GatsbyImageSharpFluid_withWebp_tracedSVG
                    }
                }
            }
        }
    `);

    const cards = [
        {
            title: 'On Demand Rides',
            createdAt: 'Sweat',
            slug: '/on_demand_rides/',
            headerImage: data.ondemand.childImageSharp.fluid,
            isPrivate: true,
        },
        {
            title: 'Yoga',
            createdAt: 'Breathe',
            slug: '/the_yoke/',
            headerImage: data.yoga.childImageSharp.fluid,
            isPrivate: true,
        },
        {
            title: 'Buy Bike',
            createdAt: 'Ride',
            slug: '/buybike/',
            headerImage: data.bike.childImageSharp.fluid,
            isPrivate: false,
        },
    ];

    return (
        <section className={styles.tours}>
            <Title title="Lets Go" subtitle="Revellers" />
            <div className={styles.center}>
                {cards.map((card, index) => (
                    <SiteLinkCard key={index} card={card} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedTours;
