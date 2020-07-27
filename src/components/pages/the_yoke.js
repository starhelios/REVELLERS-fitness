import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql, navigate } from 'gatsby';

import SEO from '../layout/seo';
import OnDemandVideo from '../../components/common/OnDemandVideo';
import { Row, Container, Col } from 'react-bootstrap';
import fetchStripeSession from '../../utils/fetchStripeSession';
import fetchPurchasedVideos from '../../utils/fetchPurchasedVideos';
import { useIdentityContext } from 'react-netlify-identity';

import fetchCustomerSubscriptions from '../../utils/fetchCustomerSubscriptions';
import Banner from '../layout/Banner';
import StyledHero from '../layout/StyledHero';

const Yoga = () => {
    const data = useStaticQuery(graphql`
        {
            allFile(filter: { name: { eq: "yogaHero" } }) {
                edges {
                    node {
                        name
                        childImageSharp {
                            fluid(
                                maxWidth: 1920
                                quality: 90
                                webpQuality: 90
                            ) {
                                ...GatsbyImageSharpFluid_withWebp_tracedSVG
                            }
                        }
                    }
                }
            }
            yoga: allContentfulOnDemandYogaVideo {
                nodes {
                    title
                    description
                    price
                    slug
                    contentful_id
                    muxVideo {
                        mux {
                            playbackId
                            ready
                            id
                        }
                    }
                }
            }
        }
    `);

    const { user } = useIdentityContext();
    const { stripeId } = user?.user_metadata || {};

    const [purchasedVideos, setPurchasedVideos] = useState([]);

    useEffect(() => {
        if (!window) {
            return;
        }

        if (!stripeId) {
            navigate('/app/profile');
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

    useEffect(() => {
        if (!window) {
            return;
        }
        const searchParams = new URLSearchParams(window.location.search);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            // Populate user's library from stripe
            fetchPurchasedVideos({ stripeId })
                .then(res => res.json())
                .then(({ data = [] }) => {
                    setPurchasedVideos(data);
                });
        } else {
            // On purchase, ie we have a sessionId in the url, update local library state
            // TODO: is this still needed?
            fetchStripeSession({ sessionId })
                .then(res => res.json())
                .then(({ session }) => {
                    if (session?.customer === user?.user_metadata?.stripeId) {
                        setPurchasedVideos([
                            ...purchasedVideos,
                            session.metadata.contentfulId,
                        ]);
                    }
                });
        }
    }, []);

    const videoPrice = '10.00';
    const priceInCents = Number(videoPrice) * 100;
    const buildCard = data.yoga.nodes;
    const heroImage = data.allFile.edges[0].node.childImageSharp.fluid;
    const isFreeVideo = cardData => {
        if (cardData === 'FREE' || 'Free' || 'free') {
            return true;
        }
        return false;
    };
    return (
        <>
            <SEO title="Yoga" />
            <StyledHero img={heroImage}>
                <Banner title="Yoga" />
            </StyledHero>

            <Container className="mt-5 pb-5" style={{ textAlign: 'center' }}>
                <h2 className="mb-3">More Than Movement</h2>
                <hr />
                <Row className="pt-3">
                    {buildCard.map((card, index) => (
                        <OnDemandVideo
                            key={card.title}
                            title={card.title}
                            text={card.description}
                            isFree={isFreeVideo(card.price)}
                            slug={card.slug}
                            button={`Watch Now`}
                            width="18rem"
                            image={`https://image.mux.com/${card.muxVideo.mux.playbackId}/thumbnail.png?time=620&width=314&height=178&fit_mode=pad`}
                            gif={`https://image.mux.com/${card.muxVideo.mux.playbackId}/animated.gif?start=600&fps=30`}
                        />
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default Yoga;
