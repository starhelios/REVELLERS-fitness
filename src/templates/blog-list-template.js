import React from 'react';
import Layout from '../components/layout/layout';
import { Link, graphql } from 'gatsby';

import styles from '../css/blog.module.css';
import BlogCard from '../components/blog/BlogCard';
import Title from '../components/layout/Title';
import SEO from '../components/layout/seo';
const BlogListTemplate = props => {
    const { data } = props;
    const { currentPage, numPages } = props.pageContext;
    const previousPage =
        currentPage - 1 === 1 ? `/blogs/` : `/blogs/${currentPage - 1}`;
    const nextPage = `/blogs/${currentPage + 1}`;
    const isFirst = currentPage === 1;
    const isLast = currentPage === numPages;

    return (
        <Layout>
            <SEO title="Tours" description="This is the travel home page" />
            <section className={styles.blog}>
                <Title title="our" subtitle="posts" />
                <div className={styles.center}>
                    {data.posts.edges.map(({ node }) => {
                        return <BlogCard key={node.id} blog={node} />;
                    })}
                </div>
                <section className={styles.links}>
                    {!isFirst && (
                        <Link fade to={previousPage} className={styles.link}>
                            Previous
                        </Link>
                    )}
                    {Array.from({ length: numPages }, (_, index) => {
                        return (
                            <Link
                                key={index}
                                fade
                                to={`/blogs/${index === 0 ? '' : index + 1}`}
                                className={
                                    index + 1 === currentPage
                                        ? `${styles.link} ${styles.active}`
                                        : `${styles.link}`
                                }
                            >
                                {index + 1}
                            </Link>
                        );
                    })}
                    {!isLast && (
                        <Link fade to={nextPage} className={styles.link}>
                            Next
                        </Link>
                    )}
                </section>
            </section>
        </Layout>
    );
};

export const query = graphql`
    query getPosts($skip: Int!, $limit: Int!) {
        posts: allContentfulBlog(
            sort: { fields: createdAt, order: DESC }
            limit: $limit
            skip: $skip
        ) {
            edges {
                node {
                    slug
                    title
                    id: contentful_id
                    createdAt(formatString: "MMMM Do, YYYY")
                    headerImage {
                        fluid {
                            ...GatsbyContentfulFluid
                        }
                    }
                }
            }
        }
    }
`;

export default BlogListTemplate;
