import React, { useContext } from 'react';
import Layout from '../layout/layout';
import SEO from '../layout/seo';
import { GlobalStateContext } from '../../context/GlobalContextProvider';
import Banner from '../../components/layout/Banner';
import StyledHero from '../../components/layout/StyledHero';
import AniLink from 'gatsby-plugin-transition-link/AniLink';
import About from '../Sections/About';
import Services from '../Sections/Services';
import SiteLinks from '../Sections/SiteLinks';
const Index = ({ data }) => {
    const tempImage = data.tempImage.nodes[0].childImageSharp.fluid;
    const state = useContext(GlobalStateContext);

    return (
        <Layout>
            <SEO title="Home" />
            <StyledHero home={true} img={tempImage}>
                <Banner
                    title="Revel Well"
                    info="Move Than Just Movement"
                    home={true}
                >
                    {state && !state.netlifyLoggedIn && (
                        <AniLink fade className="btn-white" to="/signup/">
                            Join The Crew
                        </AniLink>
                    )}
                </Banner>
            </StyledHero>
            <About />
            <Services />
            {/* <FeaturedRides /> */}
            <SiteLinks />
        </Layout>
    );
};

export default Index;
