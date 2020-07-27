import React from 'react';
import styles from '../../css/tour.module.css';
import Img from 'gatsby-image';

import AniLink from 'gatsby-plugin-transition-link/AniLink';
const Tour = ({ tour }) => {
    const { title, numberOfLessons, thumbnailImage } = tour;
    const mainImage = thumbnailImage.fluid;

    return (
        <article className={styles.tour}>
            <div className={styles.imgContainer}>
                <Img
                    fluid={mainImage}
                    className={styles.img}
                    alt={title || 'Spin Class Ride Series'}
                />
                <AniLink fade className={styles.link} to={`/`}>
                    Coming Soon
                </AniLink>
            </div>
            <div className={styles.footer}>
                <h3>{title}</h3>
                <div className={styles.info}>
                    {/* <h4 className={styles.title}>
                        <FaBicycle className={styles.icon} />
                        {description}
                    </h4> */}
                    <div className={styles.details}>
                        <h6>{numberOfLessons} Lessons</h6>
                        {/* <h6>${price}</h6> */}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Tour;
