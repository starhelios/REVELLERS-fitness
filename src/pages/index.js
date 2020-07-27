import React from 'react';
import { graphql } from 'gatsby';
import Index from '../components/pages/Index';

export const query = graphql`
    {
        allContentfulRideSeriesContentOutline(limit: 3) {
            nodes {
                createdAt(fromNow: true)
                title
                lessons
                numberOfLessons
                slug
                duration
                description
                thumbnailImage {
                    fluid(quality: 100) {
                        ...GatsbyContentfulFluid
                    }
                }
                linkedLessons {
                    title
                    slug
                    description
                }
            }
        }
        tempImage: allFile(
            filter: { name: { eq: "HOMEPAGE_BANNER_Cropped" } }
        ) {
            nodes {
                name
                childImageSharp {
                    fluid(maxWidth: 1920, quality: 90, webpQuality: 90) {
                        ...GatsbyImageSharpFluid_withWebp_tracedSVG
                    }
                }
            }
        }
    }
`;

const IndexPage = ({ data }) => {
    return <Index data={data} />;
};

export default IndexPage;
