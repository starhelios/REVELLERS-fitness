import React, { Component } from 'react';
import Hls from 'hls.js';
import mux from 'mux-embed';

export default class HLSSource extends Component {
    constructor(props, context) {
        super(props, context);
        this.hls = new Hls();

        this.state = {
            showFeedbackForm: false,
        };
    }
    feedback = () => {
        this.setState({
            showFeedbackForm: true,
        });
        console.log('ShowFeedbackForm', this.state);
    };

    componentDidMount() {
        if (window) {
            window.muxPlayerInitTime = Date.now();
        }

        // `src` is the property get from this component
        // `video` is the property insert from `Video` component
        // `video` is the html5 video element
        const { src, video } = this.props;
        // load hls video source base on hls.js
        if (Hls.isSupported()) {
            this.hls.loadSource(src);
            this.hls.attachMedia(video);
            this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                // video.play();
                // console.log('event:', event);

                // console.log(
                //     'manifest loaded, found ' +
                //         data.levels.length +
                //         ' quality level'
                // );

                video.onended = function() {
                    console.log('Video Finished');
                };
            });
            mux.monitor('video', {
                debug: false,

                // Pass in the HLS.js instance
                hlsjs: this.hls,

                // Optionally, if Hls is not available on the window globally
                // you need to pass Hls as well.
                Hls: Hls,

                data: {
                    env_key: process.env.GATSBY_MUX_ENVIRONMENT_KEY, // required
                    // Metadata
                    player_name: this.props.videoRef, // ex: 'My Main Player'
                    video_title: this.props.videoTitle,
                    player_init_time: window.muxPlayerInitTime, // ex: 1451606400000
                    //viewer_user_id: this.props.user.user.email,
                    // ... and other metadata
                },
            });
        }
    }

    componentWillUnmount() {
        // destroy hls video source
        if (this.hls) {
            this.hls.destroy();
        }
    }

    render() {
        return (
            <source
                src={this.props.src}
                type={this.props.type || 'application/x-mpegURL'}
                preload="auto"
                autoPlay={false}
            />
        );
    }
}
