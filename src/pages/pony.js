import React from 'react';
import Layout from '../components/layout/layout';
import Video from '../components/video/video';
import Banner from '../components/layout/Banner';
import StyledHero from '../components/layout/StyledHero';
import { get } from 'lodash';
export const query = graphql`
    {
        allFile(filter: { name: { eq: "wedding" } }) {
            nodes {
                name
                childImageSharp {
                    fluid(maxWidth: 1920, quality: 90, webpQuality: 90) {
                        ...GatsbyImageSharpFluid_withWebp_tracedSVG
                    }
                }
            }
        }
        pony: contentfulMux(title: { eq: "PONY_RIDE" }) {
            title
            mux {
                playbackId
            }
        }
    }
`;
const Pony = ({ data }) => {
    const MUX_UPLOAD_ID = get(data, 'pony.mux.playbackId');
    const MUX_URL = `https://stream.mux.com/${MUX_UPLOAD_ID}`;
    const MUX_POSTER = `https://image.mux.com/${MUX_UPLOAD_ID}/thumbnail.png?&fit_mode=pad&time=2`;

    return (
        <Layout>
            <StyledHero
                home={true}
                img={data.allFile.nodes[0].childImageSharp.fluid}
            >
                <div
                    style={{
                        width: '50vh',
                        textAlign: 'center',
                    }}
                >
                    <h1
                        style={{
                            color: 'white',
                            textShadow: '1px 1px 2px black',
                        }}
                    >
                        Congrats PONY!
                    </h1>
                    <Video
                        videoSrcURL={MUX_URL}
                        videoTitle={data.pony.title}
                        posterImage={MUX_POSTER}
                        videoID="pony"
                    />
                </div>
            </StyledHero>
        </Layout>
    );
};

export default Pony;
