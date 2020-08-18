import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql, navigate } from 'gatsby';
import { Row, Container } from 'react-bootstrap';
import { useIdentityContext } from 'react-netlify-identity';

import SEO from '../layout/seo';
import Banner from '../layout/Banner';
import StyledHero from '../layout/StyledHero';
import OnDemandVideo from '../../components/common/OnDemandVideo';
import fetchStripeSession from '../../utils/fetchStripeSession';
import fetchPurchasedVideos from '../../utils/fetchPurchasedVideos';
import fetchCustomerSubscriptions from '../../utils/fetchCustomerSubscriptions';

const OnDemandRides = () => {
    const data = useStaticQuery(graphql`
        {
            ondemand: allContentfulOnDemandVideo {
                nodes {
                    title
                    description
                    price
                    slug
                    sku
                    searchTags
                    video {
                        mux {
                            playbackId
                            assetId
                            uploadId
                        }
                    }
                }
            }
            tempImage: allFile(filter: { name: { eq: "ON_DEMAND_BANNER" } }) {
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
    `);

    const { user } = useIdentityContext();
    const { stripeId } = user?.user_metadata || {};

    const [purchasedVideos, setPurchasedVideos] = useState([]);

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
                .then(({ paymentIntents = [] }) => {
                    setPurchasedVideos(
                        paymentIntents?.data?.map?.(({ metadata }) => {
                            return metadata.id;
                        })
                    );
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
                            session?.metadata?.id,
                        ]);
                    }
                });
        }
    }, []);

    const buildCard = data.ondemand.nodes;
    const tempImage = data.tempImage.nodes[0].childImageSharp.fluid;

    const isFreeVideo = cardData => {
        if (cardData === 'FREE' || 'Free' || 'free') {
            return true;
        }
        return false;
    };
    return (
        <>
            <SEO title="On Demand" />
            <StyledHero img={tempImage}>
                <Banner title="On Demand Rides" />
            </StyledHero>
            <Container className="mt-5 pb-5">
                <h3 className="text-center">
                    Tailor-Made Rides To Suit Your Mood
                </h3>
                <hr />
                <Row>
                    {buildCard.map((card, index) => (
                        <OnDemandVideo
                            key={card.title}
                            id={card.video.mux.playbackId}
                            title={card.title}
                            text={card.description}
                            isFree={isFreeVideo(card.price)}
                            icon="play-circle"
                            priceInCents={card.price * 100}
                            hasPurchasedVideo={purchasedVideos?.includes?.(
                                card.video.mux.playbackId
                            )}
                            slug={card.slug}
                            button={`Watch Now`}
                            width="18rem"
                            image={`https://image.mux.com/${card.video.mux.playbackId}/thumbnail.png?time=620&width=314&height=178&fit_mode=pad`}
                            gif={`https://image.mux.com/${card.video.mux.playbackId}/animated.gif?start=600&fps=30`}
                        />
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default OnDemandRides;
