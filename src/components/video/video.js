import React, { useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Player, BigPlayButton } from 'video-react';
import HLSSource from '../video/HSLSource';
import { useIdentityContext } from 'react-netlify-identity';
const Video = ({ videoSrcURL, videoTitle, posterImage, videoID, ...props }) => {
    const videoRef = useRef();
    const user = useIdentityContext();
    return (
        <>
            <Row className="my-3">
                <Col className="m-auto">
                    <Player
                        fluid={true}
                        autoPlay={false}
                        poster={posterImage}
                        id={videoID}
                        ref={videoRef}
                    >
                        <BigPlayButton position="center" />
                        <HLSSource
                            isVideoChild
                            src={videoSrcURL}
                            playerName={videoID}
                            videoRef={videoID}
                            user={user}
                            videoTitle={videoTitle}
                        />
                    </Player>
                </Col>
            </Row>
        </>
    );
};
export default Video;
