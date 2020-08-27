import React from 'react';
import Layout from '../components/layout/layout';
import SEO from '../components/layout/seo';
import { Link } from 'gatsby';
import { Container } from 'react-bootstrap';

const NotFoundPage = () => (
    <Layout>
        <SEO title="404: Oh Dear!" />
        <Container className="mt-5 p-5 text-center">
            <h4>Just Fetching That For You...</h4>

            <p>This may take a moment.</p>
            <Link to="/">
                <p>If the page does not load automatically, click here</p>
            </Link>
        </Container>
    </Layout>
);

export default NotFoundPage;
