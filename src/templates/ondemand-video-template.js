import React from 'react';
import SEO from '../components/layout/seo';
import Video from '../components/video/video';

import { Col, Row, Container } from 'react-bootstrap';
import { graphql } from 'gatsby';
import Layout from '../components/layout/layout';

const OnDemandVideoTemplate = ({ data }) => {
    const videoData = data.contentfulOnDemandVideo;
    const MUX_UPLOAD_ID = videoData.video.mux.playbackId;
    const MUX_URL = `https://stream.mux.com/${MUX_UPLOAD_ID}`;
    const MUX_POSTER = `https://image.mux.com/${MUX_UPLOAD_ID}/thumbnail.png?&fit_mode=pad&time=23`;
    const { title, description } = videoData;
    return (
        <>
            <Layout>
                <SEO title="Daily Rides" />
                <Row>
                    <Col className="pt-5">
                        <h1 className="mt-5 text-center">{title}</h1>
                        <h3 className="text-center">{description}</h3>
                    </Col>
                </Row>
                <Container
                    style={{
                        height: '100%',
                        display: 'flex',
                        //alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Video
                        videoSrcURL={MUX_URL}
                        videoTitle="Todays Daily Ride With Eve"
                        posterImage={MUX_POSTER}
                    />
                </Container>
            </Layout>
        </>
    );
};

export const pageQuery = graphql`
    query ContentfulOnDemandVideoBySlug($slug: String!) {
        site {
            siteMetadata {
                title
            }
        }
        contentfulOnDemandVideo(slug: { eq: $slug }) {
            title
            slug
            description
            contentful_id
            createdAt(locale: "en-au")
            video {
                mux {
                    playbackId
                    ready
                    id
                    assetId
                }
            }
        }
    }
`;

export default OnDemandVideoTemplate;
