// next.config.js

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  crossOrigin: 'anonymous',

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  transpilePackages: ["geist"],

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**',
      },
    ],
    domains: [
      'lh3.googleusercontent.com',
    ],
  },

  distDir: process.env.BUILD_DIR ?? ".next",

  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,        // Disable the fs module on the client-side
      path: false,      // Disable the path module on the client-side
      stream: false,    // Disable stream module on the client-side
      crypto: false,    // Disable crypto module on the client-side
    };
    return config;
  },
};

export default config;
