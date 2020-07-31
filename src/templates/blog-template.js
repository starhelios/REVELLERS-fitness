import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout/layout';

import styles from '../css/single-blog.module.css';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import SEO from '../components/layout/seo';
import BlogStyledHero from '../components/layout/BlogStyledHero';
const BlogTemplate = ({ data }) => {
    const {
        title,
        createdAt,
        headerImage,
        body: { json },
    } = data.post;

    const options = {
        renderNode: {
            'embedded-asset-block': node => {
                return (
                    <div className="rich">
                        <img
                            width="400"
                            src={node.data.target.fields.file['en-US'].url}
                            alt="placeholder of eve"
                        />
                    </div>
                );
            },
            'embedded-entry-block': node => {
                const { title, headerImage, body } = node.data.target.fields;
                return (
                    <div className="rich">
                        <h1>More Articles: {title['en-US']}</h1>
                        <img
                            width="400"
                            src={headerImage['en-US'].fields.file['en-US'].url}
                            alt="further reading"
                        />
                        {documentToReactComponents(body['en-US'])}
                    </div>
                );
            },
        },
    };
    return (
        <Layout>
            <SEO title={title} description="RevelWell Articles" />
            <section className={styles.blog}>
                <div className={styles.center}>
                    <BlogStyledHero img={headerImage.fluid} />
                    <h1 style={{ marginTop: 10 }}>{title}</h1>
                    <h4>Written On: {createdAt}</h4>
                    <article className={styles.post}>
                        {documentToReactComponents(json, options)}
                    </article>
                    <Link fade to="/blog/" className="btn-primary">
                        Back To All Posts
                    </Link>
                </div>
            </section>
        </Layout>
    );
};

export const query = graphql`
    query getPost($slug: String!) {
        post: contentfulBlog(slug: { eq: $slug }) {
            title
            headerImage {
                fluid {
                    ...GatsbyContentfulFluid
                }
            }
            createdAt(formatString: "dddd MMM do, YYYY")
            body {
                json
            }
        }
    }
`;

export default BlogTemplate;
