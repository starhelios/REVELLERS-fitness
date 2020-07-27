import React from 'react';
import Layout from '../components/layout/layout';
import SEO from '../components/layout/seo';
import { Link } from 'gatsby';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const NotFoundPage = () => (
    <Layout>
        <SEO title="404: Oh Dear!" />
        <Container className="mt-5 p-5 text-center">
            <h2>Page Not Found</h2>
            <h1>
                Soooo, this is awkward{' '}
                <FontAwesomeIcon icon={'meh-rolling-eyes'} />
            </h1>

            <h2>You just hit a route that doesn&#39;t exist... impressive! </h2>
            <Link to="/">
                <h2>Click here &amp; we'll get you back on your bike</h2>
            </Link>
        </Container>
    </Layout>
);

export default NotFoundPage;
