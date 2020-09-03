require('source-map-support').install();
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
});

const config = require('./config/SiteConfig').default;
const pathPrefix = config.pathPrefix === '/' ? '' : config.pathPrefix;
// Sometimes images in ACF gallert is Boolean and sometimes Number, let's be consistent
const removeEmptyImages = {
  name: 'removeEmptyImages',
  normalizer: function ({ entities }) {
    return entities.map((e) => {
      if (e.__type.startsWith('wordpress__wp_conferences')) {
        return {
          ...e,
          acf: {
            ...e.acf,
            gallery: [
              e.acf.gallery.image_1,
              e.acf.gallery.image_2,
              e.acf.gallery.image_3,
              e.acf.gallery.image_4,
              e.acf.gallery.image_5,
              e.acf.gallery.image_6,
              e.acf.gallery.image_7,
              e.acf.gallery.image_8,
            ].filter(Number),
          },
        };
      }
      return e;
    });
  },
};

module.exports = {
  pathPrefix: config.pathPrefix,
  siteMetadata: {
    siteUrl: config.siteUrl + pathPrefix,
  },
  plugins: [
    {
      resolve: 'gatsby-source-wordpress',
      options: {
        baseUrl: 'cms.softiware.com/majidhajian',
        protocol: 'https',
        useACF: true,
        hostingWPCOM: false,
        verboseOutput: false,
        perPage: 100,
        cookies: false,
        concurrentRequests: 10,
        includedRoutes: [
          '**/conferences',
          '**/books',
          '**/publications',
          '**/posts',
          '**/media',
          '**/tags',
        ],
        normalizers: (normalizers) => [...normalizers, removeEmptyImages],
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        skipWaiting: true,
        clientsClaim: true,
      },
    },
    'gatsby-plugin-typescript',
    'gatsby-plugin-sass',
    'gatsby-plugin-manifest',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-lodash',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'post',
        path: `${__dirname}/blog`,
      },
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: config.Google_Tag_Manager_ID,
        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow noopener noreferrer',
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-autolink-headers',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography.ts',
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: config.siteTitle,
        short_name: config.siteTitleAlt,
        description: config.siteDescription,
        start_url: config.pathPrefix,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: 'standalone',
        icon: config.favicon,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/static/assets`,
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      // Removes unused css rules
      resolve: 'gatsby-plugin-purgecss',
      options: {
        // Activates purging in gatsby develop
        develop: true,
        // Purge only the main css file
        purgeOnly: ['all.scss'],
      },
    },
    `gatsby-plugin-netlify`,
  ],
};
