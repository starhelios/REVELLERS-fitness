import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import Layout from '../components/layout/layout';
import Course from '../components/common/course_template';
import { Container } from 'react-bootstrap';
const rideSeriesTemplate = ({ data }) => {
    const series = data.contentfulRideSeries;
    const courses = data.contentfulRideSeries.courses;
    const siteTitle = data.site.siteMetadata.title;

    return (
        <Layout>
            <Helmet>
                <title>{siteTitle}</title>
                <meta name="description" content={series.seriesTitle} />
            </Helmet>
            <Container>
                <h1>{series.seriesTitle}</h1>
                <p>{series.seriesDescription}</p>
                {courses.map(course => (
                    <Course
                        title={course.title}
                        slug={course.slug}
                        description={course.description}
                        lessons={course.numberOfLessons}
                        duration={course.duration}
                    />
                ))}
            </Container>
        </Layout>
    );
};

export default rideSeriesTemplate;

export const pageQuery = graphql`
    query ContentfulRideSeriesBySlug($slug: String!) {
        site {
            siteMetadata {
                title
            }
        }
        contentfulRideSeries(slug: { eq: $slug }) {
            seriesTitle
            seriesDescription
            createdAt(fromNow: true)
            slug
            image {
                fluid {
                    src
                }
            }
            courses {
                createdAt(fromNow: true)
                title
                description
                slug
                duration
                numberOfLessons
            }
        }
    }
`;
