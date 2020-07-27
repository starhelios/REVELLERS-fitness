import React from 'react';
import styles from '../../css/blog-card.module.css';
import Img from 'gatsby-image';
import AniLink from 'gatsby-plugin-transition-link/AniLink';
const BlogCard = ({ blog }) => {
    const { slug, title, headerImage, createdAt } = blog;
    return (
        <article className={styles.blog}>
            <div className={styles.imgContainer}>
                <Img
                    fluid={headerImage.fluid}
                    className={styles.img}
                    alt="sigle post"
                />
                <AniLink fade to={`/blog/${slug}/`} className={styles.link}>
                    Read Now
                </AniLink>
                <h6 className={styles.date}>{createdAt}</h6>
            </div>
            <div className={styles.footer}>
                <h4>{title}</h4>
            </div>
        </article>
    );
};

export default BlogCard;
