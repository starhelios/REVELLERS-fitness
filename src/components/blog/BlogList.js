import React from 'react';
import BlogCard from './BlogCard';
import Title from '../layout/Title';
import { useStaticQuery, graphql } from 'gatsby';
import styles from '../../css/blog.module.css';

const getPosts = graphql`
    {
        posts: allContentfulBlog(sort: { fields: createdAt, order: DESC }) {
            edges {
                node {
                    title
                    slug
                    contentful_id
                    headerImage {
                        fluid {
                            ...GatsbyContentfulFluid
                        }
                    }
                    createdAt(formatString: "MMMM Do YYYY")
                }
            }
        }
    }
`;
const BlogList = () => {
    const { posts } = useStaticQuery(getPosts);
    return (
        <section className={styles.blog}>
            <Title title="our" subtitle="blogs" />
            <div className={styles.center}>
                {posts.edges.map(({ node }) => {
                    return <BlogCard key={node.contentful_id} blog={node} />;
                })}
            </div>
        </section>
    );
};

export default BlogList;
