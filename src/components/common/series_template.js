import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from '../../styled_components/';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const SeriesTemplate = ({ title, description, button, icon, slug, fixed }) => {
    return (
        <Row className="mt-2">
            <Col md={4}>
                <Link to={slug}>
                    <Img fixed={fixed} />
                </Link>
            </Col>
            <Col md={8} className="border">
                <h4 className="mt-2">{title}</h4>
                <p>{description}</p>
                <Row>
                    <Col>
                        <Link to={slug}>
                            <Button>
                                {button} <FontAwesomeIcon icon={icon} />
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default SeriesTemplate;
