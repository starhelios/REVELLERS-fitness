import React, { useContext } from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout/layout';
import SEO from '../components/layout/seo';
import { GlobalStateContext } from '../context/GlobalContextProvider';
import Banner from '../components/layout/Banner';
import StyledHero from '../components/layout/StyledHero';

export const query = graphql`
    {
        allContentfulRideSeriesContentOutline {
            nodes {
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
        contHero: allContentfulAsset(filter: { title: { eq: "SHOT 09 91" } }) {
            nodes {
                title
                fluid(maxWidth: 1000, quality: 90) {
                    ...GatsbyContentfulFluid_tracedSVG
                }
            }
        }
    }
`;
const RideSeries = ({ data }) => {
    const state = useContext(GlobalStateContext);

    const contHero = data.contHero.nodes[0].fluid;
    return (
        <Layout>
            <SEO title="Ride Series" />
            <StyledHero home={true} img={contHero}>
                <Banner
                    title="Coming Soon"
                    info="From Spin Class Basics to Wedding Shreading. We will let all of our members know when this is released, join us now to get early access"
                >
                    {state && !state.netlifyLoggedIn && (
                        <Link fade className="btn-white" to="/signup/">
                            Join The Crew
                        </Link>
                    )}
                </Banner>
            </StyledHero>
        </Layout>
    );
};

export default RideSeries;
