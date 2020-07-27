import React from 'react';
import Layout from '../components/layout/layout';
import StyledHero from '../components/layout/StyledHero';
import { graphql } from 'gatsby';
import BlogList from '../components/blog/BlogList';
import SEO from '../components/layout/seo';
const Blog = ({ data }) => {
    return (
        <Layout>
            <SEO title="Blog" description="This is the travel home page" />
            <StyledHero img={data.file.childImageSharp.fluid} />
            <BlogList />
        </Layout>
    );
};
export const query = graphql`
    {
        file(relativePath: { eq: "opera.png" }) {
            name
            childImageSharp {
                fluid(maxWidth: 1920, quality: 90, webpQuality: 90) {
                    ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
            }
        }
    }
`;

export default Blog;
