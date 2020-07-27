import React from 'react';
import SingleRide from '../../components/common/SingleRide';
import { useStaticQuery, graphql } from 'gatsby';
import Title from '../layout/Title';
import styles from '../../css/items.module.css';

import AniLink from 'gatsby-plugin-transition-link/AniLink';

const FeaturedTours = () => {
    const data = useStaticQuery(graphql`
        {
            allContentfulRideSeriesContentOutline(limit: 3) {
                edges {
                    node {
                        contentful_id
                        createdAt(fromNow: true)
                        title
                        lessons
                        numberOfLessons
                        slug
                        duration
                        description
                        thumbnailImage {
                            fluid(quality: 100, maxWidth: 600) {
                                ...GatsbyContentfulFluid_withWebp
                            }
                        }
                        linkedLessons {
                            title
                            slug
                            description
                        }
                    }
                }
            }
        }
    `);

    const tours = data.allContentfulRideSeriesContentOutline.edges;
    return (
        <section className={styles.tours}>
            <Title title="Ride Series Coming" subtitle="Soon" />
            <div className={styles.center}>
                {tours.map(({ node }) => {
                    return <SingleRide key={node.contentful_id} tour={node} />;
                })}
            </div>
            <AniLink fade to="/app/on_demand_rides/" className="btn-primary">
                On Demand Rides
            </AniLink>
        </section>
    );
};

export default FeaturedTours;
