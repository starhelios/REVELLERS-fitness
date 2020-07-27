const path = require(`path`);

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;

    const contentSeriesOutlineTemplate = path.resolve(
        `./src/templates/ride-series-content-outline-template.js`
    );
    const seriesTemplate = path.resolve(
        `./src/templates/ride-series-template.js`
    );
    const onDemandVideoTemplate = path.resolve(
        `./src/templates/ondemand-video-template.js`
    );
    const onDemandYogaVideoTemplate = path.resolve(
        `./src/templates/ondemand-yoga-video-template.js`
    );
    const blogTemplate = path.resolve('./src/templates/blog-template.js');
    const blogListTemplate = path.resolve(
        './src/templates/blog-list-template.js'
    );
    const result = await graphql(
        `
            {
                seriesOutline: allContentfulRideSeriesContentOutline {
                    edges {
                        node {
                            createdAt(fromNow: true)
                            title
                            description
                            video {
                                file {
                                    url
                                }
                            }
                            slug
                            lessons
                            linkedLessons {
                                title
                                description
                                video {
                                    file {
                                        url
                                    }
                                }
                            }
                        }
                    }
                }
                series: allContentfulRideSeries {
                    edges {
                        node {
                            createdAt(fromNow: true)
                            seriesTitle
                            seriesDescription
                            slug
                            courses {
                                createdAt(fromNow: true)
                                title
                                description
                                slug
                                numberOfLessons
                                duration
                            }
                        }
                    }
                }
                onDemand: allContentfulOnDemandVideo {
                    edges {
                        node {
                            title
                            slug
                            createdAt(locale: "en-au")
                            description
                            contentful_id
                            price
                            video {
                                mux {
                                    playbackId
                                    ready
                                    assetId
                                }
                            }
                        }
                    }
                }
                yoga: allContentfulOnDemandYogaVideo {
                    edges {
                        node {
                            title
                            description
                            price
                            slug
                            contentful_id
                            muxVideo {
                                mux {
                                    playbackId
                                    ready
                                    id
                                }
                            }
                        }
                    }
                }
                allPosts: allContentfulBlog {
                    edges {
                        node {
                            slug
                        }
                    }
                }
            }
        `
    );

    if (result.errors) {
        throw result.errors;
    }

    const seriesOutline = result.data.seriesOutline.edges;
    const series = result.data.series.edges;
    const onDemand = result.data.onDemand.edges;
    const yoga = result.data.yoga.edges;
    const posts = result.data.allPosts.edges;
    const postsPerPage = 5;
    const numPages = Math.ceil(posts.length / postsPerPage);

    posts.forEach(({ node }) => {
        createPage({
            path: `/blog/${node.slug}`,
            component: blogTemplate,
            context: {
                slug: node.slug,
            },
        });
    });
    Array.from({ length: numPages }).forEach((_, index) => {
        createPage({
            path: index === 0 ? '/blogs/' : `blogs/${index + 1}`,
            component: blogListTemplate,
            context: {
                limit: postsPerPage,
                skip: index * postsPerPage,
                numPages,
                currentPage: index + 1,
            },
        });
    });

    seriesOutline.forEach((outline, index) => {
        const previous =
            index === seriesOutline.length - 1
                ? null
                : seriesOutline[index + 1].node;
        const next = index === 0 ? null : seriesOutline[index - 1].node;

        createPage({
            path: outline.node.slug,
            component: contentSeriesOutlineTemplate,
            context: {
                slug: outline.node.slug,
                previous,
                next,
            },
        });
    });

    series.forEach((ser, index) => {
        const previous =
            index === series.length - 1 ? null : series[index + 1].node;
        const next = index === 0 ? null : series[index - 1].node;

        createPage({
            path: ser.node.slug,
            component: seriesTemplate,
            context: {
                slug: ser.node.slug,
                previous,
                next,
            },
        });
    });

    onDemand.forEach((outline, index) => {
        const previous =
            index === onDemand.length - 1 ? null : onDemand[index + 1].node;
        const next = index === 0 ? null : onDemand[index - 1].node;

        createPage({
            path: outline.node.slug,
            component: onDemandVideoTemplate,
            context: {
                slug: outline.node.slug,
                previous,
                next,
            },
        });
    });

    yoga.forEach((outline, index) => {
        const previous =
            index === yoga.length - 1 ? null : yoga[index + 1].node;
        const next = index === 0 ? null : yoga[index - 1].node;

        createPage({
            path: outline.node.slug,
            component: onDemandYogaVideoTemplate,
            context: {
                slug: outline.node.slug,
                previous,
                next,
            },
        });
    });
};
