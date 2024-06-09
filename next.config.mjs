/** @type {import('next').NextConfig} */
import socketURL from "./src/utils/socketURL.mjs";
const nextConfig = {
    experimental: {
        instrumentationHook: true,
    },
    async headers() {
        console.log("Listening notifications from:", socketURL);
        return [
            {
                source: "/socket.io",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: socketURL },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, DELETE, PATCH, POST, PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ],
            },
        ];
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/u/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/a/**",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: "/manage",
                destination: "/manage/posts",
                permanent: true,
            },
            {
                source: "/settings",
                destination: "/settings/profile",
                permanent: true,
            },
        ];
    },
};

export { nextConfig };

// Injected content via Sentry wizard below

import { withSentryConfig } from "@sentry/nextjs";

const sentryConfig = withSentryConfig(
    nextConfig,
    {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        // Suppresses source map uploading logs during build
        silent: true,
        org: "romel-jr-zerna",
        project: "zefer",
    },
    {
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        // Transpiles SDK to be compatible with IE11 (increases bundle size)
        transpileClientSDK: true,

        // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
        tunnelRoute: "/monitoring",

        // Hides source maps from generated client bundles
        hideSourceMaps: true,

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,
    },
);

export default sentryConfig;
