const linguiConfig = require('./lingui.config.js')
const { locales, sourceLocale } = linguiConfig



const nextConfig = {
  webpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        resourceQuery: /raw-lingui/,
        type: 'javascript/auto',
      },
    ];
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config;
  },
  experimental: {
    esmExternals: true,
  },
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: [
      'assets.sushi.com',
      'res.cloudinary.com',
      'raw.githubusercontent.com',
      'logos.covalenthq.com',
      'assets.trustwalletapp.com',
    ],
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
 
  async redirects() {
    return [
      // {
      //   source: '/',
      //   destination: '/launchpad',
      //   permanent: true,
      // },
       
    ];
  },
  async rewrites() {
    return [
      // {
      //   source: '/',
      //   destination: '/launchpad',
      // },
      {
        source: '/dex',
        destination: '/swap',
        // permanent: true,
      },
       {
        source: '/add/:token*',
        destination: '/exchange/add/:token*',
      },
      {
        source: '/remove/:token*',
        destination: '/exchange/remove/:token*',
      },
      {
        source: '/create/:token*',
        destination: '/exchange/add/:token*',
      },
      {
        source: '/swap',
        destination: '/exchange/swap',
      },
      {
        source: '/swap/:token*',
        destination: '/exchange/swap/:token*',
      },

      {
        source: '/migrate',
        destination: '/exchange/migrate',
      },
      {
        source: '/pool',
        destination: '/exchange/pool',
      },
      {
        source: '/find',
        destination: '/exchange/find',
      },
    ];
  },

   i18n: {
    localeDetection: true,
    locales,
    defaultLocale: sourceLocale,
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = nextConfig;

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2));
