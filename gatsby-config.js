const path = require(`path`);
require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`,
});
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = {
    siteMetadata: {
        title: `Revel Well`,
        description: `Online Spin & Yoga Classes - Expanding far beyond the 4 walls of a studio.`,
        author: `Eve Smith, Samuel Aspinall, James Aspinall & Chris Lane`,
        siteUrl: 'https://revelwell.com.au',
        twitterUsername: '@jamstackjimmy',
        image: './src/images/logo.png',
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-netlify`,
            options: {
                headers: {
                    '/**/*.html': [
                        'cache-control: public',
                        'cache-control: max-age=0',
                        'cache-control: must-revalidate',
                    ],
                    '/page-data/*.json': [
                        'cache-control: public',
                        'cache-control: max-age=0',
                        'cache-control: must-revalidate',
                    ],
                    '/app-data.json': [
                        'cache-control: public',
                        'cache-control: max-age=0',
                        'cache-control: must-revalidate',
                    ],
                    '/static/*': [
                        'cache-control: public',
                        'cache-control: max-age=31536000',
                        'cache-control: immutable',
                    ],
                },
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `revel-well`,
                short_name: `revwell`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/logo_light.png`, // This path is relative to the root of the site.
            },
        },
        {
            resolve: `gatsby-plugin-prefetch-google-fonts`,
            options: {
                fonts: [
                    {
                        family: `Montserrat`,
                        variants: [`100`, `300`, `400`, `700`],
                    },
                ],
            },
        },
        {
            resolve: `gatsby-source-contentful`,
            options: {
                spaceId: `plipsjpke5ju`,
                // Learn about environment variables: https://gatsby.dev/env-vars
                accessToken: process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN,
            },
        },
        {
            resolve: `gatsby-plugin-styled-components`,
            options: {
                // Add any options here
            },
        },
        {
            resolve: `gatsby-plugin-create-client-paths`,
            options: { prefixes: [`/app/*`] },
        },
        {
            resolve: `gatsby-plugin-netlify-identity`,
            options: {
                url: `https://pensive-galileo-93ca02.netlify.app`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [`gatsby-remark-responsive-iframe`],
            },
        },
        {
            resolve: `gatsby-source-stripe`,
            options: {
                objects: [
                    'ApplicationFee',
                    'Balance',
                    'BalanceTransaction',
                    'Customer',
                    'Charge',
                    'Plan',
                    'Product',
                    'Order',
                    'Sku',
                    'Subscription',
                ],
                secretKey: process.env.GATSBY_STRIPE_SECRET_KEY,
                downloadFiles: true,
            },
        },
        `gatsby-plugin-remove-serviceworker`,
        `gatsby-plugin-sitemap`,
        {
            resolve: 'gatsby-plugin-robots-txt',
            options: {
                host: 'https://www.revelwell.com.au',
                sitemap: 'https://www.revelwell.com.au/sitemap.xml',
                policy: [{ userAgent: '*', allow: '/' }],
            },
        },
    ],
    // for avoiding CORS while developing Netlify Functions locally
    // read more: https://www.gatsbyjs.org/docs/api-proxy/#advanced-proxying
    developMiddleware: app => {
        app.use(
            '/.netlify/functions/',
            createProxyMiddleware({
                target: 'http://localhost:9000',
                pathRewrite: {
                    '/.netlify/functions/': '',
                },
            })
        );
    },
};
