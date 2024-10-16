// Use require instead of import for CommonJS
require("./src/env.js");

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  transpilePackages: ["geist"],
  images: {
    unoptimized: true, // Disable image optimization
  },
};

module.exports = nextConfig;
