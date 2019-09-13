module.exports = {
  siteMetadata: {
    title: `MetaProjection`,
    description: `MetaProjection is an aggregator of multiple Canadian federal electoral projections that provides an overview of how the election is playing out, both federally and by district.`,
    author: `Ross Hill`,
  },
  plugins: [
    `gatsby-plugin-react-leaflet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `ByDistrict2019`,
        path: `${__dirname}/src/data/2019/byDistrict`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `Federal2019`,
        path: `${__dirname}/src/data/2019/federal/${new Date()
          .toISOString()
          .slice(0, 10)}.json`,
      },
    },
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
        short_name: `MetaProjection`,
        start_url: `/`,
        background_color: `#950451`,
        theme_color: `#950451`,
        display: `browser`,
        icon: `${__dirname}/src/images/icon.png`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,

    `gatsby-plugin-emotion`,
  ],
};
