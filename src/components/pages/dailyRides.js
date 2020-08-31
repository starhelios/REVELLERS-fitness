import React, { useEffect } from 'react';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import { Col, Row, Container } from 'react-bootstrap';
import { useIdentityContext } from 'react-netlify-identity';
import Button from '../../styled_components/Button';
import SEO from '../layout/seo';
import { get } from 'lodash';
import Video from '../video/video';
import '../../utils/fontawesome';
import FeedbackForm from '../Forms/FeedbackForm';
import fetchCustomerSubscriptions from '../../utils/fetchCustomerSubscriptions';

const DailyRides = () => {
    const data = useStaticQuery(graphql`
        {
            dailyRide: allContentfulDailyRide(
                sort: { fields: [createdAt], order: DESC }
            ) {
                edges {
                    node {
                        dayOfTheWeek
                        description
                        createdAt(locale: "en-au")
                        muxVideo {
                            mux {
                                playbackId
                                ready
                            }
                        }
                    }
                }
            }
        }
    `);

    const { user } = useIdentityContext();
    const { stripeId } = user?.user_metadata || {};
    useEffect(() => {
        if (!window) {
            return;
        }

        fetchCustomerSubscriptions({ stripeId })
            .then(res => res.json())
            .then(({ subscriptions = {} }) => {
                const activeSubscriptions = subscriptions?.data?.filter(
                    ({ canceled_at, cancel_at }) =>
                        !canceled_at ||
                        new Date(cancel_at * 1000).getTime() >= new Date()
                );
                const hasSubscription = !!activeSubscriptions?.length;

                if (!hasSubscription) {
                    navigate('/app/profile');
                }
            });
    }, []);

    const MUX_UPLOAD_ID = get(
        data,
        'dailyRide.edges[0].node.muxVideo.mux.playbackId'
    );
    const MUX_URL = `https://stream.mux.com/${MUX_UPLOAD_ID}`;
    const MUX_POSTER = `https://image.mux.com/${MUX_UPLOAD_ID}/thumbnail.png?&fit_mode=pad&time=2`;

    return (
        <>
            <SEO title="Daily Rides" />
            <Container>
                <Row className="mt-5">
                    <Col className="py-3">
                        <h1 className="mt-4 text-center">Today's Ride</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h4 className="text-center">
                            {data.dailyRide.edges[0].node.description}
                        </h4>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center">
                        <Button onClick={() => window.location.reload(true)}>
                            Get Latest Ride
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row className="mb-5">
                    <Col>
                        <Video
                            videoSrcURL={MUX_URL}
                            videoTitle={
                                data.dailyRide.edges[0].node.description
                            }
                            posterImage={MUX_POSTER}
                            videoID="Daily Ride"
                        />
                    </Col>
                </Row>

                <hr />
            </Container>
            <Container>
                <Row className="px-2 mb-5">
                    <h2 className="mt-3 p-2">How Did You Go?</h2>
                    <h4 className="m-auto p-2">
                        We'd love to know how you are going with your rides.
                        <br />
                        Too challenging, too easy, tech issues? Please give your
                        feedback or ask questions in the comment box below.{' '}
                        <br /> <br />
                        Thank You, <br />
                        Eve x
                    </h4>
                    <Col className="mt-5">
                        <FeedbackForm />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default DailyRides;
