import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const course_template = ({
    title,
    description,
    numLessons,
    duration,
    slug,
    fluid,
}) => {
    return (
        <Row className="m-3">
            <Col md={4}>
                <Link to={slug}>
                    <Img fluid={fluid} />
                </Link>
            </Col>
            <Col md={8} className="border my-2">
                <h4 className="mt-2">{title}</h4>
                <p>{description}</p>
                <Row>
                    <Col>
                        <FontAwesomeIcon icon="bicycle" className="mr-3" />
                        {numLessons} Lessons
                    </Col>
                    <Col>
                        <FontAwesomeIcon icon="clock" className="mr-3" />
                        {duration} Mins
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default course_template;
