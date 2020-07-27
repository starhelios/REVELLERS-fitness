import React from 'react';
import { Col, Row } from 'react-bootstrap';

const course_teaser = ({ videoSrcURL, videoTitle, ...props }) => {
    return (
        <Row className="border mt-4">
            <Col md={8}>
                <iframe
                    src={videoSrcURL}
                    title={videoTitle}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    frameBorder="0"
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                    allowFullScreen
                    width="100%"
                    height="500px"
                />
            </Col>
            <Col md={4}>
                <h4 className="mt-2">Course Introduction</h4>
                <hr />
                <p class="font-weight-bold">Lesson One</p>
                <h4 class="font-weight-normal">Out Of Saddle</h4>
                <hr />

                <p class="font-weight-bold">Lesson Two</p>
                <h4 class="font-weight-normal">Weights &amp; Peddles</h4>
                <hr />

                <p class="font-weight-bold">Lesson Three</p>
                <h4 class="font-weight-normal">Out Of Saddle</h4>
                <hr />

                <p class="font-weight-bold">Lesson Four</p>
                <h4 class="font-weight-normal">Out Of Saddle</h4>
                <hr />
            </Col>
        </Row>
    );
};

export default course_teaser;
