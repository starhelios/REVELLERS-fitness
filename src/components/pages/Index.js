import React, { useContext } from 'react';
import Layout from '../layout/layout';
import SEO from '../layout/seo';
import { GlobalStateContext } from '../../context/GlobalContextProvider';
import Banner from '../../components/layout/Banner';
import StyledHero from '../../components/layout/StyledHero';
import { Link } from 'gatsby';
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
                        <Link fade className="btn-white" to="/signup/">
                            Join The Crew
                        </Link>
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
