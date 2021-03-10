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
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/content/`,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Follow Your Waste`,
        short_name: `FYW`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#fc652c`,
        display: `standalone`,
        icon: `src/images/icon.png`
      }
    },
    // 'gatsby-plugin-offline'
    'gatsby-plugin-remove-serviceworker'
  ],
};