import React from 'react';
import { Link } from 'gatsby';
import styles from '../../css/blog-card.module.css';
import Img from 'gatsby-image';

const SiteLinkCard = ({ card }) => {
    const { slug, title, createdAt, headerImage, isPrivate } = card;

    return (
        <article className={styles.blog}>
            <div className={styles.imgContainer}>
                <Img
                    fluid={headerImage}
                    loading="lazy"
                    className={styles.img}
                    alt="sigle post"
                />
                <Link
                    fade
                    to={isPrivate ? `app/${slug}/` : `/${slug}/`}
                    className={styles.link}
                >
                    Let's Go!
                </Link>
                <h6 className={styles.date}>{createdAt}</h6>
            </div>
            <div className={styles.footer}>
                <h4>{title}</h4>
            </div>
        </article>
    );
};

export default SiteLinkCard;
