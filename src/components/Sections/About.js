import React from 'react';
import Title from '../layout/Title';
import styles from '../../css/about.module.css';
import AniLink from 'gatsby-plugin-transition-link/AniLink';
import Video from '../../components/video/video';
const About = () => {
    return (
        <section className={styles.about}>
            <Title title="about" subtitle="us" />
            <div className={styles.aboutCenter}>
                <article className={styles.aboutImg}>
                    <div className={styles.imgContainer}>
                        <Video
                            videoSrcURL="https://stream.mux.com/pXjw5T00zcEQhUbMq15poDAqjJhhXw01vUkKiVtZKZERQ.m3u8"
                            posterImage="https://image.mux.com/pXjw5T00zcEQhUbMq15poDAqjJhhXw01vUkKiVtZKZERQ/thumbnail.png?width=300&time=19.9&fit_mode=pad"
                            videoID="Home Page Sizzle"
                        />
                    </div>
                </article>
                <article className={styles.aboutInfo}>
                    <p>
                        RevelWell is your dedicated online wellness platform
                        offering world class training, the highest quality
                        streaming and a one-on-one dialogue with your trainer
                        from the comfort of your own home. Ride and Yoga are
                        available 24/7, so you can train when and where suits
                        you.
                    </p>
                    <p>
                        Choose from Daily Rides, Yoga Classes and Courses, Ride
                        Series to target specific skills and a growing On Demand
                        menu where you can select your training routine based on
                        your mood.
                    </p>
                    <p>
                        Our purpose is to empower people with choice on how,
                        when and where they train. We offer world class training
                        from a growing team of leading wellness experts. Our
                        vision is to create the new benchmark for digital
                        fitness and wellbeing, for people anywhere, with a focus
                        on personal and individual connection and a two-way
                        dialogue between trainer and clientele.
                    </p>
                    <AniLink fade to="/app/daily_rides/">
                        <button className="btn-primary">Ride With Me</button>
                    </AniLink>
                </article>
            </div>
        </section>
    );
};

export default About;
