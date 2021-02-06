const queries = require('./src/backend/algolia');
require('dotenv').config();

module.exports = {
    siteMetadata: {
        title: `CarManuals.org`,
        description: `We have all car manuals in the world.`,
        author: `DevUnit`,
        siteUrl: `https://carmanuals.org`,
    },
    plugins: [
        `gatsby-plugin-robots-txt`,
        `gatsby-plugin-sitemap`,
        `gatsby-plugin-styled-components`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-react-helmet`,
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
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/img/favicon/favicon-32x32.png`, // This path is relative to the root of the site.
            },

        },
        {
            resolve: `gatsby-plugin-algolia`,
            options: {
                appId: process.env.ALGOLIA_APP_ID,
                apiKey: process.env.ALGOLIA_API_KEY,
                indexName: process.env.ALGOLIA_INDEX_NAME, // for all queries
                queries,
                chunkSize: 10000, // default: 1000
            },
        },
        {
            resolve: 'gatsby-plugin-mailchimp',
            options: {
                endpoint: 'https://carmanuals.us3.list-manage.com/subscribe/post?u=d0eaf149e232bd261d215366b&amp;id=ad31297d8f',
            },
        },

        {
            resolve: `gatsby-plugin-disqus`,
            options: {
                shortname: `carmanuals`
            }
        },

        {
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
                id: "GTM-TB67BW6",

                // Include GTM in development.
                // Defaults to false meaning GTM will only be loaded in production.
                includeInDevelopment: true,

                // datalayer to be set before GTM is loaded
                // should be an object or a function that is executed in the browser
                // Defaults to null
                // defaultDataLayer: { platform: "gatsby" },

                // Specify optional GTM environment details.
                // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
                // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
                // dataLayerName: "YOUR_DATA_LAYER_NAME",
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,

        {
            resolve: `gatsby-plugin-gdpr-cookies`,
            options: {
              googleAnalytics: {
                trackingId: 'UA-144973168-1',
                // Setting this parameter is optional
                anonymize: true
              },
              facebookPixel: {
                pixelId: '2521941394579450'
              },
              // Defines the environments where the tracking should be available  - default is ["production"]
              environments: ['production']
            },
          },
    ],
}
