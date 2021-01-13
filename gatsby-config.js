/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  pathPrefix: "/follow-your-waste",
  siteMetadata: {
    title: `Follow Your Waste`,
    lang: `en`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-offline`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/content/`,
      },
    },
  ],
};