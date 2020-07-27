import React, { useContext, useState } from 'react';
import { navigate } from 'gatsby';
import Img from 'gatsby-image';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GlobalStateContext } from '../../context/GlobalContextProvider';
import redirectToCheckout from '../../utils/redirectToCheckout';
import Button from '../../styled_components';

const OnDemandVideo = ({
    title,
    text,
    button,
    image,
    width,
    icon,
    slug,
    isFree,
    fluid,
    priceInCents,
    hasPurchasedVideo,
    gif,
    id,
}) => {
    const { user } = useContext(GlobalStateContext);
    const lineItems = [
        {
            name: title,
            images: image ? [image] : undefined,
            amount: priceInCents,
            currency: 'aud',
            quantity: 1,
        },
    ];
    const metadata = {
        name: title,
        description: 'On Demand Video',
        id,
    };
    const [playGIF, setPlayGIF] = useState(false);
    const renderThumbnail = () => {
        if (fluid) {
            return (
                <Img
                    fluid={fluid}
                    objectFit="cover"
                    objectPosition="50% 50%"
                    alt="Video Preview"
                />
            );
        }
        if (image && !gif) {
            return <Card.Img variant="top" src={image} alt="Video Preview" />;
        }
        if (gif && image) {
            return (
                <Card.Img
                    variant="top"
                    src={playGIF ? gif : image}
                    alt="Video Preview"
                />
            );
        }
    };

    return (
        <>
            <Card
                style={{ width: width }}
                className="mx-auto my-1"
                onMouseEnter={() => {
                    setPlayGIF(true);
                }}
                onMouseLeave={() => setPlayGIF(false)}
            >
                {renderThumbnail()}
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>{text}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <Button
                            onClick={event => {
                                user && (isFree || hasPurchasedVideo)
                                    ? navigate(`/${slug}/`)
                                    : !user
                                    ? navigate('/login', {
                                          state: {
                                              pathname: window
                                                  ? window.location.pathname
                                                  : undefined,
                                          },
                                      })
                                    : redirectToCheckout(
                                          event,
                                          user,
                                          lineItems,
                                          metadata
                                      );
                            }}
                        >
                            {hasPurchasedVideo ? (
                                <>
                                    PLAY{' '}
                                    <FontAwesomeIcon icon={'play-circle'} />
                                </>
                            ) : (
                                button
                            )}{' '}
                            {!!icon && <FontAwesomeIcon icon={icon} />}
                        </Button>
                    </div>
                </Card.Footer>
            </Card>
        </>
    );
};

export default OnDemandVideo;
