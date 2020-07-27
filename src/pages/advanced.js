import React from 'react';

import Layout from '../components/layout/layout';
import SEO from '../components/layout/seo';

import Skus from '../components/products/Skus';

const AdvancedExamplePage = () => (
    <Layout>
        <SEO title="Advanced Example" />
        <h1>This is the advanced example</h1>
        <Skus />
    </Layout>
);

export default AdvancedExamplePage;
