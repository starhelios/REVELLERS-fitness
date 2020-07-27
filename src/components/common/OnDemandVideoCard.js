import React, { useState } from 'react';
import Img from 'gatsby-image';
import { Card } from 'react-bootstrap';
import Button from '../../styled_components/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.GATSBY_STRIPE_SECRET_KEY);
const redirectToCheckout = async event => {
    event.preventDefault();
    const stripe = await stripePromise;
    const url = window ? window.location.href : '';
    const { error } = await stripe.redirectToCheckout({
        items: [{ sku: 'sku_H9HK8jAKQqkek6', quantity: 1 }],
        // THIS MIGHT BREAK IT IN PROD
        successUrl: `${url}`,
        cancelUrl: `${url}/payment_error`,
    });
    if (error) {
        console.warn('Error:', error);
    }
};
const OnDemandVideo = ({
    title,
    text,
    button,
    image,
    width,
    icon,
    slug,
    fluid,
    gif,
}) => {
    const [playGIF, setPlayGIF] = useState(false);
    const renderThumbnail = () => {
        if (fluid) {
            return (
                <Img
                    fluid={fluid}
                    objectFit="cover"
                    objectPosition="50% 50%"
                    alt="card header"
                />
            );
        }
        if (image && !gif) {
            return <Card.Img variant="top" src={image} />;
        }
        if (gif && image) {
            return <Card.Img variant="top" src={playGIF ? gif : image} />;
        }
    };

    return (
        <>
            <Card
                style={{ width: width }}
                className="mx-auto my-1"
                onMouseEnter={() => {
                    setPlayGIF(true);
                    console.log('OVER');
                }}
                onMouseLeave={() => setPlayGIF(false)}
            >
                {renderThumbnail()}
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>{text}</Card.Text>
                    <Card.Footer className="border">
                        <Button
                            variant="outline-info"
                            style={{ marginTop: 'auto' }}
                            onClick={redirectToCheckout}
                        >
                            {button} {!!icon && <FontAwesomeIcon icon={icon} />}
                        </Button>
                    </Card.Footer>
                </Card.Body>
            </Card>
        </>
    );
};

export default OnDemandVideo;
