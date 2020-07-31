import React from 'react';
import { Link } from 'gatsby';
import styles from '../../css/blog-card.module.css';
import Img from 'gatsby-image';

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
                <Link fade to={`/blog/${slug}/`} className={styles.link}>
                    Read Now
                </Link>
                <h6 className={styles.date}>{createdAt}</h6>
            </div>
            <div className={styles.footer}>
                <h4>{title}</h4>
            </div>
        </article>
    );
};

export default BlogCard;
