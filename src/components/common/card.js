import React, { useState } from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import Button from '../../styled_components';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const CardComponent = ({
    title,
    text,
    button,
    image,
    width,
    icon,
    slug,
    fluid,
}) => {
    const [hover, setHover] = useState(false);
    return (
        <>
            <Card style={{ width: width }} className="mx-auto my-1">
                {fluid ? (
                    <Img
                        fluid={fluid}
                        objectFit="cover"
                        objectPosition="50% 50%"
                        alt="james"
                    />
                ) : (
                    <Card.Img variant="top" src={image} />
                )}
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>{text}</Card.Text>
                    {!!slug && (
                        <Link to={slug}>
                            <Button disabled>
                                {button}{' '}
                                {!!icon && <FontAwesomeIcon icon={icon} />}
                            </Button>
                        </Link>
                    )}
                </Card.Body>
            </Card>
        </>
    );
};

export default CardComponent;
