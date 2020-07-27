import React, { useState, useContext } from 'react';
import { graphql, Link } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/layout/layout';
import { Container, Col, Row } from 'react-bootstrap';
import Button from '../styled_components/';
import { GlobalStateContext } from '../context/GlobalContextProvider';
import Video from '../components/video/video';
const RideSeriesContentOutlineTemplete = ({ data }) => {
    const course = data.contentfulRideSeriesContentOutline;
    const siteTitle = data.site.siteMetadata.title;

    const state = useContext(GlobalStateContext);
    const MUX_UPLOAD_ID = course.muxVideo.mux.playbackId;
    const MUX_URL = `https://stream.mux.com/${MUX_UPLOAD_ID}`;
    const [activeVideo, setActiveVideo] = useState(MUX_URL);

    return (
        <Layout>
            <Helmet>
                <title>{siteTitle}</title>
                <meta name="description" content="Ride Series" />
            </Helmet>
            <Container>
                <Row className="mt-2">
                    <h1 className="m-auto">{course.title}</h1>
                </Row>
                <Row>
                    <h4 className="m-auto text-center">{course.description}</h4>
                </Row>
                <Row className="mt-3">
                    {!state.netlifyLoggedIn ? (
                        <Link to="/signup/" className="m-auto">
                            <Button size="lg" className="px-5">
                                Join Now
                            </Button>
                        </Link>
                    ) : (
                        <></>
                    )}
                </Row>
                <Row className="border mt-4">
                    <Col md={8}>
                        {/* <iframe
                            src={activeVideo}
                            title={course.title}
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture autoplay"
                            frameBorder="0"
                            webkitallowfullscreen="true"
                            mozallowfullscreen="true"
                            allowFullScreen
                            width="100%"
                            height="500px"
                        /> */}
                        {/* CREATE HUX MANIFEST  */}
                        <Video
                            videoSrcURL={activeVideo}
                            videoTitle={course.title}
                        />
                    </Col>
                    <Col md={4}>
                        <h4 className=" font-weight-bold mt-2">
                            Course Introduction
                        </h4>

                        {course.linkedLessons &&
                            course.linkedLessons.map((lesson, index) => (
                                <>
                                    <hr />
                                    <p className="font-weight-bold">
                                        {`Lesson ${(index += 1)}`}
                                    </p>
                                    <button
                                        onClick={() => {
                                            if (state.netlifyLoggedIn) {
                                                setActiveVideo(
                                                    lesson.video.file.url
                                                );
                                            }
                                            return;
                                        }}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            outline: 'none',

                                            cursor: state.netlifyLoggedIn
                                                ? 'pointer'
                                                : 'default',
                                        }}
                                    >
                                        <h4 className="font-weight-normal ">
                                            {lesson.title}
                                        </h4>
                                    </button>
                                </>
                            ))}
                    </Col>
                </Row>
                <Row>
                    {/* <Link to="/ride_series/">Back To Ride Series</Link> */}
                </Row>
            </Container>
        </Layout>
    );
};

export default RideSeriesContentOutlineTemplete;

export const pageQuery = graphql`
    query ContentfulDailyRideBySlug($slug: String!) {
        site {
            siteMetadata {
                title
            }
        }
        contentfulRideSeriesContentOutline(slug: { eq: $slug }) {
            createdAt(fromNow: true)
            title
            description
            video {
                file {
                    url
                }
            }
            muxVideo {
                title
                mux {
                    playbackId
                }
            }
            slug
            lessons
            linkedLessons {
                title
                description
                video {
                    file {
                        url
                    }
                }
            }
        }
    }
`;
